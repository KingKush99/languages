const { getCoinPackage, readJsonBody, requireDatabase, sendJson, setCors } = require("../_utils");

module.exports = async function coinbaseCharge(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  if (!process.env.COINBASE_COMMERCE_API_KEY) {
    return sendJson(req, res, 503, { error: "COINBASE_COMMERCE_API_KEY is not configured." });
  }
  if (!requireDatabase(req, res)) return;

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    return sendJson(req, res, 400, { error: "Request body must be valid JSON." });
  }

  const pack = getCoinPackage(payload.packageId);
  if (!pack) return sendJson(req, res, 400, { error: "Unknown coin package." });

  const appUrl = process.env.PUBLIC_APP_URL || "https://languages-liard.vercel.app";
  const userId = String(payload.userId || "anonymous").slice(0, 128);
  const response = await fetch("https://api.commerce.coinbase.com/charges", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY,
      "X-CC-Version": process.env.COINBASE_COMMERCE_API_VERSION || "2018-03-22"
    },
    body: JSON.stringify({
      name: `${pack.coins.toLocaleString()} Language Learners coins`,
      description: `Coin package ${pack.id}`,
      pricing_type: "fixed_price",
      local_price: { amount: String(pack.price), currency: "USD" },
      metadata: { package_id: pack.id, coins: String(pack.coins), user_id: userId },
      redirect_url: `${appUrl}/?purchase=coinbase_success&package=${pack.id}`,
      cancel_url: `${appUrl}/?purchase=coinbase_cancel`
    })
  });
  const result = await response.json();
  if (!response.ok) {
    return sendJson(req, res, response.status, { error: result.error?.message || "Coinbase charge failed." });
  }
  return sendJson(req, res, 200, { provider: "coinbase", url: result.data?.hosted_url, chargeId: result.data?.id });
};
