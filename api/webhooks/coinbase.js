const { readRawBody, sendJson, verifyCoinbaseSignature } = require("../_utils");

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
    // TODO: Insert purchase event and credit coins in Postgres using DATABASE_URL.
    // Required fields: event.event.id, event.event.data.id, metadata.user_id,
    // metadata.package_id, metadata.coins.
  }

  return sendJson(req, res, 200, { received: true });
};
