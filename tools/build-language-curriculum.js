const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

const SOURCES = {
  russian: {
    label: "Russian",
    speechLang: "ru-RU",
    url: "https://1000mostcommonwords.com/1000-most-common-russian-words/",
    script: "cyrillic"
  },
  japanese: {
    label: "Japanese",
    speechLang: "ja-JP",
    url: "https://1000mostcommonwords.com/1000-most-common-japanese-words/",
    script: "cjk-hiragana-katakana"
  },
  mandarin: {
    label: "Mandarin",
    speechLang: "zh-CN",
    url: "https://1000mostcommonwords.com/1000-most-common-chinese-words/",
    script: "cjk"
  },
  hindi: {
    label: "Hindi",
    speechLang: "hi-IN",
    url: "https://1000mostcommonwords.com/1000-most-common-hindi-words/",
    script: "devanagari"
  },
  arabic: {
    label: "Arabic",
    speechLang: "ar-SA",
    url: "https://1000mostcommonwords.com/1000-most-common-arabic-words/",
    script: "arabic"
  }
};

const LEVELS = [
  { key: "beginner", label: "Beginner", difficulty: "Beginner page", band: 1, stories: 12, pages: 1, start: 1, end: 100 },
  { key: "elementary", label: "Elementary", difficulty: "Elementary pages", band: 2, stories: 14, pages: 2, start: 101, end: 320 },
  { key: "intermediate", label: "Intermediate", difficulty: "Intermediate chapters", band: 3, stories: 14, pages: 3, start: 321, end: 650 },
  { key: "advanced", label: "Advanced", difficulty: "Advanced chapters", band: 4, stories: 10, pages: 5, start: 651, end: 1000 }
];

const TEXT = {
  russian: {
    page: "Страница",
    chapter: "Глава",
    titlePrefix: "Слова",
    beginnerIntro: "Сегодня ученик читает простую страницу.",
    elementaryIntro: "В этой истории ученик возвращается к знакомым словам и добавляет новые.",
    intermediateIntro: "Герой читает заметку, сравнивает значения и строит более длинные фразы.",
    advancedIntro: "В этой главе слова становятся частью большого рассказа, где важны память, выбор и детали.",
    reviewLead: "Слова для повторения",
    newLead: "Новые слова",
    close: "Он читает вслух, слушает себя и записывает слова в тетрадь.",
    dir: "ltr"
  },
  japanese: {
    page: "ページ",
    chapter: "章",
    titlePrefix: "言葉",
    beginnerIntro: "今日は学習者が短いページを読みます。",
    elementaryIntro: "この物語では、学習者は知っている言葉を復習して、新しい言葉を加えます。",
    intermediateIntro: "主人公はメモを読み、意味を比べ、少し長い文を作ります。",
    advancedIntro: "この章では、言葉が記憶、選択、細かい出来事を持つ長い物語の一部になります。",
    reviewLead: "復習する言葉",
    newLead: "新しい言葉",
    close: "声に出して読み、自分の発音を聞き、言葉をノートに書きます。",
    dir: "ltr"
  },
  mandarin: {
    page: "第",
    chapter: "章",
    titlePrefix: "词语",
    beginnerIntro: "今天，学习者读一个短页面。",
    elementaryIntro: "在这个故事里，学习者复习熟悉的词，也加入新的词。",
    intermediateIntro: "主人公读一张纸条，比较意思，并写出更长的句子。",
    advancedIntro: "在这一章里，词语成为一个更大故事的一部分，故事里有记忆、选择和细节。",
    reviewLead: "复习词语",
    newLead: "新词语",
    close: "他大声朗读，听自己的声音，然后把词写在笔记本里。",
    dir: "ltr"
  },
  hindi: {
    page: "पेज",
    chapter: "अध्याय",
    titlePrefix: "शब्द",
    beginnerIntro: "आज विद्यार्थी एक छोटा पेज पढ़ता है।",
    elementaryIntro: "इस कहानी में विद्यार्थी पुराने शब्द दोहराता है और नए शब्द जोड़ता है।",
    intermediateIntro: "मुख्य पात्र एक नोट पढ़ता है, अर्थों की तुलना करता है और लंबे वाक्य बनाता है।",
    advancedIntro: "इस अध्याय में शब्द एक बड़ी कहानी का हिस्सा बनते हैं, जहाँ याद, चुनाव और विवरण महत्वपूर्ण हैं।",
    reviewLead: "दोहराने वाले शब्द",
    newLead: "नए शब्द",
    close: "वह ज़ोर से पढ़ता है, अपनी आवाज़ सुनता है और शब्दों को कॉपी में लिखता है।",
    dir: "ltr"
  },
  arabic: {
    page: "الصفحة",
    chapter: "الفصل",
    titlePrefix: "الكلمات",
    beginnerIntro: "اليوم يقرأ الطالب صفحة قصيرة.",
    elementaryIntro: "في هذه القصة يراجع الطالب كلمات يعرفها ويضيف كلمات جديدة.",
    intermediateIntro: "يقرأ البطل ملاحظة، ويقارن المعاني، ثم يصنع جملا أطول.",
    advancedIntro: "في هذا الفصل تصبح الكلمات جزءا من قصة كبيرة فيها ذاكرة واختيار وتفاصيل.",
    reviewLead: "كلمات المراجعة",
    newLead: "الكلمات الجديدة",
    close: "يقرأ بصوت عال، ويسمع صوته، ثم يكتب الكلمات في دفتره.",
    dir: "rtl"
  }
};

