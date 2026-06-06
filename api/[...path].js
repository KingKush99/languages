const crypto = require("node:crypto");
const {
  ensureLedgerSchema,
  fetchWithTimeout,
  getAuthUser,
  getPool,
  getPublicOrigin,
  normalizeChatText,
  parseCookies,
  readJsonBody,
  safeRedirectTarget,
  sendJson,
  setCors,
  setSessionCookie,
  clearSessionCookie
} = require("./_utils");

const blockedLiveChatTerms = [
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "cunt", "dick",
  "pussy", "slut", "whore", "nigger", "nigga", "faggot", "retard", "kike"
];

function routePath(req) {
  const raw = req.query.path;
  return `/${Array.isArray(raw) ? raw.join("/") : String(raw || "")}`;
}

function containsBlockedLiveChatTerm(text) {
  const normalized = String(text || "").toLowerCase().replace(/[@$!1|0*._-]/g, "");
  return blockedLiveChatTerms.some((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i").test(normalized));
}

async function handleAuthMe(req, res) {
  const user = await getAuthUser(req);
  sendJson(req, res, 200, { signedIn: Boolean(user), user });
}

async function handleLogout(req, res) {
  const db = getPool();
  const token = parseCookies(req).ll_session;
  if (db && token) {
    await ensureLedgerSchema();
    await db.query("delete from auth_sessions where session_token = $1", [token]);
  }
  clearSessionCookie(req, res);
  sendJson(req, res, 200, { signedIn: false });
}

async function handleGoogleAuthStart(req, res) {
  const db = getPool();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  if (!clientId) return sendJson(req, res, 503, { error: "GOOGLE_CLIENT_ID is not configured." });

  await ensureLedgerSchema();
  const state = crypto.randomBytes(24).toString("hex");
  await db.query(
    `insert into oauth_states (state, redirect_to, expires_at)
     values ($1, $2, now() + interval '10 minutes')`,
    [state, safeRedirectTarget(req.query.redirect || "/")]
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${getPublicOrigin(req)}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account"
  });
  res.writeHead(302, { location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  res.end();
}

async function handleGoogleAuthCallback(req, res) {
  const db = getPool();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!db || !clientId || !clientSecret) {
    return sendJson(req, res, 503, { error: "Google sign-in is not configured." });
  }

  await ensureLedgerSchema();
  const code = req.query.code;
  const state = req.query.state;
  if (!code || !state) return sendJson(req, res, 400, { error: "Missing Google OAuth code or state." });

  const stateResult = await db.query(
    `delete from oauth_states
     where state = $1 and expires_at > now()
     returning redirect_to as "redirectTo"`,
    [state]
  );
  if (!stateResult.rowCount) return sendJson(req, res, 400, { error: "Google sign-in state expired. Try again." });

  const tokenResponse = await fetchWithTimeout("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${getPublicOrigin(req)}/api/auth/google/callback`,
      grant_type: "authorization_code"
    })
  });
  const tokenJson = await tokenResponse.json();
  if (!tokenResponse.ok) {
    return sendJson(req, res, tokenResponse.status, { error: tokenJson.error_description || tokenJson.error || "Google token exchange failed." });
  }

  const profileResponse = await fetchWithTimeout("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${tokenJson.access_token}` }
  });
  const profile = await profileResponse.json();
  if (!profileResponse.ok || !profile.sub || !profile.email) {
    return sendJson(req, res, 502, { error: "Could not read Google profile." });
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
  res.writeHead(302, { location: safeRedirectTarget(stateResult.rows[0].redirectTo || "/") });
  res.end();
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

async function handleGlobalChat(req, res) {
  const db = getPool();
  if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);

  if (req.method === "GET") {
    const afterId = Number.parseInt(req.query.afterId || "0", 10);
    const language = normalizeChatText(req.query.language || "", 32);
    const params = [Number.isFinite(afterId) ? afterId : 0];
    let whereClause = "where id > $1";
    if (language) {
      params.push(language);
      whereClause += " and language = $2";
    }
    const result = await db.query(
      `select id, user_id as "userId", author, message, language, created_at as "createdAt"
       from global_chat_messages
       ${whereClause}
       order by id asc
       limit 80`,
      params
    );
    return sendJson(req, res, 200, { messages: result.rows });
  }

  const payload = await readJsonBody(req);
  const message = normalizeChatText(payload.message);
  if (!message) return sendJson(req, res, 400, { error: "Message is required." });

  const userId = normalizeChatText(authUser?.id || payload.userId || "anonymous", 128);
  const cooldownUntil = await getLiveChatCooldown(db, userId);
  if (cooldownUntil) return sendJson(req, res, 429, { error: "Live chat cooldown active.", cooldownUntil });

  if (containsBlockedLiveChatTerm(message)) {
    const moderation = await recordLiveChatViolation(db, userId);
    if (moderation.cooldownUntil) {
      return sendJson(req, res, 429, {
        error: "Live chat cooldown active after 3 blocked messages in 1 minute.",
        cooldownUntil: moderation.cooldownUntil
      });
    }
    return sendJson(req, res, 400, {
      error: "Live chat message blocked by the language filter.",
      remainingWarnings: Math.max(0, 3 - Number(moderation.violationCount || 1))
    });
  }

  const author = normalizeChatText(authUser?.displayName || payload.author || "Guest", 64);
  const language = normalizeChatText(payload.language || "site", 32);
  const result = await db.query(
    `insert into global_chat_messages (user_id, author, message, language)
     values ($1, $2, $3, $4)
     returning id, user_id as "userId", author, message, language, created_at as "createdAt"`,
    [userId, author, message, language]
  );
  sendJson(req, res, 200, { message: result.rows[0] });
}

