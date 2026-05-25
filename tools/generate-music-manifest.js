const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const languages = ["russian", "japanese", "mandarin", "hindi", "arabic"];
const audioExts = new Set([".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac"]);
const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const sourceFolders = {
  russian: [
    "languages/russian/music",
    "languages/russian/Music",
    "languages/russian/assets/music",
    "Music/russian",
    "Music/Artists"
  ],
  japanese: ["languages/japanese/music", "languages/japanese/Music", "languages/japanese/assets/music", "Music/japanese"],
  mandarin: ["languages/mandarin/music", "languages/mandarin/Music", "languages/mandarin/assets/music", "Music/mandarin"],
  hindi: ["languages/hindi/music", "languages/hindi/Music", "languages/hindi/assets/music", "Music/hindi"],
  arabic: ["languages/arabic/music", "languages/arabic/Music", "languages/arabic/assets/music", "Music/arabic"]
};

function toWebPath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function listFiles(dir) {
  const output = [];
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...listFiles(fullPath));
    else output.push(fullPath);
  }
  return output;
}

function stripNumberPrefix(name) {
  return name.replace(/^\d+[\s.-]+/, "").trim();
}

function cleanFolderName(name) {
  return stripNumberPrefix(name).trim();
}

function findCover(audioFile) {
  let dir = path.dirname(audioFile);
  while (dir.startsWith(root)) {
    const images = fs.existsSync(dir)
      ? fs.readdirSync(dir)
          .filter((file) => imageExts.has(path.extname(file).toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      : [];
    if (images.length) return path.join(dir, images[0]);
    const next = path.dirname(dir);
    if (next === dir || next === root) break;
    dir = next;
  }
  return "";
}

function getArtistAlbum(audioFile) {
  const parts = toWebPath(audioFile).split("/");
  const artistsIndex = parts.findIndex((part) => part.toLowerCase() === "artists");
  if (artistsIndex >= 0) {
    return {
      artist: cleanFolderName(parts[artistsIndex + 1] || "Language Artist"),
      album: cleanFolderName(parts[artistsIndex + 2] || "Language Music")
    };
  }
  const parent = path.basename(path.dirname(audioFile));
  const grandparent = path.basename(path.dirname(path.dirname(audioFile)));
  return {
    artist: cleanFolderName(grandparent || "Language Artist"),
    album: cleanFolderName(parent || "Language Music")
  };
}

function priceFor(index) {
  if (index < 5) return 0;
  return 75 + Math.floor((index - 5) / 5) * 50;
}

const manifest = {};

for (const language of languages) {
  const files = [];
  for (const source of sourceFolders[language]) {
    const sourcePath = path.join(root, source);
    files.push(...listFiles(sourcePath).filter((file) => audioExts.has(path.extname(file).toLowerCase())));
  }
  const uniqueFiles = [...new Set(files)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!uniqueFiles.length) continue;

  manifest[language] = uniqueFiles.map((file, index) => {
    const { artist, album } = getArtistAlbum(file);
    const cover = findCover(file);
    const price = priceFor(index);
    return {
      id: `${language}-${index + 1}`,
      language,
      title: stripNumberPrefix(path.basename(file, path.extname(file))),
      artist,
      album,
      src: toWebPath(file),
      cover: cover ? toWebPath(cover) : "",
      free: index < 5,
      price
    };
  });
}

const output = `window.languageMusicManifest = ${JSON.stringify(manifest, null, 2)};\n`;
fs.writeFileSync(path.join(root, "music-manifest.js"), output, "utf8");

for (const language of languages) {
  const count = manifest[language]?.length || 0;
  console.log(`${language}: ${count} tracks`);
}
