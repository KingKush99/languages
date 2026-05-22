const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 9876);
const host = "127.0.0.1";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const coinPackages = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].map((price, index) => {
  const baseCoins = price * 1000;
  const bonusMultiplier = Math.pow(1.05, index);
  return {
    id: `coins_${price}`,
    price,
    coins: Math.round((baseCoins * bonusMultiplier) / 100) * 100
  };
});

function getCoinPackage(id) {
  return coinPackages.find((pack) => pack.id === id || String(pack.price) === String(id));
}

function readJsonBody(req, maxBytes = 64_000) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function safeFileName(value) {
  return String(value || "story")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "story";
}

async function handleStoryImage(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }

  const env = typeof process === "undefined" ? {} : process.env;
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "Set OPENAI_API_KEY before generating ChatGPT images. The app is showing local preview images until then."
    });
    return;
  }

  const id = safeFileName(payload.id);
  const language = ["russian", "japanese", "mandarin", "hindi", "arabic"].includes(payload.language)
    ? payload.language
    : "russian";
  const prompt = String(payload.prompt || "").trim();
  if (!prompt) {
    sendJson(res, 400, { error: "Missing image prompt." });
    return;
  }

  const imageDir = path.join(root, "languages", language, "assets", "story-ai");
  const imagePath = path.join(imageDir, `${id}.webp`);
  const publicUrl = `/languages/${language}/assets/story-ai/${id}.webp`;

  if (fs.existsSync(imagePath)) {
    sendJson(res, 200, { status: "cached", url: publicUrl });
    return;
  }

  try {
    fs.mkdirSync(imageDir, { recursive: true });
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_IMAGE_MODEL || "gpt-image-1",
        prompt,
        size: "1024x1024",
        quality: env.OPENAI_IMAGE_QUALITY || "medium",
        output_format: "webp"
      })
    });

    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: `OpenAI image request failed: ${text.slice(0, 500)}` });
      return;
    }

    const result = await response.json();
    const imageBase64 = result.data?.[0]?.b64_json;
    if (!imageBase64) {
      sendJson(res, 502, { error: "OpenAI response did not include image data." });
      return;
    }

    fs.writeFileSync(imagePath, Buffer.from(imageBase64, "base64"));
    sendJson(res, 200, { status: "generated", url: publicUrl });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleTranscription(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req, 10_000_000);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }

  const env = typeof process === "undefined" ? {} : process.env;
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "Set OPENAI_API_KEY before using server transcription."
    });
    return;
  }

  const audio = String(payload.audio || "");
  const match = audio.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    sendJson(res, 400, { error: "Missing recorded audio data." });
    return;
  }

  const mimeType = match[1] || "audio/webm";
  const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("mpeg") ? "mp3" : mimeType.includes("wav") ? "wav" : "webm";
  const buffer = Buffer.from(match[2], "base64");
  const form = new FormData();
  form.append("model", env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
  form.append("file", new Blob([buffer], { type: mimeType }), `recording.${extension}`);

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}` },
      body: form
    });
    if (!response.ok) {
      const text = await response.text();
      sendJson(res, response.status, { error: `OpenAI transcription request failed: ${text.slice(0, 500)}` });
      return;
    }
    const result = await response.json();
    sendJson(res, 200, { text: result.text || "" });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleStripeCheckout(req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  if (!env.STRIPE_SECRET_KEY) {
    sendJson(res, 503, { error: "Set STRIPE_SECRET_KEY on the backend before using real card checkout." });
    return;
  }
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const pack = getCoinPackage(payload.packageId);
  if (!pack) {
    sendJson(res, 400, { error: "Unknown coin package." });
    return;
  }
  const origin = env.PUBLIC_APP_URL || `http://${host}:${port}`;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/?purchase=stripe_success&package=${pack.id}`);
  params.set("cancel_url", `${origin}/?purchase=stripe_cancel`);
  params.set("metadata[package_id]", pack.id);
  params.set("metadata[coins]", String(pack.coins));
  const priceId = env[`STRIPE_PRICE_ID_${pack.price}`] || env.STRIPE_PRICE_ID;
  if (priceId) {
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
  } else {
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][product_data][name]", `${pack.coins.toLocaleString()} Language Learners coins`);
    params.set("line_items[0][price_data][unit_amount]", String(pack.price * 100));
    params.set("line_items[0][quantity]", "1");
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: params
    });
    const result = await response.json();
    if (!response.ok) {
      sendJson(res, response.status, { error: result.error?.message || "Stripe checkout failed." });
      return;
    }
    sendJson(res, 200, { provider: "stripe", url: result.url, sessionId: result.id });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

async function handleCoinbaseCharge(req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  if (!env.COINBASE_COMMERCE_API_KEY) {
    sendJson(res, 503, { error: "Set COINBASE_COMMERCE_API_KEY on the backend before using real crypto checkout." });
    return;
  }
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
    return;
  }
  const pack = getCoinPackage(payload.packageId);
  if (!pack) {
    sendJson(res, 400, { error: "Unknown coin package." });
    return;
  }
  const origin = env.PUBLIC_APP_URL || `http://${host}:${port}`;
  try {
    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-CC-Api-Key": env.COINBASE_COMMERCE_API_KEY,
        "X-CC-Version": env.COINBASE_COMMERCE_API_VERSION || "2018-03-22"
      },
      body: JSON.stringify({
        name: `${pack.coins.toLocaleString()} Language Learners coins`,
        description: `Coin package ${pack.id}`,
        pricing_type: "fixed_price",
        local_price: { amount: String(pack.price), currency: "USD" },
        metadata: { package_id: pack.id, coins: String(pack.coins) },
        redirect_url: `${origin}/?purchase=coinbase_success&package=${pack.id}`,
        cancel_url: `${origin}/?purchase=coinbase_cancel`
      })
    });
    const result = await response.json();
    if (!response.ok) {
      sendJson(res, response.status, { error: result.error?.message || "Coinbase charge failed." });
      return;
    }
    sendJson(res, 200, { provider: "coinbase", url: result.data?.hosted_url, chargeId: result.data?.id });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

function handleAdsConfig(_req, res) {
  const env = typeof process === "undefined" ? {} : process.env;
  sendJson(res, 200, {
    enabled: Boolean(env.GOOGLE_ADSENSE_CLIENT && env.GOOGLE_ADSENSE_REWARDED_SLOT),
    client: env.GOOGLE_ADSENSE_CLIENT || "",
    rewardedSlot: env.GOOGLE_ADSENSE_REWARDED_SLOT || ""
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  if (url.pathname === "/api/story-image" && req.method === "POST") {
    handleStoryImage(req, res);
    return;
  }
  if (url.pathname === "/api/transcribe" && req.method === "POST") {
    handleTranscription(req, res);
    return;
  }
  if (url.pathname === "/api/payments/stripe-checkout" && req.method === "POST") {
    handleStripeCheckout(req, res);
    return;
  }
  if (url.pathname === "/api/payments/coinbase-charge" && req.method === "POST") {
    handleCoinbaseCharge(req, res);
    return;
  }
  if (url.pathname === "/api/ads/config" && req.method === "GET") {
    handleAdsConfig(req, res);
    return;
  }
  if (url.pathname === "/ads.txt" && req.method === "GET") {
    const publisher = process.env.GOOGLE_ADSENSE_PUBLISHER_ID || "";
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end(publisher ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n` : "# Set GOOGLE_ADSENSE_PUBLISHER_ID on the backend.\n");
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "content-type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, host);