async function handleDirectMessages(req, res) {
  const db = getPool();
  if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (!authUser) return sendJson(req, res, 401, { error: "Sign in with Google to use DMs." });

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
    return sendJson(req, res, 200, { messages: result.rows });
  }

  const payload = await readJsonBody(req);
  const fromUserId = normalizeChatText(authUser.id, 128);
  const fromName = normalizeChatText(authUser.displayName, 64);
  const toName = normalizeChatText(payload.toName, 64);
  const message = normalizeChatText(payload.message, 1000);
  if (!toName || !message) return sendJson(req, res, 400, { error: "Recipient and message are required." });

  const pending = await db.query(
    `select count(*)::int as count
     from direct_messages
     where from_name = $1 and to_name = $2 and status = 'pending'`,
    [fromName, toName]
  );
  if ((pending.rows[0]?.count || 0) >= 3) {
    return sendJson(req, res, 429, { error: "You can send up to three messages without a reply." });
  }

  const result = await db.query(
    `insert into direct_messages (from_user_id, from_name, to_name, message)
     values ($1, $2, $3, $4)
     returning id, from_user_id as "fromUserId", from_name as "from", to_name as "to", message, status, created_at as "createdAt"`,
    [fromUserId, fromName, toName, message]
  );
  sendJson(req, res, 200, { message: result.rows[0] });
}

async function handleDirectMessageReport(req, res) {
  const db = getPool();
  if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (!authUser) return sendJson(req, res, 401, { error: "Sign in with Google to report DMs." });

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

  const payload = await readJsonBody(req);
  const allowedReasons = new Set(["harassment", "hate", "sexual", "scam", "spam", "other"]);
  const reason = normalizeChatText(payload.reason, 32).toLowerCase();
  if (!allowedReasons.has(reason)) return sendJson(req, res, 400, { error: "Choose a valid report reason." });

  const reportedUserName = normalizeChatText(payload.reportedUserName, 64);
  if (!reportedUserName) return sendJson(req, res, 400, { error: "Reported user is required." });

  const messageId = Number.parseInt(payload.messageId || "0", 10);
  const result = await db.query(
    `insert into direct_message_reports
     (message_id, reporter_user_id, reporter_name, reported_user_name, reason, details)
     values ($1, $2, $3, $4, $5, $6)
     returning id, created_at as "createdAt"`,
    [
      Number.isFinite(messageId) && messageId > 0 ? messageId : null,
      normalizeChatText(authUser.id, 128),
      normalizeChatText(authUser.displayName, 64),
      reportedUserName,
      reason,
      normalizeChatText(payload.details || "", 1000)
    ]
  );
  sendJson(req, res, 200, { report: result.rows[0] });
}

module.exports = async function catchAllApi(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const path = routePath(req);
    if (path === "/auth/me" && req.method === "GET") return await handleAuthMe(req, res);
    if (path === "/auth/logout" && req.method === "POST") return await handleLogout(req, res);
    if (path === "/auth/google/start" && req.method === "GET") return await handleGoogleAuthStart(req, res);
    if (path === "/auth/google/callback" && req.method === "GET") return await handleGoogleAuthCallback(req, res);
    if (path === "/chat/global" && (req.method === "GET" || req.method === "POST")) return await handleGlobalChat(req, res);
    if (path === "/dms" && (req.method === "GET" || req.method === "POST")) return await handleDirectMessages(req, res);
    if (path === "/dms/report" && req.method === "POST") return await handleDirectMessageReport(req, res);
    sendJson(req, res, 404, { error: "API route not found." });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
