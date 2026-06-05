const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = process.cwd();
const port = Number(process.env.PORT || 9876);
const host = "127.0.0.1";
let dbPool;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

function getDbPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!dbPool) {
    const { Pool } = require("pg");
    dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      query_timeout: 8000
    });
  }
  return dbPool;
}

async function ensureLedgerSchema() {
  const db = getDbPool();
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
    create table if not exists global_chat_messages (
      id bigserial primary key,
      user_id text not null,
      author text not null,
      message text not null,
      language text not null default 'site',
      created_at timestamptz not null default now()
    );
    create table if not exists direct_messages (
      id bigserial primary key,
      from_user_id text not null,
      from_name text not null,
      to_name text not null,
      message text not null,
      status text not null default 'pending',
      created_at timestamptz not null default now()
    );
    create table if not exists live_chat_moderation (
      user_id text primary key,
      violation_count integer not null default 0,
      window_start timestamptz not null default now(),
      cooldown_until timestamptz,
      updated_at timestamptz not null default now()
    );
    create table if not exists auth_users (
      id text primary key,
      email text not null unique,
      display_name text not null,
      picture text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    create table if not exists auth_sessions (
      session_token text primary key,
      user_id text not null references auth_users(id) on delete cascade,
      expires_at timestamptz not null,
      created_at timestamptz not null default now()
    );
    create table if not exists oauth_states (
      state text primary key,
      redirect_to text not null default '/',
      expires_at timestamptz not null,
      created_at timestamptz not null default now()
    );
  `);
}

async function getWallet(userId) {
  const db = getDbPool();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  await ensureLedgerSchema();
  const safeUserId = String(userId || "anonymous").slice(0, 128);
  await db.query(
    `insert into user_wallets (user_id, coins)
     values ($1, 0)
     on conflict (user_id) do nothing`,
    [safeUserId]
  );
  const existing = await db.query("select user_id, coins from user_wallets where user_id = $1", [safeUserId]);
  return existing.rows[0] || { user_id: safeUserId, coins: 0 };
}

function normalizeChatText(value, maxLength = 500) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function getPublicOrigin(req) {
  const envOrigin = process.env.PUBLIC_APP_URL || "";
  if (envOrigin) return envOrigin.replace(/\/$/, "");
  const forwardedHost = req.headers["x-forwarded-host"];
  const hostHeader = forwardedHost || req.headers.host || `${host}:${port}`;
  const proto = req.headers["x-forwarded-proto"] || (hostHeader.includes("localhost") || hostHeader.includes("127.0.0.1") ? "http" : "https");
  return `${proto}://${hostHeader}`;
}

function parseCookies(req) {
  return String(req.headers.cookie || "").split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");
    if (index > -1) cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    return cookies;
  }, {});
}

function setSessionCookie(req, res, token) {
  const secure = getPublicOrigin(req).startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `ll_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`);
}

