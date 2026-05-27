const { creditCoinsFromWebhook, readRawBody, sendJson, verifyStripeSignature } = require("../_utils");

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
    const session = event.data?.object || {};
    const metadata = session.metadata || {};
    const result = await creditCoinsFromWebhook({
      provider: "stripe",
      providerEventId: event.id,
      providerPaymentId: session.id,
      userId: metadata.user_id || session.client_reference_id,
      packageId: metadata.package_id,
      coins: metadata.coins,
      rawEvent: event
    });
    return sendJson(req, res, 200, { received: true, ...result });
  }

  return sendJson(req, res, 200, { received: true });
};
