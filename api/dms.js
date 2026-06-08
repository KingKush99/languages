const { ensureLedgerSchema, getAuthUser, getPool, normalizeChatText, readJsonBody, sendJson, setCors } = require("./_utils");

function routePath(req) {
  const raw = req.query.path;
  return `/${Array.isArray(raw) ? raw.join("/") : String(raw || "")}`.replace(/\/+$/, "") || "/";
}

async function messages(req, res) {
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

  const recipient = await db.query(
    `select id, display_name as "displayName"
     from auth_users
     where lower(display_name) = lower($1)
     limit 1`,
    [toName]
  );
  const recipientUser = recipient.rows[0];
  if (!recipientUser) return sendJson(req, res, 404, { error: "Choose a registered signed-in user." });
  const normalizedRecipientName = normalizeChatText(recipientUser.displayName, 64);

  const pending = await db.query(
    `select count(*)::int as count
     from direct_messages
     where from_name = $1 and to_name = $2 and status = 'pending'`,
    [fromName, normalizedRecipientName]
  );
  if ((pending.rows[0]?.count || 0) >= 3) {
    return sendJson(req, res, 429, { error: "You can send up to three messages without a reply." });
  }

  const result = await db.query(
    `insert into direct_messages (from_user_id, from_name, to_name, message)
     values ($1, $2, $3, $4)
     returning id, from_user_id as "fromUserId", from_name as "from", to_name as "to", message, status, created_at as "createdAt"`,
    [fromUserId, fromName, normalizedRecipientName, message]
  );
  sendJson(req, res, 200, { message: result.rows[0] });
}

async function users(req, res) {
  const db = getPool();
  if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  await ensureLedgerSchema();
  const authUser = await getAuthUser(req);
  if (!authUser) return sendJson(req, res, 401, { error: "Sign in with Google to search registered users." });

  const query = normalizeChatText(req.query.q || "", 64).toLowerCase();
  const params = query ? [authUser.id, `%${query}%`] : [authUser.id];
  const result = await db.query(
    `select id, display_name as "displayName", picture
     from auth_users
     ${query ? "where lower(display_name) like $2" : ""}
     order by case when id = $1 then 0 else 1 end, updated_at desc
     limit 20`,
    params
  );
  sendJson(req, res, 200, { users: result.rows });
}

async function report(req, res) {
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
  const reportedUserName = normalizeChatText(payload.reportedUserName, 64);
  if (!allowedReasons.has(reason)) return sendJson(req, res, 400, { error: "Choose a valid report reason." });
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

module.exports = async function dms(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  try {
    const path = routePath(req);
    if ((path === "/" || path === "") && (req.method === "GET" || req.method === "POST")) return await messages(req, res);
    if (path === "/users" && req.method === "GET") return await users(req, res);
    if (path === "/report" && req.method === "POST") return await report(req, res);
    sendJson(req, res, 404, { error: "DM route not found.", path });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