function clearSessionCookie(req, res) {
  const secure = getPublicOrigin(req).startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `ll_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

async function getAuthUser(req) {
  const db = getDbPool();
  if (!db) return null;
  await ensureLedgerSchema();
  const token = parseCookies(req).ll_session;
  if (!token) return null;
  const result = await db.query(
    `select u.id, u.email, u.display_name as "displayName", u.picture
     from auth_sessions s
     join auth_users u on u.id = s.user_id
     where s.session_token = $1 and s.expires_at > now()`,
    [token]
  );
  return result.rows[0] || null;
}

async function handleAuthMe(req, res) {
  const user = await getAuthUser(req);
  sendJson(res, 200, { signedIn: Boolean(user), user });
}

async function handleGoogleAuthStart(req, res, url) {
  const db = getDbPool();
  if (!db) {
    sendJson(res, 503, { error: "DATABASE_URL is not configured." });
    return;
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    sendJson(res, 503, { error: "GOOGLE_CLIENT_ID is not configured." });
    return;
  }
  await ensureLedgerSchema();
  const origin = getPublicOrigin(req);
  const redirectTo = url.searchParams.get("redirect") || "/";
  const state = crypto.randomBytes(24).toString("hex");
  await db.query(
    `insert into oauth_states (state, redirect_to, expires_at)
     values ($1, $2, now() + interval '10 minutes')`,
    [state, redirectTo.slice(0, 500)]
  );
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account"
  });
  res.writeHead(302, { location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  res.end();
}

async function handleGoogleAuthCallback(req, res, url) {
  const db = getDbPool();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!db || !clientId || !clientSecret) {
    sendJson(res, 503, { error: "Google sign-in is not configured." });
    return;
  }
  await ensureLedgerSchema();
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    sendJson(res, 400, { error: "Missing Google OAuth code or state." });
    return;
  }
  const stateResult = await db.query(
    `delete from oauth_states
     where state = $1 and expires_at > now()
     returning redirect_to as "redirectTo"`,
    [state]
  );
  const redirectTo = stateResult.rows[0]?.redirectTo || "/";
  if (!stateResult.rowCount) {
    sendJson(res, 400, { error: "Google sign-in state expired. Try again." });
    return;
  }
  const origin = getPublicOrigin(req);
  const tokenResponse = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/api/auth/google/callback`,
      grant_type: "authorization_code"
    })
  }, 15000);
  const tokenJson = await tokenResponse.json();
  if (!tokenResponse.ok) {
    sendJson(res, tokenResponse.status, { error: tokenJson.error_description || tokenJson.error || "Google token exchange failed." });
    return;
  }
  const profileResponse = await fetchWithTimeout("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${tokenJson.access_token}` }
  }, 15000);
  const profile = await profileResponse.json();
  if (!profileResponse.ok || !profile.sub || !profile.email) {
    sendJson(res, 502, { error: "Could not read Google profile." });
    return;
  }
  const userId = `google:${profile.sub}`;
  await db.query(
    `insert into auth_users (id, email, display_name, picture, updated_at)
     values ($1, $2, $3, $4, now())
     on conflict (id) do update set
       email = excluded.email,
       display_name = excluded.display_name,
       picture = excluded.picture,
       updated_at = now()`,
    [userId, profile.email, profile.name || profile.email.split("@")[0], profile.picture || ""]
  );
  const sessionToken = crypto.randomBytes(32).toString("hex");
  await db.query(
    `insert into auth_sessions (session_token, user_id, expires_at)
     values ($1, $2, now() + interval '30 days')`,
    [sessionToken, userId]
  );
  setSessionCookie(req, res, sessionToken);
  res.writeHead(302, { location: redirectTo.startsWith("/") ? redirectTo : "/" });
  res.end();
}

async function handleLogout(req, res) {
  const db = getDbPool();
  const token = parseCookies(req).ll_session;
  if (db && token) {
    await ensureLedgerSchema();
    await db.query("delete from auth_sessions where session_token = $1", [token]);
  }
  clearSessionCookie(req, res);
  sendJson(res, 200, { signedIn: false });
}

const blockedLiveChatTerms = [
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "cunt", "dick",
  "pussy", "slut", "whore", "nigger", "nigga", "faggot", "retard", "kike"
];

