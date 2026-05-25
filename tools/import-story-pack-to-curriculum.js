const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PACK_DIR = path.join(ROOT, "Stories", "Text", "language_story_pack");
const DATA_DIR = path.join(ROOT, "data");

const LANGUAGE_MAP = {
  Russian: "russian",
  Hindi: "hindi",
  Arabic: "arabic",
  Japanese: "japanese",
  Chinese: "mandarin",
  Mandarin: "mandarin"
};

const BAND_BY_LEVEL = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4
};

const DIFFICULTY_BY_LEVEL = {
  beginner: "Beginner page",
  elementary: "Elementary pages",
  intermediate: "Intermediate chapters",
  advanced: "Advanced chapters"
};

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === "\"" && line[i + 1] === "\"") {
        current += "\"";
        i++;
      } else if (ch === "\"") {
        quoted = !quoted;
      } else if (ch === "," && !quoted) {
        values.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function parseRange(value) {
  const match = String(value).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return [1, 1];
  return [Number(match[1]), Number(match[2])];
}

function ranksInRange(range) {
  const out = [];
  for (let rank = range[0]; rank <= range[1]; rank++) out.push(rank);
  return out;
}

function extractSection(text, startLabel, endLabel) {
  const start = text.indexOf(startLabel);
  if (start < 0) return "";
  const afterStart = start + startLabel.length;
  const end = endLabel ? text.indexOf(endLabel, afterStart) : -1;
  return text.slice(afterStart, end >= 0 ? end : undefined).trim();
}

function parsePages(block) {
  const normalized = block.replace(/\r\n/g, "\n");
  const matches = [...normalized.matchAll(/^Page\s+(\d+):\s*$/gmi)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;
    return {
      page: Number(match[1]),
      text: normalized.slice(start, end).trim()
    };
  });
}

function parseStoryFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const targetBlock = extractSection(text, "TARGET LANGUAGE STORY", "ENGLISH TRANSLATION").replace(/^-+\s*/m, "").trim();
  const englishBlock = extractSection(text, "ENGLISH TRANSLATION", "Implementation note:").replace(/^-+\s*/m, "").trim();
  const targetPages = parsePages(targetBlock);
  const englishPages = parsePages(englishBlock);
  return targetPages.map((targetPage, index) => ({
    heading: `Page ${targetPage.page}`,
    ru: targetPage.text,
    en: englishPages[index]?.text || ""
  }));
}

function loadCurriculum() {
  const source = fs.readFileSync(path.join(DATA_DIR, "curriculum.js"), "utf8");
  const json = source.replace(/^window\.LANGUAGE_CURRICULUM\s*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(json);
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main() {
  const curriculum = loadCurriculum();
  const manifest = readCsv(path.join(PACK_DIR, "manifest.csv"));
  const storiesByLanguage = {};

  for (const row of manifest) {
    const language = LANGUAGE_MAP[row.language];
    if (!language) throw new Error(`Unknown language in manifest: ${row.language}`);
    const level = row.level.toLowerCase();
    const storyNumber = Number(row.story_number);
    const wordRange = parseRange(row.word_range);
    const existing = curriculum.languages[language].stories.find((story) => story.wordRange?.[0] === wordRange[0] && story.wordRange?.[1] === wordRange[1]);
    const sections = parseStoryFile(path.join(PACK_DIR, row.filename));
    if (!sections.length) throw new Error(`No pages parsed from ${row.filename}`);
    const story = {
      id: `${language}-${level}-${String(storyNumber).padStart(2, "0")}`,
      level,
      title: `${row.level} ${String(storyNumber).padStart(2, "0")}: ${row.title}`,
      difficulty: DIFFICULTY_BY_LEVEL[level] || row.level,
      band: BAND_BY_LEVEL[level] || 1,
      wordRange,
      allowedWordRankMax: wordRange[1],
      newWords: ranksInRange(wordRange),
      reviewWords: existing?.reviewWords || [],
      sourceTextFile: `Stories/Text/language_story_pack/${row.filename}`,
      sections
    };
    if (!storiesByLanguage[language]) storiesByLanguage[language] = [];
    storiesByLanguage[language].push(story);
  }

  for (const [language, stories] of Object.entries(storiesByLanguage)) {
    stories.sort((a, b) => a.wordRange[0] - b.wordRange[0]);
    curriculum.languages[language].stories = stories;
    writeJson(path.join(DATA_DIR, language, "stories.json"), stories);
  }

  curriculum.generatedAt = new Date().toISOString();
  curriculum.storySource = "Stories/Text/language_story_pack";
  fs.writeFileSync(path.join(DATA_DIR, "curriculum.js"), `window.LANGUAGE_CURRICULUM = ${JSON.stringify(curriculum, null, 2)};\n`, "utf8");

  for (const [language, data] of Object.entries(curriculum.languages)) {
    console.log(`${language}: ${data.stories.length} stories from text pack`);
  }
}

main();
