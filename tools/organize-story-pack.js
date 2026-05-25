const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const PACK_DIR = path.join(ROOT, "Stories", "Text", "language_story_pack");

const LANGUAGE_DIRS = {
  Arabic: "arabic",
  Chinese: "mandarin",
  Hindi: "hindi",
  Japanese: "japanese",
  Russian: "russian"
};

const LEVEL_DIRS = {
  Beginner: "beginner",
  Elementary: "elementary",
  Intermediate: "intermediate",
  Advanced: "advanced"
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function toCsv(rows) {
  const headers = ["language", "story_number", "title", "level", "pages", "word_range", "new_words", "filename"];
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => escape(row[header])).join(",")).join("\n")}\n`;
}

function slugFileName(fileName) {
  return fileName
    .replace(/\.txt$/i, "")
    .replace(/_/g, "-")
    .replace(/[^A-Za-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() + ".txt";
}

function moveIfNeeded(from, to) {
  if (path.resolve(from) === path.resolve(to)) return;
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  if (fs.existsSync(to)) {
    const source = fs.readFileSync(from);
    const target = fs.readFileSync(to);
    if (source.equals(target)) {
      fs.unlinkSync(from);
      return;
    }
    throw new Error(`Refusing to overwrite different file: ${to}`);
  }
  fs.renameSync(from, to);
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    if (entry.isFile()) out.push(full);
  }
  return out;
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function cleanupEmptyDirs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) cleanupEmptyDirs(full);
  }
  if (dir !== PACK_DIR && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

function main() {
  const manifestPath = path.join(PACK_DIR, "manifest.csv");
  const rows = readCsv(manifestPath);
  const organizedRows = [];

  for (const row of rows) {
    const languageDir = LANGUAGE_DIRS[row.language] || row.language.toLowerCase();
    const levelDir = LEVEL_DIRS[row.level] || row.level.toLowerCase();
    const oldPath = path.join(PACK_DIR, row.filename);
    const newFileName = slugFileName(path.basename(row.filename));
    const newRelative = path.join("stories", languageDir, levelDir, newFileName).replace(/\\/g, "/");
    const newPath = path.join(PACK_DIR, newRelative);
    moveIfNeeded(oldPath, newPath);
    organizedRows.push({ ...row, filename: newRelative });
  }

  for (const [oldLanguage, newLanguage] of Object.entries(LANGUAGE_DIRS)) {
    const combinedName = `ALL_50_STORIES_${oldLanguage}.txt`;
    const oldPath = path.join(PACK_DIR, oldLanguage, combinedName);
    const newRelative = path.join("combined", newLanguage, "all-50-stories.txt").replace(/\\/g, "/");
    moveIfNeeded(oldPath, path.join(PACK_DIR, newRelative));
  }

  fs.writeFileSync(manifestPath, toCsv(organizedRows), "utf8");

  const files = walkFiles(PACK_DIR).filter((file) => !file.includes(`${path.sep}.git${path.sep}`));
  const byHash = new Map();
  for (const file of files) {
    const hash = hashFile(file);
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(path.relative(PACK_DIR, file).replace(/\\/g, "/"));
  }
  const exactDuplicates = [...byHash.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([hash, paths]) => ({ hash, paths }));

  ensureDir(path.join(PACK_DIR, "reports"));
  fs.writeFileSync(
    path.join(PACK_DIR, "reports", "duplicate-report.json"),
    `${JSON.stringify({ exactDuplicateGroups: exactDuplicates }, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(PACK_DIR, "reports", "organization-summary.md"),
    [
      "# Story Pack Organization",
      "",
      "- Individual stories are stored under `stories/<language>/<level>/`.",
      "- Combined language exports are stored under `combined/<language>/all-50-stories.txt`.",
      "- `manifest.csv` has been updated to the organized individual story paths.",
      `- Exact duplicate groups found: ${exactDuplicates.length}.`,
      "",
      "The repeated story filenames across languages are intentional parallel translations, not exact duplicate files."
    ].join("\n") + "\n",
    "utf8"
  );

  cleanupEmptyDirs(PACK_DIR);
}

main();