function containsBlockedLiveChatTerm(text) {
  const normalized = String(text || "").toLowerCase().replace(/[@$!1|0*._-]/g, "");
  return blockedLiveChatTerms.some((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i").test(normalized));
}

async function getLiveChatCooldown(db, userId) {
  const existing = await db.query(
    `select cooldown_until as "cooldownUntil"
     from live_chat_moderation
     where user_id = $1 and cooldown_until is not null and cooldown_until > now()`,
    [userId]
  );
  return existing.rows[0]?.cooldownUntil || null;
}

async function recordLiveChatViolation(db, userId) {
  const result = await db.query(
    `insert into live_chat_moderation (user_id, violation_count, window_start, updated_at)
     values ($1, 1, now(), now())
     on conflict (user_id) do update set
       violation_count = case
         when live_chat_moderation.window_start < now() - interval '1 minute' then 1
         else live_chat_moderation.violation_count + 1
       end,
       window_start = case
         when live_chat_moderation.window_start < now() - interval '1 minute' then now()
         else live_chat_moderation.window_start
       end,
       cooldown_until = case
         when live_chat_moderation.window_start >= now() - interval '1 minute'
          and live_chat_moderation.violation_count + 1 >= 3 then now() + interval '5 minutes'
         else live_chat_moderation.cooldown_until
       end,
       updated_at = now()
     returning violation_count as "violationCount", cooldown_until as "cooldownUntil"`,
    [userId]
  );
  return result.rows[0] || { violationCount: 1, cooldownUntil: null };
}

async function handleGlobalChat(req, res, url) {
  const db = getDbPool();
  if (!db) {
    sendJson(res, 503, { error: "DATABASE_URL is not configured." });
    return;
  }
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (req.method === "GET") {
    const afterId = Number.parseInt(url.searchParams.get("afterId") || "0", 10);
    const result = await db.query(
      `select id, user_id as "userId", author, message, language, created_at as "createdAt"
       from global_chat_messages
       where id > $1
       order by id asc
       limit 80`,
      [Number.isFinite(afterId) ? afterId : 0]
    );
    sendJson(res, 200, { messages: result.rows });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const message = normalizeChatText(payload.message);
  if (!message) {
    sendJson(res, 400, { error: "Message is required." });
    return;
  }
  const userId = normalizeChatText(authUser?.id || payload.userId || "anonymous", 128);
  const cooldownUntil = await getLiveChatCooldown(db, userId);
  if (cooldownUntil) {
    sendJson(res, 429, { error: "Live chat cooldown active.", cooldownUntil });
    return;
  }
  if (containsBlockedLiveChatTerm(message)) {
    const moderation = await recordLiveChatViolation(db, userId);
    if (moderation.cooldownUntil) {
      sendJson(res, 429, {
        error: "Live chat cooldown active after 3 blocked messages in 1 minute.",
        cooldownUntil: moderation.cooldownUntil
      });
      return;
    }
    sendJson(res, 400, {
      error: "Live chat message blocked by the language filter.",
      remainingWarnings: Math.max(0, 3 - Number(moderation.violationCount || 1))
    });
    return;
  }
  const author = normalizeChatText(authUser?.displayName || payload.author || "Guest", 64);
  const language = normalizeChatText(payload.language || "site", 32);
  const result = await db.query(
    `insert into global_chat_messages (user_id, author, message, language)
     values ($1, $2, $3, $4)
     returning id, user_id as "userId", author, message, language, created_at as "createdAt"`,
    [userId, author, message, language]
  );
  sendJson(res, 200, { message: result.rows[0] });
}

async function handleDirectMessages(req, res, url) {
  const db = getDbPool();
  if (!db) {
    sendJson(res, 503, { error: "DATABASE_URL is not configured." });
    return;
  }
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (!authUser) {
    sendJson(res, 401, { error: "Sign in with Google to use DMs." });
    return;
  }
  if (req.method === "GET") {
    const ownName = normalizeChatText(authUser.displayName, 64);
    const result = await db.query(
      `select id, from_user_id as "fromUserId", from_name as "from", to_name as "to", message, status, created_at as "createdAt"
       from direct_messages
       where from_name = $1 or to_name = $1
       order by id desc
       limit 80`,
      [ownName]
    );
    sendJson(res, 200, { messages: result.rows });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const fromUserId = normalizeChatText(authUser.id, 128);
  const fromName = normalizeChatText(authUser.displayName, 64);
  const toName = normalizeChatText(payload.toName, 64);
  const message = normalizeChatText(payload.message, 1000);
  if (!toName || !message) {
    sendJson(res, 400, { error: "Recipient and message are required." });
    return;
  }
  const pending = await db.query(
    `select count(*)::int as count
     from direct_messages
     where from_name = $1 and to_name = $2 and status = 'pending'`,
    [fromName, toName]
  );
  if ((pending.rows[0]?.count || 0) >= 3) {
    sendJson(res, 429, { error: "You can send up to three messages without a reply." });
    return;
  }
  const result = await db.query(
    `insert into direct_messages (from_user_id, from_name, to_name, message)
     values ($1, $2, $3, $4)
     returning id, from_user_id as "fromUserId", from_name as "from", to_name as "to", message, status, created_at as "createdAt"`,
    [fromUserId, fromName, toName, message]
  );
  sendJson(res, 200, { message: result.rows[0] });
}

async function handleDirectMessageReport(req, res) {
  const db = getDbPool();
  if (!db) {
    sendJson(res, 503, { error: "DATABASE_URL is not configured." });
    return;
  }
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (!authUser) {
    sendJson(res, 401, { error: "Sign in with Google to report DMs." });
    return;
  }
  await db.query(`
    create table if not exists direct_message_reports (
      id bigserial primary key,
      message_id bigint,
      reporter_user_id text not null,
      reporter_name text not null,
      reported_user_name text not null,
      reason text not null,
      details text not null default '',
      created_at timestamptz not null default now()
    );
  `);
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const allowedReasons = new Set(["harassment", "hate", "sexual", "scam", "spam", "other"]);
  const reason = normalizeChatText(payload.reason, 32).toLowerCase();
  if (!allowedReasons.has(reason)) {
    sendJson(res, 400, { error: "Choose a valid report reason." });
    return;
  }
  const reporterUserId = normalizeChatText(authUser.id, 128);
  const reporterName = normalizeChatText(authUser.displayName, 64);
  const reportedUserName = normalizeChatText(payload.reportedUserName, 64);
  const details = normalizeChatText(payload.details || "", 1000);
  const messageId = Number.parseInt(payload.messageId || "0", 10);
  if (!reportedUserName) {
    sendJson(res, 400, { error: "Reported user is required." });
    return;
  }
  const result = await db.query(
    `insert into direct_message_reports
     (message_id, reporter_user_id, reporter_name, reported_user_name, reason, details)
     values ($1, $2, $3, $4, $5, $6)
     returning id, created_at as "createdAt"`,
    [Number.isFinite(messageId) && messageId > 0 ? messageId : null, reporterUserId, reporterName, reportedUserName, reason, details]
  );
  sendJson(res, 200, { report: result.rows[0] });
}

async function creditCoinsFromWebhook({ provider, providerEventId, providerPaymentId, userId, packageId, coins, rawEvent }) {
  const db = getDbPool();
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

function verifyStripeSignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const parsed = String(header).split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    if (key === "t") acc.timestamp = value;
    if (key === "v1") acc.signatures.push(value);
    return acc;
  }, { timestamp: "", signatures: [] });
  if (!parsed.timestamp || !parsed.signatures.length) return false;
  const signedPayload = `${parsed.timestamp}.${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return parsed.signatures.some((signature) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}

function verifyNowPaymentsSignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  // NOWPayments webhooks require sorting payload keys alphabetically to verify signatures securely
  const sorted = {};
  Object.keys(payload).sort().forEach(key => {
    sorted[key] = payload[key];
  });
  const expected = crypto.createHmac("sha512", secret).update(JSON.stringify(sorted)).digest("hex");
  return signature === expected;
}

function readJsonBody(req, maxBytes = 64_000) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function readRawBody(req, maxBytes = 1_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function safeFileName(value) {
  return String(value || "story")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "story";
}

async function handleStoryImage(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }

  const env = typeof process === "undefined" ? {} : process.env;
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "Set OPENAI_API_KEY before generating ChatGPT images. The app is showing local preview images until then."
    });
    return;
  }

  const id = safeFileName(payload.id);
  const language = ["russian", "japanese", "mandarin", "hindi", "arabic"].includes(payload.language)
    ? payload.language
    : "russian";
  const prompt = String(payload.prompt || "").trim();
  if (!prompt) {
    sendJson(res, 400, { error: "Missing image prompt." });
    return;
  }

  const imageDir = path.join(root, "languages", language, "assets", "story-ai");
  const imagePath = path.join(imageDir, `${id}.webp`);
  const publicUrl = `/languages/${language}/assets/story-ai/${id}.webp`;

  if (fs.existsSync(imagePath)) {
    sendJson(res, 200, { status: "cached", url: publicUrl });
    return;
  }

  try {
    fs.mkdirSync(imageDir, { recursive: true });
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_IMAGE_MODEL || "gpt-image-1",
        prompt,
        size: "1024x1024",
        quality: env.OPENAI_IMAGE_QUALITY || "medium",
        output_format: "webp"
      })
    });

    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: `OpenAI image request failed: ${text.slice(0, 500)}` });
      return;
    }

    const result = await response.json();
    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      sendJson(res, 502, { error: "OpenAI response did not include image data." });
      return;
    }

    fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));
    sendJson(res, 200, { status: "generated", url: publicUrl });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleTranscription(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req, 10_000_000);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }

  const env = typeof process === "undefined" ? {} : process.env;
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "Set OPENAI_API_KEY before using server transcription."
    });
    return;
  }

  const audio = String(payload.audio || "");
  const match = audio.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    sendJson(res, 400, { error: "Missing recorded audio data." });
    return;
  }

  const mimeType = match[1] || "audio/webm";
  const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("mpeg") ? "mp3" : mimeType.includes("wav") ? "wav" : "webm";
  const buffer = Buffer.from(match[2], "base64");
  const form = new FormData();
  form.append("model", env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
  form.append("file", new Blob([buffer], { type: mimeType }), `recording.${extension}`);

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}` },
      body: form
    });
    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: `OpenAI transcription request failed: ${text.slice(0, 500)}` });
      return;
    }
    const result = await response.json();
    sendJson(res, 200, { text: result.text || "" });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleStripeCheckout(req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  if (!env.STRIPE_SECRET_KEY) {
    sendJson(res, 503, { error: "Set STRIPE_SECRET_KEY on the backend before using real card checkout." });
    return;
  }
  if (!env.DATABASE_URL) {
    sendJson(res, 503, { error: "Set DATABASE_URL before accepting real payments." });
    return;
  }
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const pack = getCoinPackage(payload.packageId);
  if (!pack) {
    sendJson(res, 400, { error: "Unknown coin package." });
    return;
  }
  const origin = env.PUBLIC_APP_URL || `http://${host}:${port}`;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/?purchase=stripe_success&package=${pack.id}`);
  params.set("cancel_url", `${origin}/?purchase=stripe_cancel`);
  params.set("metadata[package_id]", pack.id);
  params.set("metadata[coins]", String(pack.coins));
  params.set("metadata[user_id]", String(payload.userId || "anonymous").slice(0, 128));
  params.set("client_reference_id", String(payload.userId || "anonymous").slice(0, 128));
  const priceId = env[`STRIPE_PRICE_ID_${pack.price}`] || env.STRIPE_PRICE_ID;
  if (priceId) {
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
  } else {
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][product_data][name]", `${pack.coins.toLocaleString()} Language Learners coins`);
    params.set("line_items[0][price_data][unit_amount]", String(pack.price * 100));
    params.set("line_items[0][quantity]", "1");
  }

  try {
    const response = await fetchWithTimeout("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params
    }, 15000);
    const result = await response.json();
    if (!response.ok) {
      sendJson(res, response.status, { error: result.error?.message || "Stripe checkout failed." });
      return;
    }
    sendJson(res, 200, { provider: "stripe", url: result.url, sessionId: result.id });
  } catch (error) {
    sendJson(res, 502, { error: error.name === "AbortError" ? "Stripe checkout request timed out. Check the Stripe secret key and try again." : error.message });
  }
}

async function handleNowPaymentsInvoice(req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  if (!env.NOWPAYMENTS_API_KEY) {
    sendJson(res, 503, { error: "Set NOWPAYMENTS_API_KEY on the backend before using crypto checkout." });
    return;
  }
  if (!env.DATABASE_URL) {
    sendJson(res, 503, { error: "Set DATABASE_URL before accepting real payments." });
    return;
  }
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const pack = getCoinPackage(payload.packageId);
  if (!pack) {
    sendJson(res, 400, { error: "Unknown coin package." });
    return;
  }
  const origin = env.PUBLIC_APP_URL || `http://${host}:${port}`;
  const userId = String(payload.userId || "anonymous").slice(0, 128);

  try {
    const response = await fetchWithTimeout("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.NOWPAYMENTS_API_KEY
      },
      body: JSON.stringify({
        price_amount: pack.price,
        price_currency: "usd",
        order_id: `${userId}__${pack.id}__${pack.coins}`,
        order_description: `${pack.coins.toLocaleString()} Language Learners coins`,
        ipn_callback_url: `${origin}/api/webhooks/nowpayments`,
        success_url: `${origin}/?purchase=nowpayments_success&package=${pack.id}`,
        cancel_url: `${origin}/?purchase=nowpayments_cancel`
      })
    }, 15000);

    const result = await response.json();
    if (!response.ok) {
      sendJson(res, response.status, { error: result.message || "NOWPayments invoice failed." });
      return;
    }
    sendJson(res, 200, { provider: "nowpayments", url: result.invoice_url, invoiceId: result.id });
  } catch (error) {
    sendJson(res, 502, { error: error.name === "AbortError" ? "NOWPayments request timed out. Check your NOWPayments API key." : error.message });
  }
}