const NO_DIRECT_EQUIVALENT = {
  hindi: "सीधा समकक्ष नहीं"
};

const PARTS = ["particle", "preposition", "verb", "adverb", "pronoun", "noun", "adjective", "conjunction", "phrase"];

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (_, name) => named[name.toLowerCase()] || `&${name};`);
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "\n")
      .replace(/<style[\s\S]*?<\/style>/gi, "\n")
      .replace(/<\/(?:tr|p|li|h[1-6]|div|td|th)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
  );
}

function hasTargetScript(value, script) {
  const tests = {
    cyrillic: /\p{Script=Cyrillic}/u,
    "cjk-hiragana-katakana": /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    cjk: /\p{Script=Han}/u,
    devanagari: /\p{Script=Devanagari}/u,
    arabic: /\p{Script=Arabic}/u
  };
  return tests[script].test(value);
}

function splitRow(line, script) {
  const match = line.match(/^(\d{1,4})\s+(.+)$/);
  if (!match) return null;
  const rank = Number(match[1]);
  if (!Number.isInteger(rank) || rank < 1 || rank > 1000) return null;

  const parts = match[2].trim().split(/\s+/);
  if (parts.length < 2) return null;

  let splitAt = -1;
  for (let i = parts.length - 1; i > 0; i--) {
    const target = parts.slice(0, i).join(" ");
    const english = parts.slice(i).join(" ");
    if (hasTargetScript(target, script) && /[A-Za-z]/.test(english)) {
      splitAt = i;
      break;
    }
  }
  if (splitAt < 0) return null;

  return {
    rank,
    word: parts.slice(0, splitAt).join(" ").trim(),
    translation: parts.slice(splitAt).join(" ").trim(),
    partOfSpeech: inferPartOfSpeech(parts.slice(splitAt).join(" "))
  };
}

function inferPartOfSpeech(translation) {
  const value = translation.toLowerCase();
  if (/^(to|be|have|do|go|come|make|say|see|know|think|take|give|use|find|work|read|write|speak)\b/.test(value)) return "verb";
  if (/^(and|or|but|because|if|when|while|although)\b/.test(value)) return "conjunction";
  if (/^(in|on|at|to|from|with|by|for|of|about|under|over|between|into)\b/.test(value)) return "preposition";
  if (/^(i|you|he|she|we|they|it|this|that|who|what|which)\b/.test(value)) return "pronoun";
  if (/^(not|very|also|now|then|here|there|always|never|often|again)\b/.test(value)) return "adverb";
  if (/^(big|small|good|bad|new|old|long|short|right|left|first|last|many|few)\b/.test(value)) return "adjective";
  return "noun";
}

function normalizeRankedWords(rows) {
  return rows.slice(0, 1000).map((row, index) => ({
    rank: index + 1,
    sourceRank: row.rank,
    word: row.word.replace(/\s+/g, " ").trim(),
    translation: row.translation.replace(/\s+/g, " ").trim(),
    partOfSpeech: row.partOfSpeech
  }));
}

async function fetchWords(language, source) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`${source.url} returned ${response.status}`);
  const html = await response.text();
  const tableRows = [];
  const rowPattern = /<tr>\s*<td[^>]*>\s*(\d{1,4})\s*<\/td>\s*<td[^>]*>\s*([\s\S]*?)\s*<\/td>\s*<td[^>]*>\s*([\s\S]*?)\s*<\/td>\s*<\/tr>/gi;
  for (const match of html.matchAll(rowPattern)) {
    const rank = Number(match[1]);
    const word = htmlToText(match[2]).trim() || NO_DIRECT_EQUIVALENT[language] || "";
    const translation = htmlToText(match[3]).trim();
    if (rank >= 1 && rank <= 1000 && word && translation) {
      tableRows.push({ rank, word, translation, partOfSpeech: inferPartOfSpeech(translation) });
    }
  }
  if (tableRows.length >= 900) return normalizeRankedWords(tableRows);

  const text = htmlToText(html);
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => splitRow(line, source.script))
    .filter(Boolean);
  const words = normalizeRankedWords(rows);
  if (words.length < 900) {
    throw new Error(`Only parsed ${words.length} ${language} words from ${source.url}`);
  }
  return words;
}

