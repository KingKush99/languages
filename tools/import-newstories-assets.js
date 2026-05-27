const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.resolve(ROOT, "..", "NewStories", "Russian");
const FAVICON_SOURCE = path.resolve(ROOT, "..", "Favicon", "1.png");
const IMAGE_TARGET_ROOT = path.join(ROOT, "Stories", "Images", "newstories", "russian");
const FAVICON_TARGET = path.join(ROOT, "assets", "favicon.png");
const DATA_DIR = path.join(ROOT, "data");

const LEVELS = [
  { source: "Beginner", key: "beginner" },
  { source: "Elementary", key: "elementary" },
  { source: "Intermediate", key: "intermediate" },
  { source: "Advanced", key: "advanced" }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function assertInsideRoot(target) {
  const resolved = path.resolve(target);
  const root = path.resolve(ROOT);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error(`Refusing to write outside project root: ${resolved}`);
  }
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) return false;
  assertInsideRoot(target);
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  return true;
}

function loadCurriculum() {
  const filePath = path.join(DATA_DIR, "curriculum.js");
  const source = fs.readFileSync(filePath, "utf8");
  return JSON.parse(source.replace(/^window\.LANGUAGE_CURRICULUM\s*=\s*/, "").replace(/;\s*$/, ""));
}

function writeCurriculum(curriculum) {
  const filePath = path.join(DATA_DIR, "curriculum.js");
  fs.writeFileSync(filePath, `window.LANGUAGE_CURRICULUM = ${JSON.stringify(curriculum, null, 2)};\n`, "utf8");
}

function writeStories(language, stories) {
  fs.writeFileSync(path.join(DATA_DIR, language, "stories.json"), `${JSON.stringify(stories, null, 2)}\n`, "utf8");
}

function parseImageName(fileName) {
  const match = path.basename(fileName, path.extname(fileName)).match(/^(\d+)(?:\.(\d+))?$/);
  if (!match) return null;
  return {
    storyNumber: Number(match[1]),
    pageNumber: Number(match[2] || 1)
  };
}

function main() {
  const copiedFavicon = copyFile(FAVICON_SOURCE, FAVICON_TARGET);
  const curriculum = loadCurriculum();
  const russianStories = curriculum.languages.russian.stories;
  const assigned = [];

  for (const level of LEVELS) {
    const sourceDir = path.join(SOURCE_ROOT, level.source);
    if (!fs.existsSync(sourceDir)) continue;
    const files = fs.readdirSync(sourceDir)
      .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
      .sort((a, b) => {
        const parsedA = parseImageName(a);
        const parsedB = parseImageName(b);
        return (parsedA?.storyNumber || 0) - (parsedB?.storyNumber || 0)
          || (parsedA?.pageNumber || 0) - (parsedB?.pageNumber || 0);
      });

    for (const file of files) {
      const parsed = parseImageName(file);
      if (!parsed) continue;
      const story = russianStories.find((item) => item.id === `russian-${level.key}-${String(parsed.storyNumber).padStart(2, "0")}`);
      if (!story) continue;
      const section = story.sections[parsed.pageNumber - 1];
      if (!section) continue;

      const ext = path.extname(file).toLowerCase();
      const targetRel = `Stories/Images/newstories/russian/${level.key}/${String(parsed.storyNumber).padStart(2, "0")}-${parsed.pageNumber}${ext}`;
      const targetAbs = path.join(ROOT, targetRel);
      if (copyFile(path.join(sourceDir, file), targetAbs)) {
        section.image = targetRel.replace(/\\/g, "/");
        assigned.push(section.image);
      }
    }
  }

  curriculum.generatedAt = new Date().toISOString();
  curriculum.storyImageSource = "M:\\Languages\\NewStories\\Russian";
  writeStories("russian", russianStories);
  writeCurriculum(curriculum);

  console.log(`favicon: ${copiedFavicon ? "copied" : "missing"}`);
  console.log(`russian story images assigned: ${assigned.length}`);
}

main();
