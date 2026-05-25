const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mediaBase = String(process.env.LANGUAGE_MEDIA_BASE || "").replace(/\/+$/, "");

if (!mediaBase) {
  console.error("Set LANGUAGE_MEDIA_BASE to your public media URL before running this check.");
  process.exit(1);
}

const manifestPath = path.join(root, "music-manifest.js");
const manifestSource = fs.readFileSync(manifestPath, "utf8");
const match = manifestSource.match(/window\.languageMusicManifest\s*=\s*(\{[\s\S]*\});?\s*$/);

if (!match) {
  console.error("Could not parse music-manifest.js.");
  process.exit(1);
}

const manifest = JSON.parse(match[1]);
const urls = [];

for (const tracks of Object.values(manifest)) {
  for (const track of tracks) {
    if (track.src) urls.push(`${mediaBase}/${String(track.src).replace(/^\/+/, "")}`);
    if (track.cover) urls.push(`${mediaBase}/${String(track.cover).replace(/^\/+/, "")}`);
  }
}

async function check(url) {
  const response = await fetch(url, { method: "HEAD" });
  return { url, status: response.status, ok: response.ok };
}

(async () => {
  const results = [];
  for (const url of urls.slice(0, Number(process.env.MEDIA_CHECK_LIMIT || 20))) {
    results.push(await check(url));
  }
  const failures = results.filter((result) => !result.ok);
  console.table(results);
  if (failures.length) process.exit(1);
})();
