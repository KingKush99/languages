const crypto = require("node:crypto");
const { ensureLedgerSchema, getPool, getPublicOrigin, safeRedirectTarget, sendJson, setCors } = require("../../_utils");

module.exports = async function googleAuthStart(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendJson(req, res, 405, { error: "Method not allowed." });

  try {
    const db = getPool();
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!db) return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
    if (!clientId) return sendJson(req, res, 503, { error: "GOOGLE_CLIENT_ID is not configured." });

    await ensureLedgerSchema();
    const origin = getPublicOrigin(req);
    const redirectTo = safeRedirectTarget(req.query.redirect || "/");
    const state = crypto.randomBytes(24).toString("hex");
    await db.query(
      `insert into oauth_states (state, redirect_to, expires_at)
       values ($1, $2, now() + interval '10 minutes')`,
      [state, redirectTo]
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
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
