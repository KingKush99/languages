const crypto = require("node:crypto");
const { creditCoinsFromWebhook, sendJson } = require("../_utils");

function verifyNowPaymentsSignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  const sorted = {};
  Object.keys(payload).sort().forEach(key => {
    sorted[key] = payload[key];
  });
  const expected = crypto.createHmac("sha512", secret).update(JSON.stringify(sorted)).digest("hex");
  return signature === expected;
}

module.exports = async function nowpaymentsWebhook(req, res) {
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  if (!process.env.NOWPAYMENTS_IPN_SECRET) {
    return sendJson(req, res, 503, { error: "NOWPAYMENTS_IPN_SECRET is not configured." });
  }

  let event;
  try {
    event = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.toString("utf8"));
  } catch {
    return sendJson(req, res, 400, { error: "Invalid JSON." });
  }

  if (!verifyNowPaymentsSignature(event, req.headers["x-nowpayments-sig"], process.env.NOWPAYMENTS_IPN_SECRET)) {
    return sendJson(req, res, 400, { error: "Invalid NOWPayments webhook signature." });
  }

  if (event.payment_status === "finished" || event.payment_status === "partially_paid") {
    const orderId = event.order_id || "";
    const parts = orderId.split("__");
    if (parts.length >= 3) {
      const userId = parts[0];
      const packageId = parts[1];
      const coins = parts[2];

      const result = await creditCoinsFromWebhook({
        provider: "nowpayments",
        providerEventId: String(event.payment_id),
        providerPaymentId: String(event.payment_id),
        userId: userId,
        packageId: packageId,
        coins: coins,
        rawEvent: event
      });
      return sendJson(req, res, 200, { received: true, ...result });
    }
  }
  return sendJson(req, res, 200, { received: true });
};