function handleAdsConfig(_req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  sendJson(res, 200, {
    enabled: Boolean(env.GOOGLE_ADSENSE_CLIENT && env.GOOGLE_ADSENSE_REWARDED_SLOT),
    client: env.GOOGLE_ADSENSE_CLIENT || "",
    rewardedSlot: env.GOOGLE_ADSENSE_REWARDED_SLOT || ""
  });
}

async function handleWallet(req, res, url) {
  if (!process.env.DATABASE_URL) {
    sendJson(res, 503, { error: "DATABASE_URL is not configured." });
    return;
  }
  const userId = String(url.searchParams.get("userId") || "").slice(0, 128);
  if (!userId) {
    sendJson(res, 400, { error: "Missing userId." });
    return;
  }
  try {
    const wallet = await getWallet(userId);
    sendJson(res, 200, { userId: wallet.user_id, coins: wallet.coins });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleStripeWebhook(req, res) {
  const rawBody = await readRawBody(req);
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    sendJson(res, 503, { error: "STRIPE_WEBHOOK_SECRET is not configured." });
    return;
  }
  if (!verifyStripeSignature(rawBody, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET)) {
    sendJson(res, 400, { error: "Invalid Stripe webhook signature." });
    return;
  }
  const event = JSON.parse(rawBody.toString("utf8"));
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object || {};
    const metadata = session.metadata || {};
    const result = await creditCoinsFromWebhook({
      provider: "stripe",
      providerEventId: event.id,
      providerPaymentId: session.id,
      userId: metadata.user_id || session.client_reference_id,
      packageId: metadata.package_id,
      coins: metadata.coins,
      rawEvent: event
    });
    sendJson(res, 200, { received: true, ...result });
    return;
  }
  sendJson(res, 200, { received: true });
}

