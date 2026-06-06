const { clearSessionCookie, ensureLedgerSchema, getPool, parseCookies, sendJson, setCors } = require("../_utils");

module.exports = async function authLogout(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  try {
    const db = getPool();
    const token = parseCookies(req).ll_session;
    if (db && token) {
      await ensureLedgerSchema();
      await db.query("delete from auth_sessions where session_token = $1", [token]);
    }
    clearSessionCookie(req, res);
    sendJson(req, res, 200, { signedIn: false });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
