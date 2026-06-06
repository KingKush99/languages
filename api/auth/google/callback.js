const crypto = require("node:crypto");
const {
  ensureLedgerSchema,
  fetchWithTimeout,
  getPool,
  getPublicOrigin,
  safeRedirectTarget,
  sendJson,
  setCors,
  setSessionCookie
} = require("../../_utils");

module.exports = async function googleAuthCallback(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendJson(req, res, 405, { error: "Method not allowed." });

  try {
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
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
