# Languages

This folder keeps language-specific content grouped by language.

- `russian/` - Russian reading content and Russian image assets.
- `japanese/` - Japanese reading content and Japanese theme assets.
- `mandarin/` - Mandarin reading content.
- `hindi/` - Hindi reading content.
- `arabic/` - Arabic reading content.

The current static app still bundles most generated text data in `script.js` so it can run from `index.html` without a build step. Generated story images are written to `languages/<language>/assets/story-ai/` by the local server and are ignored by git.
