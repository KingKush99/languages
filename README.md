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

## Import format

```json
[
  { "rank": 1, "word": "hola", "translation": "hello", "partOfSpeech": "interjection" },
  { "rank": 2, "word": "yo", "translation": "I", "partOfSpeech": "pronoun" }
]
```

The default Russian dataset comes from <https://github.com/alicewriteswrongs/russian-vocab>, which states that it was scraped from MasterRussian's frequency list.
