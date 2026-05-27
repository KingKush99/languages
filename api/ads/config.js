const { sendJson, setCors } = require("../_utils");

module.exports = async function adsConfig(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return sendJson(req, res, 405, { error: "Method not allowed." });

  return sendJson(req, res, 200, {
    enabled: Boolean(process.env.GOOGLE_ADSENSE_CLIENT && process.env.GOOGLE_ADSENSE_REWARDED_SLOT),
    client: process.env.GOOGLE_ADSENSE_CLIENT || "",
    rewardedSlot: process.env.GOOGLE_ADSENSE_REWARDED_SLOT || ""
  });
};
