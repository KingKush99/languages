const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const externalMediaRoot = path.resolve(process.env.LANGUAGE_EXTERNAL_MEDIA_ROOT || path.join(root, ".."));
const languages = ["russian", "japanese", "mandarin", "hindi", "arabic"];
const audioExts = new Set([".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac"]);
const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const sourceFolders = {
  russian: [
    "languages/russian/music",
    "languages/russian/Music",
    "languages/russian/assets/music",
    "Music/russian",
    {
      disk: path.join(externalMediaRoot, "Russian", "Music", "Artists"),
      web: "Russian/Music/Artists"
    }
  ],
  japanese: [
    "languages/japanese/music",
    "languages/japanese/Music",
    "languages/japanese/assets/music",
    "Music/japanese",
    {
      disk: path.join(externalMediaRoot, "Japanese", "Music", "Artists"),
      web: "Japanese/Music/Artists"
    }
  ],
  mandarin: [
    "languages/mandarin/music",
    "languages/mandarin/Music",
    "languages/mandarin/assets/music",
    "Music/mandarin",
    {
      disk: path.join(externalMediaRoot, "Mandarin", "Music", "Artists"),
      web: "Mandarin/Music/Artists"
    }
  ],
  hindi: [
    "languages/hindi/music",
    "languages/hindi/Music",
    "languages/hindi/assets/music",
    "Music/hindi",
    {
      disk: path.join(externalMediaRoot, "Hindi", "Music", "Artists"),
      web: "Hindi/Music/Artists"
    }
  ],
  arabic: [
    "languages/arabic/music",
    "languages/arabic/Music",
    "languages/arabic/assets/music",
    "Music/arabic",
    {
      disk: path.join(externalMediaRoot, "Arabic", "Music", "Artists"),
      web: "Arabic/Music/Artists"
    }
  ]
};

function normalizeSource(source) {
  if (typeof source === "string") {
    return {
      disk: path.join(root, source),
      web: source.split(/[\\/]+/).join("/")
    };
  }
  return {
    disk: path.resolve(source.disk),
    web: String(source.web || "").split(/[\\/]+/).filter(Boolean).join("/")
  };
}

function toWebPath(filePath, source) {
  const sourceMeta = source || { disk: root, web: "" };
  const relativePath = path.relative(sourceMeta.disk, filePath).split(path.sep).join("/");
  if (sourceMeta.web) return `${sourceMeta.web}/${relativePath}`;
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

function findCover(audioFile, source) {
  let dir = path.dirname(audioFile);
  const stopDir = source?.disk || root;
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

function getArtistAlbum(audioFile, source) {
  const parts = toWebPath(audioFile, source).split("/");
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
  const fileRecords = [];
  for (const source of sourceFolders[language]) {
    const sourceMeta = normalizeSource(source);
    fileRecords.push(...listFiles(sourceMeta.disk)
      .filter((file) => audioExts.has(path.extname(file).toLowerCase()))
      .map((file) => ({ file, source: sourceMeta })));
  }
  const uniqueRecords = [...new Map(fileRecords.map((record) => [toWebPath(record.file, record.source), record])).values()]
    .sort((a, b) => toWebPath(a.file, a.source).localeCompare(toWebPath(b.file, b.source), undefined, { numeric: true }));
  if (!uniqueRecords.length) continue;

  manifest[language] = uniqueRecords.map(({ file, source }, index) => {
    const { artist, album } = getArtistAlbum(file, source);
    const cover = findCover(file, source);
    const price = priceFor(index);
    return {
      id: `${language}-${index + 1}`,
      language,
      title: stripNumberPrefix(path.basename(file, path.extname(file))),
      artist,
      album,
      src: toWebPath(file, source),
      cover: cover ? toWebPath(cover, source) : "",
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
