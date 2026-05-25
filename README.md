# Languages

Static prototype for language-reading practice across Russian, Japanese, Mandarin, Hindi, and Arabic.

## Project layout

- `index.html`, `styles.css`, `script.js` - the static app.
- `server.js` - local development server for `http://127.0.0.1:9876`.
- `languages/` - language-specific folders and manifests.
- `languages/russian/assets/images/` - Russian story and theme images.
- `languages/japanese/assets/themes/` - Japanese background themes.

## Features

- Ranked vocabulary list with English glosses. The app loads a public 1000-word Russian dataset from GitHub and falls back to a bundled offline starter list if the browser is offline.
- Russian reading paragraphs built from frequency bands.
- Paragraph translation toggle.
- Hover or keyboard focus on a Russian word to see its English translation.
- Russian speech-recognition scoring using the browser Web Speech API.
- Stories tab with 300+ practice readings across beginner pages, elementary pages, intermediate chapters, and advanced multi-chapter readings.
- Every story has a right-side image panel. Local generated previews appear immediately, and the `Generate with ChatGPT` button can create and cache OpenAI-generated images when `OPENAI_API_KEY` is set.
- JSON import for another language's 1000-word dataset.
- Profile social data uses a local `SocialDataStore` layer. Followers, following, friends, and outbound message limits persist in browser storage now, and the UI is structured so the store can later be swapped for a real auth/database backend.
- Story pages now contain collectible treasures. Standard items are available immediately; rare, legendary, and god-tier items unlock after more reading tasks and feed into the 4 x 4 collection grid.
- The store UI is wired for real Stripe card checkout, Coinbase Commerce crypto checkout, and backend-provided AdSense configuration. It no longer grants fake purchase coins from the client.
- The bottom music player loads language-specific tracks from `music-manifest.js`. The first five tracks per language are free; later tracks are coin unlocks.

## Run

Run the local server:

```powershell
node server.js
```

Then open <http://127.0.0.1:9876>. Chrome or Edge is recommended for speech recognition.

## ChatGPT story images

Set `OPENAI_API_KEY` before starting the server to enable the `Generate with ChatGPT` story-image button:

```powershell
$env:OPENAI_API_KEY = "your_api_key"
node server.js
```

Generated story images are cached in `languages/<language>/assets/story-ai/`.

## Music

Music is indexed through `music-manifest.js` so the app can switch playlists when the learner changes language.

Recommended folders:

```text
languages/russian/music/
languages/japanese/music/
languages/mandarin/music/
languages/hindi/music/
languages/arabic/music/
```

The generator also supports the current Russian local folder at `Music/Artists/`. Put cover images in the same album folder as the song files.

Regenerate the manifest after adding or moving music:

```powershell
node tools/generate-music-manifest.js
```

Large WAV libraries should not be committed directly to GitHub. For production, use compressed audio such as MP3, AAC, OGG, or WebM, or serve the files from external object storage/CDN and point the manifest at those URLs.

When media is hosted outside GitHub, keep the manifest paths relative and set the public media base URL:

```js
window.LANGUAGE_MEDIA_BASE = "https://your-media-bucket.example.com";
```

or during testing:

```js
localStorage.setItem("language_media_base", "https://your-media-bucket.example.com");
```

With that setting, a manifest path like `Music/Artists/Album/cover.png` loads from `https://your-media-bucket.example.com/Music/Artists/Album/cover.png`.

## Real ads and purchases

Real payments and rewarded ads require `server.js` or another backend. Do not put secret keys in `index.html`, `script.js`, GitHub Pages, or browser storage.

This follows the same split as a plain Express deployment: GitHub Pages can host the static app, while the backend host runs `server.js` with Stripe, Coinbase Commerce, AdSense config, webhook verification, and the coin ledger.

For a GitHub Pages frontend with a separate backend, set the public backend URL in the browser:

```js
window.LANGUAGE_API_BASE = "https://your-payment-server.example.com";
```

or during testing:

```js
localStorage.setItem("language_api_base", "https://your-payment-server.example.com");
```

Backend environment variables:

```powershell
$env:PUBLIC_APP_URL = "http://127.0.0.1:9876"
$env:STRIPE_SECRET_KEY = "sk_live_or_test_key"
$env:STRIPE_PRICE_ID = "price_optional_default"
$env:COINBASE_COMMERCE_API_KEY = "coinbase_commerce_key"
$env:GOOGLE_ADSENSE_CLIENT = "ca-pub-0000000000000000"
$env:GOOGLE_ADSENSE_REWARDED_SLOT = "0000000000"
$env:GOOGLE_ADSENSE_PUBLISHER_ID = "pub-0000000000000000"
node server.js
```

Available local endpoints:

- `POST /api/payments/stripe-checkout` starts a Stripe Checkout Session for a coin package.
- `POST /api/payments/coinbase-charge` starts a Coinbase Commerce hosted crypto charge.
- `GET /api/ads/config` exposes only public ad configuration.
- `GET /ads.txt` emits the Google AdSense publisher line when `GOOGLE_ADSENSE_PUBLISHER_ID` is set.

For production, add webhook verification and a database-backed user ledger before crediting purchased coins.

## Import format

```json
[
  { "rank": 1, "word": "hola", "translation": "hello", "partOfSpeech": "interjection" },
  { "rank": 2, "word": "yo", "translation": "I", "partOfSpeech": "pronoun" }
]
```

The default Russian dataset comes from <https://github.com/alicewriteswrongs/russian-vocab>, which states that it was scraped from MasterRussian's frequency list.
