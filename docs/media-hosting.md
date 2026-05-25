# Media Hosting Setup

The app code stays on GitHub Pages. Large music and generated images should live in object storage.

## Cloudflare R2

1. Create a Cloudflare account or sign in.
2. Enable R2.
3. Create a bucket named `languages-media`.
4. Make the bucket publicly readable using either an `r2.dev` public URL or a custom domain.
5. Upload the media while preserving folder paths.
6. Put the public URL in `config.js`.

Example `config.js`:

```js
window.LANGUAGE_API_BASE = "";
window.LANGUAGE_MEDIA_BASE = "https://pub-your-bucket-id.r2.dev";
```

## Upload From This Repo

Create an R2 API token:

1. Open Cloudflare Dashboard.
2. Go to **R2 Object Storage**.
3. Create a bucket named `languages-media`.
4. Go to **Manage R2 API Tokens**.
5. Create a token with object read/write permission for `languages-media`.
6. Copy the Account ID, Access Key ID, and Secret Access Key.

Preview what will upload:

```powershell
npm run media:upload:r2 -- --dry-run
```

Upload:

```powershell
$env:R2_ACCOUNT_ID = "your_cloudflare_account_id"
$env:R2_ACCESS_KEY_ID = "your_r2_access_key_id"
$env:R2_SECRET_ACCESS_KEY = "your_r2_secret_access_key"
$env:R2_BUCKET = "languages-media"
npm run media:upload:r2
```

Check links after setting the public URL:

```powershell
$env:LANGUAGE_MEDIA_BASE = "https://pub-your-bucket-id.r2.dev"
npm run media:check
```

## Notes

- Keep the `Music/` folder out of Git.
- Convert WAV files to compressed audio before production if bandwidth or load speed becomes an issue.
- Keep manifest paths relative. The app prepends `window.LANGUAGE_MEDIA_BASE` at runtime.
