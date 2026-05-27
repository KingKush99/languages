const { readRawBody, sendJson, verifyStripeSignature } = require("../_utils");

module.exports = async function stripeWebhook(req, res) {
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  const rawBody = await readRawBody(req);
  const signature = req.headers["stripe-signature"];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return sendJson(req, res, 503, { error: "STRIPE_WEBHOOK_SECRET is not configured." });
  }
  if (!process.env.DATABASE_URL) {
    return sendJson(req, res, 503, { error: "DATABASE_URL is required before crediting paid coins." });
  }
  if (!verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) {
    return sendJson(req, res, 400, { error: "Invalid Stripe webhook signature." });
  }

  const event = JSON.parse(rawBody.toString("utf8"));
  if (event.type === "checkout.session.completed") {
    // TODO: Insert purchase event and credit coins in Postgres using DATABASE_URL.
    // Required fields: event.id, event.data.object.id, metadata.user_id,
    // metadata.package_id, metadata.coins.
  }

  return sendJson(req, res, 200, { received: true });
};
