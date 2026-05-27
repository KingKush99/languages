const { getWallet, sendJson, setCors } = require("./_utils");

module.exports = async function wallet(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendJson(req, res, 405, { error: "Method not allowed." });
  if (!process.env.DATABASE_URL) {
    return sendJson(req, res, 503, { error: "DATABASE_URL is not configured." });
  }
  const userId = String(req.query.userId || "").slice(0, 128);
  if (!userId) return sendJson(req, res, 400, { error: "Missing userId." });
  try {
    const wallet = await getWallet(userId);
    return sendJson(req, res, 200, { userId: wallet.user_id, coins: wallet.coins });
  } catch (error) {
    return sendJson(req, res, 500, { error: error.message });
  }
};
