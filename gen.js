const fs = require('fs');

const zhData = {
  names: ["李明", "王伟", "芳芳", "小华", "秀英", "建国", "强", "丽丽", "平", "静"],
  places: [["公园", "park"], ["商店", "store"], ["学校", "school"], ["图书馆", "library"], ["车站", "station"], ["市场", "market"], ["博物馆", "museum"], ["咖啡馆", "cafe"], ["家", "house"], ["大学", "university"]],
  objects: [["书", "book"], ["信", "letter"], ["电话", "phone"], ["地图", "map"], ["桌子", "table"], ["窗户", "window"], ["茶", "tea"], ["包", "bag"], ["电影", "film"], ["音乐", "music"]],
  themes: [["家庭", "family"], ["工作", "work"], ["城市", "city"], ["语言", "language"], ["历史", "history"], ["计划", "plan"], ["路", "road"], ["会议", "meeting"], ["新闻", "news"], ["问题", "question"]],
  weather: [["雪", "snow"], ["雨", "rain"], ["风", "wind"], ["太阳", "sun"], ["温暖的夜晚", "warm evening"], ["安静的早晨", "quiet morning"], ["寒冷的一天", "cold day"], ["晴朗的天空", "clear sky"]]
};

const hiData = {
  names: ["आरव", "विहान", "अदिति", "दीया", "कबीर", "रिया", "अर्जुन", "मीरा", "रोहन", "सान्या"],
  places: [["पार्क", "park"], ["दुकान", "store"], ["स्कूल", "school"], ["पुस्तकालय", "library"], ["स्टेशन", "station"], ["बाज़ार", "market"], ["संग्रहालय", "museum"], ["कैफे", "cafe"], ["घर", "house"], ["विश्वविद्यालय", "university"]],
  objects: [["किताब", "book"], ["पत्र", "letter"], ["फोन", "phone"], ["नक्शा", "map"], ["मेज़", "table"], ["खिड़की", "window"], ["चाय", "tea"], ["बैग", "bag"], ["फिल्म", "film"], ["संगीत", "music"]],
  themes: [["परिवार", "family"], ["काम", "work"], ["शहर", "city"], ["भाषा", "language"], ["इतिहास", "history"], ["योजना", "plan"], ["सड़क", "road"], ["बैठक", "meeting"], ["समाचार", "news"], ["सवाल", "question"]],
  weather: [["बर्फ", "snow"], ["बारिश", "rain"], ["हवा", "wind"], ["सूरज", "sun"], ["गर्म शाम", "warm evening"], ["शांत सुबह", "quiet morning"], ["ठंडा दिन", "cold day"], ["साफ आसमान", "clear sky"]]
};

const arData = {
  names: ["محمد", "أحمد", "فاطمة", "عائشة", "علي", "مريم", "عمر", "زينب", "يوسف", "سارة"],
  places: [["حديقة", "park"], ["متجر", "store"], ["مدرسة", "school"], ["مكتبة", "library"], ["محطة", "station"], ["سوق", "market"], ["متحف", "museum"], ["مقهى", "cafe"], ["منزل", "house"], ["جامعة", "university"]],
  objects: [["كتاب", "book"], ["رسالة", "letter"], ["هاتف", "phone"], ["خريطة", "map"], ["طاولة", "table"], ["نافذة", "window"], ["شاي", "tea"], ["حقيبة", "bag"], ["فيلم", "film"], ["موسيقى", "music"]],
  themes: [["عائلة", "family"], ["عمل", "work"], ["مدينة", "city"], ["لغة", "language"], ["تاريخ", "history"], ["خطة", "plan"], ["طريق", "road"], ["اجتماع", "meeting"], ["أخبار", "news"], ["سؤال", "question"]],
  weather: [["ثلج", "snow"], ["مطر", "rain"], ["رياح", "wind"], ["شمس", "sun"], ["مساء دافئ", "warm evening"], ["صباح هادئ", "quiet morning"], ["يوم بارد", "cold day"], ["سماء صافية", "clear sky"]]
};

