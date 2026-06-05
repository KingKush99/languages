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
- Google sign-in is supported through the Vercel backend. Profiles and DMs require a signed-in Google user, while global chat stays open to signed-out users as `Guest ####`.
- Direct messages, DM reports, and global chat can persist through Neon/Postgres when `DATABASE_URL` is configured.
- Story pages now contain collectible treasures. Standard items are available immediately; rare, legendary, and god-tier items unlock after more reading tasks and feed into the 4 x 4 collection grid.
- The store UI is wired for real Stripe card checkout, NOWPayments crypto checkout, and backend-provided AdSense configuration. It no longer grants fake purchase coins from the client.
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

The generator detects sibling libraries at `M:\Languages\<Language>\Music\Artists\` for Russian, Japanese, Mandarin, Hindi, and Arabic, then writes those entries as `<Language>/Music/Artists/...` media paths. Put cover images in the same album folder as the song files.

Regenerate the manifest after adding or moving music:

```powershell
node tools/generate-music-manifest.js
```

For local testing without copying large music files into this repo, serve `M:\Languages` as the media root in a second terminal:

```powershell
npm run media:serve
```

The app automatically uses `http://127.0.0.1:9877` as `LANGUAGE_MEDIA_BASE` when opened from a local file, localhost, or `127.0.0.1`. Manifest paths that start with a language folder, such as `Russian/Music/Artists/...`, `Japanese/Music/Artists/...`, or `Hindi/Music/Artists/...`, are loaded through the media base.

Large WAV libraries should not be committed directly to GitHub. For production, use compressed audio such as MP3, AAC, OGG, or WebM, or serve the files from external object storage/CDN and point the manifest at those URLs.

When media is hosted outside GitHub, keep the manifest paths relative and set the public media base URL:

```js
window.LANGUAGE_MEDIA_BASE = "https://your-media-bucket.example.com";
```

For the deployed site, put that value in `config.js`. This file is public config only; do not put API secrets in it.

or during testing:

```js
localStorage.setItem("language_media_base", "https://your-media-bucket.example.com");
```

With that setting, a manifest path like `Japanese/Music/Artists/Album/cover.png` loads from `https://your-media-bucket.example.com/Japanese/Music/Artists/Album/cover.png`.

## Real ads and purchases

Real payments and rewarded ads require `server.js` or another backend. Do not put secret keys in `index.html`, `script.js`, GitHub Pages, or browser storage.

This follows the same split as a plain Express deployment: GitHub Pages can host the static app, while Vercel runs the `/api` functions for Stripe, NOWPayments crypto checkout, AdSense config, webhook verification, and the coin ledger.

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
$env:PUBLIC_APP_URL = "https://languages-liard.vercel.app"
$env:DATABASE_URL = "postgres://..."
$env:GOOGLE_CLIENT_ID = "google_oauth_client_id"
$env:GOOGLE_CLIENT_SECRET = "google_oauth_client_secret"
$env:STRIPE_SECRET_KEY = "sk_live_or_test_key"
$env:STRIPE_WEBHOOK_SECRET = "whsec_..."
$env:NOWPAYMENTS_API_KEY = "nowpayments_api_key"
$env:NOWPAYMENTS_IPN_SECRET = "nowpayments_ipn_secret"
$env:GOOGLE_ADSENSE_CLIENT = "ca-pub-0000000000000000"
$env:GOOGLE_ADSENSE_REWARDED_SLOT = "0000000000"
$env:GOOGLE_ADSENSE_PUBLISHER_ID = "pub-0000000000000000"
```

Available Vercel endpoints:

- `GET /api/auth/me` returns the signed-in Google profile, or `{ signedIn: false }`.
- `GET /api/auth/google/start` starts Google OAuth.
- `GET /api/auth/google/callback` is the Google OAuth redirect URI.
- `POST /api/auth/logout` clears the server session cookie.
- `GET/POST /api/chat/global` reads and writes server-backed global chat. Signed-out users post as guests.
- `GET/POST /api/dms` reads and writes server-backed DMs. Google sign-in is required.
- `POST /api/dms/report` stores a DM report. Google sign-in is required.
- `POST /api/payments/stripe-checkout` starts a Stripe Checkout Session for a coin package.
- `POST /api/payments/nowpayments-invoice` starts a NOWPayments hosted crypto invoice.
- `POST /api/webhooks/stripe` verifies Stripe webhook signatures.
- `POST /api/webhooks/nowpayments` verifies NOWPayments webhook signatures.
- `GET /api/wallet?userId=...` returns the database coin balance for a user.
- `GET /api/ads/config` exposes only public ad configuration.
- `GET /ads.txt` emits the Google AdSense publisher line when `GOOGLE_ADSENSE_PUBLISHER_ID` is set on Vercel.

Webhook URLs to paste into providers:

```text
https://languages-liard.vercel.app/api/webhooks/stripe
https://languages-liard.vercel.app/api/webhooks/nowpayments
```

Google OAuth redirect URI to paste into Google Cloud:

```text
https://languages-liard.vercel.app/api/auth/google/callback
```

The checkout endpoints intentionally require `DATABASE_URL` before opening real checkout. That prevents a user from paying before the backend has a durable coin ledger. The webhook files verify signatures, create the `user_wallets` and `purchase_events` tables if needed, and credit coins idempotently after confirmed provider events.

## Import format

```json
[
  { "rank": 1, "word": "hola", "translation": "hello", "partOfSpeech": "interjection" },
  { "rank": 2, "word": "yo", "translation": "I", "partOfSpeech": "pronoun" }
]
```

The default Russian dataset comes from <https://github.com/alicewriteswrongs/russian-vocab>, which states that it was scraped from MasterRussian's frequency list.
