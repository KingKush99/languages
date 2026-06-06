const { ensureLedgerSchema, getAuthUser, getPool, normalizeChatText, readJsonBody, sendJson, setCors } = require("./_utils");

module.exports = async function directMessages(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET" && req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });

  try {
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
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