function chunkRange(start, end, chunks) {
  const total = end - start + 1;
  let cursor = start;
  return Array.from({ length: chunks }, (_, index) => {
    const remainingChunks = chunks - index;
    const remainingWords = end - cursor + 1;
    const size = Math.ceil(remainingWords / remainingChunks);
    const range = [cursor, Math.min(end, cursor + size - 1)];
    cursor = range[1] + 1;
    return range;
  });
}

function byRank(words, rank) {
  return words[rank - 1] || words[words.length - 1];
}

function phrase(words) {
  return words.map((item) => item.word).join(", ");
}

function gloss(words) {
  return words.map((item) => `${item.word} = ${item.translation}`).join("; ");
}

function pageHeading(text, level, page, total) {
  if (level.band <= 2) return `${text.page} ${page}`;
  return `${text.chapter} ${page} / ${total}`;
}

function storyIntro(text, levelKey) {
  if (levelKey === "beginner") return text.beginnerIntro;
  if (levelKey === "elementary") return text.elementaryIntro;
  if (levelKey === "intermediate") return text.intermediateIntro;
  return text.advancedIntro;
}

function buildStory(language, words, level, storyIndex, range) {
  const text = TEXT[language];
  const newWords = [];
  for (let rank = range[0]; rank <= range[1]; rank++) newWords.push(byRank(words, rank));
  const reviewStart = Math.max(1, range[0] - 24);
  const reviewWords = [];
  for (let rank = reviewStart; rank < range[0]; rank += Math.max(1, Math.ceil((range[0] - reviewStart) / 8))) {
    reviewWords.push(byRank(words, rank));
  }
  const perPage = Math.ceil(newWords.length / level.pages);
  const pages = Array.from({ length: level.pages }, (_, pageIndex) => {
    const pageWords = newWords.slice(pageIndex * perPage, (pageIndex + 1) * perPage);
    const pageReview = reviewWords.slice(0, Math.min(reviewWords.length, 5));
    const targetText = [
      storyIntro(text, level.key),
      pageReview.length ? `${text.reviewLead}: ${phrase(pageReview)}.` : "",
      `${text.newLead}: ${phrase(pageWords)}.`,
      text.close
    ].filter(Boolean).join(" ");
    const en = [
      storyIntro({ ...text, beginnerIntro: "Today the learner reads a short page.", elementaryIntro: "In this story, the learner reviews known words and adds new ones.", intermediateIntro: "The main character reads a note, compares meanings, and builds longer phrases.", advancedIntro: "In this chapter, words become part of a larger story about memory, choice, and detail." }, level.key),
      pageReview.length ? `Review words: ${gloss(pageReview)}.` : "",
      `New words: ${gloss(pageWords)}.`,
      "The learner reads aloud, listens carefully, and writes the words in a notebook."
    ].filter(Boolean).join(" ");
    return {
      heading: pageHeading(text, level, pageIndex + 1, level.pages),
      ru: targetText,
      en
    };
  });
  const storyNumber = String(storyIndex + 1).padStart(2, "0");
  return {
    id: `${language}-${level.key}-${storyNumber}`,
    level: level.key,
    title: `${level.label} ${storyNumber}: ${text.titlePrefix} ${range[0]}-${range[1]}`,
    difficulty: level.difficulty,
    band: level.band,
    wordRange: range,
    allowedWordRankMax: range[1],
    newWords: newWords.map((item) => item.rank),
    reviewWords: reviewWords.map((item) => item.rank),
    sections: pages
  };
}

function buildStories(language, words) {
  const stories = [];
  for (const level of LEVELS) {
    const ranges = chunkRange(level.start, level.end, level.stories);
    ranges.forEach((range, index) => stories.push(buildStory(language, words, level, index, range)));
  }
  return stories;
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeBrowserBundle(curriculum) {
  const filePath = path.join(DATA_DIR, "curriculum.js");
  const payload = JSON.stringify(curriculum, null, 2);
  fs.writeFileSync(filePath, `window.LANGUAGE_CURRICULUM = ${payload};\n`, "utf8");
}

async function main() {
  const curriculum = {
    generatedAt: new Date().toISOString(),
    sourceName: "1000 Most Common Words",
    plan: LEVELS.map((level) => ({
      level: level.key,
      stories: level.stories,
      pagesPerStory: level.pages,
      wordRange: [level.start, level.end],
      targetNewWords: level.end - level.start + 1
    })),
    languages: {}
  };

  for (const [language, source] of Object.entries(SOURCES)) {
    console.log(`Fetching ${language} words...`);
    const words = await fetchWords(language, source);
    const stories = buildStories(language, words);
    const languageDir = path.join(DATA_DIR, language);
    writeJson(path.join(languageDir, "words.json"), words);
    writeJson(path.join(languageDir, "stories.json"), stories);
    curriculum.languages[language] = {
      label: source.label,
      speechLang: source.speechLang,
      sourceUrl: source.url,
      words,
      stories
    };
    console.log(`${language}: ${words.length} words, ${stories.length} stories`);
  }

  writeJson(path.join(DATA_DIR, "curriculum-plan.json"), curriculum.plan);
  writeBrowserBundle(curriculum);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
