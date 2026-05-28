const { getCoinPackage, readJsonBody, requireDatabase, sendJson, setCors } = require("../_utils");

module.exports = async function stripeCheckout(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(req, res, 405, { error: "Method not allowed." });
  if (!process.env.STRIPE_SECRET_KEY) {
    return sendJson(req, res, 503, { error: "STRIPE_SECRET_KEY is not configured." });
  }
  if (!requireDatabase(req, res)) return;

  let payload;
  try {
    // If Vercel has already parsed the JSON body, use it to prevent the stream from hanging
    if (req.body && typeof req.body === "object") {
      payload = req.body;
    } else {
      payload = await readJsonBody(req);
    }
  } catch (error) {
    return sendJson(req, res, 400, { error: "Request body must be valid JSON. " + error.message });
  }

  const pack = getCoinPackage(payload.packageId);
  if (!pack) return sendJson(req, res, 400, { error: "Unknown coin package." });

  const appUrl = process.env.PUBLIC_APP_URL || "https://languages-liard.vercel.app";
  const userId = String(payload.userId || "anonymous").slice(0, 128);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${appUrl}/?purchase=stripe_success&package=${pack.id}`);
  params.set("cancel_url", `${appUrl}/?purchase=stripe_cancel`);
  params.set("client_reference_id", userId);
  params.set("metadata[package_id]", pack.id);
  params.set("metadata[coins]", String(pack.coins));
  params.set("metadata[user_id]", userId);
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][product_data][name]", `${pack.coins.toLocaleString()} Language Learners coins`);
  params.set("line_items[0][price_data][unit_amount]", String(pack.price * 100));
  params.set("line_items[0][quantity]", "1");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const result = await response.json();
  if (!response.ok) {
    return sendJson(req, res, response.status, { error: result.error?.message || "Stripe checkout failed." });
  }
  return sendJson(req, res, 200, { provider: "stripe", url: result.url, sessionId: result.id });
};