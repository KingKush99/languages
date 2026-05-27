const crypto = require("node:crypto");

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
  getCoinPackage,
  readJsonBody,
  readRawBody,
  requireDatabase,
  sendJson,
  setCors,
  verifyCoinbaseSignature,
  verifyStripeSignature
};
