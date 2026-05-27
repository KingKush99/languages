const { creditCoinsFromWebhook, readRawBody, sendJson, verifyCoinbaseSignature } = require("../_utils");

module.exports = async function coinbaseWebhook(req, res) {
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  const rawBody = await readRawBody(req);
  const signature = req.headers["x-cc-webhook-signature"];

  if (!process.env.COINBASE_WEBHOOK_SECRET) {
    return sendJson(req, res, 503, { error: "COINBASE_WEBHOOK_SECRET is not configured." });
  }
  if (!process.env.DATABASE_URL) {
    return sendJson(req, res, 503, { error: "DATABASE_URL is required before crediting paid coins." });
  }
  if (!verifyCoinbaseSignature(rawBody, signature, process.env.COINBASE_WEBHOOK_SECRET)) {
    return sendJson(req, res, 400, { error: "Invalid Coinbase webhook signature." });
  }

  const event = JSON.parse(rawBody.toString("utf8"));
  if (event.event?.type === "charge:confirmed" || event.event?.type === "charge:resolved") {
    const charge = event.event?.data || {};
    const metadata = charge.metadata || {};
    const result = await creditCoinsFromWebhook({
      provider: "coinbase",
      providerEventId: event.event.id,
      providerPaymentId: charge.id || charge.code,
      userId: metadata.user_id,
      packageId: metadata.package_id,
      coins: metadata.coins,
      rawEvent: event
    });
    return sendJson(req, res, 200, { received: true, ...result });
  }

  return sendJson(req, res, 200, { received: true });
};
