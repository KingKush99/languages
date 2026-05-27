const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const releaseTag = process.env.MUSIC_RELEASE_TAG || "music-wav-v1";
const releaseBaseUrl = `https://github.com/KingKush99/languages/releases/download/${releaseTag}`;
const externalRoot = path.resolve(process.env.LANGUAGE_EXTERNAL_MEDIA_ROOT || path.join(root, ".."));
const stagingDir = path.join(root, ".release-upload", releaseTag);

const languages = ["russian", "japanese", "mandarin", "hindi", "arabic"];
const folders = {
  russian: path.join(externalRoot, "Russian", "Music", "Artists"),
  japanese: path.join(externalRoot, "Japanese", "Music", "Artists"),
  mandarin: path.join(externalRoot, "Mandarin", "Music", "Artists"),
  hindi: path.join(externalRoot, "Hindi", "Music", "Artists"),
  arabic: path.join(externalRoot, "Arabic", "Music", "Artists")
};
const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function stripNumberPrefix(name) {
  return name.replace(/^\d+[\s.-]+/, "").trim();
}

function cleanFolderName(name) {
  return stripNumberPrefix(name).trim();
}

function getTrackNumber(filePath) {
  const match = path.basename(filePath).match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function priceFor(index) {
  if (index < 5) return 0;
  return 75 + Math.floor((index - 5) / 5) * 50;
}

function findCover(audioFile, stopDir) {
  let dir = path.dirname(audioFile);
  while (dir.startsWith(stopDir)) {
    const images = fs.existsSync(dir)
      ? fs.readdirSync(dir)
          .filter((file) => imageExts.has(path.extname(file).toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      : [];
    if (images.length) return path.join(dir, images[0]);
    const next = path.dirname(dir);
    if (next === dir || next === stopDir) break;
    dir = next;
  }
  return "";
}

function artistAlbum(audioFile, sourceDir) {
  const relativeParts = path.relative(sourceDir, audioFile).split(path.sep);
  return {
    artist: cleanFolderName(relativeParts[0] || "Language Artist"),
    album: cleanFolderName(relativeParts[1] || "Language Music")
  };
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function hardlinkOrCopy(source, target) {
  fs.rmSync(target, { force: true });
  try {
    fs.linkSync(source, target);
  } catch {
    fs.copyFileSync(source, target);
  }
}

resetDir(stagingDir);

const manifest = {};
const stagedAssets = [];
const coverAssets = new Map();

for (const language of languages) {
  const sourceDir = folders[language];
  const tracks = listFiles(sourceDir)
    .filter((file) => path.extname(file).toLowerCase() === ".wav")
    .sort((a, b) => {
      const trackDiff = getTrackNumber(a) - getTrackNumber(b);
      if (trackDiff) return trackDiff;
      return a.localeCompare(b, undefined, { numeric: true });
    });

  manifest[language] = tracks.map((file, index) => {
    const trackNumber = String(index + 1).padStart(3, "0");
    const audioAsset = `${language}-${trackNumber}.wav`;
    hardlinkOrCopy(file, path.join(stagingDir, audioAsset));
    stagedAssets.push(audioAsset);

    const cover = findCover(file, sourceDir);
    let coverUrl = "";
    if (cover) {
      if (!coverAssets.has(cover)) {
        const coverNumber = String(coverAssets.size + 1).padStart(3, "0");
        const coverAsset = `${language}-cover-${coverNumber}${path.extname(cover).toLowerCase()}`;
        coverAssets.set(cover, coverAsset);
        hardlinkOrCopy(cover, path.join(stagingDir, coverAsset));
        stagedAssets.push(coverAsset);
      }
      coverUrl = `${releaseBaseUrl}/${encodeURIComponent(coverAssets.get(cover))}`;
    }

    const { artist, album } = artistAlbum(file, sourceDir);
    const price = priceFor(index);
    return {
      id: `${language}-${index + 1}`,
      language,
      title: stripNumberPrefix(path.basename(file, path.extname(file))),
      artist,
      album,
      src: `${releaseBaseUrl}/${encodeURIComponent(audioAsset)}`,
      cover: coverUrl,
      free: index < 5,
      price
    };
  });

  console.log(`${language}: ${tracks.length} tracks`);
}

fs.writeFileSync(
  path.join(root, "music-manifest.js"),
  `window.languageMusicManifest = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8"
);
fs.writeFileSync(
  path.join(stagingDir, "upload-assets.txt"),
  stagedAssets.map((asset) => path.join(stagingDir, asset)).join("\n"),
  "utf8"
);

console.log(`staged: ${stagedAssets.length} release assets`);
console.log(`manifest: ${path.join(root, "music-manifest.js")}`);
console.log(`upload list: ${path.join(stagingDir, "upload-assets.txt")}`);
