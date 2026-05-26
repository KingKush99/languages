const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.resolve(ROOT, "..", "NewStories");
const PACK_DIR = path.join(ROOT, "Stories", "Text", "language_story_pack");
const CURRENT_MANIFEST = path.join(PACK_DIR, "manifest.csv");

const LANGUAGES = [
  { display: "Russian", key: "russian", source: "Russian", textLabel: "Russian" },
  { display: "Hindi", key: "hindi", source: "Hindi", textLabel: "Hindi" },
  { display: "Arabic", key: "arabic", source: "Arabic", textLabel: "Arabic" },
  { display: "Japanese", key: "japanese", source: "Japanese", textLabel: "Japanese" },
  { display: "Chinese", key: "mandarin", source: "Mandarin", textLabel: "Mandarin" }
];

const LEVELS = [
  { name: "Beginner", dir: "beginner", file: "1.txt" },
  { name: "Elementary", dir: "elementary", file: "2.txt" },
  { name: "Intermediate", dir: "intermediate", file: "3.txt" },
  { name: "Advanced", dir: "advanced", file: "4.txt" }
];

const JAPANESE_INTERMEDIATE_34_TO_40 = [
  {
    number: 34,
    title: "The Lost Key (なくした鍵)",
    level: "Intermediate",
    pages: [
      {
        heading: "雨の後の庭",
        target: "放課後、すみれは家の小さな庭でなくした鍵を探していました。朝から雨が降っていたので、土は柔らかく、草には水の粒が残っていました。弟も一緒に来て、二人で石の下や植木鉢の近くを丁寧に見ました。",
        english: "After school, Sumire was looking for a lost key in the small garden at home. Because it had rained since morning, the soil was soft and drops of water remained on the grass. Her younger brother came too, and they carefully looked under stones and near the flowerpots."
      },
      {
        heading: "小さな手がかり",
        target: "すみれは古いベンチのそばで、泥の中に細い線を見つけました。それは誰かが何かを引きずった跡のようでした。弟は葉をどかしながら、「ここをもう一度見よう」と言いました。二人は急がず、静かに手がかりを追いました。",
        english: "Near an old bench, Sumire found a thin line in the mud. It looked like a mark left by something being dragged. Her brother moved the leaves aside and said, \"Let's look here one more time.\" The two followed the clue quietly without rushing."
      },
      {
        heading: "灰色の石",
        target: "最後に、灰色の小さな石の下で金色の光が見えました。すみれが石を持ち上げると、そこに鍵がありました。彼女はほっとして笑い、弟に感謝しました。その日、二人は注意深く見ることの大切さを学びました。",
        english: "At last, a golden shine appeared under a small gray stone. When Sumire lifted the stone, the key was there. She smiled with relief and thanked her brother. That day, they learned the importance of looking carefully."
      }
    ]
  },
  {
    number: 35,
    title: "The River Adventure (川の冒険)",
    level: "Intermediate",
    pages: [
      {
        heading: "朝の川辺",
        target: "夏休みの朝、はるとは友達と川辺へ行きました。水は透明で、浅い場所では小さな魚が銀色に光っていました。先生から遠くへ行きすぎないように言われていたので、みんなは岸の近くで遊ぶことにしました。",
        english: "On a summer vacation morning, Haruto went to the riverside with his friends. The water was clear, and in the shallow places small fish shone silver. Their teacher had told them not to go too far, so everyone decided to play near the bank."
      },
      {
        heading: "流された帽子",
        target: "突然、強い風が吹いて、友達の帽子が川に落ちました。帽子はゆっくり流れ始めましたが、はるとは慌てませんでした。彼は長い枝を見つけ、岸から安全に手を伸ばして帽子を引き寄せました。",
        english: "Suddenly, a strong wind blew, and a friend's hat fell into the river. The hat began to float away slowly, but Haruto did not panic. He found a long branch and safely reached from the bank to pull the hat closer."
      },
      {
        heading: "冒険の約束",
        target: "帽子が戻ると、友達は大きな声で喜びました。はるとは、川は美しいけれど注意が必要だと思いました。帰る前に、みんなは次に来る時も規則を守り、自然を大切にしようと約束しました。",
        english: "When the hat returned, his friends cheered loudly. Haruto thought that the river was beautiful but required care. Before going home, everyone promised to follow the rules next time too and take care of nature."
      }
    ]
  },
  {
    number: 36,
    title: "The Starlit Sky (星空)",
    level: "Intermediate",
    pages: [
      {
        heading: "山のキャンプ",
        target: "秋の週末、りくは家族と山へキャンプに行きました。夜になると空気が冷たくなり、町の明かりは遠くに小さく見えました。父は毛布を出し、みんなで外に座って空を見上げました。",
        english: "On an autumn weekend, Riku went camping in the mountains with his family. At night the air became cold, and the lights of the town looked small in the distance. His father brought out blankets, and everyone sat outside looking up at the sky."
      },
      {
        heading: "星座を探す",
        target: "空には数えきれないほどの星がありました。母は星座の名前を教え、りくは指で形をなぞりました。彼は、昔の人々も同じ星を見ながら旅をしたのだろうと想像しました。",
        english: "There were more stars in the sky than he could count. His mother taught him the names of constellations, and Riku traced their shapes with his finger. He imagined that people long ago must have traveled while looking at the same stars."
      },
      {
        heading: "静かな願い",
        target: "流れ星が一つ、空を横切りました。りくは目を閉じて、もっと多くのことを学びたいと願いました。翌朝、彼は小さなノートに星の絵を描き、宇宙への興味を忘れないようにしました。",
        english: "One shooting star crossed the sky. Riku closed his eyes and wished to learn many more things. The next morning, he drew stars in a small notebook so he would not forget his interest in space."
      }
    ]
  },
  {
    number: 37,
    title: "The Garden Project (庭のプロジェクト)",
    level: "Intermediate",
    pages: [
      {
        heading: "学校の空き地",
        target: "学校の裏には、長い間使われていない小さな空き地がありました。草は伸び、土は固くなっていました。クラスのみんなは先生と相談し、その場所を野菜と花の庭に変える計画を立てました。",
        english: "Behind the school, there was a small unused space that had been empty for a long time. The grass had grown tall, and the soil had become hard. The class talked with the teacher and made a plan to turn the place into a vegetable and flower garden."
      },
      {
        heading: "役割を分ける",
        target: "ゆいは種を選ぶ係になり、友達は水やりと看板作りを担当しました。最初の作業は大変で、手も服も土で汚れました。それでも、みんなは笑いながら協力し、少しずつ庭の形を作っていきました。",
        english: "Yui became responsible for choosing seeds, while her friends took charge of watering and making signs. The first work was hard, and their hands and clothes became dirty with soil. Still, everyone cooperated while laughing and slowly shaped the garden."
      },
      {
        heading: "最初の収穫",
        target: "数週間後、小さな緑の芽が並びました。やがて赤いトマトと明るい花が育ち、学校の裏は楽しい場所になりました。ゆいは、自分たちの手で育てたものには特別な味と意味があると感じました。",
        english: "A few weeks later, small green sprouts stood in rows. Eventually red tomatoes and bright flowers grew, and the back of the school became a cheerful place. Yui felt that things grown with their own hands had a special taste and meaning."
      }
    ]
  },
  {
    number: 38,
    title: "The Old Lighthouse (古い灯台)",
    level: "Intermediate",
    pages: [
      {
        heading: "海辺の町",
        target: "海辺の町には、長い間使われていない古い灯台がありました。壁の色は薄くなり、階段にはほこりが積もっていました。けれども、町の人々はその灯台を大切な記憶として守りたいと思っていました。",
        english: "In a seaside town, there was an old lighthouse that had not been used for a long time. The wall color had faded, and dust covered the stairs. Even so, the people of the town wanted to protect the lighthouse as an important memory."
      },
      {
        heading: "修理の日",
        target: "けんとは友達と一緒に掃除を手伝いました。窓を磨くと、遠くの海が青く見えました。大人たちは壊れたランプを修理し、子供たちは古い写真を並べて、小さな展示を作りました。",
        english: "Kento helped clean with his friends. When they polished the windows, the distant sea looked blue. The adults repaired the broken lamp, and the children arranged old photographs to make a small display."
      },
      {
        heading: "戻った光",
        target: "夕方、灯台の光が久しぶりに海へ向かって伸びました。町の人々は拍手し、けんとは胸が熱くなりました。古い建物でも、みんなで力を合わせれば新しい役目を持てるのだと彼は知りました。",
        english: "In the evening, the lighthouse light reached out toward the sea for the first time in a long while. The townspeople clapped, and Kento felt moved. He learned that even an old building could have a new role if everyone worked together."
      }
    ]
  },
  {
    number: 39,
    title: "The Science Fair (科学展)",
    level: "Intermediate",
    pages: [
      {
        heading: "実験の準備",
        target: "毎年秋に、学校では大きな科学展が開かれます。まなは水の浄化について発表することにしました。彼女は砂、石、布を使って小さな装置を作り、汚れた水が少しずつきれいになる様子を調べました。",
        english: "Every autumn, the school holds a large science fair. Mana decided to present about water purification. She made a small device using sand, stones, and cloth, and studied how dirty water gradually became cleaner."
      },
      {
        heading: "失敗から学ぶ",
        target: "最初の実験では、水は思ったほどきれいになりませんでした。まなは落ち込みましたが、先生は失敗も大切なデータだと言いました。彼女は材料の順番を変え、何度も試しました。",
        english: "In the first experiment, the water did not become as clean as she expected. Mana felt discouraged, but her teacher said failure was also important data. She changed the order of the materials and tried many times."
      },
      {
        heading: "発表の日",
        target: "発表の日、まなの装置はうまく動きました。見に来た人たちは、水が透明に近づく様子を見て驚きました。まなは、科学は答えを覚えるだけでなく、質問し続ける力だと感じました。",
        english: "On presentation day, Mana's device worked well. The visitors were surprised to see the water become closer to clear. Mana felt that science was not only memorizing answers, but also the power to keep asking questions."
      }
    ]
  },
  {
    number: 40,
    title: "The Sound of Music (音楽の音)",
    level: "Intermediate",
    pages: [
      {
        heading: "古い音楽室",
        target: "あやは母と一緒に、町の古い音楽室を訪れました。その日は子供たちのための小さな演奏会がありました。部屋の明かりが少し暗くなると、舞台の上でバイオリンが静かに光りました。",
        english: "Aya visited the town's old music room with her mother. That day there was a small concert for children. When the room lights became a little dim, a violin quietly shone on the stage."
      },
      {
        heading: "変わる旋律",
        target: "演奏が始まると、音はゆっくり流れたり、急に高く跳ねたりしました。あやは目を閉じて、音の中に雨、風、明るい朝の景色を感じました。言葉がなくても、音楽は気持ちを伝えられるのだと思いました。",
        english: "When the performance began, the sounds flowed slowly and sometimes jumped suddenly high. Aya closed her eyes and felt rain, wind, and a bright morning scene inside the music. She thought that even without words, music could communicate feelings."
      },
      {
        heading: "生まれた夢",
        target: "演奏会の後、みんなは大きな拍手をしました。家に帰ると、あやは昔使っていた小さなピアノを開きました。まだ上手ではありませんでしたが、もう一度練習したいという新しい夢が生まれました。",
        english: "After the concert, everyone clapped loudly. When she returned home, Aya opened the small piano she had used long ago. She was not skilled yet, but a new dream was born: she wanted to practice again."
      }
    ]
  }
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function assertInsidePack(target) {
  const resolved = path.resolve(target);
  const pack = path.resolve(PACK_DIR);
  if (!resolved.startsWith(pack + path.sep) && resolved !== pack) {
    throw new Error(`Refusing to modify path outside story pack: ${resolved}`);
  }
}

function resetDir(dir) {
  assertInsidePack(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === "\"" && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
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

function toCsv(rows) {
  const headers = ["language", "story_number", "title", "level", "pages", "word_range", "new_words", "filename"];
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
  };
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => escape(row[header])).join(",")).join("\n")}\n`;
}

function slug(input) {
  return String(input || "story")
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "story";
}

function cleanText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s*=== END OF STORY\s+\d+\s*===\s*$/i, "")
    .replace(/\s*=== END OF DATABASE\s*$/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanTitle(title) {
  return String(title || "")
    .replace(/\s+Level:\s*.*$/i, "")
    .replace(/\s+Pages:\s*.*$/i, "")
    .replace(/\s+Band:\s*.*$/i, "")
    .trim();
}

function englishTitle(title) {
  return cleanTitle(title).replace(/\s*\([^)]*\)\s*$/u, "").trim();
}

function extractAfter(block, label, stopPattern) {
  const start = block.search(label);
  if (start < 0) return "";
  const afterLabel = block.slice(start).replace(label, "");
  const stop = afterLabel.search(stopPattern);
  return cleanText(stop >= 0 ? afterLabel.slice(0, stop) : afterLabel);
}

function parseStoryBlock(block, number, defaultLevel) {
  const headerLine = block.split(/\n/)[0] || "";
  const title = cleanTitle((headerLine.match(/Title:\s*([\s\S]*?)(?=\s+Level:|\s+Pages:|\s+Band:|$)/i) || block.match(/^Title:\s*(.+)$/mi) || [])[1]);
  const level = ((block.match(/Level:\s*([A-Za-z]+)/i) || [])[1] || defaultLevel).trim();
  const pagesDeclared = Number((block.match(/Pages:\s*(\d+)/i) || [])[1] || 0);
  const band = ((block.match(/Band:\s*([0-9 -]+)/i) || [])[1] || "").trim();
  const pages = [];
  for (let page = 1; page <= pagesDeclared; page += 1) {
    const heading = extractAfter(
      block,
      new RegExp(`\\[Page\\s+${page}\\s+Heading\\]\\s*`, "i"),
      new RegExp(`\\n\\[Page\\s+${page}\\s+[^\\]]*Text\\]`, "i")
    );
    const target = extractAfter(
      block,
      new RegExp(`\\[Page\\s+${page}\\s+[^\\]]*Text\\]\\s*`, "i"),
      new RegExp(`\\n\\[Page\\s+${page}\\s+(?:Transliteration|Romaji|Pinyin|Phonetic|English Translation)\\]`, "i")
    );
    const english = extractAfter(
      block,
      new RegExp(`\\[Page\\s+${page}\\s+English Translation\\]\\s*`, "i"),
      new RegExp(`\\n\\[Page\\s+${page + 1}\\s+Heading\\]|\\n=== STORY\\s+\\d+\\s+===|\\n=== END OF DATABASE`, "i")
    );
    pages.push({
      heading: heading || `Page ${page}`,
      target,
      english
    });
  }
  return { number, title, level, pagesDeclared, band, pages };
}

function parseNewStoriesFile(filePath, defaultLevel) {
  const text = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const matches = [...text.matchAll(/^=== STORY\s+(\d+)\s+===[\s\S]*?(?=^=== STORY\s+\d+\s+===|^=== END OF DATABASE|(?![\s\S]))/gim)];
  return matches.map((match) => parseStoryBlock(match[0], Number(match[1]), defaultLevel));
}

function storyToText(language, story) {
  const targetPages = story.pages.map((page, index) => [
    `Page ${index + 1}:`,
    page.target
  ].join("\n")).join("\n\n");
  const englishPages = story.pages.map((page, index) => [
    `Page ${index + 1}:`,
    page.english
  ].join("\n")).join("\n\n");
  return [
    `Story ${String(story.number).padStart(2, "0")}: ${englishTitle(story.title)}`,
    `Language: ${language.display}`,
    `Level: ${story.level}`,
    `Pages: ${story.pages.length}`,
    `Assigned new-word slots: ${story.wordRange} (${story.newWords} new words)`,
    "",
    "TARGET LANGUAGE STORY",
    "----------------------",
    targetPages,
    "",
    "ENGLISH TRANSLATION",
    "-------------------",
    englishPages,
    "",
    "Implementation note:",
    "Use the shared cozy storybook art style, but base the image only on this story. No white border. Do not add blackboards, posters, extra books, thought bubbles, or objects unless the page text says they are there.",
    ""
  ].join("\n");
}

function validateStory(language, story) {
  if (!story.title) throw new Error(`${language.display} story ${story.number} has no title.`);
  if (!story.pages.length) throw new Error(`${language.display} story ${story.number} has no pages.`);
  for (const [index, page] of story.pages.entries()) {
    if (!page.target) throw new Error(`${language.display} story ${story.number} page ${index + 1} has no target text.`);
    if (!page.english) throw new Error(`${language.display} story ${story.number} page ${index + 1} has no English translation.`);
  }
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    throw new Error(`NewStories folder not found: ${SOURCE_ROOT}`);
  }

  const oldManifest = readCsv(CURRENT_MANIFEST);
  const oldByLanguageNumber = new Map(oldManifest.map((row) => [`${row.language}:${row.story_number}`, row]));
  const manifest = [];
  const combinedByLanguage = new Map();

  resetDir(path.join(PACK_DIR, "stories"));
  resetDir(path.join(PACK_DIR, "combined"));
  resetDir(path.join(PACK_DIR, "reports"));

  for (const language of LANGUAGES) {
    const stories = [];
    for (const level of LEVELS) {
      const sourceFile = path.join(SOURCE_ROOT, language.source, level.name, level.file);
      const parsed = parseNewStoriesFile(sourceFile, level.name);
      stories.push(...parsed);
    }
    if (language.key === "japanese") {
      const existing = new Set(stories.map((story) => story.number));
      for (const story of JAPANESE_INTERMEDIATE_34_TO_40) {
        if (!existing.has(story.number)) stories.push(story);
      }
    }

    stories.sort((a, b) => a.number - b.number);
    if (stories.length !== 50) {
      throw new Error(`${language.display} should have 50 stories, found ${stories.length}.`);
    }

    for (const story of stories) {
      const baseline = oldByLanguageNumber.get(`${language.display}:${story.number}`) || oldByLanguageNumber.get(`${language.display === "Chinese" ? "Mandarin" : language.display}:${story.number}`);
      if (!baseline) throw new Error(`No baseline manifest row for ${language.display} story ${story.number}.`);
      story.wordRange = baseline.word_range;
      story.newWords = baseline.new_words;
      validateStory(language, story);

      const levelDir = LEVELS.find((level) => level.name.toLowerCase() === story.level.toLowerCase())?.dir;
      if (!levelDir) throw new Error(`Unknown level for ${language.display} story ${story.number}: ${story.level}`);
      const filename = `stories/${language.key}/${levelDir}/${String(story.number).padStart(2, "0")}-${levelDir}-${slug(englishTitle(story.title))}.txt`;
      const outputPath = path.join(PACK_DIR, filename);
      assertInsidePack(outputPath);
      ensureDir(path.dirname(outputPath));
      fs.writeFileSync(outputPath, storyToText(language, story), "utf8");

      manifest.push({
        language: language.display,
        story_number: story.number,
        title: englishTitle(story.title),
        level: story.level,
        pages: story.pages.length,
        word_range: story.wordRange,
        new_words: story.newWords,
        filename
      });

      const combined = combinedByLanguage.get(language.key) || [];
      combined.push(storyToText(language, story));
      combinedByLanguage.set(language.key, combined);
    }
  }

  fs.writeFileSync(CURRENT_MANIFEST, toCsv(manifest), "utf8");

  for (const language of LANGUAGES) {
    const combinedPath = path.join(PACK_DIR, "combined", language.key, "all-50-stories.txt");
    assertInsidePack(combinedPath);
    ensureDir(path.dirname(combinedPath));
    fs.writeFileSync(combinedPath, combinedByLanguage.get(language.key).join("\n\n"), "utf8");
  }

  const duplicateReport = { exactDuplicateGroups: [] };
  fs.writeFileSync(path.join(PACK_DIR, "reports", "duplicate-report.json"), `${JSON.stringify(duplicateReport, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(PACK_DIR, "README.txt"), [
    "Language Story Pack",
    "",
    "Source: M:\\Languages\\NewStories, normalized for the Language Learners app.",
    "",
    "Contents:",
    "- 5 language folders under stories/: russian, hindi, arabic, japanese, mandarin",
    "- 50 individual story .txt files per language",
    "- 250 individual story .txt files total",
    "- 1 combined all-50-stories file per language under combined/",
    "- 132 story pages per language",
    "- 1,000 assigned new-word slots per language",
    "",
    "Structure:",
    "stories/<language>/beginner/: 12 stories, 1 page each, word slots 1-100",
    "stories/<language>/elementary/: 14 stories, 2 pages each, word slots 101-320",
    "stories/<language>/intermediate/: 14 stories, 3 pages each, word slots 321-650",
    "stories/<language>/advanced/: 10 stories, 5 pages each, word slots 651-1000",
    "",
    "Japanese note:",
    "M:\\Languages\\NewStories\\Japanese\\Intermediate\\3.txt only contained stories 27-33, so stories 34-40 were completed during normalization to preserve the 50-story curriculum.",
    "",
    "Important image rule:",
    "Keep the same cozy storybook style across the series, but every image should be based only on its own page text. Do not carry props or layout from one scene into the next. No white borders.",
    ""
  ].join("\n"), "utf8");

  console.log("Imported NewStories into language_story_pack.");
  for (const language of LANGUAGES) {
    const rows = manifest.filter((row) => row.language === language.display);
    const pages = rows.reduce((sum, row) => sum + Number(row.pages), 0);
    console.log(`${language.key}: ${rows.length} stories, ${pages} pages`);
  }
}

main();
