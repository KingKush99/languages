const { ensureLedgerSchema, getAuthUser, getPool, normalizeChatText, readJsonBody, sendJson, setCors } = require("../_utils");

module.exports = async function directMessageReport(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });

  try {
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

    const reporterUserId = normalizeChatText(authUser.id, 128);
    const reporterName = normalizeChatText(authUser.displayName, 64);
    const reportedUserName = normalizeChatText(payload.reportedUserName, 64);
    const details = normalizeChatText(payload.details || "", 1000);
    const messageId = Number.parseInt(payload.messageId || "0", 10);
    if (!reportedUserName) return sendJson(req, res, 400, { error: "Reported user is required." });

    const result = await db.query(
      `insert into direct_message_reports
       (message_id, reporter_user_id, reporter_name, reported_user_name, reason, details)
       values ($1, $2, $3, $4, $5, $6)
       returning id, created_at as "createdAt"`,
      [Number.isFinite(messageId) && messageId > 0 ? messageId : null, reporterUserId, reporterName, reportedUserName, reason, details]
    );
    sendJson(req, res, 200, { report: result.rows[0] });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
