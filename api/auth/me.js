const { getAuthUser, sendJson, setCors } = require("../_utils");

module.exports = async function authMe(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendJson(req, res, 405, { error: "Method not allowed." });
  try {
    const user = await getAuthUser(req);
    sendJson(req, res, 200, { signedIn: Boolean(user), user });
  } catch (error) {
    sendJson(req, res, 500, { error: error.message });
  }
};