function generateCode(langPrefix, dataName) {
  return `
const ${langPrefix}StorySeedData = ${dataName}; // replaced at the top

function createBeginner${langPrefix}Stories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(${dataName}.names, index);
    const [placeLang, placeEn] = seedAt(${dataName}.places, index);
    const [objectLang, objectEn] = seedAt(${dataName}.objects, index + 2);
    const [themeLang, themeEn] = seedAt(${dataName}.themes, index + 4);
    return {
      id: \`${langPrefix.toLowerCase()}-beginner-page-\${index + 1}\`,
      level: "beginner",
      title: \`${langPrefix} Page \${index + 1}: \${name}\`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "Page 1",
          ru: \`\${name} goes to the \${placeLang} in the morning. There is a \${objectLang} and a new word. \${name} reads it and thinks about \${themeLang}.\`,
          en: \`In the morning \${name} goes to the \${placeEn}. There is a \${objectEn} and a new word there. \${name} reads slowly and thinks about \${themeEn}.\`
        }
      ]
    };
  });
}

function createElementary${langPrefix}Stories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(${dataName}.names, index + 1);
    const friend = seedAt(${dataName}.names, index + 5);
    const [placeLang, placeEn] = seedAt(${dataName}.places, index + 3);
    const [objectLang, objectEn] = seedAt(${dataName}.objects, index + 1);
    const [themeLang, themeEn] = seedAt(${dataName}.themes, index + 6);
    return {
      id: \`${langPrefix.toLowerCase()}-elementary-story-\${index + 1}\`,
      level: "elementary",
      title: \`${langPrefix} Story \${index + 1}: \${placeEn}\`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "Page 1",
          ru: \`After class, \${name} meets a friend. They go to \${placeLang} and talk about \${themeLang}. \${name} listens carefully.\`,
          en: \`After the lesson \${name} meets a friend. They go to the \${placeEn} and talk about \${themeEn}. \${name} listens carefully.\`
        },
        {
          heading: "Page 2",
          ru: \`\${friend} shows a \${objectLang} and asks a question. They go home.\`,
          en: \`\${friend} shows a \${objectEn} and asks a question. Then the answer becomes clear, and the friends go home together.\`
        }
      ]
    };
  });
}

function createIntermediate${langPrefix}Stories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(${dataName}.names, index + 2);
    const [placeLang, placeEn] = seedAt(${dataName}.places, index + 4);
    const [themeLang, themeEn] = seedAt(${dataName}.themes, index + 2);
    const [weatherLang, weatherEn] = seedAt(${dataName}.weather, index);
    return {
      id: \`${langPrefix.toLowerCase()}-intermediate-chapter-\${index + 1}\`,
      level: "intermediate",
      title: \`${langPrefix} Chapter \${index + 1}: \${themeEn}\`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "Chapter 1",
          ru: \`\${name} wanted to understand \${themeLang}. Went to \${placeLang}.\`,
          en: \`\${name} had long wanted to understand the story about \${themeEn}. Then he went to the \${placeEn}.\`
        },
        {
          heading: "Chapter 2",
          ru: \`Weather was \${weatherLang}.\`,
          en: \`Outside there was \${weatherEn}.\`
        }
      ]
    };
  });
}

function createAdvanced${langPrefix}Stories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(${dataName}.names, index + 3);
    const [placeLang, placeEn] = seedAt(${dataName}.places, index + 6);
    const [themeLang, themeEn] = seedAt(${dataName}.themes, index + 1);
    const [weatherLang, weatherEn] = seedAt(${dataName}.weather, index + 2);
    return {
      id: \`${langPrefix.toLowerCase()}-advanced-chapter-\${index + 1}\`,
      level: "advanced",
      title: \`${langPrefix} Chapter \${index + 1}: \${themeEn}\`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "Chapter 1",
          ru: \`\${name} arrived at \${placeLang} late. Weather was \${weatherLang}. Thought about \${themeLang}.\`,
          en: \`When \${name} arrived at the \${placeEn} late in the evening. There was \${weatherEn} in the city. He thought about \${themeEn}.\`
        }
      ]
    };
  });
}

const generated${langPrefix}Stories = [
  ...createBeginner${langPrefix}Stories(70),
  ...createElementary${langPrefix}Stories(80),
  ...createIntermediate${langPrefix}Stories(80),
  ...createAdvanced${langPrefix}Stories(70)
];
`;
}

const zhCode = `const zhStorySeedData = ${JSON.stringify(zhData, null, 2)};` + generateCode('Zh', 'zhStorySeedData');
const hiCode = `const hiStorySeedData = ${JSON.stringify(hiData, null, 2)};` + generateCode('Hi', 'hiStorySeedData');
const arCode = `const arStorySeedData = ${JSON.stringify(arData, null, 2)};` + generateCode('Ar', 'arStorySeedData');

let script = fs.readFileSync('script.js', 'utf8');

script = script.replace(/const mandarinStories = \[\s*\{\s*id: "zh-beginner-1"[\s\S]*?\];/m, zhCode + '\nconst mandarinStories = generatedZhStories;');
script = script.replace(/const hindiStories = \[\s*\{\s*id: "hi-beginner-1"[\s\S]*?\];/m, hiCode + '\nconst hindiStories = generatedHiStories;');
script = script.replace(/const arabicStories = \[\s*\{\s*id: "ar-beginner-1"[\s\S]*?\];/m, arCode + '\nconst arabicStories = generatedArStories;');

fs.writeFileSync('script.js', script);
console.log("Done");
