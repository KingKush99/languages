const crypto = require("node:crypto");

let pool;

const coinPackages = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].map((price, index) => {
  const baseCoins = price * 1000;
  const bonusMultiplier = Math.pow(1.05, index);
  return {
    id: `coins_${price}`,
    price,
    coins: Math.round((baseCoins * bonusMultiplier) / 100) * 100
  };
});

function getCoinPackage(id) {
  return coinPackages.find((pack) => pack.id === id || String(pack.price) === String(id));
}

function setCors(req, res) {
  const allowedOrigins = [
    process.env.PUBLIC_APP_URL,
    "https://kingkush99.github.io",
    "https://kingkush99.github.io/languages"
  ].filter(Boolean);
  const origin = req.headers.origin || "";
  let originHost = "";
  try {
    originHost = origin ? new URL(origin).hostname : "";
  } catch {
    originHost = "";
  }
  const allowOrigin = origin && (allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(originHost))
    ? origin
    : (process.env.PUBLIC_APP_URL || "*");
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Stripe-Signature,X-CC-Webhook-Signature");
}

function sendJson(req, res, status, payload) {
  setCors(req, res);
  res.status(status).json(payload);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await readRawBody(req);
  if (!raw.length) return {};
  return JSON.parse(raw.toString("utf8"));
}

function requireDatabase(req, res) {
  if (process.env.DATABASE_URL) return true;
  sendJson(req, res, 503, {
    error: "DATABASE_URL is required before accepting real payments. Add Neon/Postgres first so verified webhooks can credit coins safely."
  });
  return false;
}

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const { Pool } = require("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      query_timeout: 8000
    });
  }
  return pool;
}

async function ensureLedgerSchema() {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  await db.query(`
    create table if not exists user_wallets (
      user_id text primary key,
      coins integer not null default 0,
      updated_at timestamptz not null default now()
    );
    create table if not exists purchase_events (
      provider text not null,
      provider_event_id text not null,
      provider_payment_id text,
      user_id text not null,
      package_id text not null,
      coins integer not null,
      raw_event jsonb not null,
      created_at timestamptz not null default now(),
      primary key (provider, provider_event_id)
    );
  `);
}

async function getWallet(userId) {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  await ensureLedgerSchema();
  const safeUserId = String(userId || "anonymous").slice(0, 128);
  const result = await db.query(
    `insert into user_wallets (user_id, coins)
     values ($1, 0)
     on conflict (user_id) do nothing
     returning user_id, coins`,
    [safeUserId]
  );
  if (result.rows[0]) return result.rows[0];
  const existing = await db.query("select user_id, coins from user_wallets where user_id = $1", [safeUserId]);
  return existing.rows[0] || { user_id: safeUserId, coins: 0 };
}

async function creditCoinsFromWebhook({ provider, providerEventId, providerPaymentId, userId, packageId, coins, rawEvent }) {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  await ensureLedgerSchema();
  const safeCoins = Number.parseInt(coins, 10);
  if (!Number.isFinite(safeCoins) || safeCoins <= 0) throw new Error("Webhook did not include a valid coin amount.");
  const safeUserId = String(userId || "anonymous").slice(0, 128);
  const client = await db.connect();
  try {
    await client.query("begin");
    const inserted = await client.query(
      `insert into purchase_events
       (provider, provider_event_id, provider_payment_id, user_id, package_id, coins, raw_event)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb)
       on conflict (provider, provider_event_id) do nothing
       returning provider_event_id`,
      [provider, providerEventId, providerPaymentId || "", safeUserId, packageId || "", safeCoins, JSON.stringify(rawEvent)]
    );
    if (inserted.rowCount) {
      await client.query(
        `insert into user_wallets (user_id, coins, updated_at)
         values ($1, $2, now())
         on conflict (user_id)
         do update set coins = user_wallets.coins + excluded.coins, updated_at = now()`,
        [safeUserId, safeCoins]
      );
    }
    const wallet = await client.query("select user_id, coins from user_wallets where user_id = $1", [safeUserId]);
    await client.query("commit");
    return { credited: Boolean(inserted.rowCount), wallet: wallet.rows[0] || { user_id: safeUserId, coins: 0 } };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

function verifyCoinbaseSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function getStripeTimestampAndSignatures(header) {
  return String(header || "").split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    if (key === "t") acc.timestamp = value;
    if (key === "v1") acc.signatures.push(value);
    return acc;
  }, { timestamp: "", signatures: [] });
}

function verifyStripeSignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const { timestamp, signatures } = getStripeTimestampAndSignatures(header);
  if (!timestamp || !signatures.length) return false;
  const signedPayload = `${timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return signatures.some((signature) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}

module.exports = {
  coinPackages,
  creditCoinsFromWebhook,
  ensureLedgerSchema,
  getCoinPackage,
  getWallet,
  readJsonBody,
  readRawBody,
  requireDatabase,
  sendJson,
  setCors,
  verifyCoinbaseSignature,
  verifyStripeSignature
};