async function handleNowPaymentsWebhook(req, res) {
  const rawBody = await readRawBody(req);
  if (!process.env.NOWPAYMENTS_IPN_SECRET) {
    sendJson(res, 503, { error: "NOWPAYMENTS_IPN_SECRET is not configured." });
    return;
  }
  const event = JSON.parse(rawBody.toString("utf8"));
  
  if (!verifyNowPaymentsSignature(event, req.headers["x-nowpayments-sig"], process.env.NOWPAYMENTS_IPN_SECRET)) {
    sendJson(res, 400, { error: "Invalid NOWPayments webhook signature." });
    return;
  }

  if (event.payment_status === "finished" || event.payment_status === "partially_paid") {
    const orderId = event.order_id || "";
    const parts = orderId.split("__");
    if (parts.length >= 3) {
      const userId = parts[0];
      const packageId = parts[1];
      const coins = parts[2];

      const result = await creditCoinsFromWebhook({
        provider: "nowpayments",
        providerEventId: String(event.payment_id),
        providerPaymentId: String(event.payment_id),
        userId: userId,
        packageId: packageId,
        coins: coins,
        rawEvent: event
      });
      sendJson(res, 200, { received: true, ...result });
      return;
    }
  }
  sendJson(res, 200, { received: true });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  if (url.pathname === "/api/story-image" && req.method === "POST") {
    handleStoryImage(req, res);
    return;
  }
  if (url.pathname === "/api/transcribe" && req.method === "POST") {
    handleTranscription(req, res);
    return;
  }
  if (url.pathname === "/api/payments/stripe-checkout" && req.method === "POST") {
    handleStripeCheckout(req, res);
    return;
  }
  if (url.pathname === "/api/payments/nowpayments-invoice" && req.method === "POST") {
    handleNowPaymentsInvoice(req, res);
    return;
  }
  if (url.pathname === "/api/wallet" && req.method === "GET") {
    handleWallet(req, res, url);
    return;
  }
  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    handleAuthMe(req, res);
    return;
  }
  if (url.pathname === "/api/auth/google/start" && req.method === "GET") {
    handleGoogleAuthStart(req, res, url);
    return;
  }
  if (url.pathname === "/api/auth/google/callback" && req.method === "GET") {
    handleGoogleAuthCallback(req, res, url);
    return;
  }
  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    handleLogout(req, res);
    return;
  }
  if (url.pathname === "/api/chat/global" && (req.method === "GET" || req.method === "POST")) {
    handleGlobalChat(req, res, url);
    return;
  }
  if (url.pathname === "/api/dms" && (req.method === "GET" || req.method === "POST")) {
    handleDirectMessages(req, res, url);
    return;
  }
  if (url.pathname === "/api/dms/report" && req.method === "POST") {
    handleDirectMessageReport(req, res);
    return;
  }
  if (url.pathname === "/api/webhooks/stripe" && req.method === "POST") {
    handleStripeWebhook(req, res);
    return;
  }
  if (url.pathname === "/api/webhooks/nowpayments" && req.method === "POST") {
    handleNowPaymentsWebhook(req, res);
    return;
  }
  if (url.pathname === "/api/ads/config" && req.method === "GET") {
    handleAdsConfig(req, res);
    return;
  }
  if (url.pathname === "/ads.txt" && req.method === "GET") {
    const publisher = process.env.GOOGLE_ADSENSE_PUBLISHER_ID || "";
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end(publisher ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n` : "# Set GOOGLE_ADSENSE_PUBLISHER_ID on the backend.\n");
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "content-type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, host);
