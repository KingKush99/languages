const { getCoinPackage, readJsonBody, requireDatabase, sendJson, setCors } = require("../_utils");

module.exports = async function nowPaymentsInvoice(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return sendJson(req, res, 503, { error: "NOWPAYMENTS_API_KEY is not configured." });
  }
  if (!requireDatabase(req, res)) return;

  let payload;
  try {
    payload = req.body && typeof req.body === "object" ? req.body : await readJsonBody(req);
  } catch {
    return sendJson(req, res, 400, { error: "Request body must be valid JSON." });
  }

  const pack = getCoinPackage(payload.packageId);
  if (!pack) return sendJson(req, res, 400, { error: "Unknown coin package." });

  const appUrl = process.env.PUBLIC_APP_URL || "https://languages-liard.vercel.app";
  const userId = String(payload.userId || "anonymous").slice(0, 128);

  try {
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.NOWPAYMENTS_API_KEY
      },
      body: JSON.stringify({
        price_amount: pack.price,
        price_currency: "usd",
        order_id: `${userId}__${pack.id}__${pack.coins}`,
        order_description: `${pack.coins.toLocaleString()} Language Learners coins`,
        ipn_callback_url: `${appUrl}/api/webhooks/nowpayments`,
        success_url: `${appUrl}/?purchase=nowpayments_success&package=${pack.id}`,
        cancel_url: `${appUrl}/?purchase=nowpayments_cancel`
      })
    });

    const result = await response.json();
    if (!response.ok) {
      return sendJson(req, res, response.status, { error: result.message || "NOWPayments invoice failed." });
    }
    return sendJson(req, res, 200, { provider: "nowpayments", url: result.invoice_url, invoiceId: result.id });
  } catch (error) {
    return sendJson(req, res, 502, { error: error.message });
  }
};