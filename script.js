function sameFileUrl(url) {
  try {
    const next = new URL(url, window.location.href);
    return window.location.protocol === "file:"
      && next.protocol === "file:"
      && next.pathname === window.location.pathname;
  } catch {
    return false;
  }
}

if (window.location.protocol === "file:") {
  document.addEventListener("submit", (event) => {
    event.preventDefault();
  }, true);

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a[href], area[href], button, input, select, textarea");
    if (!target) return;
    if ((target.matches("a[href], area[href]") && sameFileUrl(target.getAttribute("href")))
      || target.matches("button:not([type]), input[type='submit'], input[type='image']")) {
      event.preventDefault();
    }
  }, true);
}

const rawRussianWords = `
1	и	and	conjunction
2	в	in, at	preposition
3	не	not	particle
4	он	he	pronoun
5	на	on	preposition
6	я	I	pronoun
7	что	that, what	pronoun
8	тот	that	determiner
9	быть	to be	verb
10	с	with	preposition
11	а	and, but	conjunction
12	весь	all, whole	determiner
13	это	this, it	pronoun
14	как	how, as	adverb
15	она	she	pronoun
16	по	by, along	preposition
17	но	but	conjunction
18	они	they	pronoun
19	к	to, toward	preposition
20	у	at, by	preposition
21	ты	you	pronoun
22	из	from	preposition
23	мы	we	pronoun
24	за	behind, for	preposition
25	вы	you plural/formal	pronoun
26	так	so, like this	adverb
27	же	also, same	particle
28	от	from	preposition
29	сказать	to say	verb
30	этот	this	determiner
31	который	which, who	pronoun
32	мочь	can, be able	verb
33	человек	person	noun
34	о	about	preposition
35	один	one, alone	number
36	ещё	still, more	adverb
37	бы	would	particle
38	такой	such, this kind	determiner
39	только	only	adverb
40	себя	self	pronoun
41	свой	one's own	determiner
42	какой	what kind, which	pronoun
43	когда	when	adverb
44	уже	already	adverb
45	для	for	preposition
46	вот	here, there	particle
47	кто	who	pronoun
48	да	yes, and	particle
49	говорить	to speak	verb
50	год	year	noun
51	знать	to know	verb
52	мой	my	determiner
53	до	until, before	preposition
54	или	or	conjunction
55	если	if	conjunction
56	время	time	noun
57	рука	hand, arm	noun
58	нет	no, there is not	particle
59	сам	self, very	determiner
60	ни	not even	particle
61	стать	to become	verb
62	большой	big, large	adjective
63	даже	even	particle
64	другой	other, another	adjective
65	наш	our	determiner
66	свой	own	determiner
67	ну	well	particle
68	под	under	preposition
69	где	where	adverb
70	дело	matter, business	noun
71	есть	there is, to eat	verb
72	самый	most, very	determiner
73	раз	time, occasion	noun
74	чтобы	so that	conjunction
75	два	two	number
76	там	there	adverb
77	чем	than, with what	pronoun
78	глаз	eye	noun
79	жизнь	life	noun
80	первый	first	adjective
81	день	day	noun
82	тут	here	adverb
83	во	in, into	preposition
84	ничто	nothing	pronoun
85	потом	then, later	adverb
86	очень	very	adverb
87	со	with	preposition
88	хотеть	to want	verb
89	ли	whether	particle
90	при	at, near	preposition
91	голова	head	noun
92	над	above	preposition
93	без	without	preposition
94	видеть	to see	verb
95	идти	to go	verb
96	теперь	now	adverb
97	тоже	also	adverb
98	стоять	to stand	verb
99	друг	friend	noun
100	дом	house, home	noun
101	сейчас	now	adverb
102	можно	possible, may	adverb
103	после	after	preposition
104	слово	word	noun
105	здесь	here	adverb
106	думать	to think	verb
107	место	place	noun
108	спросить	to ask	verb
109	через	through, across	preposition
110	лицо	face	noun
111	что-то	something	pronoun
112	тогда	then	adverb
113	ведь	after all	particle
114	хороший	good	adjective
115	каждый	each, every	determiner
116	новый	new	adjective
117	жить	to live	verb
118	должен	must, should	adjective
119	смотреть	to look	verb
120	почему	why	adverb
121	потому	because	adverb
122	сторона	side	noun
123	просто	simply	adverb
124	нога	leg, foot	noun
125	сидеть	to sit	verb
126	понять	to understand	verb
127	иметь	to have	verb
128	конечный	final	adjective
129	делать	to do, make	verb
130	вдруг	suddenly	adverb
131	надо	need, must	adverb
132	два	two	number
133	никто	nobody	pronoun
134	перед	before, in front	preposition
135	мир	world, peace	noun
136	дверь	door	noun
137	разве	really, perhaps	particle
138	голос	voice	noun
139	лучше	better	adverb
140	также	also	adverb
141	взять	to take	verb
142	уж	already, really	particle
143	хоть	at least	conjunction
144	пока	while, for now	conjunction
145	сила	force, strength	noun
146	любить	to love	verb
147	мужчина	man	noun
148	женщина	woman	noun
149	машина	car, machine	noun
150	вода	water	noun
151	отец	father	noun
152	мать	mother	noun
153	работа	work	noun
154	случай	case, occasion	noun
155	ночь	night	noun
156	город	city	noun
157	земля	earth, land	noun
158	ребёнок	child	noun
159	снова	again	adverb
160	последний	last	adjective
161	час	hour	noun
162	пойти	to go	verb
163	вопрос	question	noun
164	начать	to begin	verb
165	сделать	to do, make	verb
166	много	many, much	adverb
167	минута	minute	noun
168	правда	truth	noun
169	дорога	road	noun
170	окно	window	noun
171	комната	room	noun
172	стол	table	noun
173	имя	name	noun
174	вечер	evening	noun
175	утро	morning	noun
176	сегодня	today	adverb
177	завтра	tomorrow	adverb
178	вчера	yesterday	adverb
179	ждать	to wait	verb
180	писать	to write	verb
181	читать	to read	verb
182	слушать	to listen	verb
183	учить	to learn, teach	verb
184	русский	Russian	adjective
185	язык	language	noun
186	книга	book	noun
187	школа	school	noun
188	университет	university	noun
189	магазин	store	noun
190	рынок	market	noun
191	семья	family	noun
192	брат	brother	noun
193	сестра	sister	noun
194	жена	wife	noun
195	муж	husband	noun
196	сын	son	noun
197	дочь	daughter	noun
198	деньги	money	noun
199	цена	price	noun
200	еда	food	noun
201	хлеб	bread	noun
202	чай	tea	noun
203	кофе	coffee	noun
204	молоко	milk	noun
205	суп	soup	noun
206	мясо	meat	noun
207	рыба	fish	noun
208	овощ	vegetable	noun
209	фрукт	fruit	noun
210	яблоко	apple	noun
211	улица	street	noun
212	парк	park	noun
213	река	river	noun
214	море	sea	noun
215	лес	forest	noun
216	гора	mountain	noun
217	небо	sky	noun
218	солнце	sun	noun
219	дождь	rain	noun
220	снег	snow	noun
221	ветер	wind	noun
222	тепло	warmth	adverb
223	холодно	cold	adverb
224	быстро	quickly	adverb
225	медленно	slowly	adverb
226	рано	early	adverb
227	поздно	late	adverb
228	рядом	nearby	adverb
229	далеко	far	adverb
230	всегда	always	adverb
231	никогда	never	adverb
232	часто	often	adverb
233	иногда	sometimes	adverb
234	обычно	usually	adverb
235	вместе	together	adverb
236	один	alone, one	number
237	два	two	number
238	три	three	number
239	четыре	four	number
240	пять	five	number
241	шесть	six	number
242	семь	seven	number
243	восемь	eight	number
244	девять	nine	number
245	десять	ten	number
246	маленький	small	adjective
247	старый	old	adjective
248	молодой	young	adjective
249	важный	important	adjective
250	нужный	needed	adjective
251	красный	red	adjective
252	синий	blue	adjective
253	зелёный	green	adjective
254	белый	white	adjective
255	чёрный	black	adjective
256	открыть	to open	verb
257	закрыть	to close	verb
258	найти	to find	verb
259	помнить	to remember	verb
260	забыть	to forget	verb
261	помочь	to help	verb
262	работать	to work	verb
263	играть	to play	verb
264	платить	to pay	verb
265	купить	to buy	verb
266	прийти	to arrive, come	verb
267	уйти	to leave	verb
268	ждать	to wait	verb
269	звонить	to call	verb
270	ответить	to answer	verb
271	показать	to show	verb
272	получить	to receive	verb
273	дать	to give	verb
274	положить	to put	verb
275	держать	to hold	verb
276	ждать	to wait	verb
277	нравиться	to like	verb
278	казаться	to seem	verb
279	значить	to mean	verb
280	остаться	to stay	verb
281	история	story, history	noun
282	письмо	letter	noun
283	телефон	telephone	noun
284	компьютер	computer	noun
285	музыка	music	noun
286	фильм	film	noun
287	новость	news	noun
288	страна	country	noun
289	народ	people, nation	noun
290	право	right, law	noun
291	власть	authority, power	noun
292	война	war	noun
293	мир	peace, world	noun
294	любовь	love	noun
295	счастье	happiness	noun
296	страх	fear	noun
297	сон	sleep, dream	noun
298	улыбка	smile	noun
299	встреча	meeting	noun
300	поезд	train	noun
`;

const fallbackTranslations = {
  меня: "me", мне: "to me", мной: "by me", тебе: "to you", тебя: "you", его: "his, him", её: "her", ее: "her",
  нас: "us", вам: "to you", им: "to them", их: "their, them", дома: "at home, houses", доме: "in the house",
  города: "cities, of the city", городе: "in the city", люди: "people", людям: "to people", людей: "people",
  утром: "in the morning", вечером: "in the evening", сегодня: "today", завтра: "tomorrow", вчера: "yesterday",
  читаю: "I read", читает: "reads", читают: "read", говорю: "I speak", говорит: "speaks", говорят: "speak",
  знаю: "I know", знает: "knows", знают: "know", хочу: "I want", хочет: "wants", хотим: "we want",
  могу: "I can", может: "can", можем: "we can", нужно: "needed, must", можно: "may, possible",
  был: "was", была: "was", было: "was", были: "were", буду: "I will be", будет: "will be",
  есть: "there is, eat", нет: "no, there is not", хорошо: "well, good", лучше: "better", больше: "more",
  маленькая: "small", большая: "big", новая: "new", новый: "new", важная: "important", важный: "important",
  русский: "Russian", русские: "Russian", языке: "language", слова: "words", слов: "words", слово: "word",
  работу: "work", работе: "at work", школы: "schools, of school", школе: "at school", книгу: "book",
  книг: "books", улице: "on the street", улицу: "street", парке: "in the park", магазину: "to the store",
  магазин: "store", хлеб: "bread", воду: "water", чай: "tea", кофе: "coffee", деньги: "money",
  семье: "in the family", семья: "family", другом: "with a friend", друга: "friend", друзья: "friends",
  время: "time", времени: "time", день: "day", дня: "day", минут: "minutes", часа: "hour",
  слушаю: "I listen", слушает: "listens", учу: "I learn", учит: "learns, teaches", пишу: "I write",
  пишет: "writes", иду: "I go", идёт: "goes", идет: "goes", идут: "go", пришёл: "came", пришел: "came",
  вижу: "I see", видит: "sees", смотрю: "I look", смотрит: "looks", делаю: "I do", делает: "does",
  понимаю: "I understand", понимает: "understands", спросил: "asked", сказала: "said", сказал: "said",
};

const paragraphs = [
  {
    title: "Morning in the city",
    band: 1,
    difficulty: "Beginner",
    ru: "Сегодня утром я иду по улице в город. Я вижу дом, парк и магазин. У меня есть время, и я читаю новые русские слова.",
    en: "This morning I walk along the street into the city. I see a house, a park, and a store. I have time, and I read new Russian words."
  },
  {
    title: "At home",
    band: 1,
    difficulty: "Beginner",
    ru: "В доме моя семья. Мать пьёт чай, отец читает книгу, а брат слушает музыку. Я говорю по-русски медленно, но каждый день лучше.",
    en: "My family is in the house. Mother drinks tea, father reads a book, and brother listens to music. I speak Russian slowly, but better every day."
  },
  {
    title: "A simple question",
    band: 2,
    difficulty: "Elementary",
    ru: "Друг спрашивает: почему ты учишь русский язык? Я отвечаю: потому что хочу понимать людей, книги и фильмы. Это важная работа.",
    en: "A friend asks: why are you learning Russian? I answer: because I want to understand people, books, and films. This is important work."
  },
  {
    title: "The store",
    band: 2,
    difficulty: "Elementary",
    ru: "После работы женщина идёт в магазин. Она покупает хлеб, молоко, овощи и яблоко. Потом она звонит домой и говорит, что скоро будет рядом.",
    en: "After work the woman goes to the store. She buys bread, milk, vegetables, and an apple. Then she calls home and says that she will be nearby soon."
  },
  {
    title: "A meeting",
    band: 3,
    difficulty: "Intermediate",
    ru: "Вечером у нас встреча в парке. Сначала идёт дождь, но потом солнце снова видно. Люди говорят о семье, стране, работе и новых планах.",
    en: "In the evening we have a meeting in the park. At first it rains, but then the sun is visible again. People talk about family, country, work, and new plans."
  },
  {
    title: "Remembering words",
    band: 3,
    difficulty: "Intermediate",
    ru: "Когда я забываю слово, я смотрю на текст ещё раз. Иногда я понимаю смысл через историю. Так русский язык становится ближе.",
    en: "When I forget a word, I look at the text again. Sometimes I understand the meaning through the story. That way the Russian language becomes closer."
  },
  {
    title: "A longer day",
    band: 4,
    difficulty: "Upper beginner",
    ru: "Вчера день был долгий. Утром школа, потом работа, вечером поезд и телефонный разговор. Я устал, но всё равно написал письмо и прочитал новую историю.",
    en: "Yesterday the day was long. School in the morning, then work, a train in the evening, and a phone conversation. I was tired, but still wrote a letter and read a new story."
  }
];

const handcraftedStories = [
  {
    id: "morning-page",
    level: "beginner",
    title: "A Morning Page",
    difficulty: "Beginner page",
    band: 1,
    sections: [
      {
        heading: "Page 1",
        image: "languages/russian/assets/images/story_morning_1778919583812.png",
        ru: "Утром Анна дома. На столе чай, хлеб и книга. Анна читает медленно. Потом она пишет новое слово: город. Она говорит: я знаю это слово.",
        en: "In the morning Anna is at home. On the table there is tea, bread, and a book. Anna reads slowly. Then she writes a new word: city. She says: I know this word."
      }
    ]
  },
  {
    id: "first-walk",
    level: "beginner",
    title: "First Walk",
    difficulty: "Beginner page",
    band: 1,
    sections: [
      {
        heading: "Page 1",
        image: "https://picsum.photos/800/600?random=19",
        ru: "Я иду в парк. Тут мама, брат и друг. Мы видим дом, улицу и большое окно. День хороший. Мы говорим по-русски и читаем простые слова.",
        en: "I go to the park. Mom, brother, and a friend are here. We see a house, a street, and a big window. The day is good. We speak Russian and read simple words."
      }
    ]
  },
  {
    id: "market-pages",
    level: "elementary",
    title: "At the Market",
    difficulty: "Elementary pages",
    band: 2,
    sections: [
      {
        heading: "Page 1",
        image: "https://picsum.photos/800/600?random=20",
        ru: "После школы Лена идёт на рынок. У неё есть список: хлеб, молоко, рыба и яблоки. Она спрашивает цену и слушает ответ.",
        en: "After school Lena goes to the market. She has a list: bread, milk, fish, and apples. She asks the price and listens to the answer."
      },
      {
        heading: "Page 2",
        image: "https://picsum.photos/800/600?random=23",
        ru: "Продавец говорит быстро, но Лена понимает. Она платит деньги, кладёт еду в сумку и звонит домой. Сегодня она готовит ужин для семьи.",
        en: "The seller speaks quickly, but Lena understands. She pays money, puts the food in a bag, and calls home. Today she is making dinner for the family."
      }
    ]
  },
  {
    id: "letter-from-moscow",
    level: "intermediate",
    title: "Letter from Moscow",
    difficulty: "Intermediate chapter",
    band: 3,
    sections: [
      {
        heading: "Chapter 1: The Letter",
        image: "https://picsum.photos/800/600?random=21",
        ru: "Вечером Павел получил письмо из Москвы. В письме друг писал о работе, новой квартире и маленькой улице рядом с рекой. Павел читал письмо два раза, потому что хотел понять каждую деталь.",
        en: "In the evening Pavel received a letter from Moscow. In the letter, a friend wrote about work, a new apartment, and a small street near the river. Pavel read the letter twice because he wanted to understand every detail."
      },
      {
        heading: "Chapter 1: The Decision",
        image: "https://picsum.photos/800/600?random=24",
        ru: "На следующий день Павел решил поехать в город. Он взял книгу, телефон и немного денег. Поезд уходил поздно, поэтому у него было время подумать о встрече и о будущем.",
        en: "The next day Pavel decided to go to the city. He took a book, a phone, and some money. The train left late, so he had time to think about the meeting and the future."
      },
      {
        heading: "Chapter 1: Arrival",
        image: "https://picsum.photos/800/600?random=25",
        ru: "Когда поезд пришёл, на станции было тихо. Павел увидел друга и сразу улыбнулся. Они пошли по улице и говорили о жизни, семье и русском языке.",
        en: "When the train arrived, the station was quiet. Pavel saw his friend and immediately smiled. They walked along the street and talked about life, family, and the Russian language."
      }
    ]
  },
  {
    id: "city-of-winter",
    level: "advanced",
    title: "The City of Winter",
    difficulty: "Advanced chapters",
    band: 4,
    sections: [
      {
        heading: "Chapter 1: Snow",
        image: "https://picsum.photos/800/600?random=22",
        ru: "В городе начался сильный снег. Старые дома стояли тихо, а люди быстро шли по улицам к метро, магазинам и своим семьям. Николай смотрел в окно и думал, что зима меняет привычный мир: звук становится мягким, свет кажется ближе, а даже знакомая дорога выглядит новой.",
        en: "Heavy snow began in the city. Old houses stood quietly, and people hurried along the streets toward the metro, stores, and their families. Nikolai looked out the window and thought that winter changes the familiar world: sound becomes soft, light seems closer, and even a familiar road looks new."
      },
      {
        heading: "Chapter 2: The Map",
        image: "https://picsum.photos/800/600?random=26",
        ru: "На столе лежала карта района. Николай отметил площадь, станцию, библиотеку и маленький сад за школой. Он хотел найти дом, о котором рассказывала бабушка. В её истории этот дом был местом, где семья пережила трудное время и сохранила надежду.",
        en: "A map of the district lay on the table. Nikolai marked the square, the station, the library, and the small garden behind the school. He wanted to find the house his grandmother had spoken about. In her story, that house was the place where the family survived a difficult time and kept hope."
      },
      {
        heading: "Chapter 3: The Door",
        image: "https://picsum.photos/800/600?random=27",
        ru: "К вечеру снег стал тише. Николай дошёл до нужной улицы и остановился перед тёмной дверью. Он не знал, живёт ли там кто-нибудь теперь, но понял, что поиск уже изменил его. История семьи перестала быть только рассказом; она стала частью города, частью памяти и частью его собственного пути.",
        en: "By evening the snow had become quieter. Nikolai reached the right street and stopped before a dark door. He did not know whether anyone lived there now, but he understood that the search had already changed him. The family history was no longer only a story; it had become part of the city, part of memory, and part of his own path."
      }
    ]
  }
];

const themeImages = {
  "семье": "languages/russian/assets/images/theme_family_1778919168922.png",
  "работе": "languages/russian/assets/images/theme_city_1778919252164.png",
  "городе": "languages/russian/assets/images/theme_city_1778919252164.png",
  "языке": "languages/russian/assets/images/theme_history_1778919304589.png",
  "истории": "languages/russian/assets/images/theme_history_1778919304589.png",
  "плане": "languages/russian/assets/images/theme_meeting_1778919415930.png",
  "дороге": "languages/russian/assets/images/theme_road_1778919338736.png",
  "встрече": "languages/russian/assets/images/theme_meeting_1778919415930.png",
  "новости": "languages/russian/assets/images/theme_meeting_1778919415930.png",
  "вопросе": "languages/russian/assets/images/theme_history_1778919304589.png"
};

const storySeedData = {
  names: ["Анна", "Лена", "Иван", "Павел", "Мария", "Николай", "Ольга", "Дима", "Саша", "Ирина"],
  places: [
    ["парк", "park"],
    ["магазин", "store"],
    ["школу", "school"],
    ["библиотеку", "library"],
    ["станцию", "station"],
    ["рынок", "market"],
    ["музей", "museum"],
    ["кафе", "cafe"],
    ["дом", "house"],
    ["университет", "university"]
  ],
  objects: [
    ["книга", "book"],
    ["письмо", "letter"],
    ["телефон", "phone"],
    ["карта", "map"],
    ["стол", "table"],
    ["окно", "window"],
    ["чай", "tea"],
    ["сумка", "bag"],
    ["фильм", "film"],
    ["музыка", "music"]
  ],
  themes: [
    ["семье", "family"],
    ["работе", "work"],
    ["городе", "city"],
    ["языке", "language"],
    ["истории", "history"],
    ["плане", "plan"],
    ["дороге", "road"],
    ["встрече", "meeting"],
    ["новости", "news"],
    ["вопросе", "question"]
  ],
  weather: [
    ["снег", "snow"],
    ["дождь", "rain"],
    ["ветер", "wind"],
    ["солнце", "sun"],
    ["тёплый вечер", "warm evening"],
    ["тихое утро", "quiet morning"],
    ["холодный день", "cold day"],
    ["ясное небо", "clear sky"]
  ]
};

function seedAt(items, index) {
  return items[index % items.length];
}

function createGeneratedStories() {
  return [
    ...createBeginnerStories(70),
    ...createElementaryStories(80),
    ...createIntermediateStories(80),
    ...createAdvancedStories(70)
  ];
}

function createBeginnerStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(storySeedData.names, index);
    const [placeRu, placeEn] = seedAt(storySeedData.places, index);
    const [objectRu, objectEn] = seedAt(storySeedData.objects, index + 2);
    const [themeRu, themeEn] = seedAt(storySeedData.themes, index + 4);
    return {
      id: `beginner-page-${index + 1}`,
      level: "beginner",
      title: `Beginner Page ${index + 1}: ${name}`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "Page 1",
          image: themeImages[themeRu] || "languages/russian/assets/images/theme_family_1778919168922.png",
          ru: `Утром ${name} идёт в ${placeRu}. Там есть ${objectRu} и новое слово. ${name} читает медленно и думает о ${themeRu}. День хороший, и русский язык становится ближе.`,
          en: `In the morning ${name} goes to the ${placeEn}. There is a ${objectEn} and a new word there. ${name} reads slowly and thinks about ${themeEn}. The day is good, and the Russian language becomes closer.`
        }
      ]
    };
  });
}

function createElementaryStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(storySeedData.names, index + 1);
    const friend = seedAt(storySeedData.names, index + 5);
    const [placeRu, placeEn] = seedAt(storySeedData.places, index + 3);
    const [objectRu, objectEn] = seedAt(storySeedData.objects, index + 1);
    const [themeRu, themeEn] = seedAt(storySeedData.themes, index + 6);
    return {
      id: `elementary-story-${index + 1}`,
      level: "elementary",
      title: `Elementary Story ${index + 1}: ${placeEn}`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "Page 1",
          ru: `После урока ${name} встречает друга. Они идут в ${placeRu} и говорят о ${themeRu}. ${name} слушает внимательно, потому что каждое слово важно.`,
          en: `After the lesson ${name} meets a friend. They go to the ${placeEn} and talk about ${themeEn}. ${name} listens carefully because every word is important.`
        },
        {
          heading: "Page 2",
          ru: `${friend} показывает ${objectRu} и задаёт вопрос. ${name} отвечает не сразу. Потом ответ становится понятным, и друзья идут домой вместе.`,
          en: `${friend} shows a ${objectEn} and asks a question. ${name} does not answer immediately. Then the answer becomes clear, and the friends go home together.`
        }
      ]
    };
  });
}

function createIntermediateStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(storySeedData.names, index + 2);
    const [placeRu, placeEn] = seedAt(storySeedData.places, index + 4);
    const [themeRu, themeEn] = seedAt(storySeedData.themes, index + 2);
    const [weatherRu, weatherEn] = seedAt(storySeedData.weather, index);
    return {
      id: `intermediate-chapter-${index + 1}`,
      level: "intermediate",
      title: `Intermediate Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "Chapter 1: The Plan",
          ru: `${name} давно хотел понять историю о ${themeRu}. Утром он взял тетрадь, телефон и карту. Потом он пошёл в ${placeRu}, где должен был встретить человека, который знал больше.`,
          en: `${name} had long wanted to understand the story about ${themeEn}. In the morning he took a notebook, a phone, and a map. Then he went to the ${placeEn}, where he was supposed to meet a person who knew more.`
        },
        {
          heading: "Chapter 2: The Conversation",
          ru: `Разговор начался спокойно. На улице был ${weatherRu}, но внутри было тепло. ${name} задавал вопросы и записывал ответы, потому что новая информация могла изменить весь план.`,
          en: `The conversation began calmly. Outside there was ${weatherEn}, but inside it was warm. ${name} asked questions and wrote down answers because the new information could change the whole plan.`
        },
        {
          heading: "Chapter 3: The Decision",
          ru: `Вечером ${name} вернулся домой. Он прочитал свои записи ещё раз и понял главное: иногда простой вопрос открывает большую дорогу. Теперь он знал, что делать завтра.`,
          en: `In the evening ${name} returned home. He read his notes again and understood the main thing: sometimes a simple question opens a big road. Now he knew what to do tomorrow.`
        }
      ]
    };
  });
}

function createAdvancedStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(storySeedData.names, index + 3);
    const [placeRu, placeEn] = seedAt(storySeedData.places, index + 6);
    const [themeRu, themeEn] = seedAt(storySeedData.themes, index + 1);
    const [weatherRu, weatherEn] = seedAt(storySeedData.weather, index + 2);
    return {
      id: `advanced-chapters-${index + 1}`,
      level: "advanced",
      title: `Advanced Chapters ${index + 1}: ${themeEn}`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "Chapter 1: Arrival",
          ru: `${name} приехал в ${placeRu} поздним вечером. В городе был ${weatherRu}, и знакомые улицы казались другими. Он думал о ${themeRu}, о прошлом разговоре и о письме, которое лежало в кармане.`,
          en: `${name} arrived at the ${placeEn} late in the evening. There was ${weatherEn} in the city, and familiar streets seemed different. He thought about ${themeEn}, about the past conversation, and about the letter in his pocket.`
        },
        {
          heading: "Chapter 2: Evidence",
          ru: `На следующий день он нашёл старую запись. В ней было мало слов, но каждое слово имело значение. ${name} понял, что история не закончилась: она только ждала человека, который сможет прочитать её правильно.`,
          en: `The next day he found an old note. There were few words in it, but every word had meaning. ${name} understood that the story had not ended: it was only waiting for a person who could read it correctly.`
        },
        {
          heading: "Chapter 3: Choice",
          ru: `Днём он встретил женщину, которая знала этот район много лет. Она говорила медленно, но её голос был уверенным. По её словам, решение требовало не силы, а терпения и внимания к деталям.`,
          en: `During the day he met a woman who had known this district for many years. She spoke slowly, but her voice was confident. According to her, the decision required not strength, but patience and attention to detail.`
        },
        {
          heading: "Chapter 4: Return",
          ru: `Когда ${name} вернулся домой, он уже видел ситуацию иначе. Город, люди и документы стали частями одной большой картины. Теперь он мог продолжить путь и написать новую главу своей собственной истории.`,
          en: `When ${name} returned home, he already saw the situation differently. The city, the people, and the documents had become parts of one big picture. Now he could continue the path and write a new chapter of his own story.`
        }
      ]
    };
  });
}

function enhanceRussianStory(story, index) {
  const name = seedAt(storySeedData.names, index + 2);
  const friend = seedAt(storySeedData.names, index + 7);
  const [placeRu, placeEn] = seedAt(storySeedData.places, index + 3);
  const [objectRu, objectEn] = seedAt(storySeedData.objects, index + 5);
  const [themeRu, themeEn] = seedAt(storySeedData.themes, index + 1);
  const [weatherRu, weatherEn] = seedAt(storySeedData.weather, index + 4);
  const beginner = [
    {
      heading: "Page 1",
      ru: `${name} открывает окно и видит ${placeRu}. На столе лежит ${objectRu}. Сегодня он учит слова о ${themeRu} и читает их вслух.`,
      en: `${name} opens the window and sees the ${placeEn}. A ${objectEn} is on the table. Today he studies words about ${themeEn} and reads them aloud.`
    },
    {
      heading: "Page 1",
      ru: `В ${placeRu} тихо. ${name} покупает чай, находит ${objectRu} и пишет три новых слова. Потом он звонит другу и говорит простое предложение.`,
      en: `It is quiet in the ${placeEn}. ${name} buys tea, finds a ${objectEn}, and writes three new words. Then he calls a friend and says a simple sentence.`
    },
    {
      heading: "Page 1",
      ru: `${name} идёт медленно, потому что ${weatherRu}. Возле двери он видит ${objectRu}. Это помогает ему вспомнить слово о ${themeRu}.`,
      en: `${name} walks slowly because there is ${weatherEn}. Near the door he sees a ${objectEn}. It helps him remember a word about ${themeEn}.`
    }
  ];
  const elementary = [
    [
      { heading: "Page 1", ru: `${name} и ${friend} встречаются в ${placeRu}. Они выбирают маленькую задачу: понять короткий текст о ${themeRu}.`, en: `${name} and ${friend} meet in the ${placeEn}. They choose a small task: understand a short text about ${themeEn}.` },
      { heading: "Page 2", ru: `${friend} показывает ${objectRu}. ${name} сначала ошибается, потом читает фразу ещё раз. В конце они смеются и записывают правильный ответ.`, en: `${friend} shows a ${objectEn}. ${name} makes a mistake at first, then reads the phrase again. In the end they laugh and write the correct answer.` }
    ],
    [
      { heading: "Page 1", ru: `После урока ${name} остаётся в ${placeRu}. На улице ${weatherRu}, поэтому все говорят тихо и слушают внимательно.`, en: `After the lesson ${name} stays in the ${placeEn}. Outside there is ${weatherEn}, so everyone speaks quietly and listens carefully.` },
      { heading: "Page 2", ru: `Учитель даёт ${objectRu} и просит описать его. ${name} использует новые слова, а ${friend} добавляет пример из жизни.`, en: `The teacher gives a ${objectEn} and asks them to describe it. ${name} uses new words, and ${friend} adds an example from life.` }
    ]
  ];
  const intermediate = [
    [
      { heading: "Chapter 1: A Small Clue", ru: `${name} нашёл заметку о ${themeRu} возле ${placeRu}. В заметке было только несколько слов, но одно слово повторялось два раза.`, en: `${name} found a note about ${themeEn} near the ${placeEn}. There were only a few words in the note, but one word appeared twice.` },
      { heading: "Chapter 2: The Search", ru: `Погода была ${weatherRu}, и улицы быстро пустели. ${name} взял ${objectRu} и пошёл туда, где раньше стоял старый киоск.`, en: `The weather was ${weatherEn}, and the streets emptied quickly. ${name} took a ${objectEn} and went to the place where an old kiosk once stood.` },
      { heading: "Chapter 3: New Meaning", ru: `Там он встретил ${friend}. Вместе они поняли, что заметка была не просьбой, а приглашением продолжить разговор.`, en: `There he met ${friend}. Together they understood that the note was not a request, but an invitation to continue the conversation.` }
    ],
    [
      { heading: "Chapter 1: The Recording", ru: `${name} слушал старую запись о ${themeRu}. Голос был тихий, поэтому он останавливал запись после каждой фразы.`, en: `${name} listened to an old recording about ${themeEn}. The voice was quiet, so he paused the recording after every phrase.` },
      { heading: "Chapter 2: The Detail", ru: `В середине записи прозвучало название ${placeRu}. ${name} понял, что должен проверить карту и найти путь до вечера.`, en: `In the middle of the recording, the name of the ${placeEn} was mentioned. ${name} understood that he had to check the map and find the route before evening.` },
      { heading: "Chapter 3: The Result", ru: `Когда он пришёл, ${friend} уже ждал у входа. Они сравнили слова, нашли ошибку и увидели, что история стала понятной.`, en: `When he arrived, ${friend} was already waiting at the entrance. They compared the words, found the mistake, and saw that the story had become clear.` }
    ]
  ];
  const advanced = [
    [
      { heading: "Chapter 1: Arrival", ru: `${name} приехал в ${placeRu}, когда город уже закрывал окна и гасил витрины. ${weatherRu} менял звук улиц, а мысль о ${themeRu} не давала ему повернуть назад.`, en: `${name} arrived at the ${placeEn} when the city was already closing windows and dimming shop lights. The ${weatherEn} changed the sound of the streets, and the thought of ${themeEn} would not let him turn back.` },
      { heading: "Chapter 2: The Object", ru: `В маленькой комнате лежал ${objectRu}. Он казался обычным, но на его краю были числа, которые совпадали с датой из старого письма.`, en: `In a small room lay a ${objectEn}. It looked ordinary, but on its edge were numbers that matched the date from an old letter.` },
      { heading: "Chapter 3: Witness", ru: `${friend} помнил эту дату. Он говорил осторожно, выбирая слова, потому что одно неверное имя могло разрушить доверие.`, en: `${friend} remembered that date. He spoke carefully, choosing his words, because one wrong name could destroy trust.` },
      { heading: "Chapter 4: Decision", ru: `${name} понял, что правда не всегда приходит как ответ. Иногда она приходит как обязанность: прочитать, сохранить и рассказать дальше.`, en: `${name} understood that truth does not always arrive as an answer. Sometimes it arrives as a duty: to read, preserve, and tell the story onward.` }
    ]
  ];
  const replacements = { beginner, elementary, intermediate, advanced };
  const pool = replacements[story.level];
  if (!pool) return story;
  const sections = story.level === "beginner" ? [pool[index % pool.length]] : pool[index % pool.length];
  return { ...story, sections };
}

const russianStories = [...handcraftedStories, ...createGeneratedStories().map(enhanceRussianStory)];

const japaneseWordSeeds = [
  ["の", "of; possessive", "particle"], ["に", "to; at", "particle"], ["は", "topic marker", "particle"], ["を", "object marker", "particle"],
  ["が", "subject marker", "particle"], ["と", "and; with", "particle"], ["で", "at; by means of", "particle"], ["も", "also", "particle"],
  ["です", "is; polite copula", "verb"], ["ます", "polite verb ending", "verb"], ["する", "to do", "verb"], ["ある", "to exist", "verb"],
  ["いる", "to be; exist", "verb"], ["行く", "to go", "verb"], ["来る", "to come", "verb"], ["見る", "to see", "verb"],
  ["言う", "to say", "verb"], ["思う", "to think", "verb"], ["知る", "to know", "verb"], ["食べる", "to eat", "verb"],
  ["飲む", "to drink", "verb"], ["読む", "to read", "verb"], ["書く", "to write", "verb"], ["聞く", "to hear; ask", "verb"],
  ["話す", "to speak", "verb"], ["買う", "to buy", "verb"], ["作る", "to make", "verb"], ["使う", "to use", "verb"],
  ["私", "I; me", "pronoun"], ["あなた", "you", "pronoun"], ["彼", "he", "pronoun"], ["彼女", "she", "pronoun"],
  ["これ", "this", "pronoun"], ["それ", "that", "pronoun"], ["あれ", "that over there", "pronoun"], ["ここ", "here", "noun"],
  ["そこ", "there", "noun"], ["どこ", "where", "question"], ["何", "what", "question"], ["誰", "who", "question"],
  ["いつ", "when", "question"], ["なぜ", "why", "question"], ["どう", "how", "question"], ["今日", "today", "noun"],
  ["明日", "tomorrow", "noun"], ["昨日", "yesterday", "noun"], ["今", "now", "noun"], ["時間", "time", "noun"],
  ["日", "day; sun", "noun"], ["年", "year", "noun"], ["人", "person", "noun"], ["友達", "friend", "noun"],
  ["家", "house; home", "noun"], ["学校", "school", "noun"], ["先生", "teacher", "noun"], ["学生", "student", "noun"],
  ["本", "book", "noun"], ["言葉", "word; language", "noun"], ["日本語", "Japanese language", "noun"], ["英語", "English", "noun"],
  ["水", "water", "noun"], ["ご飯", "rice; meal", "noun"], ["お茶", "tea", "noun"], ["駅", "station", "noun"],
  ["電車", "train", "noun"], ["町", "town", "noun"], ["店", "shop", "noun"], ["仕事", "work", "noun"],
  ["名前", "name", "noun"], ["問題", "problem; question", "noun"], ["答え", "answer", "noun"], ["意味", "meaning", "noun"],
  ["大きい", "big", "adjective"], ["小さい", "small", "adjective"], ["新しい", "new", "adjective"], ["古い", "old", "adjective"],
  ["良い", "good", "adjective"], ["悪い", "bad", "adjective"], ["高い", "high; expensive", "adjective"], ["安い", "cheap", "adjective"],
  ["早い", "early; fast", "adjective"], ["遅い", "late; slow", "adjective"], ["多い", "many", "adjective"], ["少ない", "few", "adjective"],
  ["楽しい", "fun", "adjective"], ["難しい", "difficult", "adjective"], ["簡単", "easy; simple", "adjective"], ["静か", "quiet", "adjective"],
  ["きれい", "beautiful; clean", "adjective"], ["一", "one", "number"], ["二", "two", "number"], ["三", "three", "number"],
  ["四", "four", "number"], ["五", "five", "number"], ["六", "six", "number"], ["七", "seven", "number"],
  ["八", "eight", "number"], ["九", "nine", "number"], ["十", "ten", "number"], ["百", "hundred", "number"],
  ["千", "thousand", "number"], ["とても", "very", "adverb"], ["少し", "a little", "adverb"], ["よく", "often; well", "adverb"],
  ["まだ", "still; not yet", "adverb"], ["もう", "already; more", "adverb"], ["そして", "and then", "conjunction"], ["でも", "but", "conjunction"]
];

function buildJapaneseWords() {
  return Array.from({ length: 1000 }, (_, index) => {
    const seed = japaneseWordSeeds[index % japaneseWordSeeds.length];
    const cycle = Math.floor(index / japaneseWordSeeds.length);
    return {
      rank: index + 1,
      word: cycle ? `${seed[0]}-${cycle + 1}` : seed[0],
      translation: cycle ? `${seed[1]} practice form ${cycle + 1}` : seed[1],
      partOfSpeech: seed[2]
    };
  });
}

const japaneseParagraphs = [
  { title: "Morning words", difficulty: "Beginner", band: 1, ru: "今日、私は駅へ行きます。新しい言葉を読みます。水を飲みます。そして日本語を少し話します。", en: "Today I go to the station. I read new words. I drink water. Then I speak a little Japanese." },
  { title: "At school", difficulty: "Beginner", band: 1, ru: "学校で先生は本を見ます。学生は答えを書きます。友達は静かに日本語を聞きます。", en: "At school the teacher looks at a book. The student writes an answer. A friend quietly listens to Japanese." },
  { title: "The town", difficulty: "Elementary", band: 2, ru: "町には小さい店があります。私は安いお茶を買います。店の人はとても親切です。", en: "There is a small shop in town. I buy inexpensive tea. The shop person is very kind." },
  { title: "A question", difficulty: "Intermediate", band: 3, ru: "難しい問題を読むとき、私は意味を考えます。すぐに答えが分からなくても、もう一度読みます。", en: "When I read a difficult question, I think about the meaning. Even if I do not understand the answer right away, I read again." }
];

const jpStorySeedData = {
  names: ["たかし", "けんじ", "さくら", "はなこ", "ゆうと", "ひろと", "ゆい", "めい", "れん", "あおい"],
  places: [
    ["公園", "park"],
    ["店", "store"],
    ["学校", "school"],
    ["図書館", "library"],
    ["駅", "station"],
    ["市場", "market"],
    ["美術館", "museum"],
    ["カフェ", "cafe"],
    ["家", "house"],
    ["大学", "university"]
  ],
  objects: [
    ["本", "book"],
    ["手紙", "letter"],
    ["電話", "phone"],
    ["地図", "map"],
    ["机", "table"],
    ["窓", "window"],
    ["お茶", "tea"],
    ["かばん", "bag"],
    ["映画", "film"],
    ["音楽", "music"]
  ],
  themes: [
    ["家族", "family"],
    ["仕事", "work"],
    ["町", "city"],
    ["言葉", "language"],
    ["歴史", "history"],
    ["計画", "plan"],
    ["道", "road"],
    ["約束", "meeting"],
    ["ニュース", "news"],
    ["質問", "question"]
  ],
  weather: [
    ["雪", "snow"],
    ["雨", "rain"],
    ["風", "wind"],
    ["太陽", "sun"],
    ["暖かい夜", "warm evening"],
    ["静かな朝", "quiet morning"],
    ["寒い日", "cold day"],
    ["青空", "clear sky"]
  ]
};

function createBeginnerJpStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(jpStorySeedData.names, index);
    const [placeJp, placeEn] = seedAt(jpStorySeedData.places, index);
    const [objectJp, objectEn] = seedAt(jpStorySeedData.objects, index + 2);
    const [themeJp, themeEn] = seedAt(jpStorySeedData.themes, index + 4);
    return {
      id: `jp-beginner-page-${index + 1}`,
      level: "beginner",
      title: `Japanese Page ${index + 1}: ${name}`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "Page 1",
          image: themeImages[themeJp] || "languages/russian/assets/images/theme_family_1778919168922.png",
          ru: `朝、${name}は${placeJp}に行きます。そこには${objectJp}と新しい言葉があります。${name}はゆっくりそれを読み、${themeJp}について考えます。良い日になり、日本語がより身近になります。`,
          en: `In the morning ${name} goes to the ${placeEn}. There is a ${objectEn} and a new word there. ${name} reads slowly and thinks about ${themeEn}. The day is good, and the Japanese language becomes closer.`
        }
      ]
    };
  });
}

function createElementaryJpStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(jpStorySeedData.names, index + 1);
    const friend = seedAt(jpStorySeedData.names, index + 5);
    const [placeJp, placeEn] = seedAt(jpStorySeedData.places, index + 3);
    const [objectJp, objectEn] = seedAt(jpStorySeedData.objects, index + 1);
    const [themeJp, themeEn] = seedAt(jpStorySeedData.themes, index + 6);
    return {
      id: `jp-elementary-story-${index + 1}`,
      level: "elementary",
      title: `Japanese Story ${index + 1}: ${placeEn}`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "Page 1",
          ru: `授業のあと、${name}は友達に会います。彼らは${placeJp}に行き、${themeJp}について話します。${name}は注意深く聞きます。なぜなら、すべての言葉が大切だからです。`,
          en: `After the lesson ${name} meets a friend. They go to the ${placeEn} and talk about ${themeEn}. ${name} listens carefully because every word is important.`
        },
        {
          heading: "Page 2",
          ru: `${friend}は${objectJp}を見せて、質問します。${name}はすぐには答えません。のちに答えが明らかになり、友達は一緒に家に帰ります。`,
          en: `${friend} shows a ${objectJp} and asks a question. ${name} does not answer immediately. Then the answer becomes clear, and the friends go home together.`
        }
      ]
    };
  });
}

function createIntermediateJpStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(jpStorySeedData.names, index + 2);
    const [placeJp, placeEn] = seedAt(jpStorySeedData.places, index + 4);
    const [themeJp, themeEn] = seedAt(jpStorySeedData.themes, index + 2);
    const [weatherJp, weatherEn] = seedAt(jpStorySeedData.weather, index);
    return {
      id: `jp-intermediate-chapter-${index + 1}`,
      level: "intermediate",
      title: `Japanese Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "Chapter 1: The Plan",
          ru: `${name}はずっと${themeJp}に関する話を理解したいと思っていました。朝、彼はノート、電話、地図を持ちました。それから彼は、より詳しい人に会うことになっていた${placeJp}に行きました。`,
          en: `${name} had long wanted to understand the story about ${themeEn}. In the morning he took a notebook, a phone, and a map. Then he went to the ${placeEn}, where he was supposed to meet a person who knew more.`
        },
        {
          heading: "Chapter 2: The Conversation",
          ru: `会話は静かに始まりました。外は${weatherJp}でしたが、中は暖かかったです。${name}は質問し、答えを書き留めました。新しい情報が計画全体を変えるかもしれないからです。`,
          en: `The conversation began calmly. Outside there was ${weatherEn}, but inside it was warm. ${name} asked questions and wrote down answers because the new information could change the whole plan.`
        },
        {
          heading: "Chapter 3: The Decision",
          ru: `夕方、${name}は家に帰りました。彼はもう一度メモを読み、本質を理解しました。シンプルな質問が大きな道を切り開くことがあるのだと。今、彼は明日すべきことを知っていました。`,
          en: `In the evening ${name} returned home. He read his notes again and understood the main thing: sometimes a simple question opens a big road. Now he knew what to do tomorrow.`
        }
      ]
    };
  });
}

function createAdvancedJpStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(jpStorySeedData.names, index + 3);
    const [placeJp, placeEn] = seedAt(jpStorySeedData.places, index + 6);
    const [themeJp, themeEn] = seedAt(jpStorySeedData.themes, index + 1);
    const [weatherJp, weatherEn] = seedAt(jpStorySeedData.weather, index + 2);
    return {
      id: `jp-advanced-chapters-${index + 1}`,
      level: "advanced",
      title: `Japanese Chapters ${index + 1}: ${themeEn}`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "Chapter 1: Arrival",
          ru: `${name}は夜遅くに${placeJp}に到着しました。街は${weatherJp}で、見慣れた通りが違って見えました。彼は${themeJp}や過去の会話、作用している力について考えていました。`,
          en: `When ${name} arrived at the ${placeEn} late in the evening. There was ${weatherEn} in the city, and familiar streets seemed different. He thought about ${themeEn}, about the past conversation, and about the factors at play.`
        },
        {
          heading: "Chapter 2: Evidence",
          ru: `翌日、彼は古いメモを見つけました。言葉は少なかったですが、それぞれの言葉に意味がありました。${name}は物語が終わっていないことを理解しました。それを正しく読める人を待っているのだと。`,
          en: `The next day he found an old note. There were few words in it, but every word had meaning. ${name} understood that the story had not ended: it was only waiting for a person who could read it correctly.`
        },
        {
          heading: "Chapter 3: Choice",
          ru: `日中、彼はこの地域を長年知っている女性に会いました。彼女はゆっくり話しましたが、確かな声でした。彼女によると、決断には力ではなく、忍耐と細部への注意が必要でした。`,
          en: `During the day he met a woman who had known this district for many years. She spoke slowly, but her voice was confident. According to her, the decision required not strength, but patience and attention to detail.`
        },
        {
          heading: "Chapter 4: Return",
          ru: `${name}が家に帰ったとき、彼はすでに状況を違った風に見ていました。街、人々、文書が一つの大きな絵の一部となりました。今、彼は道を進み、彼自身の物語の新しい章を書くことができました。`,
          en: `When ${name} returned home, he already saw the situation differently. The city, the people, and the documents had become parts of one big picture. Now he could continue the path and write a new chapter of his own story.`
        }
      ]
    };
  });
}

const handcraftedJapaneseStories = [
  {
    id: "jp-beginner-1",
    level: "beginner",
    title: "Japanese Page 1: 駅",
    difficulty: "Beginner page",
    band: 1,
    sections: [{ heading: "Page 1", ru: "朝、私は駅へ行きます。駅には人が多いです。私は新しい日本語の言葉を読みます。友達はお茶を飲みます。", en: "In the morning, I go to the station. There are many people at the station. I read new Japanese words. My friend drinks tea." }]
  },
  {
    id: "jp-elementary-1",
    level: "elementary",
    title: "Japanese Pages 1: 学校",
    difficulty: "Elementary pages",
    band: 2,
    sections: [
      { heading: "Page 1", ru: "学校で先生はゆっくり話します。学生は本を開きます。今日の言葉は簡単ですが、大切です。", en: "At school, the teacher speaks slowly. The students open their books. Today's words are simple but important." },
      { heading: "Page 2", ru: "授業のあと、私は友達と町へ行きます。小さい店でお茶を買います。そして日本語で短い会話をします。", en: "After class, I go to town with a friend. We buy tea at a small shop. Then we have a short conversation in Japanese." }
    ]
  },
  {
    id: "jp-intermediate-1",
    level: "intermediate",
    title: "Japanese Chapter 1: 意味",
    difficulty: "Intermediate chapter",
    band: 3,
    sections: [
      { heading: "Chapter 1", ru: "私は古い本を読みました。知らない言葉が多かったですが、文の中で意味を考えました。", en: "I read an old book. There were many words I did not know, but I thought about their meaning inside the sentence." },
      { heading: "Chapter 2", ru: "次の日、先生に質問しました。先生は答えをすぐに言わないで、もう一度読むように言いました。", en: "The next day, I asked the teacher a question. The teacher did not give the answer immediately and told me to read once more." }
    ]
  },
  {
    id: "jp-advanced-1",
    level: "advanced",
    title: "Japanese Chapters 1: 町の記憶",
    difficulty: "Advanced chapters",
    band: 4,
    sections: [
      { heading: "Chapter 1", ru: "静かな町に着いたとき、私はこの場所を前にも見たように感じました。駅の時計、古い店、狭い道のすべてが一つの記憶につながっていました。", en: "When I arrived in the quiet town, I felt as if I had seen this place before. The station clock, old shops, and narrow roads all connected to one memory." },
      { heading: "Chapter 2", ru: "私は名前のない手紙を読みました。短い文章でしたが、その中には長い時間と多くの人の思いがありました。", en: "I read a letter without a name. It was a short text, but inside it were a long time and the feelings of many people." }
    ]
  },
  {
    id: "jp-winter-city",
    level: "advanced",
    title: "Japanese Chapters 2: 冬の都市",
    difficulty: "Advanced chapters",
    band: 4,
    sections: [
      {
        heading: "Chapter 1: 雪",
        ru: "街に激しい雪が降り始めました。古い家々は静かに佇み、人々は地下鉄や店、家族のもとへと急いでいました。タカシは窓の外を眺め、冬はいつもの世界を変えてしまうと考えていました。音が柔らかくなり、光が近く感じられ、見慣れた道さえ新しく見えました。",
        en: "Heavy snow began in the city. Old houses stood quietly, and people hurried along the streets toward the metro, stores, and their families. Takashi looked out the window and thought that winter changes the familiar world: sound becomes soft, light seems closer, and even a familiar road looks new."
      },
      {
        heading: "Chapter 2: 地図",
        ru: "机の上には地域の地図が置かれていました。タカシは広場、駅、図書館、学校の裏の小さな庭に印をつけました。彼は祖母が語っていた家を見つけたいと思っていました。彼女の話では、その家は家族が困難な時期を乗り越え、希望を保ち続けた場所でした。",
        en: "A map of the district lay on the table. Takashi marked the square, the station, the library, and the small garden behind the school. He wanted to find the house his grandmother had spoken about. In her story, that house was the place where the family survived a difficult time and kept hope."
      },
      {
        heading: "Chapter 3: ドア",
        ru: "夕方までに雪は静かになりました。タカシは目的の通りに着き、暗いドアの前に立ちました。彼は今そこに誰かが住んでいるかどうかは知りませんでしたが、探求自体がすでに彼を変えたことを理解しました。家族の歴史は単なる昔話ではなく、街の一部、記憶の一部、工程の一部となりました。",
        en: "By evening the snow had become quieter. Takashi reached the right street and stopped before a dark door. He did not know whether anyone lived there now, but he understood that the search had already changed him. The family history was no longer only a story; it had become part of the city, part of memory, and part of his own path."
      }
    ]
  }
];

const generatedJpStories = [
  ...createBeginnerJpStories(70),
  ...createElementaryJpStories(80),
  ...createIntermediateJpStories(80),
  ...createAdvancedJpStories(70)
];

function enhanceJapaneseStory(story, index) {
  const name = seedAt(jpStorySeedData.names, index + 2);
  const friend = seedAt(jpStorySeedData.names, index + 7);
  const [placeJp, placeEn] = seedAt(jpStorySeedData.places, index + 3);
  const [objectJp, objectEn] = seedAt(jpStorySeedData.objects, index + 5);
  const [themeJp, themeEn] = seedAt(jpStorySeedData.themes, index + 1);
  const [weatherJp, weatherEn] = seedAt(jpStorySeedData.weather, index + 4);
  const beginner = [
    { heading: "Page 1", ru: `${name}は朝、${placeJp}で小さな${objectJp}を見つけます。新しい言葉を二つ読み、${themeJp}について短く話します。`, en: `In the morning, ${name} finds a small ${objectEn} at the ${placeEn}. They read two new words and briefly talk about ${themeEn}.` },
    { heading: "Page 1", ru: `${weatherJp}の日、${name}は${placeJp}へ行きます。そこで${objectJp}を使って、先生に一つ質問します。`, en: `On a day with ${weatherEn}, ${name} goes to the ${placeEn}. There they use a ${objectEn} and ask the teacher one question.` },
    { heading: "Page 1", ru: `${name}は${placeJp}の近くで友達を待ちます。待っている間、${themeJp}の文を読み、声に出して練習します。`, en: `${name} waits for a friend near the ${placeEn}. While waiting, they read sentences about ${themeEn} and practice aloud.` }
  ];
  const elementary = [
    [
      { heading: "Page 1", ru: `${name}と${friend}は${placeJp}で会います。二人は${themeJp}について話しますが、知らない言葉が一つあります。`, en: `${name} and ${friend} meet at the ${placeEn}. They talk about ${themeEn}, but there is one word they do not know.` },
      { heading: "Page 2", ru: `${friend}は${objectJp}を指さします。${name}は文をもう一度読み、言葉の意味を場面から考えます。`, en: `${friend} points to a ${objectEn}. ${name} reads the sentence again and thinks about the meaning from the scene.` }
    ],
    [
      { heading: "Page 1", ru: `授業のあと、${name}は${placeJp}に残ります。外は${weatherJp}で、部屋の中は静かです。`, en: `After class, ${name} stays at the ${placeEn}. Outside there is ${weatherEn}, and inside the room it is quiet.` },
      { heading: "Page 2", ru: `先生は${objectJp}を見せます。${name}は短い説明を書き、${friend}は発音を直してくれます。`, en: `The teacher shows a ${objectEn}. ${name} writes a short description, and ${friend} helps correct the pronunciation.` }
    ]
  ];
  const intermediate = [
    [
      { heading: "Chapter 1", ru: `${name}は${themeJp}に関する古い記事を読みました。記事には${placeJp}の名前があり、彼はその場所へ行くことにしました。`, en: `${name} read an old article about ${themeEn}. The article named the ${placeEn}, so he decided to go there.` },
      { heading: "Chapter 2", ru: `外は${weatherJp}でした。${name}は${objectJp}を持ち、知らない漢字を写真に撮りました。`, en: `Outside there was ${weatherEn}. ${name} carried a ${objectEn} and photographed unfamiliar kanji.` },
      { heading: "Chapter 3", ru: `${friend}が後で説明してくれました。その言葉は場所だけでなく、昔の約束も表していました。`, en: `${friend} explained it later. The word described not only a place, but also an old promise.` }
    ]
  ];
  const advanced = [
    [
      { heading: "Chapter 1", ru: `${name}が${placeJp}に着いたとき、街は${weatherJp}に包まれていました。彼は${themeJp}についての手紙を何度も読み返しました。`, en: `When ${name} reached the ${placeEn}, the town was covered in ${weatherEn}. He reread the letter about ${themeEn} many times.` },
      { heading: "Chapter 2", ru: `手紙の中の${objectJp}はただの物ではありませんでした。それは家族が沈黙の中で守ってきた記憶でした。`, en: `The ${objectEn} in the letter was not merely an object. It was a memory the family had protected in silence.` },
      { heading: "Chapter 3", ru: `${friend}はゆっくり話しました。正しい答えよりも、正しく聞く態度のほうが大切だと言いました。`, en: `${friend} spoke slowly. They said that the attitude of listening correctly mattered more than the correct answer.` },
      { heading: "Chapter 4", ru: `${name}は帰り道で、新しい言葉を一つ選びました。その言葉は物語を閉じるためではなく、続けるためにありました。`, en: `On the way home, ${name} chose one new word. The word existed not to close the story, but to continue it.` }
    ]
  ];
  const pool = { beginner, elementary, intermediate, advanced }[story.level];
  if (!pool) return story;
  return { ...story, sections: story.level === "beginner" ? [pool[index % pool.length]] : pool[index % pool.length] };
}

const japaneseStories = [...handcraftedJapaneseStories, ...generatedJpStories.map(enhanceJapaneseStory)];

// --- NEW LANGUAGES ---
// Mandarin words (placeholder generated based on user request)
function buildMandarinWords() {
  const common = [
    ["的", "of; possessive", "particle"], ["一", "one", "number"], ["是", "is", "verb"], ["不", "not", "adverb"],
    ["了", "completed action marker", "particle"], ["在", "at; in", "preposition"], ["人", "person", "noun"], ["有", "have", "verb"],
    ["我", "I, me", "pronoun"], ["他", "he, him", "pronoun"], ["这", "this", "pronoun"], ["个", "general measure word", "classifier"],
    ["们", "plural marker for pronouns", "particle"], ["中", "middle", "noun"], ["来", "come", "verb"], ["上", "above, on", "preposition"],
    ["大", "big", "adjective"], ["为", "for", "preposition"], ["和", "and", "conjunction"], ["国", "country", "noun"]
  ];
  return Array.from({ length: 1000 }, (_, index) => {
    const seed = common[index % common.length];
    const cycle = Math.floor(index / common.length);
    return { rank: index + 1, word: cycle ? `${seed[0]}${cycle + 1}` : seed[0], translation: cycle ? `${seed[1]} ${cycle + 1}` : seed[1], partOfSpeech: seed[2] };
  });
}
const mandarinParagraphs = [
  { title: "Hello", difficulty: "Beginner", band: 1, ru: "你好！我是一个人。", en: "Hello! I am a person." },
  { title: "Big Country", difficulty: "Beginner", band: 1, ru: "中国是一个大国。", en: "China is a big country." }
];
const zhStorySeedData = {
  "names": [
    "李明",
    "王伟",
    "芳芳",
    "小华",
    "秀英",
    "建国",
    "强",
    "丽丽",
    "平",
    "静"
  ],
  "places": [
    [
      "公园",
      "park"
    ],
    [
      "商店",
      "store"
    ],
    [
      "学校",
      "school"
    ],
    [
      "图书馆",
      "library"
    ],
    [
      "车站",
      "station"
    ],
    [
      "市场",
      "market"
    ],
    [
      "博物馆",
      "museum"
    ],
    [
      "咖啡馆",
      "cafe"
    ],
    [
      "家",
      "house"
    ],
    [
      "大学",
      "university"
    ]
  ],
  "objects": [
    [
      "书",
      "book"
    ],
    [
      "信",
      "letter"
    ],
    [
      "电话",
      "phone"
    ],
    [
      "地图",
      "map"
    ],
    [
      "桌子",
      "table"
    ],
    [
      "窗户",
      "window"
    ],
    [
      "茶",
      "tea"
    ],
    [
      "包",
      "bag"
    ],
    [
      "电影",
      "film"
    ],
    [
      "音乐",
      "music"
    ]
  ],
  "themes": [
    [
      "家庭",
      "family"
    ],
    [
      "工作",
      "work"
    ],
    [
      "城市",
      "city"
    ],
    [
      "语言",
      "language"
    ],
    [
      "历史",
      "history"
    ],
    [
      "计划",
      "plan"
    ],
    [
      "路",
      "road"
    ],
    [
      "会议",
      "meeting"
    ],
    [
      "新闻",
      "news"
    ],
    [
      "问题",
      "question"
    ]
  ],
  "weather": [
    [
      "雪",
      "snow"
    ],
    [
      "雨",
      "rain"
    ],
    [
      "风",
      "wind"
    ],
    [
      "太阳",
      "sun"
    ],
    [
      "温暖的夜晚",
      "warm evening"
    ],
    [
      "安静的早晨",
      "quiet morning"
    ],
    [
      "寒冷的一天",
      "cold day"
    ],
    [
      "晴朗的天空",
      "clear sky"
    ]
  ]
};
const ZhStorySeedData = zhStorySeedData; // replaced at the top

function createBeginnerZhStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(zhStorySeedData.names, index);
    const [placeLang, placeEn] = seedAt(zhStorySeedData.places, index);
    const [objectLang, objectEn] = seedAt(zhStorySeedData.objects, index + 2);
    const [themeLang, themeEn] = seedAt(zhStorySeedData.themes, index + 4);
    return {
      id: `zh-beginner-page-${index + 1}`,
      level: "beginner",
      title: `Zh Page ${index + 1}: ${name}`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "第1页",
          ru: `${name}早上去${placeLang}。那里有一个${objectLang}，还有一个新词。${name}慢慢读，然后想到${themeLang}。`,
          en: `In the morning ${name} goes to the ${placeEn}. There is a ${objectEn} and a new word there. ${name} reads slowly and thinks about ${themeEn}.`
        }
      ]
    };
  });
}

function createElementaryZhStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(zhStorySeedData.names, index + 1);
    const friend = seedAt(zhStorySeedData.names, index + 5);
    const [placeLang, placeEn] = seedAt(zhStorySeedData.places, index + 3);
    const [objectLang, objectEn] = seedAt(zhStorySeedData.objects, index + 1);
    const [themeLang, themeEn] = seedAt(zhStorySeedData.themes, index + 6);
    return {
      id: `zh-elementary-story-${index + 1}`,
      level: "elementary",
      title: `Zh Story ${index + 1}: ${placeEn}`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "第1页",
          ru: `下课后，${name}遇见一个朋友。他们去${placeLang}，谈论${themeLang}。${name}认真听。`,
          en: `After the lesson ${name} meets a friend. They go to the ${placeEn} and talk about ${themeEn}. ${name} listens carefully.`
        },
        {
          heading: "第2页",
          ru: `${friend}拿出一个${objectLang}，问了一个问题。然后他们一起回家。`,
          en: `${friend} shows a ${objectEn} and asks a question. Then the answer becomes clear, and the friends go home together.`
        }
      ]
    };
  });
}

function createIntermediateZhStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(zhStorySeedData.names, index + 2);
    const [placeLang, placeEn] = seedAt(zhStorySeedData.places, index + 4);
    const [themeLang, themeEn] = seedAt(zhStorySeedData.themes, index + 2);
    const [weatherLang, weatherEn] = seedAt(zhStorySeedData.weather, index);
    return {
      id: `zh-intermediate-chapter-${index + 1}`,
      level: "intermediate",
      title: `Zh Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "第1章",
          ru: `${name}一直想了解${themeLang}的故事。于是他去了${placeLang}。`,
          en: `${name} had long wanted to understand the story about ${themeEn}. Then he went to the ${placeEn}.`
        },
        {
          heading: "第2章",
          ru: `外面是${weatherLang}，城市很安静。`,
          en: `Outside there was ${weatherEn}.`
        }
      ]
    };
  });
}

function createAdvancedZhStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(zhStorySeedData.names, index + 3);
    const [placeLang, placeEn] = seedAt(zhStorySeedData.places, index + 6);
    const [themeLang, themeEn] = seedAt(zhStorySeedData.themes, index + 1);
    const [weatherLang, weatherEn] = seedAt(zhStorySeedData.weather, index + 2);
    return {
      id: `zh-advanced-chapter-${index + 1}`,
      level: "advanced",
      title: `Zh Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "第1章",
          ru: `${name}很晚才到${placeLang}。天气是${weatherLang}。他一边走，一边思考${themeLang}。`,
          en: `When ${name} arrived at the ${placeEn} late in the evening. There was ${weatherEn} in the city. He thought about ${themeEn}.`
        }
      ]
    };
  });
}

const generatedZhStories = [
  ...createBeginnerZhStories(70),
  ...createElementaryZhStories(80),
  ...createIntermediateZhStories(80),
  ...createAdvancedZhStories(75)
];

function enhanceMandarinStory(story, index) {
  const name = seedAt(zhStorySeedData.names, index + 2);
  const friend = seedAt(zhStorySeedData.names, index + 8);
  const [placeZh, placeEn] = seedAt(zhStorySeedData.places, index + 3);
  const [objectZh, objectEn] = seedAt(zhStorySeedData.objects, index + 5);
  const [themeZh, themeEn] = seedAt(zhStorySeedData.themes, index + 1);
  const [weatherZh, weatherEn] = seedAt(zhStorySeedData.weather, index + 4);
  const beginner = [
    { heading: "第1页", ru: `${name}早上来到${placeZh}。他看见一个${objectZh}，也听见有人谈论${themeZh}。他把新词写下来，然后慢慢读一遍。`, en: `In the morning, ${name} comes to the ${placeEn}. He sees a ${objectEn} and hears someone talking about ${themeEn}. He writes down the new words and reads them slowly.` },
    { heading: "第1页", ru: `${weatherZh}的时候，${name}在${placeZh}等朋友。他用${objectZh}练习一个句子，声音不大，但是很清楚。`, en: `During ${weatherEn}, ${name} waits for a friend at the ${placeEn}. He uses a ${objectEn} to practice one sentence. His voice is not loud, but it is clear.` },
    { heading: "第1页", ru: `${name}今天学习${themeZh}。老师给他看${objectZh}，让他说出三个简单的句子。`, en: `${name} studies ${themeEn} today. The teacher shows him a ${objectEn} and asks him to say three simple sentences.` }
  ];
  const elementary = [
    [
      { heading: "第1页", ru: `${name}和${friend}在${placeZh}见面。他们想读一篇关于${themeZh}的短文，但是里面有几个不熟悉的词。`, en: `${name} and ${friend} meet at the ${placeEn}. They want to read a short text about ${themeEn}, but it has several unfamiliar words.` },
      { heading: "第2页", ru: `${friend}拿起${objectZh}，解释第一个词。${name}重新读句子，终于明白了故事的意思。`, en: `${friend} picks up a ${objectEn} and explains the first word. ${name} reads the sentence again and finally understands the meaning of the story.` }
    ],
    [
      { heading: "第1页", ru: `课后，${name}还留在${placeZh}。外面是${weatherZh}，所以房间里的人都安静地听录音。`, en: `After class, ${name} stays at the ${placeEn}. Outside there is ${weatherEn}, so everyone in the room quietly listens to the recording.` },
      { heading: "第2页", ru: `录音里多次出现${themeZh}。${name}把关键句子抄下来，${friend}帮他纠正发音。`, en: `${themeEn} appears many times in the recording. ${name} copies the key sentence, and ${friend} helps correct his pronunciation.` }
    ]
  ];
  const intermediate = [
    [
      { heading: "第1章：线索", ru: `${name}在${placeZh}附近发现一张纸条。纸条写得很短，只提到${themeZh}和一个奇怪的时间。`, en: `${name} finds a note near the ${placeEn}. The note is short and mentions only ${themeEn} and a strange time.` },
      { heading: "第2章：寻找", ru: `外面是${weatherZh}，街上的声音变得很远。${name}带着${objectZh}，沿着旧路向前走。`, en: `Outside there is ${weatherEn}, and the sounds of the street feel far away. ${name} carries a ${objectEn} and follows the old road forward.` },
      { heading: "第3章：答案", ru: `在入口处，${friend}已经等了很久。两个人一起读纸条，发现真正重要的不是地点，而是纸条背后的承诺。`, en: `At the entrance, ${friend} has been waiting for a long time. Together they read the note and discover that the important thing is not the place, but the promise behind it.` }
    ]
  ];
  const advanced = [
    [
      { heading: "第1章：抵达", ru: `${name}傍晚到达${placeZh}时，${weatherZh}让整条街像被压低了声音。他反复想起关于${themeZh}的那封信。`, en: `When ${name} reaches the ${placeEn} in the evening, the ${weatherEn} seems to lower the sound of the whole street. He keeps thinking of the letter about ${themeEn}.` },
      { heading: "第2章：物件", ru: `屋里只有一盏灯和一个${objectZh}。它看起来普通，却藏着过去许多人不愿说出的名字。`, en: `Inside the room there is only one lamp and a ${objectEn}. It looks ordinary, but it holds names many people from the past did not want to say aloud.` },
      { heading: "第3章：选择", ru: `${friend}提醒他，有些故事不是为了马上得到答案，而是为了学会认真听别人留下的声音。`, en: `${friend} reminds him that some stories are not meant to give an answer immediately, but to teach people to listen carefully to voices left behind.` },
      { heading: "第4章：继续", ru: `${name}离开时，终于把那个词读对了。这个词没有结束故事，反而让他知道下一页应该从哪里开始。`, en: `When ${name} leaves, he finally reads the word correctly. The word does not end the story; instead, it tells him where the next page should begin.` }
    ]
  ];
  const pool = { beginner, elementary, intermediate, advanced }[story.level];
  if (!pool) return story;
  return { ...story, sections: story.level === "beginner" ? [pool[index % pool.length]] : pool[index % pool.length] };
}

const mandarinStories = generatedZhStories.map(enhanceMandarinStory);

// Hindi words
function buildHindiWords() {
  const common = [
    ["मैं", "I", "pronoun"], ["आप", "you (formal)", "pronoun"], ["यह", "this", "pronoun"], ["वह", "that", "pronoun"],
    ["है", "is", "verb"], ["और", "and", "conjunction"], ["क्या", "what", "pronoun"], ["नहीं", "not", "adverb"],
    ["हाँ", "yes", "particle"], ["करना", "to do", "verb"], ["जाना", "to go", "verb"], ["आना", "to come", "verb"],
    ["खाना", "to eat", "verb"], ["पानी", "water", "noun"], ["घर", "house", "noun"], ["नाम", "name", "noun"],
    ["लड़का", "boy", "noun"], ["लड़की", "girl", "noun"], ["अच्छा", "good", "adjective"], ["बड़ा", "big", "adjective"]
  ];
  return Array.from({ length: 1000 }, (_, index) => {
    const seed = common[index % common.length];
    const cycle = Math.floor(index / common.length);
    return { rank: index + 1, word: cycle ? `${seed[0]} ${cycle + 1}` : seed[0], translation: cycle ? `${seed[1]} ${cycle + 1}` : seed[1], partOfSpeech: seed[2] };
  });
}
const hindiParagraphs = [
  { title: "My name", difficulty: "Beginner", band: 1, ru: "मेरा नाम कॉनर है।", en: "My name is Connor." },
  { title: "Good house", difficulty: "Beginner", band: 1, ru: "यह एक अच्छा घर है।", en: "This is a good house." }
];
const hiStorySeedData = {
  "names": [
    "आरव",
    "विहान",
    "अदिति",
    "दीया",
    "कबीर",
    "रिया",
    "अर्जुन",
    "मीरा",
    "रोहन",
    "सान्या"
  ],
  "places": [
    [
      "पार्क",
      "park"
    ],
    [
      "दुकान",
      "store"
    ],
    [
      "स्कूल",
      "school"
    ],
    [
      "पुस्तकालय",
      "library"
    ],
    [
      "स्टेशन",
      "station"
    ],
    [
      "बाज़ार",
      "market"
    ],
    [
      "संग्रहालय",
      "museum"
    ],
    [
      "कैफे",
      "cafe"
    ],
    [
      "घर",
      "house"
    ],
    [
      "विश्वविद्यालय",
      "university"
    ]
  ],
  "objects": [
    [
      "किताब",
      "book"
    ],
    [
      "पत्र",
      "letter"
    ],
    [
      "फोन",
      "phone"
    ],
    [
      "नक्शा",
      "map"
    ],
    [
      "मेज़",
      "table"
    ],
    [
      "खिड़की",
      "window"
    ],
    [
      "चाय",
      "tea"
    ],
    [
      "बैग",
      "bag"
    ],
    [
      "फिल्म",
      "film"
    ],
    [
      "संगीत",
      "music"
    ]
  ],
  "themes": [
    [
      "परिवार",
      "family"
    ],
    [
      "काम",
      "work"
    ],
    [
      "शहर",
      "city"
    ],
    [
      "भाषा",
      "language"
    ],
    [
      "इतिहास",
      "history"
    ],
    [
      "योजना",
      "plan"
    ],
    [
      "सड़क",
      "road"
    ],
    [
      "बैठक",
      "meeting"
    ],
    [
      "समाचार",
      "news"
    ],
    [
      "सवाल",
      "question"
    ]
  ],
  "weather": [
    [
      "बर्फ",
      "snow"
    ],
    [
      "बारिश",
      "rain"
    ],
    [
      "हवा",
      "wind"
    ],
    [
      "सूरज",
      "sun"
    ],
    [
      "गर्म शाम",
      "warm evening"
    ],
    [
      "शांत सुबह",
      "quiet morning"
    ],
    [
      "ठंडा दिन",
      "cold day"
    ],
    [
      "साफ आसमान",
      "clear sky"
    ]
  ]
};
const HiStorySeedData = hiStorySeedData; // replaced at the top

function createBeginnerHiStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(hiStorySeedData.names, index);
    const [placeLang, placeEn] = seedAt(hiStorySeedData.places, index);
    const [objectLang, objectEn] = seedAt(hiStorySeedData.objects, index + 2);
    const [themeLang, themeEn] = seedAt(hiStorySeedData.themes, index + 4);
    return {
      id: `hi-beginner-page-${index + 1}`,
      level: "beginner",
      title: `Hi Page ${index + 1}: ${name}`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "पृष्ठ 1",
          ru: `${name} सुबह ${placeLang} जाता है। वहाँ एक ${objectLang} है और एक नया शब्द है। ${name} उसे पढ़ता है और ${themeLang} के बारे में सोचता है।`,
          en: `In the morning ${name} goes to the ${placeEn}. There is a ${objectEn} and a new word there. ${name} reads slowly and thinks about ${themeEn}.`
        }
      ]
    };
  });
}

function createElementaryHiStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(hiStorySeedData.names, index + 1);
    const friend = seedAt(hiStorySeedData.names, index + 5);
    const [placeLang, placeEn] = seedAt(hiStorySeedData.places, index + 3);
    const [objectLang, objectEn] = seedAt(hiStorySeedData.objects, index + 1);
    const [themeLang, themeEn] = seedAt(hiStorySeedData.themes, index + 6);
    return {
      id: `hi-elementary-story-${index + 1}`,
      level: "elementary",
      title: `Hi Story ${index + 1}: ${placeEn}`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "पृष्ठ 1",
          ru: `कक्षा के बाद ${name} एक दोस्त से मिलता है। वे ${placeLang} जाते हैं और ${themeLang} के बारे में बात करते हैं। ${name} ध्यान से सुनता है।`,
          en: `After the lesson ${name} meets a friend. They go to the ${placeEn} and talk about ${themeEn}. ${name} listens carefully.`
        },
        {
          heading: "पृष्ठ 2",
          ru: `${friend} एक ${objectLang} दिखाता है और एक सवाल पूछता है। फिर वे घर जाते हैं।`,
          en: `${friend} shows a ${objectEn} and asks a question. Then the answer becomes clear, and the friends go home together.`
        }
      ]
    };
  });
}

function createIntermediateHiStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(hiStorySeedData.names, index + 2);
    const [placeLang, placeEn] = seedAt(hiStorySeedData.places, index + 4);
    const [themeLang, themeEn] = seedAt(hiStorySeedData.themes, index + 2);
    const [weatherLang, weatherEn] = seedAt(hiStorySeedData.weather, index);
    return {
      id: `hi-intermediate-chapter-${index + 1}`,
      level: "intermediate",
      title: `Hi Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "अध्याय 1",
          ru: `${name} लंबे समय से ${themeLang} की कहानी समझना चाहता था। फिर वह ${placeLang} गया।`,
          en: `${name} had long wanted to understand the story about ${themeEn}. Then he went to the ${placeEn}.`
        },
        {
          heading: "अध्याय 2",
          ru: `बाहर ${weatherLang} था।`,
          en: `Outside there was ${weatherEn}.`
        }
      ]
    };
  });
}

function createAdvancedHiStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(hiStorySeedData.names, index + 3);
    const [placeLang, placeEn] = seedAt(hiStorySeedData.places, index + 6);
    const [themeLang, themeEn] = seedAt(hiStorySeedData.themes, index + 1);
    const [weatherLang, weatherEn] = seedAt(hiStorySeedData.weather, index + 2);
    return {
      id: `hi-advanced-chapter-${index + 1}`,
      level: "advanced",
      title: `Hi Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "अध्याय 1",
          ru: `${name} देर से ${placeLang} पहुँचा। मौसम ${weatherLang} था। वह ${themeLang} के बारे में सोच रहा था।`,
          en: `When ${name} arrived at the ${placeEn} late in the evening. There was ${weatherEn} in the city. He thought about ${themeEn}.`
        }
      ]
    };
  });
}

const generatedHiStories = [
  ...createBeginnerHiStories(70),
  ...createElementaryHiStories(80),
  ...createIntermediateHiStories(80),
  ...createAdvancedHiStories(75)
];

function enhanceHindiStory(story, index) {
  const name = seedAt(hiStorySeedData.names, index + 2);
  const friend = seedAt(hiStorySeedData.names, index + 8);
  const [placeHi, placeEn] = seedAt(hiStorySeedData.places, index + 3);
  const [objectHi, objectEn] = seedAt(hiStorySeedData.objects, index + 5);
  const [themeHi, themeEn] = seedAt(hiStorySeedData.themes, index + 1);
  const [weatherHi, weatherEn] = seedAt(hiStorySeedData.weather, index + 4);
  const beginner = [
    { heading: "पेज 1", ru: `${name} सुबह ${placeHi} जाता है। वहाँ उसे एक ${objectHi} मिलता है। वह ${themeHi} के बारे में दो नए शब्द पढ़ता है और धीरे-धीरे बोलता है।`, en: `In the morning, ${name} goes to the ${placeEn}. There he finds a ${objectEn}. He reads two new words about ${themeEn} and says them slowly.` },
    { heading: "पेज 1", ru: `${weatherHi} में ${name} ${placeHi} के पास रुकता है। वह ${objectHi} को देखता है और शिक्षक से एक आसान सवाल पूछता है।`, en: `In ${weatherEn}, ${name} stops near the ${placeEn}. He looks at a ${objectEn} and asks the teacher one easy question.` },
    { heading: "पेज 1", ru: `${name} आज ${themeHi} सीख रहा है। वह छोटा वाक्य पढ़ता है, फिर उसे अपनी नोटबुक में साफ-साफ लिखता है।`, en: `${name} is learning ${themeEn} today. He reads a short sentence, then writes it clearly in his notebook.` }
  ];
  const elementary = [
    [
      { heading: "पेज 1", ru: `${name} और ${friend} ${placeHi} में मिलते हैं। वे ${themeHi} पर एक छोटी कहानी पढ़ना चाहते हैं, लेकिन पहला वाक्य कठिन लगता है।`, en: `${name} and ${friend} meet in the ${placeEn}. They want to read a short story about ${themeEn}, but the first sentence feels difficult.` },
      { heading: "पेज 2", ru: `${friend} ${objectHi} दिखाता है और अर्थ समझाता है। ${name} फिर से पढ़ता है और इस बार पूरी बात समझ जाता है।`, en: `${friend} shows a ${objectEn} and explains the meaning. ${name} reads again and this time understands the whole idea.` }
    ],
    [
      { heading: "पेज 1", ru: `कक्षा के बाद ${name} ${placeHi} में रुकता है। बाहर ${weatherHi} है, इसलिए सब लोग अंदर बैठकर रिकॉर्डिंग सुनते हैं।`, en: `After class, ${name} stays in the ${placeEn}. Outside there is ${weatherEn}, so everyone sits inside and listens to a recording.` },
      { heading: "पेज 2", ru: `रिकॉर्डिंग में ${themeHi} शब्द कई बार आता है। ${name} उसका उच्चारण करता है, और ${friend} उसे सही लय बताता है।`, en: `The word for ${themeEn} appears many times in the recording. ${name} pronounces it, and ${friend} shows him the correct rhythm.` }
    ]
  ];
  const intermediate = [
    [
      { heading: "अध्याय 1: संकेत", ru: `${name} को ${placeHi} के बाहर एक पुराना कागज़ मिला। उसमें ${themeHi} के बारे में सिर्फ तीन पंक्तियाँ थीं, पर हर पंक्ति में एक ही नाम छिपा था।`, en: `${name} found an old paper outside the ${placeEn}. It had only three lines about ${themeEn}, but each line hid the same name.` },
      { heading: "अध्याय 2: रास्ता", ru: `बाहर ${weatherHi} था। ${name} ने ${objectHi} उठाया और उस गली में गया जहाँ पुराने लोग शाम को कहानियाँ सुनाते थे।`, en: `Outside there was ${weatherEn}. ${name} picked up a ${objectEn} and went to the lane where old people used to tell stories in the evening.` },
      { heading: "अध्याय 3: अर्थ", ru: `वहाँ ${friend} मिला। दोनों ने मिलकर कागज़ पढ़ा और समझा कि कठिन शब्द असल में एक अधूरी याद का दरवाज़ा था।`, en: `There he met ${friend}. Together they read the paper and understood that the difficult word was actually a door to an unfinished memory.` }
    ]
  ];
  const advanced = [
    [
      { heading: "अध्याय 1: आगमन", ru: `${name} देर शाम ${placeHi} पहुँचा। ${weatherHi} ने सड़क को शांत कर दिया था, और उसके मन में ${themeHi} वाली चिट्ठी बार-बार लौट रही थी।`, en: `${name} reached the ${placeEn} late in the evening. The ${weatherEn} had made the road quiet, and the letter about ${themeEn} kept returning to his mind.` },
      { heading: "अध्याय 2: वस्तु", ru: `कमरे में एक ${objectHi} रखा था। वह साधारण दिखता था, लेकिन उसके किनारे पर लिखे शब्द किसी पुराने फैसले की ओर इशारा करते थे।`, en: `A ${objectEn} was placed in the room. It looked ordinary, but the words written on its edge pointed toward an old decision.` },
      { heading: "अध्याय 3: गवाही", ru: `${friend} ने धीमी आवाज़ में बताया कि भाषा कभी-कभी सिर्फ अर्थ नहीं देती; वह लोगों के बीच बचा हुआ भरोसा भी सँभालती है।`, en: `${friend} said softly that language sometimes gives more than meaning; it also protects the trust left between people.` },
      { heading: "अध्याय 4: आगे", ru: `${name} ने आखिरी पंक्ति फिर पढ़ी। अब वह उत्तर खोजने नहीं, बल्कि कहानी को सही आवाज़ में आगे कहने के लिए तैयार था।`, en: `${name} read the last line again. He was no longer searching only for an answer; he was ready to carry the story forward in the right voice.` }
    ]
  ];
  const pool = { beginner, elementary, intermediate, advanced }[story.level];
  if (!pool) return story;
  return { ...story, sections: story.level === "beginner" ? [pool[index % pool.length]] : pool[index % pool.length] };
}

const hindiStories = generatedHiStories.map(enhanceHindiStory);

// Arabic words
function buildArabicWords() {
  const common = [
    ["في", "in", "preposition"], ["من", "from", "preposition"], ["على", "on", "preposition"], ["أن", "that", "conjunction"],
    ["إلى", "to", "preposition"], ["لا", "no", "particle"], ["الله", "God", "noun"], ["أو", "or", "conjunction"],
    ["عن", "about", "preposition"], ["ما", "what", "pronoun"], ["مع", "with", "preposition"], ["كل", "all", "noun"],
    ["هو", "he", "pronoun"], ["هي", "she", "pronoun"], ["هذا", "this", "pronoun"], ["كان", "was", "verb"],
    ["قال", "said", "verb"], ["يوم", "day", "noun"], ["أنا", "I", "pronoun"], ["كبير", "big", "adjective"]
  ];
  return Array.from({ length: 1000 }, (_, index) => {
    const seed = common[index % common.length];
    const cycle = Math.floor(index / common.length);
    return { rank: index + 1, word: cycle ? `${seed[0]} ${cycle + 1}` : seed[0], translation: cycle ? `${seed[1]} ${cycle + 1}` : seed[1], partOfSpeech: seed[2] };
  });
}
const arabicParagraphs = [
  { title: "Big day", difficulty: "Beginner", band: 1, ru: "هذا يوم كبير.", en: "This is a big day." },
  { title: "Where from", difficulty: "Beginner", band: 1, ru: "من أين أنت؟", en: "Where are you from?" }
];
const arStorySeedData = {
  "names": [
    "محمد",
    "أحمد",
    "فاطمة",
    "عائشة",
    "علي",
    "مريم",
    "عمر",
    "زينب",
    "يوسف",
    "سارة"
  ],
  "places": [
    [
      "حديقة",
      "park"
    ],
    [
      "متجر",
      "store"
    ],
    [
      "مدرسة",
      "school"
    ],
    [
      "مكتبة",
      "library"
    ],
    [
      "محطة",
      "station"
    ],
    [
      "سوق",
      "market"
    ],
    [
      "متحف",
      "museum"
    ],
    [
      "مقهى",
      "cafe"
    ],
    [
      "منزل",
      "house"
    ],
    [
      "جامعة",
      "university"
    ]
  ],
  "objects": [
    [
      "كتاب",
      "book"
    ],
    [
      "رسالة",
      "letter"
    ],
    [
      "هاتف",
      "phone"
    ],
    [
      "خريطة",
      "map"
    ],
    [
      "طاولة",
      "table"
    ],
    [
      "نافذة",
      "window"
    ],
    [
      "شاي",
      "tea"
    ],
    [
      "حقيبة",
      "bag"
    ],
    [
      "فيلم",
      "film"
    ],
    [
      "موسيقى",
      "music"
    ]
  ],
  "themes": [
    [
      "عائلة",
      "family"
    ],
    [
      "عمل",
      "work"
    ],
    [
      "مدينة",
      "city"
    ],
    [
      "لغة",
      "language"
    ],
    [
      "تاريخ",
      "history"
    ],
    [
      "خطة",
      "plan"
    ],
    [
      "طريق",
      "road"
    ],
    [
      "اجتماع",
      "meeting"
    ],
    [
      "أخبار",
      "news"
    ],
    [
      "سؤال",
      "question"
    ]
  ],
  "weather": [
    [
      "ثلج",
      "snow"
    ],
    [
      "مطر",
      "rain"
    ],
    [
      "رياح",
      "wind"
    ],
    [
      "شمس",
      "sun"
    ],
    [
      "مساء دافئ",
      "warm evening"
    ],
    [
      "صباح هادئ",
      "quiet morning"
    ],
    [
      "يوم بارد",
      "cold day"
    ],
    [
      "سماء صافية",
      "clear sky"
    ]
  ]
};
const ArStorySeedData = arStorySeedData; // replaced at the top

function createBeginnerArStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(arStorySeedData.names, index);
    const [placeLang, placeEn] = seedAt(arStorySeedData.places, index);
    const [objectLang, objectEn] = seedAt(arStorySeedData.objects, index + 2);
    const [themeLang, themeEn] = seedAt(arStorySeedData.themes, index + 4);
    return {
      id: `ar-beginner-page-${index + 1}`,
      level: "beginner",
      title: `Ar Page ${index + 1}: ${name}`,
      difficulty: "Beginner page",
      band: 1,
      sections: [
        {
          heading: "الصفحة 1",
          ru: `${name} يذهب إلى ${placeLang} في الصباح. هناك ${objectLang} وكلمة جديدة. يقرأ ${name} الكلمة ويفكر في ${themeLang}.`,
          en: `In the morning ${name} goes to the ${placeEn}. There is a ${objectEn} and a new word there. ${name} reads slowly and thinks about ${themeEn}.`
        }
      ]
    };
  });
}

function createElementaryArStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(arStorySeedData.names, index + 1);
    const friend = seedAt(arStorySeedData.names, index + 5);
    const [placeLang, placeEn] = seedAt(arStorySeedData.places, index + 3);
    const [objectLang, objectEn] = seedAt(arStorySeedData.objects, index + 1);
    const [themeLang, themeEn] = seedAt(arStorySeedData.themes, index + 6);
    return {
      id: `ar-elementary-story-${index + 1}`,
      level: "elementary",
      title: `Ar Story ${index + 1}: ${placeEn}`,
      difficulty: "Elementary pages",
      band: 2,
      sections: [
        {
          heading: "الصفحة 1",
          ru: `بعد الدرس، يلتقي ${name} بصديق. يذهبان إلى ${placeLang} ويتحدثان عن ${themeLang}. يستمع ${name} بانتباه.`,
          en: `After the lesson ${name} meets a friend. They go to the ${placeEn} and talk about ${themeEn}. ${name} listens carefully.`
        },
        {
          heading: "الصفحة 2",
          ru: `يعرض ${friend} ${objectLang} ويسأل سؤالا. ثم يعودان إلى البيت.`,
          en: `${friend} shows a ${objectEn} and asks a question. Then the answer becomes clear, and the friends go home together.`
        }
      ]
    };
  });
}

function createIntermediateArStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(arStorySeedData.names, index + 2);
    const [placeLang, placeEn] = seedAt(arStorySeedData.places, index + 4);
    const [themeLang, themeEn] = seedAt(arStorySeedData.themes, index + 2);
    const [weatherLang, weatherEn] = seedAt(arStorySeedData.weather, index);
    return {
      id: `ar-intermediate-chapter-${index + 1}`,
      level: "intermediate",
      title: `Ar Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Intermediate chapter",
      band: 3,
      sections: [
        {
          heading: "الفصل 1",
          ru: `كان ${name} يريد أن يفهم قصة عن ${themeLang}. ثم ذهب إلى ${placeLang}.`,
          en: `${name} had long wanted to understand the story about ${themeEn}. Then he went to the ${placeEn}.`
        },
        {
          heading: "الفصل 2",
          ru: `كان الطقس ${weatherLang} في الخارج.`,
          en: `Outside there was ${weatherEn}.`
        }
      ]
    };
  });
}

function createAdvancedArStories(count) {
  return Array.from({ length: count }, (_, index) => {
    const name = seedAt(arStorySeedData.names, index + 3);
    const [placeLang, placeEn] = seedAt(arStorySeedData.places, index + 6);
    const [themeLang, themeEn] = seedAt(arStorySeedData.themes, index + 1);
    const [weatherLang, weatherEn] = seedAt(arStorySeedData.weather, index + 2);
    return {
      id: `ar-advanced-chapter-${index + 1}`,
      level: "advanced",
      title: `Ar Chapter ${index + 1}: ${themeEn}`,
      difficulty: "Advanced chapters",
      band: 4,
      sections: [
        {
          heading: "الفصل 1",
          ru: `وصل ${name} إلى ${placeLang} في وقت متأخر. كان الطقس ${weatherLang}. فكر في ${themeLang}.`,
          en: `When ${name} arrived at the ${placeEn} late in the evening. There was ${weatherEn} in the city. He thought about ${themeEn}.`
        }
      ]
    };
  });
}

const generatedArStories = [
  ...createBeginnerArStories(70),
  ...createElementaryArStories(80),
  ...createIntermediateArStories(80),
  ...createAdvancedArStories(75)
];

function enhanceArabicStory(story, index) {
  const name = seedAt(arStorySeedData.names, index + 2);
  const friend = seedAt(arStorySeedData.names, index + 8);
  const [placeAr, placeEn] = seedAt(arStorySeedData.places, index + 3);
  const [objectAr, objectEn] = seedAt(arStorySeedData.objects, index + 5);
  const [themeAr, themeEn] = seedAt(arStorySeedData.themes, index + 1);
  const [weatherAr, weatherEn] = seedAt(arStorySeedData.weather, index + 4);
  const beginner = [
    { heading: "الصفحة 1", ru: `في الصباح يذهب ${name} إلى ${placeAr}. يرى ${objectAr} صغيرا، ثم يقرأ كلمتين عن ${themeAr} بصوت واضح.`, en: `In the morning, ${name} goes to the ${placeEn}. He sees a small ${objectEn}, then reads two words about ${themeEn} in a clear voice.` },
    { heading: "الصفحة 1", ru: `عندما يكون الطقس ${weatherAr}، ينتظر ${name} قرب ${placeAr}. يكتب جملة قصيرة ويسأل المعلم عن معنى ${objectAr}.`, en: `When the weather is ${weatherEn}, ${name} waits near the ${placeEn}. He writes a short sentence and asks the teacher about the meaning of a ${objectEn}.` },
    { heading: "الصفحة 1", ru: `يتعلم ${name} اليوم عن ${themeAr}. يقرأ ببطء، ثم يعيد الجملة حتى تصبح الكلمات أسهل.`, en: `${name} learns about ${themeEn} today. He reads slowly, then repeats the sentence until the words become easier.` }
  ];
  const elementary = [
    [
      { heading: "الصفحة 1", ru: `يلتقي ${name} و${friend} في ${placeAr}. يريدان قراءة قصة قصيرة عن ${themeAr}، لكن في السطر الأول كلمة جديدة.`, en: `${name} and ${friend} meet in the ${placeEn}. They want to read a short story about ${themeEn}, but the first line has a new word.` },
      { heading: "الصفحة 2", ru: `يشير ${friend} إلى ${objectAr} ويشرح الفكرة. يقرأ ${name} السطر مرة ثانية، ثم يفهم لماذا تغير معنى القصة.`, en: `${friend} points to a ${objectEn} and explains the idea. ${name} reads the line a second time, then understands why the story's meaning changed.` }
    ],
    [
      { heading: "الصفحة 1", ru: `بعد الدرس يبقى ${name} في ${placeAr}. في الخارج طقس ${weatherAr}، ولذلك يستمع الجميع إلى التسجيل بهدوء.`, en: `After the lesson, ${name} stays in the ${placeEn}. Outside there is ${weatherEn}, so everyone listens quietly to the recording.` },
      { heading: "الصفحة 2", ru: `تتكرر كلمة ${themeAr} في التسجيل. يكتبها ${name} ثلاث مرات، ويساعده ${friend} على نطق الحروف الصعبة.`, en: `The word for ${themeEn} repeats in the recording. ${name} writes it three times, and ${friend} helps him pronounce the difficult letters.` }
    ]
  ];
  const intermediate = [
    [
      { heading: "الفصل 1: أثر", ru: `وجد ${name} ورقة قديمة قرب ${placeAr}. كانت الورقة تتحدث عن ${themeAr}، لكنها تركت أهم جملة ناقصة.`, en: `${name} found an old paper near the ${placeEn}. The paper spoke about ${themeEn}, but it left the most important sentence unfinished.` },
      { heading: "الفصل 2: الطريق", ru: `كان الطقس ${weatherAr}، والشارع شبه خال. حمل ${name} ${objectAr} ومشى نحو الباب الذي ذكرته الورقة.`, en: `The weather was ${weatherEn}, and the street was almost empty. ${name} carried a ${objectEn} and walked toward the door mentioned in the paper.` },
      { heading: "الفصل 3: المعنى", ru: `هناك وجد ${friend}. قرآ الكلمات معا، واكتشفا أن الجملة الناقصة كانت وعدا قديما لا سؤالا عاديا.`, en: `There he found ${friend}. They read the words together and discovered that the missing sentence was an old promise, not an ordinary question.` }
    ]
  ];
  const advanced = [
    [
      { heading: "الفصل 1: الوصول", ru: `وصل ${name} إلى ${placeAr} في ساعة متأخرة. كان الطقس ${weatherAr}، وكانت فكرة ${themeAr} تتحرك في ذهنه كأنها صوت من بعيد.`, en: `${name} arrived at the ${placeEn} late. The weather was ${weatherEn}, and the thought of ${themeEn} moved through his mind like a distant voice.` },
      { heading: "الفصل 2: الشيء", ru: `في الغرفة كان هناك ${objectAr}. بدا عاديا، لكن العلامة الصغيرة عليه فتحت بابا إلى قصة لم يروها أحد كاملة.`, en: `In the room there was a ${objectEn}. It looked ordinary, but the small mark on it opened a door to a story no one had told completely.` },
      { heading: "الفصل 3: الصمت", ru: `قال ${friend} إن بعض الكلمات لا تكشف الحقيقة مباشرة. إنها تجعل القارئ يبطئ، يسمع، ثم يختار ما يجب أن يحفظه.`, en: `${friend} said that some words do not reveal the truth directly. They make the reader slow down, listen, and then choose what must be preserved.` },
      { heading: "الفصل 4: العودة", ru: `قرأ ${name} الجملة الأخيرة مرة أخرى. هذه المرة لم يبحث عن نهاية، بل عن طريقة يحمل بها القصة إلى الشخص التالي.`, en: `${name} read the final sentence again. This time he was not searching for an ending, but for a way to carry the story to the next person.` }
    ]
  ];
  const pool = { beginner, elementary, intermediate, advanced }[story.level];
  if (!pool) return story;
  return { ...story, sections: story.level === "beginner" ? [pool[index % pool.length]] : pool[index % pool.length] };
}

const arabicStories = generatedArStories.map(enhanceArabicStory);

function getCurriculumLanguage(language) {
  return window.LANGUAGE_CURRICULUM?.languages?.[language] || null;
}

function getCurriculumWords(language, fallback) {
  const words = getCurriculumLanguage(language)?.words;
  if (!Array.isArray(words) || !words.length) return fallback();
  return words.map((item) => ({
    rank: Number(item.rank),
    sourceRank: item.sourceRank,
    word: item.word,
    translation: item.translation,
    partOfSpeech: item.partOfSpeech || ""
  }));
}

function getCurriculumStories(language, fallback) {
  const stories = getCurriculumLanguage(language)?.stories;
  if (!Array.isArray(stories) || !stories.length) return fallback;
  return stories;
}

const initialLanguage = localStorage.getItem("nova_target_language") || "russian";
const languageDatasets = {
  russian: { label: "Russian", title: "Russian Reading", words: () => getCurriculumWords("russian", () => parseWords(rawRussianWords)), paragraphs, stories: getCurriculumStories("russian", russianStories), speechLang: "ru-RU" },
  japanese: { label: "Japanese", title: "Japanese Reading", words: () => getCurriculumWords("japanese", buildJapaneseWords), paragraphs: japaneseParagraphs, stories: getCurriculumStories("japanese", japaneseStories), speechLang: "ja-JP" },
  mandarin: { label: "Mandarin", title: "Mandarin Reading", words: () => getCurriculumWords("mandarin", buildMandarinWords), paragraphs: mandarinParagraphs, stories: getCurriculumStories("mandarin", mandarinStories), speechLang: "zh-CN" },
  hindi: { label: "Hindi", title: "Hindi Reading", words: () => getCurriculumWords("hindi", buildHindiWords), paragraphs: hindiParagraphs, stories: getCurriculumStories("hindi", hindiStories), speechLang: "hi-IN" },
  arabic: { label: "Arabic", title: "Arabic Reading", words: () => getCurriculumWords("arabic", buildArabicWords), paragraphs: arabicParagraphs, stories: getCurriculumStories("arabic", arabicStories), speechLang: "ar-SA" }
};
let activeParagraphs = languageDatasets[initialLanguage]?.paragraphs || paragraphs;
let storyLibrary = languageDatasets[initialLanguage]?.stories || russianStories;

function getMediaBaseUrl() {
  return String(window.LANGUAGE_MEDIA_BASE || localStorage.getItem("language_media_base") || "").replace(/\/+$/, "");
}

function resolveMediaUrl(assetPath) {
  const value = String(assetPath || "").trim();
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const base = getMediaBaseUrl();
  const externalMediaPath = /^(Russian|Japanese|Mandarin|Hindi|Arabic)\//i.test(value);
  if (!base || !externalMediaPath) return value;
  return `${base}/${value.replace(/^\/+/, "")}`;
}

const appState = {
  targetLanguage: languageDatasets[initialLanguage] ? initialLanguage : "russian",
  words: (languageDatasets[initialLanguage] || languageDatasets.russian).words(),
  currentParagraph: activeParagraphs[0],
  currentStory: storyLibrary[0],
  practiceIndex: 0,
  practiceUnlocked: false,
  lastPracticeScore: JSON.parse(localStorage.getItem("nova_practice_stats") || "{}"),
  activeView: "practice",
  recognition: null,
  recognizing: false,
  transcript: "",
  coins: parseInt(localStorage.getItem('nova_coins') || '100', 10),
  unlockedThemes: JSON.parse(localStorage.getItem('nova_unlocked_themes') || '[8,9,10]'),
  unlockedSongs: JSON.parse(localStorage.getItem('nova_unlocked_songs') || '[]'),
  learnedWords: JSON.parse(localStorage.getItem(`nova_learned_words_${initialLanguage}`) || localStorage.getItem('nova_learned_words') || '[]'),
  outboundMessages: JSON.parse(localStorage.getItem('nova_outbound_messages') || '{}'),
  settings: JSON.parse(localStorage.getItem('nova_profile_settings') || '{}'),
  activeTheme: localStorage.getItem('nova_active_theme') || 'languages/russian/assets/images/theme_family_1778919168922.png',
  isPlaying: false,
  currentStorySectionIndex: 0
};
let mediaRecorder = null;
let mediaRecordChunks = [];
let activeSpeech = null;
let speechRestartTimer = null;

const fullRussianWordListUrl = "https://raw.githubusercontent.com/alicewriteswrongs/russian-vocab/master/words.json";

const els = {
  practiceTab: document.querySelector("#practiceTab"),
  storiesTab: document.querySelector("#storiesTab"),
  profileTab: document.querySelector("#profileTab"),
  editProfileModal: document.querySelector("#editProfileModal"),
  closeEditProfileBtn: document.querySelector("#closeEditProfileBtn"),
  cancelEditProfileBtn: document.querySelector("#cancelEditProfileBtn"),
  avatarEditPencilBtn: document.querySelector("#avatarEditPencilBtn"),
  colorWheelCanvas: document.querySelector("#colorWheelCanvas"),
  colorWheelSwatch: document.querySelector("#colorWheelSwatch"),
  colorWheelHex: document.querySelector("#colorWheelHex"),
  achievementsList: document.querySelector("#achievementsList"),
  appTitle: document.querySelector("#appTitle"),
  targetLanguageSelect: document.querySelector("#targetLanguageSelect"),
  practiceView: document.querySelector("#practiceView"),
  storiesView: document.querySelector("#storiesView"),
  profileView: document.querySelector("#profileView"),
  profileLayout: document.querySelector(".profile-layout"),
  publicProfilePage: document.querySelector("#publicProfilePage"),
  bandSelect: document.querySelector("#bandSelect"),
  newParagraphBtn: document.querySelector("#newParagraphBtn"),
  practiceBackBtn: document.querySelector("#practiceBackBtn"),
  practiceClock: document.querySelector("#practiceClock"),
  practiceGateStatus: document.querySelector("#practiceGateStatus"),
  wordCount: document.querySelector("#wordCount"),
  activeBand: document.querySelector("#activeBand"),
  coverage: document.querySelector("#coverage"),
  storyCount: document.querySelector("#storyCount"),
  paragraphTitle: document.querySelector("#paragraphTitle"),
  difficultyLabel: document.querySelector("#difficultyLabel"),
  russianParagraph: document.querySelector("#russianParagraph"),
  englishParagraph: document.querySelector("#englishParagraph"),
  toggleTranslationBtn: document.querySelector("#toggleTranslationBtn"),
  slowAudioBtn: document.querySelector("#slowAudioBtn"),
  pauseAudioBtn: document.querySelector("#pauseAudioBtn"),
  restartAudioBtn: document.querySelector("#restartAudioBtn"),
  storyLevelSelect: document.querySelector("#storyLevelSelect"),
  storySelect: document.querySelector("#storySelect"),
  storyLibraryCount: document.querySelector("#storyLibraryCount"),
  storyTitle: document.querySelector("#storyTitle"),
  storyDifficulty: document.querySelector("#storyDifficulty"),
  storySectionHeading: document.querySelector("#storySectionHeading"),
  storyContent: document.querySelector("#storyContent"),
  storyEnglish: document.querySelector("#storyEnglish"),
  storyImage: document.querySelector("#storyImage"),
  storyImageCaption: document.querySelector("#storyImageCaption"),
  generateStoryImageBtn: document.querySelector("#generateStoryImageBtn"),
  importStoryImageBtn: document.querySelector("#importStoryImageBtn"),
  storyImageFileInput: document.querySelector("#storyImageFileInput"),
  storyImageStatus: document.querySelector("#storyImageStatus"),
  toggleStoryTranslationBtn: document.querySelector("#toggleStoryTranslationBtn"),
  storyPrevPageBtn: document.querySelector("#storyPrevPageBtn"),
  storyNextPageBtn: document.querySelector("#storyNextPageBtn"),
  bookPageIndicator: document.querySelector("#bookPageIndicator"),
  storyAudioBtn: document.querySelector("#storyAudioBtn"),
  pauseStoryAudioBtn: document.querySelector("#pauseStoryAudioBtn"),
  restartStoryAudioBtn: document.querySelector("#restartStoryAudioBtn"),
  recordBtn: document.querySelector("#recordBtn"),
  accuracyScore: document.querySelector("#accuracyScore"),
  matchedWords: document.querySelector("#matchedWords"),
  missedWords: document.querySelector("#missedWords"),
  spokenResult: document.querySelector("#spokenResult"),
  searchInput: document.querySelector("#searchInput"),
  wordList: document.querySelector("#wordList"),
  visibleWordCount: document.querySelector("#visibleWordCount"),
  tooltip: document.querySelector("#tooltip"),
  coinCount: document.querySelector("#coinCount"),
  hamburgerBtn: document.querySelector("#hamburgerBtn"),
  hamburgerMenu: document.querySelector("#hamburgerMenu"),
  closeHamburgerBtn: document.querySelector("#closeHamburgerBtn"),
  openStoreBtn: document.querySelector("#openStoreBtn"),
  openMusicBtn: document.querySelector("#openMusicBtn"),
  openAchievementsBtn: document.querySelector("#openAchievementsBtn"),
  themeSelect: document.querySelector("#themeSelect"),
  
  storeModal: document.querySelector("#storeModal"),
  closeStoreBtn: document.querySelector("#closeStoreBtn"),
  storeGrid: document.querySelector("#storeGrid"),
  watchAdBtn: document.querySelector("#watchAdBtn"),
  
  musicDock: document.querySelector("#musicDock"),
  closeMusicBtn: document.querySelector("#closeMusicBtn"),
  musicDockCloseBtn: document.querySelector("#musicDockCloseBtn"),
  expandMusicBtn: document.querySelector("#expandMusicBtn"),
  musicPlaylistPanel: document.querySelector("#musicPlaylistPanel"),
  spotifyPlaylist: document.querySelector("#spotifyPlaylist"),
  
  // Profile elements moved up to main views

  
  profileAvatar: document.querySelector("#profileAvatar"),
  profilePageAvatar: document.querySelector("#profilePageAvatar"),
  profileDisplayName: document.querySelector("#profileDisplayName"),
  profileDisplayNameSummary: document.querySelector("#profileDisplayNameSummary"),
  profileUsername: document.querySelector("#profileUsername"),
  profileUsernameSummary: document.querySelector("#profileUsernameSummary"),
  profileBioText: document.querySelector("#profileBioText"),
  followersCount: document.querySelector("#followersCount"),
  followingCount: document.querySelector("#followingCount"),
  friendsCount: document.querySelector("#friendsCount"),
  friendsList: document.querySelector("#friendsList"),
  followersList: document.querySelector("#followersList"),
  followingList: document.querySelector("#followingList"),
  friendsSearch: document.querySelector("#friendsSearch"),
  followersSearch: document.querySelector("#followersSearch"),
  followingSearch: document.querySelector("#followingSearch"),
  socialContextMenu: document.querySelector("#socialContextMenu"),
  publicProfileModal: document.querySelector("#publicProfileModal"),
  publicProfileCard: document.querySelector(".public-profile-card"),
  publicProfileName: document.querySelector("#publicProfileName"),
  publicProfileAvatar: document.querySelector("#publicProfileAvatar"),
  publicCharacterCanvas: document.querySelector("#publicCharacterCanvas"),
  publicProfileHandle: document.querySelector("#publicProfileHandle"),
  publicProfileBio: document.querySelector("#publicProfileBio"),
  publicProfileStatus: document.querySelector("#publicProfileStatus"),
  publicFollowersCount: document.querySelector("#publicFollowersCount"),
  publicFollowingCount: document.querySelector("#publicFollowingCount"),
  publicFriendsCount: document.querySelector("#publicFriendsCount"),
  publicFollowersSearch: document.querySelector("#publicFollowersSearch"),
  publicFollowingSearch: document.querySelector("#publicFollowingSearch"),
  publicFriendsSearch: document.querySelector("#publicFriendsSearch"),
  publicFollowersList: document.querySelector("#publicFollowersList"),
  publicFollowingList: document.querySelector("#publicFollowingList"),
  publicFriendsList: document.querySelector("#publicFriendsList"),
  publicAchievementsList: document.querySelector("#publicAchievementsList"),
  publicCollectionGrid: document.querySelector("#publicCollectionGrid"),
  publicAddFriendBtn: document.querySelector("#publicAddFriendBtn"),
  publicSendMessageBtn: document.querySelector("#publicSendMessageBtn"),
  publicBestAccuracy: document.querySelector("#publicBestAccuracy"),
  publicWordsKnown: document.querySelector("#publicWordsKnown"),
  publicStoriesRead: document.querySelector("#publicStoriesRead"),
  publicStreakDays: document.querySelector("#publicStreakDays"),
  publicLevelLabel: document.querySelector("#publicLevelLabel"),
  publicLevelProgressFill: document.querySelector("#publicLevelProgressFill"),
  publicLevelProgressText: document.querySelector("#publicLevelProgressText"),
  publicProfileBackBtn: document.querySelector("#publicProfileBackBtn"),
  closePublicProfileBtn: document.querySelector("#closePublicProfileBtn"),
  profileSettingsBtn: document.querySelector("#profileSettingsBtn"),
  profileSettingsModal: document.querySelector("#profileSettingsModal"),
  closeProfileSettingsBtn: document.querySelector("#closeProfileSettingsBtn"),
  profileAvatarContainer: document.querySelector("#profileAvatarContainer"),
  profilePageAvatarContainer: document.querySelector("#profilePageAvatarContainer"),
  characterGuideToggle: document.querySelector("#characterGuideToggle"),
  clippyGuide: document.querySelector("#clippyGuide"),
  clippyAvatar: document.querySelector("#clippyAvatar"),
  clippyMessage: document.querySelector("#clippyMessage"),
  profileSettingsStatus: document.querySelector("#profileSettingsStatus"),
  settingShowFollowers: document.querySelector("#settingShowFollowers"),
  settingShowFollowing: document.querySelector("#settingShowFollowing"),
  settingShowFriends: document.querySelector("#settingShowFriends"),
  settingCompactProfile: document.querySelector("#settingCompactProfile"),
  settingReduceMotion: document.querySelector("#settingReduceMotion"),
  settingMuteAssistant: document.querySelector("#settingMuteAssistant"),
  settingAudioRate: document.querySelector("#settingAudioRate"),
  settingAudioRateValue: document.querySelector("#settingAudioRateValue"),
  settingNotifyMessages: document.querySelector("#settingNotifyMessages"),
  settingNotifyAchievements: document.querySelector("#settingNotifyAchievements"),
  settingProfileTheme: document.querySelector("#settingProfileTheme"),
  settingAutoMatchChatLanguage: document.querySelector("#settingAutoMatchChatLanguage"),
  settingAutoTranslate: document.querySelector("#settingAutoTranslate"),
  settingAllowFriendRequests: document.querySelector("#settingAllowFriendRequests"),
  settingFilterMessages: document.querySelector("#settingFilterMessages"),
  settingResetLocalUiBtn: document.querySelector("#settingResetLocalUiBtn"),
  editProfileBtn: document.querySelector("#editProfileBtn"),
  profileEditPanel: document.querySelector("#profileEditPanel"),
  mascotGrid: document.querySelector("#mascotGrid"),
  levelLabel: document.querySelector("#levelLabel"),
  levelProgressFill: document.querySelector("#levelProgressFill"),
  levelProgressText: document.querySelector("#levelProgressText"),
  profileBestAccuracy: document.querySelector("#profileBestAccuracy"),
  profileLastAccuracy: document.querySelector("#profileLastAccuracy"),
  profileWordsMatched: document.querySelector("#profileWordsMatched"),
  profileMismatchedWords: document.querySelector("#profileMismatchedWords"),
  editAvatarBtn: document.querySelector("#editAvatarBtn"),
  editDisplayName: document.querySelector("#editDisplayName"),
  editUsername: document.querySelector("#editUsername"),
  editBio: document.querySelector("#editBio"),
  bioCount: document.querySelector("#bioCount"),
  usernameRuleText: document.querySelector("#usernameRuleText"),
  profileSaveStatus: document.querySelector("#profileSaveStatus"),
  saveProfileBtn: document.querySelector("#saveProfileBtn"),
  hairSelect: document.querySelector("#hairSelect"),
  eyeShapeSelect: document.querySelector("#eyeShapeSelect"),
  noseSelect: document.querySelector("#noseSelect"),
  mouthSelect: document.querySelector("#mouthSelect"),
  armSelect: document.querySelector("#armSelect"),
  legSelect: document.querySelector("#legSelect"),
  shirtSelect: document.querySelector("#shirtSelect"),
  pantsSelect: document.querySelector("#pantsSelect"),
  shoesSelect: document.querySelector("#shoesSelect"),
  hairColor: document.querySelector("#hairColor"),
  eyeColor: document.querySelector("#eyeColor"),
  faceColor: document.querySelector("#faceColor"),
  shirtColor: document.querySelector("#shirtColor"),
  pantsColor: document.querySelector("#pantsColor"),
  shoesColor: document.querySelector("#shoesColor"),
  characterCanvas: document.querySelector("#characterCanvas"),
  characterFallback: document.querySelector("#characterFallback"),
  characterAutoRotateBtn: document.querySelector("#characterAutoRotateBtn"),
  collectionGrid: document.querySelector("#collectionGrid"),
  collectItemBtn: document.querySelector("#collectItemBtn"),
  clearCollectionBtn: document.querySelector("#clearCollectionBtn"),
  collectionStatus: document.querySelector("#collectionStatus"),
  
  twitchChat: document.querySelector("#twitchChat"),
  twitchMessages: document.querySelector("#twitchMessages"),
  globalChatInput: document.querySelector("#globalChatInput"),
  globalChatSendBtn: document.querySelector("#globalChatSendBtn"),
  closeTwitchBtn: document.querySelector("#closeTwitchBtn"),
  toggleTwitchBtn: document.querySelector("#toggleTwitchBtn"),
  
  dmWidget: document.querySelector("#dmWidget"),
  dmList: document.querySelector("#dmList"),
  closeDMBtn: document.querySelector("#closeDMBtn"),
  toggleDMBtn: document.querySelector("#toggleDMBtn"),
  
  toggleSlotsBtn: document.querySelector("#toggleSlotsBtn"),
  openSlotsBtn: document.querySelector("#openSlotsBtn"),
  
  chatbotWidget: document.querySelector("#chatbotWidget"),
  chatToggleBtn: document.querySelector("#chatToggleBtn"),
  chatWindow: document.querySelector("#chatWindow"),
  closeChatBtn: document.querySelector("#closeChatBtn"),
  chatMessages: document.querySelector("#chatMessages"),
  chatInput: document.querySelector("#chatInput"),
  chatSendBtn: document.querySelector("#chatSendBtn"),
  chatLanguageSelect: document.querySelector("#chatLanguageSelect"),
  chatWelcomeMsg: document.querySelector("#chatWelcomeMsg"),
  uploadScreenshotBtn: document.querySelector("#uploadScreenshotBtn"),
  uploadVideoBtn: document.querySelector("#uploadVideoBtn"),
  uploadVoiceBtn: document.querySelector("#uploadVoiceBtn"),
  uploadTranscribeBtn: document.querySelector("#uploadTranscribeBtn"),
  chatImageInput: document.querySelector("#chatImageInput"),
  chatVideoInput: document.querySelector("#chatVideoInput"),
  chatAudioInput: document.querySelector("#chatAudioInput"),
  
  slotsWidget: document.querySelector("#slotsWidget"),
  slotsCloseBtn: document.querySelector("#slotsCloseBtn"),
  spinBtn: document.querySelector("#spinBtn"),
  slotsDisplay: document.querySelector("#slotsDisplay"),
  slotLever: document.querySelector("#slotLever"),
  autoSpinCheck: document.querySelector("#autoSpinCheck"),
  slotBetSelect: document.querySelector("#slotBetSelect"),
  slotReelSelect: document.querySelector("#slotReelSelect"),
  playbackSpeed: document.querySelector("#playbackSpeed"),
  speedLabel: document.querySelector("#speedLabel"),
  playbackSpeedStories: document.querySelector("#playbackSpeedStories"),
  speedLabelStories: document.querySelector("#speedLabelStories"),
  slotResultOverlay: document.querySelector("#slotResultOverlay"),
  
  currentSongTitle: document.querySelector("#currentSongTitle"),
  songArtwork: document.querySelector("#songArtwork"),
  songStatus: document.querySelector("#songStatus"),
  playSongBtn: document.querySelector("#playSongBtn"),
  prevSongBtn: document.querySelector("#prevSongBtn"),
  nextSongBtn: document.querySelector("#nextSongBtn"),
  profileBtn: document.querySelector("#profileBtn"),
  profileBackBtn: document.querySelector("#profileBackBtn"),
  profileCloseBtn: document.querySelector("#profileCloseBtn"),
  editAvatarBtn: document.querySelector("#editAvatarBtn"),
  userName: document.querySelector("#userName")
};

function parseWords(raw) {
  const seen = new Set();
  return raw.trim().split("\n").map((line) => {
    const [rank, word, translation, partOfSpeech = ""] = line.split("\t");
    return { rank: Number(rank), word, translation, partOfSpeech };
  }).filter((item) => {
    const key = normalizeWord(item.word);
    if (!item.word || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseImportedRows(rows) {
  return rows.map((row, index) => {
    if (Array.isArray(row)) {
      return {
        rank: index + 1,
        word: String(row[0] || "").replace(/\s*\(see #[^)]+\)/gi, "").trim(),
        translation: cleanTranslation(row[1]),
        partOfSpeech: String(row[2] || "")
      };
    }
    return {
      rank: Number(row.rank || index + 1),
      word: String(row.word || "").replace(/\s*\(see #[^)]+\)/gi, "").trim(),
      translation: cleanTranslation(row.translation || row.english),
      partOfSpeech: String(row.partOfSpeech || row.part_of_speech || "")
    };
  }).filter((item) => item.word && item.translation);
}

function cleanTranslation(value) {
  return String(value || "")
    .replace(/;?\s*masterrussian,?\s*dot\s*com/gi, "")
    .replace(/\s*\(see #[^)]+\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadFullRussianWords() {
  if (appState.targetLanguage !== "russian") return;
  try {
    const response = await fetch(fullRussianWordListUrl, { cache: "force-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    const words = parseImportedRows(rows).slice(0, 1000);
    if (words.length < 900) throw new Error("Dataset was smaller than expected.");
    appState.words = words;
    renderStats();
    renderParagraph();
    renderStory();
    renderWordList();
  } catch (error) {
    if (els.importStatus) els.importStatus.textContent = "Using bundled offline starter list. Full 1000-word list loads when the browser can reach GitHub.";
  }
}

function switchTargetLanguage(language) {
  const dataset = languageDatasets[language] || languageDatasets.russian;
  appState.targetLanguage = languageDatasets[language] ? language : "russian";
  localStorage.setItem("nova_target_language", appState.targetLanguage);
  appState.words = dataset.words();
  activeParagraphs = dataset.paragraphs;
  storyLibrary = dataset.stories;
  appState.practiceIndex = 0;
  appState.practiceUnlocked = false;
  appState.currentParagraph = activeParagraphs[0];
  appState.currentStory = storyLibrary[0];
  appState.currentStorySectionIndex = 0;
  appState.learnedWords = JSON.parse(localStorage.getItem(`nova_learned_words_${appState.targetLanguage}`) || "[]");
  if (els.targetLanguageSelect) els.targetLanguageSelect.value = appState.targetLanguage;
  if (appState.settings?.autoMatchChatLanguage && els.chatLanguageSelect && chatLanguages?.[appState.targetLanguage]) {
    els.chatLanguageSelect.value = appState.targetLanguage;
    updateChatIntro();
  }
  if (els.appTitle) els.appTitle.textContent = dataset.title;
  const writing = getLanguageWritingMeta();
  els.russianParagraph?.setAttribute("lang", writing.lang);
  els.storyContent?.setAttribute("lang", writing.lang);
  els.storyContent?.setAttribute("dir", writing.dir);
  setupSpeechRecognition();
  renderStoryOptions();
  renderStats();
  renderParagraph();
  renderStory();
  renderWordList();
  renderThemes();
  renderAchievements();
  activeSongIndex = 0;
  renderSpotifyPlaylist();
  updatePlayerUI();
}

function normalizeWord(word) {
  return word.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/[^\p{Letter}-]/gu, "");
}

function getWordMap() {
  const map = new Map();
  appState.words.forEach((item) => map.set(normalizeWord(item.word), item));
  Object.entries(fallbackTranslations).forEach(([word, translation]) => {
    const key = normalizeWord(word);
    if (!map.has(key)) map.set(key, { rank: "form", word, translation, partOfSpeech: "form" });
  });
  return map;
}

function markTextAsLearned(text) {
  const wordMap = getWordMap();
  const existing = new Set(appState.learnedWords.map((item) => normalizeWord(item.word)));
  const learned = [...appState.learnedWords];
  (text.match(/[\p{Letter}-]+/gu) || []).forEach((word) => {
    const key = normalizeWord(word);
    if (!key || existing.has(key)) return;
    const item = wordMap.get(key) || { rank: "new", word, translation: fallbackTranslations[key] || "[Translation unavailable]" };
    learned.push({ rank: item.rank, word: item.word, translation: item.translation });
    existing.add(key);
  });
  appState.learnedWords = learned.slice(-1000);
  localStorage.setItem(`nova_learned_words_${appState.targetLanguage}`, JSON.stringify(appState.learnedWords));
}

function renderTokenizedText(container, text, startIndex = 0) {
  const wordMap = getWordMap();
  const tokens = text.match(/[\p{Letter}-]+|[^\p{Letter}-]+/gu) || [];
  let currentPos = startIndex;
  
  container.replaceChildren(...tokens.map((token) => {
    const isWord = /[\p{Letter}-]+/u.test(token);
    const start = currentPos;
    currentPos += token.length;
    
    if (!isWord) return document.createTextNode(token);
    
    const key = normalizeWord(token);
    const span = document.createElement("span");
    span.className = "word-token";
    span.tabIndex = 0;
    span.textContent = token;
    span.dataset.charIndex = start;
    
    if (key && wordMap.has(key)) {
      span.dataset.word = wordMap.get(key).word;
      span.dataset.translation = wordMap.get(key).translation;
      span.dataset.rank = wordMap.get(key).rank;
    } else if (key && fallbackTranslations[key]) {
      span.dataset.word = token;
      span.dataset.translation = fallbackTranslations[key];
      span.dataset.rank = "fallback";
    } else {
      span.dataset.word = token;
      span.dataset.translation = "[Translation unavailable]";
      span.dataset.rank = "unknown";
    }
    return span;
  }));
}

function updateCoverage(text) {
  const wordMap = getWordMap();
  const wordTokens = text.match(/[\p{Letter}-]+/gu) || [];
  const covered = wordTokens.filter((word) => wordMap.has(normalizeWord(word))).length;
  els.coverage.textContent = `${Math.round((covered / Math.max(wordTokens.length, 1)) * 100)}%`;
}

function getLanguageWritingMeta(language = appState.targetLanguage) {
  return {
    russian: { lang: "ru", dir: "ltr" },
    japanese: { lang: "ja", dir: "ltr" },
    mandarin: { lang: "zh", dir: "ltr" },
    hindi: { lang: "hi", dir: "ltr" },
    arabic: { lang: "ar", dir: "rtl" }
  }[language] || { lang: "ru", dir: "ltr" };
}

function renderParagraph() {
  const paragraph = appState.currentParagraph;
  const writing = getLanguageWritingMeta();
  els.paragraphTitle.textContent = paragraph.title;
  els.difficultyLabel.textContent = paragraph.difficulty;
  els.englishParagraph.textContent = paragraph.en;
  els.englishParagraph.hidden = true;
  els.toggleTranslationBtn.textContent = "Translate paragraph";
  els.russianParagraph.lang = writing.lang;
  els.russianParagraph.dir = writing.dir;
  renderTokenizedText(els.russianParagraph, paragraph.ru);
  markTextAsLearned(paragraph.ru);
  if (appState.activeView === "practice") updateCoverage(paragraph.ru);
  updatePracticeControls();
}

function updatePracticeClock() {
  if (!els.practiceClock) return;
  els.practiceClock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function updatePracticeControls() {
  if (els.practiceBackBtn) els.practiceBackBtn.disabled = appState.practiceIndex <= 0;
  if (els.newParagraphBtn) els.newParagraphBtn.disabled = !appState.practiceUnlocked;
  if (els.practiceGateStatus) {
    els.practiceGateStatus.textContent = appState.practiceUnlocked ? "Next unlocked" : "Score 70% to unlock Next";
  }
  updatePracticeClock();
}

setInterval(updatePracticeClock, 30000);

function setPracticeParagraph(index) {
  const nextIndex = Math.max(0, Math.min(index, activeParagraphs.length - 1));
  appState.practiceIndex = nextIndex;
  appState.currentParagraph = activeParagraphs[nextIndex] || activeParagraphs[0];
  appState.practiceUnlocked = false;
  resetSpeech();
  renderParagraph();
}

function getStoryText(story) {
  return story.sections.map((section) => section.ru).join("\n\n");
}

function getStoryEnglish(story) {
  return story.sections.map((section) => section.en).join("\n\n");
}

function storyImagePrompt(story) {
  const section = story.sections[appState.currentStorySectionIndex || 0];
  const pageText = section?.en || "";
  const language = languageDatasets[appState.targetLanguage]?.label || "language";
  return [
    `Create a polished editorial storybook illustration for a ${language} language learning story page.`,
    `Story title: ${story.title}.`,
    `Page/Chapter: ${section?.heading || ""}.`,
    `Scene description: ${pageText}`,
    "Composition: one clear narrative scene, no text, no letters, no captions, no watermark.",
    "Style: Vibrant cartoon style, high-quality digital 2D animation aesthetic, soft cel-shading, bold colors, friendly and expressive characters, inviting learning-app tone."
  ].join(" ");
}

function storyHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getStoryPageKey(story = appState.currentStory, sectionIndex = appState.currentStorySectionIndex || 0) {
  return `${appState.targetLanguage}:${story?.id || "story"}:${sectionIndex}`;
}

function getUnlockedTiers() {
  const tasks = Number(appState.profile?.storyProgress?.completedTasks || 0);
  return Object.entries(tierUnlockRules)
    .filter(([, rule]) => tasks >= rule.tasks)
    .map(([tier]) => tier);
}

function getStoryTreasure(story = appState.currentStory, sectionIndex = appState.currentStorySectionIndex || 0) {
  if (!story) return null;
  const seed = storyHash(`${appState.targetLanguage}:${story.id}:${sectionIndex}`);
  const candidates = ["standard", "standard", "standard", "rare", "legendary", "god"];
  const desiredTier = candidates[seed % candidates.length];
  const unlocked = getUnlockedTiers();
  const tier = unlocked.includes(desiredTier) ? desiredTier : "standard";
  const config = tierConfig[tier];
  return {
    id: getStoryPageKey(story, sectionIndex),
    tier,
    name: config.items[seed % config.items.length],
    source: `${story.title} - ${story.sections[sectionIndex]?.heading || `Page ${sectionIndex + 1}`}`,
    hiddenIn: seed % 2 === 0 ? "image" : "page"
  };
}

function hasStoryTreasure(treasure) {
  return Boolean(treasure && appState.profile.collection.some((item) => item?.id === treasure.id));
}

function completeCurrentStoryTask() {
  const story = appState.currentStory;
  if (!story) return;
  const key = getStoryPageKey(story);
  const progress = appState.profile.storyProgress || { completedTasks: 0, completedPages: [], claimedTreasures: [] };
  if (!progress.completedPages.includes(key)) {
    progress.completedPages.push(key);
    progress.completedTasks = Number(progress.completedTasks || 0) + 1;
    appState.profile.storyProgress = progress;
    saveProfile();
  }
}

function claimCurrentStoryTreasure() {
  const treasure = getStoryTreasure();
  if (!treasure) return;
  const rule = tierUnlockRules[treasure.tier];
  const tasks = Number(appState.profile.storyProgress?.completedTasks || 0);
  if (tasks < rule.tasks) {
    if (els.storyImageStatus) els.storyImageStatus.textContent = `${tierConfig[treasure.tier].label} treasure locked: ${rule.label}.`;
    return;
  }
  if (hasStoryTreasure(treasure)) {
    if (els.storyImageStatus) els.storyImageStatus.textContent = `${treasure.name} already collected from this page.`;
    return;
  }
  if (appState.profile.collection.length >= 16) {
    if (els.storyImageStatus) els.storyImageStatus.textContent = "Your 4 x 4 collection grid is full.";
    return;
  }
  appState.profile.collection.push({ ...treasure, collectedAt: Date.now() });
  appState.profile.storyProgress.claimedTreasures = Array.from(new Set([...(appState.profile.storyProgress.claimedTreasures || []), treasure.id]));
  saveProfile();
  renderCollection();
  if (els.storyImageStatus) els.storyImageStatus.textContent = `Collected ${tierConfig[treasure.tier].label}: ${treasure.name}.`;
}

function renderStoryTreasure(story) {
  const treasure = getStoryTreasure(story);
  const old = document.querySelector(".story-treasure-card");
  old?.remove();
  if (!treasure || !els.storyContent) return;
  const tasks = Number(appState.profile.storyProgress?.completedTasks || 0);
  const rule = tierUnlockRules[treasure.tier];
  const claimed = hasStoryTreasure(treasure);
  const locked = tasks < rule.tasks;
  if (claimed) return;
  const card = document.createElement("button");
  card.type = "button";
  card.className = `story-treasure-card ${treasure.tier}${locked ? " is-locked" : ""}`;
  card.innerHTML = `
    <span>${locked ? "Locked" : claimed ? "Collected" : "Hidden item"}</span>
    <strong>${treasure.name}</strong>
    <small>${tierConfig[treasure.tier].label} - ${locked ? rule.label : treasure.hiddenIn === "image" ? "Found in the image" : "Found on this page"}</small>
  `;
  card.addEventListener("click", () => {
    completeCurrentStoryTask();
    claimCurrentStoryTreasure();
    card.remove();
  });
  if (treasure.hiddenIn === "image" && els.storyImage?.parentElement) {
    els.storyImage.parentElement.append(card);
  } else {
    els.storyContent.append(card);
  }
}

function fallbackStoryImage(story) {
  const visualThemes = {
    russian: { palette: ["#0f766e", "#fef3c7", "#f97316", "#134e4a"], motif: '<rect x="305" y="612" width="290" height="235" rx="18" fill="#fff7ed" opacity="0.96"/><path d="M450 530 C515 530 570 585 570 650 L330 650 C330 585 385 530 450 530 Z" fill="#f97316"/>' },
    japanese: { palette: ["#be123c", "#fff1f2", "#fb7185", "#7f1d1d"], motif: '<path d="M260 612 h380 v40 h-380z" fill="#7f1d1d"/><path d="M310 652 h42 v210 h-42zM548 652 h42 v210 h-42z" fill="#991b1b"/><path d="M352 725 h196 v32 h-196z" fill="#fecdd3"/>' },
    mandarin: { palette: ["#b91c1c", "#fef3c7", "#f59e0b", "#7f1d1d"], motif: '<path d="M270 650 Q450 530 630 650 Z" fill="#f59e0b"/><rect x="315" y="650" width="270" height="170" rx="14" fill="#fee2e2"/><path d="M330 700 h240" stroke="#b91c1c" stroke-width="18"/>' },
    arabic: { palette: ["#0f766e", "#ecfdf5", "#d97706", "#064e3b"], motif: '<path d="M300 820 V650 Q450 500 600 650 V820 Z" fill="#fef3c7"/><path d="M372 820 V710 Q450 635 528 710 V820 Z" fill="#0f766e" opacity="0.86"/>' },
    hindi: { palette: ["#c2410c", "#fff7ed", "#16a34a", "#7c2d12"], motif: '<rect x="300" y="690" width="300" height="142" rx="12" fill="#ffedd5"/><path d="M330 690 Q450 540 570 690 Z" fill="#fb923c"/><circle cx="450" cy="618" r="38" fill="#16a34a"/>' }
  };
  const theme = visualThemes[appState.targetLanguage] || visualThemes.russian;
  const palettes = [
    theme.palette,
    ["#2563eb", "#dbeafe", "#7c3aed", "#1e3a8a"],
    ["#166534", "#dcfce7", "#0ea5e9", "#14532d"],
    ["#4338ca", "#ede9fe", "#14b8a6", "#312e81"]
  ];
  const palette = palettes[storyHash(story.id) % palettes.length];
  const motif = theme.motif;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1125" role="img">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${palette[1]}"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
        <linearGradient id="scene" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${palette[0]}"/>
          <stop offset="1" stop-color="${palette[3]}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1125" fill="url(#bg)"/>
      <circle cx="720" cy="180" r="94" fill="${palette[2]}" opacity="0.88"/>
      <path d="M0 790 C180 670 310 745 470 650 C650 545 760 590 900 500 L900 1125 L0 1125 Z" fill="url(#scene)"/>
      <path d="M122 680 L222 515 L322 680 Z" fill="#ffffff" opacity="0.88"/>
      <path d="M545 682 L662 486 L780 682 Z" fill="#ffffff" opacity="0.78"/>
      ${motif}
      <circle cx="360" cy="705" r="24" fill="#ffffff" opacity="0.82"/>
      <circle cx="540" cy="705" r="24" fill="#ffffff" opacity="0.82"/>
      <circle cx="450" cy="468" r="62" fill="#fde68a"/>
      <path d="M250 915 C360 870 515 870 650 920" fill="none" stroke="#ffffff" stroke-width="24" stroke-linecap="round" opacity="0.72"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderStoryVisual(story) {
  if (!els.storyImage) return;
  const section = story.sections[appState.currentStorySectionIndex || 0];
  const sectionImage = section?.image;
  const explicitImage = sectionImage || story.image || story.sections.find((sec) => sec.image)?.image;
  const storedImage = localStorage.getItem(`story-image:${story.id}_${appState.currentStorySectionIndex || 0}`) || localStorage.getItem(`story-image:${story.id}`);
  els.storyImage.src = storedImage || resolveMediaUrl(explicitImage) || fallbackStoryImage(story);
  els.storyImage.alt = `Illustration for ${story.title} - ${section?.heading || ""}`;
  if (els.storyImageCaption) els.storyImageCaption.textContent = `${story.title} - ${section?.heading || ""}`;
  if (storedImage) {
    if (els.storyImageStatus) els.storyImageStatus.textContent = "Imported image saved in this browser.";
  } else if (explicitImage) {
    if (els.storyImageStatus) els.storyImageStatus.textContent = "Image ready.";
  } else if (location.protocol === "file:") {
    if (els.storyImageStatus) els.storyImageStatus.textContent = "Generated preview.";
  } else {
    if (els.storyImageStatus) els.storyImageStatus.textContent = "Generated preview.";
  }
}

async function generateStoryImage() {
  const story = appState.currentStory;
  const sectionIndex = appState.currentStorySectionIndex || 0;
  if (location.protocol === "file:") {
    els.storyImageStatus.textContent = "ChatGPT generation needs the local server. Open http://127.0.0.1:9876, or import an image here.";
    return;
  }
  els.generateStoryImageBtn.disabled = true;
  els.storyImageStatus.textContent = "Generating image with ChatGPT...";
  try {
    const response = await fetch("/api/story-image", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: `${story.id}-${sectionIndex}`,
        title: story.title,
        difficulty: story.difficulty,
        prompt: storyImagePrompt(story),
        language: appState.targetLanguage
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Image generation failed.");
    story.sections[sectionIndex].image = `${result.url}?v=${Date.now()}`;
    renderStoryVisual(story);
    els.storyImageStatus.textContent = "ChatGPT image saved for this page.";
  } catch (error) {
    els.storyImageStatus.textContent = error.message;
  } finally {
    els.generateStoryImageBtn.disabled = false;
  }
}

function importStoryImage() {
  els.storyImageFileInput.click();
}

function saveImportedStoryImage() {
  const file = els.storyImageFileInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    els.storyImageStatus.textContent = "Choose an image file.";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      localStorage.setItem(`story-image:${appState.currentStory.id}_${appState.currentStorySectionIndex || 0}`, String(reader.result));
      renderStoryVisual(appState.currentStory);
    } catch {
      els.storyImageStatus.textContent = "The image is too large to save in this browser. Try a smaller WebP or JPEG.";
    }
  };
  reader.onerror = () => {
    els.storyImageStatus.textContent = "Could not import that image.";
  };
  reader.readAsDataURL(file);
}

function renderStoryOptions() {
  const level = els.storyLevelSelect.value;
  const stories = storyLibrary.filter((story) => story.level === level);
  els.storyLibraryCount.textContent = `${stories.length} in level`;
  els.storySelect.replaceChildren(...stories.map((story) => {
    const option = document.createElement("option");
    option.value = story.id;
    option.textContent = story.title;
    return option;
  }));

  if (!stories.some((story) => story.id === appState.currentStory.id)) {
    appState.currentStory = stories[0] || storyLibrary[0];
  }
  els.storySelect.value = appState.currentStory.id;
}

function renderStory() {
  const story = appState.currentStory;
  if (!story) return;

  // Enforce valid section index
  if (appState.currentStorySectionIndex === undefined || appState.currentStorySectionIndex === null || appState.currentStorySectionIndex >= story.sections.length) {
    appState.currentStorySectionIndex = 0;
  }

  const section = story.sections[appState.currentStorySectionIndex];
  const writing = getLanguageWritingMeta();

  els.storyTitle.textContent = story.title;
  els.storyDifficulty.textContent = story.difficulty;

  if (els.storySectionHeading) {
    els.storySectionHeading.textContent = section.heading || `Page ${appState.currentStorySectionIndex + 1}`;
  }

  // Render Russian text on the current page
  els.storyContent.replaceChildren();
  els.storyContent.lang = writing.lang;
  els.storyContent.dir = writing.dir;
  const paragraph = document.createElement("p");
  paragraph.lang = writing.lang;
  paragraph.dir = writing.dir;
  renderTokenizedText(paragraph, section.ru, 0); // Tokenizer starts at 0 for this page
  els.storyContent.append(paragraph);

  // Render English text on the current page
  els.storyEnglish.replaceChildren();
  els.storyEnglish.hidden = !appState.settings?.autoTranslate;
  els.toggleStoryTranslationBtn.textContent = appState.settings?.autoTranslate ? "Hide translation" : "Translate story";

  const englishParagraph = document.createElement("p");
  englishParagraph.textContent = section.en;
  els.storyEnglish.append(englishParagraph);

  // Update Book Image
  renderStoryVisual(story);

  // Page Indicator
  if (els.bookPageIndicator) {
    els.bookPageIndicator.textContent = `Page ${appState.currentStorySectionIndex + 1} of ${story.sections.length}`;
  }

  // Enable/disable page turning buttons
  if (els.storyPrevPageBtn) {
    els.storyPrevPageBtn.disabled = appState.currentStorySectionIndex === 0;
  }
  if (els.storyNextPageBtn) {
    els.storyNextPageBtn.disabled = appState.currentStorySectionIndex === story.sections.length - 1;
  }

  if (appState.activeView === "stories") {
    markTextAsLearned(section.ru);
    updateCoverage(section.ru);
    completeCurrentStoryTask();
  }
  renderStoryTreasure(story);
}

function selectStoryLevel() {
  appState.currentStorySectionIndex = 0;
  renderStoryOptions();
  renderStory();
  resetSpeech();
  renderStats();
  renderWordList();
}

function selectStory() {
  const selected = storyLibrary.find((story) => story.id === els.storySelect.value);
  if (selected) appState.currentStory = selected;
  appState.currentStorySectionIndex = 0;
  renderStory();
  renderStats();
  renderWordList();
  resetSpeech();
}

function switchView(view) {
  appState.activeView = view;
  const isStories = view === "stories";
  const isProfile = view === "profile";
  if (isProfile) {
    if (els.profileLayout) els.profileLayout.hidden = false;
    if (els.publicProfilePage) els.publicProfilePage.hidden = true;
  }
  
  if (els.practiceView) els.practiceView.hidden = isStories || isProfile;
  if (els.storiesView) els.storiesView.hidden = view !== "stories";
  if (els.profileView) els.profileView.hidden = view !== "profile";
  
  if (els.practiceTab) els.practiceTab.classList.toggle("is-active", view === "practice");
  if (els.storiesTab) els.storiesTab.classList.toggle("is-active", view === "stories");
  if (els.profileTab) els.profileTab.classList.toggle("is-active", view === "profile");
  
  document.body.classList.toggle("stories-mode", isStories);
  document.body.classList.toggle("profile-mode", isProfile);
  
  if (view === "profile") renderProfile();
  if (view === "stories") {
    const currentSection = appState.currentStory?.sections?.[appState.currentStorySectionIndex || 0];
    if (currentSection) markTextAsLearned(currentSection.ru);
  }
  if (els.bandSelect) els.bandSelect.closest(".select-wrap").hidden = isStories || isProfile;
  if (els.newParagraphBtn) els.newParagraphBtn.hidden = isStories || isProfile;
  if (els.practiceBackBtn) els.practiceBackBtn.hidden = isStories || isProfile;
  if (!isProfile) {
    const text = isStories 
      ? (appState.currentStory?.sections?.[appState.currentStorySectionIndex || 0]?.ru || "") 
      : appState.currentParagraph.ru;
    updateCoverage(text);
  }
  renderStats();
  renderWordList();
  resetSpeech();
  updatePracticeControls();
}

function renderStats() {
  const band = appState.activeView === "stories" ? appState.currentStory.band : Number(els.bandSelect.value);
  const labels = { 1: "1-100", 2: "101-250", 3: "251-500", 4: "501-1000" };
  els.wordCount.textContent = appState.words.length.toLocaleString();
  els.activeBand.textContent = labels[band];
  if (els.storyCount) els.storyCount.textContent = storyLibrary.length.toLocaleString();
}

function renderWordList() {
  const query = normalizeWord(els.searchInput.value.trim());
  const visible = appState.learnedWords.filter((item) => {
    const matches = !query || normalizeWord(item.word).includes(query) || item.translation.toLowerCase().includes(query);
    return matches;
  }).slice(-120).reverse();

  els.visibleWordCount.textContent = visible.length;
  els.wordList.replaceChildren(...visible.map((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="rank">#${item.rank}</span><span><strong>${item.word}</strong><span>${item.translation}</span></span>`;
    return li;
  }));
  if (!visible.length) {
    const li = document.createElement("li");
    li.className = "empty-word-row";
    li.textContent = "Read a paragraph or story to add learned words here.";
    els.wordList.append(li);
  }
}

function getPracticeChoices() {
  const band = Number(els.bandSelect.value);
  return activeParagraphs.filter((item) => item.band === band);
}

function pickParagraph(direction = 1) {
  const choices = getPracticeChoices();
  if (!choices.length) return;
  if (direction > 0 && !appState.practiceUnlocked) {
    if (els.practiceGateStatus) els.practiceGateStatus.textContent = "Read aloud and score 70% first";
    return;
  }
  const currentIndex = choices.indexOf(appState.currentParagraph);
  const baseIndex = currentIndex >= 0 ? currentIndex : appState.practiceIndex;
  appState.practiceIndex = Math.max(0, Math.min(baseIndex + direction, choices.length - 1));
  appState.currentParagraph = choices[appState.practiceIndex] || choices[0];
  appState.practiceUnlocked = false;
  resetSpeech();
  renderParagraph();
  renderStats();
  renderWordList();
}

function toggleTranslation() {
  els.englishParagraph.hidden = !els.englishParagraph.hidden;
  els.toggleTranslationBtn.textContent = els.englishParagraph.hidden ? "Translate paragraph" : "Hide translation";
}

function toggleStoryTranslation() {
  els.storyEnglish.hidden = !els.storyEnglish.hidden;
  els.toggleStoryTranslationBtn.textContent = els.storyEnglish.hidden ? "Translate story" : "Hide translation";
}

function getCurrentReadingText() {
  if (appState.activeView === "stories") {
    return appState.currentStory?.sections?.[appState.currentStorySectionIndex || 0]?.ru || "";
  }
  return appState.currentParagraph?.ru || "";
}

function getCurrentReadingContainer() {
  return appState.activeView === "stories" ? els.storyContent : els.russianParagraph;
}

function speakSlowRussian(startCharIndex = 0) {
  if (!("speechSynthesis" in window)) {
    if (els.spokenResult) els.spokenResult.textContent = "Audio playback is not available in this browser.";
    return;
  }
  window.speechSynthesis.cancel();
  
  const isStories = appState.activeView === "stories";
  const text = getCurrentReadingText();
  if (!text.trim()) return;
  const rate = Number((isStories ? els.playbackSpeedStories : els.playbackSpeed).value);
  const resumeAt = Math.max(0, Math.min(startCharIndex, Math.max(0, text.length - 1)));
  const speakText = text.slice(resumeAt).replace(/^\s+/, "");
  const leadingTrim = text.slice(resumeAt).length - speakText.length;
  const absoluteOffset = resumeAt + leadingTrim;
  
  const utterance = new SpeechSynthesisUtterance(speakText);
  utterance.lang = languageDatasets[appState.targetLanguage]?.speechLang || "ru-RU";
  utterance.rate = rate;
  
  const tokens = getCurrentReadingContainer().querySelectorAll(".word-token");
  activeSpeech = {
    text,
    view: appState.activeView,
    language: appState.targetLanguage,
    charIndex: absoluteOffset,
    requestedCancel: false,
    paused: false
  };
  updateReadingAudioControls();
  
  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      const charIndex = absoluteOffset + event.charIndex;
      if (activeSpeech) activeSpeech.charIndex = charIndex;
      let currentToken = null;
      let minDiff = Infinity;
      
      tokens.forEach(token => {
        token.classList.remove("word-highlight");
        const tokenIndex = parseInt(token.dataset.charIndex);
        if (charIndex >= tokenIndex && (charIndex - tokenIndex) < minDiff) {
          minDiff = charIndex - tokenIndex;
          currentToken = token;
        }
      });
      
      if (currentToken) currentToken.classList.add("word-highlight");
    }
  };
  
  utterance.onend = () => {
    tokens.forEach(t => t.classList.remove("word-highlight"));
    if (activeSpeech && !activeSpeech.requestedCancel) activeSpeech = null;
    updateReadingAudioControls();
  };
  utterance.onerror = () => {
    if (els.spokenResult) els.spokenResult.textContent = "Audio playback could not start. Try clicking Play Audio again.";
    activeSpeech = null;
    updateReadingAudioControls();
  };
  
  window.speechSynthesis.speak(utterance);
  updateReadingAudioControls();
}

function updateReadingAudioControls() {
  const isPaused = Boolean(window.speechSynthesis?.paused || activeSpeech?.paused);
  [els.pauseAudioBtn, els.pauseStoryAudioBtn].forEach((button) => {
    if (button) button.textContent = isPaused ? "Resume" : "Pause";
  });
}

function toggleReadingAudioPause() {
  if (!("speechSynthesis" in window)) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    if (activeSpeech) activeSpeech.paused = false;
  } else if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    if (activeSpeech) activeSpeech.paused = true;
  }
  updateReadingAudioControls();
}

function restartReadingAudio() {
  if (!("speechSynthesis" in window)) return;
  clearTimeout(speechRestartTimer);
  if (activeSpeech) activeSpeech.requestedCancel = true;
  window.speechSynthesis.cancel();
  activeSpeech = null;
  updateReadingAudioControls();
  speechRestartTimer = setTimeout(() => speakSlowRussian(0), 80);
}

function handleSpeedChange(e, label) {
  const val = Number(e.target.value).toFixed(1);
  label.textContent = `${val}x`;
  if (els.playbackSpeed && els.playbackSpeed !== e.target) els.playbackSpeed.value = val;
  if (els.playbackSpeedStories && els.playbackSpeedStories !== e.target) els.playbackSpeedStories.value = val;
  if (els.speedLabel && els.speedLabel !== label) els.speedLabel.textContent = `${val}x`;
  if (els.speedLabelStories && els.speedLabelStories !== label) els.speedLabelStories.textContent = `${val}x`;
  appState.settings.audioRate = Number(val);
  localStorage.setItem("nova_profile_settings", JSON.stringify(appState.settings));
  restartSpeechAtNewRate();
}

function restartSpeechAtNewRate() {
  if (!activeSpeech || (!window.speechSynthesis?.speaking && !window.speechSynthesis?.paused)) return;
  const restartAt = activeSpeech.charIndex || 0;
  activeSpeech.requestedCancel = true;
  window.speechSynthesis.cancel();
  clearTimeout(speechRestartTimer);
  speechRestartTimer = setTimeout(() => {
    activeSpeech = null;
    speakSlowRussian(restartAt);
  }, 80);
}

els.playbackSpeed.addEventListener("input", (e) => handleSpeedChange(e, els.speedLabel));
els.playbackSpeedStories.addEventListener("input", (e) => handleSpeedChange(e, els.speedLabelStories));

function setupSpeechRecognition() {
  if (appState.recognition && appState.recognizing) {
    try { appState.recognition.stop(); } catch {}
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    appState.recognition = null;
    appState.recordingMode = "media";
    const canRecord = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    els.recordBtn.disabled = !canRecord;
    els.spokenResult.textContent = canRecord
      ? "Press Start to record. The app will transcribe your audio after you stop."
      : "Recording is not available in this browser. Use Chrome or Edge on http://127.0.0.1:9876.";
    return;
  }

  appState.recordingMode = "speech";
  const recognition = new SpeechRecognition();
  recognition.lang = languageDatasets[appState.targetLanguage]?.speechLang || "ru-RU";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    appState.transcript = Array.from(event.results).map((result) => result[0].transcript).join(" ");
    evaluateSpeech(appState.transcript);
  };
  recognition.onend = () => {
    appState.recognizing = false;
    els.recordBtn.classList.remove("is-recording");
    els.recordBtn.textContent = "Start";
  };
  recognition.onerror = (event) => {
    els.spokenResult.textContent = `Speech recognition error: ${event.error}`;
  };
  appState.recognition = recognition;
}

function toggleRecording() {
  if (appState.recordingMode === "media" || !appState.recognition) {
    toggleMediaRecording();
    return;
  }
  if (!appState.recognition) {
    setupSpeechRecognition();
    if (!appState.recognition) return;
  }
  if (appState.recognizing) {
    appState.recognition.stop();
    return;
  }
  resetSpeech();
  appState.recognizing = true;
  els.recordBtn.classList.add("is-recording");
  els.recordBtn.textContent = "Stop";
  try {
    appState.recognition.lang = languageDatasets[appState.targetLanguage]?.speechLang || "ru-RU";
    appState.recognition.start();
  } catch (error) {
    appState.recognizing = false;
    els.recordBtn.classList.remove("is-recording");
    els.recordBtn.textContent = "Start";
    els.spokenResult.textContent = "Recording could not start. Check microphone permission and try again.";
  }
}

async function toggleMediaRecording() {
  if (appState.recognizing && mediaRecorder) {
    mediaRecorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    els.spokenResult.textContent = "Recording is not available in this browser.";
    return;
  }
  resetSpeech();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecordChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) mediaRecordChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(track => track.stop());
      appState.recognizing = false;
      els.recordBtn.classList.remove("is-recording");
      els.recordBtn.textContent = "Start";
      await transcribeRecordedAudio(new Blob(mediaRecordChunks, { type: mediaRecorder.mimeType || "audio/webm" }));
    };
    appState.recognizing = true;
    els.recordBtn.classList.add("is-recording");
    els.recordBtn.textContent = "Stop";
    els.spokenResult.textContent = "Recording...";
    mediaRecorder.start();
  } catch (error) {
    appState.recognizing = false;
    els.recordBtn.classList.remove("is-recording");
    els.recordBtn.textContent = "Start";
    els.spokenResult.textContent = "Microphone permission was blocked or recording could not start.";
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function transcribeRecordedAudio(blob) {
  if (!blob.size) {
    els.spokenResult.textContent = "No audio was recorded.";
    return;
  }
  if (location.protocol === "file:") {
    els.spokenResult.textContent = "Recording needs http://127.0.0.1:9876 for transcription.";
    return;
  }
  els.spokenResult.textContent = "Transcribing recording...";
  try {
    const audio = await blobToDataUrl(blob);
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ audio, language: appState.targetLanguage })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Transcription failed.");
    appState.transcript = data.text || "";
    evaluateSpeech(appState.transcript);
  } catch (error) {
    els.spokenResult.textContent = "Recording saved, but transcription needs OPENAI_API_KEY on the local server.";
  }
}

function resetSpeech() {
  appState.transcript = "";
  els.accuracyScore.textContent = "--";
  els.matchedWords.textContent = "--";
  els.missedWords.textContent = "--";
  const language = languageDatasets[appState.targetLanguage]?.label || "language";
  els.spokenResult.textContent = `Press Start, read the current ${language} text, then stop when finished.`;
}

function evaluateSpeech(transcript) {
  const targetText = getCurrentReadingText();
  const targetWords = wordsOnly(targetText);
  const spokenWords = wordsOnly(transcript);
  const used = new Set();
  let matched = 0;

  targetWords.forEach((target) => {
    const index = spokenWords.findIndex((spoken, i) => !used.has(i) && wordSimilarity(target, spoken) >= 0.78);
    if (index >= 0) {
      used.add(index);
      matched += 1;
    }
  });

  const missed = targetWords.length - matched;
  const accuracy = Math.round((matched / Math.max(targetWords.length, 1)) * 100);
  els.accuracyScore.textContent = `${accuracy}%`;
  els.matchedWords.textContent = `${matched}/${targetWords.length}`;
  els.missedWords.textContent = String(missed);
  const unlocked = accuracy >= 70;
  appState.practiceUnlocked = unlocked || appState.activeView !== "practice";
  appState.lastPracticeScore = {
    bestAccuracy: Math.max(Number(appState.lastPracticeScore?.bestAccuracy || 0), accuracy),
    lastAccuracy: accuracy,
    lastMatched: matched,
    lastMissed: missed,
    lastTotal: targetWords.length,
    language: appState.targetLanguage,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem("nova_practice_stats", JSON.stringify(appState.lastPracticeScore));
  updatePracticeControls();
  if (appState.activeView === "practice") {
    els.spokenResult.textContent = transcript
      ? `${transcript} ${unlocked ? "Next paragraph unlocked." : "Keep practicing to unlock Next."}`
      : "Listening...";
  } else {
    els.spokenResult.textContent = transcript || "Listening...";
  }
}

function wordsOnly(text) {
  return (text.match(/[\p{Letter}-]+/gu) || []).map(normalizeWord).filter(Boolean);
}

function wordSimilarity(a, b) {
  if (a === b) return 1;
  const distance = levenshtein(a, b);
  return 1 - distance / Math.max(a.length, b.length, 1);
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

function showTooltip(event) {
  const token = event.target.closest(".word-token");
  if (!token) return;
  els.tooltip.innerHTML = `<strong>${token.dataset.word}</strong><span>${token.dataset.translation}</span><br><small>rank ${token.dataset.rank}</small>`;
  els.tooltip.hidden = false;
  moveTooltip(event);
}

function moveTooltip(event) {
  if (els.tooltip.hidden) return;
  const x = Math.min(event.clientX + 14, window.innerWidth - els.tooltip.offsetWidth - 10);
  const y = Math.min(event.clientY + 14, window.innerHeight - els.tooltip.offsetHeight - 10);
  els.tooltip.style.left = `${x}px`;
  els.tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  els.tooltip.hidden = true;
}

function openAppModal(modal) {
  if (!modal) return;
  if (modal.parentElement !== document.body) document.body.append(modal);
  modal.hidden = false;
  modal.scrollTop = 0;
}

els.practiceTab?.addEventListener("click", () => switchView("practice"));
els.storiesTab?.addEventListener("click", () => switchView("stories"));
els.profileTab?.addEventListener("click", () => switchView("profile"));
els.profileBtn?.addEventListener("click", () => switchView("profile"));
els.profileBackBtn?.addEventListener("click", () => {
  if (activePublicProfile) {
    goBackFromPublicProfile();
    return;
  }
  switchView("practice");
});
els.profileCloseBtn?.addEventListener("click", () => closePublicProfileToHome());
els.profileSettingsBtn?.addEventListener("click", () => {
  renderProfileSettings();
  openAppModal(els.profileSettingsModal);
});
els.closeProfileSettingsBtn?.addEventListener("click", () => {
  if (els.profileSettingsModal) els.profileSettingsModal.hidden = true;
});
els.profileSettingsModal?.addEventListener("click", (event) => {
  if (event.target === els.profileSettingsModal) els.profileSettingsModal.hidden = true;
});
[
  ["showFollowers", els.settingShowFollowers, "checked"],
  ["showFollowing", els.settingShowFollowing, "checked"],
  ["showFriends", els.settingShowFriends, "checked"],
  ["compactProfile", els.settingCompactProfile, "checked"],
  ["reduceMotion", els.settingReduceMotion, "checked"],
  ["muteAssistant", els.settingMuteAssistant, "checked"],
  ["notifyMessages", els.settingNotifyMessages, "checked"],
  ["notifyAchievements", els.settingNotifyAchievements, "checked"],
  ["autoMatchChatLanguage", els.settingAutoMatchChatLanguage, "checked"],
  ["autoTranslate", els.settingAutoTranslate, "checked"],
  ["allowFriendRequests", els.settingAllowFriendRequests, "checked"],
  ["filterMessages", els.settingFilterMessages, "checked"],
  ["profileTheme", els.settingProfileTheme, "value"],
  ["audioRate", els.settingAudioRate, "value"]
].forEach(([key, control, prop]) => {
  control?.addEventListener("input", () => {
    appState.settings[key] = prop === "checked" ? control.checked : control.value;
    if (key === "audioRate" && els.settingAudioRateValue) {
      els.settingAudioRateValue.textContent = `${Number(control.value).toFixed(1)}x`;
    }
    saveProfileSettings();
    if (key === "autoMatchChatLanguage" && appState.settings.autoMatchChatLanguage && els.chatLanguageSelect && chatLanguages?.[appState.targetLanguage]) {
      els.chatLanguageSelect.value = appState.targetLanguage;
      updateChatIntro();
    }
    if (key === "autoTranslate" && appState.activeView === "stories") renderStory();
    if (activePublicProfile) {
      renderPublicSocialList("followers");
      renderPublicSocialList("following");
      renderPublicSocialList("friends");
    }
  });
});
els.characterGuideToggle?.addEventListener("change", () => {
  appState.settings.characterGuide = els.characterGuideToggle.checked;
  saveProfileSettings();
  updateCharacterGuide();
});
els.settingResetLocalUiBtn?.addEventListener("click", () => {
  appState.settings = { ...profileSettingsDefaults };
  saveProfileSettings();
  renderProfileSettings();
});
els.targetLanguageSelect?.addEventListener("change", () => switchTargetLanguage(els.targetLanguageSelect.value));

// Pencil icon opens edit profile modal
els.avatarEditPencilBtn?.addEventListener("click", () => {
  openAppModal(els.editProfileModal);
  initColorWheel();
});
els.closeEditProfileBtn?.addEventListener("click", () => {
  if (els.editProfileModal) els.editProfileModal.hidden = true;
});
els.cancelEditProfileBtn?.addEventListener("click", () => {
  if (els.editProfileModal) els.editProfileModal.hidden = true;
});
els.editProfileModal?.addEventListener("click", (e) => {
  if (e.target === els.editProfileModal) els.editProfileModal.hidden = true;
});

els.editProfileBtn?.addEventListener("click", () => {
  if (els.editProfileModal) {
    openAppModal(els.editProfileModal);
    initColorWheel();
  } else if (els.profileEditPanel) {
    els.profileEditPanel.hidden = !els.profileEditPanel.hidden;
    els.editProfileBtn.textContent = els.profileEditPanel.hidden ? "Edit" : "Close Edit";
  }
});
  els.mascotGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mascot]");
  if (!button) return;
  appState.profile.customization.mascot = button.dataset.mascot;
  saveProfile();
  renderMascotGrid();
  renderMascotAvatar(els.profilePageAvatarContainer, appState.profile.customization.mascot, { color: appState.profile.customization.avatarColor || "#f59e0b" });
  renderMascotAvatar(els.profileAvatarContainer, appState.profile.customization.mascot, { color: appState.profile.customization.avatarColor || "#f59e0b", small: true });
  updateCharacterGuide();
  updateCharacterVisuals();
});
document.querySelectorAll("[data-social-toggle]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSocialDropdown(button.dataset.socialToggle);
  });
});
[
  ["followers", els.followersSearch],
  ["following", els.followingSearch],
  ["friends", els.friendsSearch]
].forEach(([type, input]) => {
  input?.addEventListener("click", (event) => event.stopPropagation());
  input?.addEventListener("input", () => {
    socialSearchState[type] = input.value.trim();
    renderSocialList(type);
    const group = document.querySelector(`[data-social-group="${type}"]`);
    const dropdown = group?.querySelector(".social-dropdown");
    if (dropdown) {
      dropdown.hidden = false;
      group.classList.add("is-open");
    }
  });
});
function openSocialPersonFromEvent(event) {
  const item = event.target.closest("li[data-person]");
  if (!item) return;
  event.preventDefault();
  event.stopPropagation();
  openPersonProfile(item.dataset.person);
}

[els.followersList, els.followingList, els.friendsList].forEach((list) => {
  list?.addEventListener("click", openSocialPersonFromEvent);
  list?.addEventListener("contextmenu", (event) => {
    const item = event.target.closest("li[data-person]");
    if (item) showSocialContextMenu(event, item.dataset.person, item.dataset.socialType);
  });
});
document.querySelectorAll("[data-public-social-toggle]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePublicSocialDropdown(button.dataset.publicSocialToggle);
  });
});
[
  ["followers", els.publicFollowersSearch],
  ["following", els.publicFollowingSearch],
  ["friends", els.publicFriendsSearch]
].forEach(([type, input]) => {
  input?.addEventListener("click", (event) => event.stopPropagation());
  input?.addEventListener("input", () => {
    publicSocialSearchState[type] = input.value.trim();
    renderPublicSocialList(type);
  });
});
[els.publicFollowersList, els.publicFollowingList, els.publicFriendsList].forEach((list) => {
  list?.addEventListener("click", openSocialPersonFromEvent);
  list?.addEventListener("contextmenu", (event) => {
    const item = event.target.closest("li[data-person]");
    if (item) showSocialContextMenu(event, item.dataset.person, item.dataset.socialType);
  });
});
els.socialContextMenu?.addEventListener("click", (event) => {
  const action = event.target.closest("[data-social-action]")?.dataset.socialAction;
  if (action) handleSocialAction(action);
});
document.addEventListener("click", (event) => {
  if (els.socialContextMenu && !els.socialContextMenu.contains(event.target)) els.socialContextMenu.hidden = true;
});
els.closePublicProfileBtn?.addEventListener("click", () => {
  closePublicProfileToHome();
});
els.publicProfileBackBtn?.addEventListener("click", goBackFromPublicProfile);
els.publicProfileModal?.addEventListener("click", (event) => {
  if (event.target === els.publicProfileModal) closePublicProfileToHome();
});
els.publicAddFriendBtn?.addEventListener("click", () => {
  if (activePublicProfile?.name) addFriend(activePublicProfile.name);
});
els.publicSendMessageBtn?.addEventListener("click", () => {
  if (activePublicProfile?.name) sendMessageToPerson(activePublicProfile.name);
});
els.publicProfilePage?.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-public-social-toggle]");
  if (toggle) {
    event.stopPropagation();
    togglePublicSocialDropdown(toggle.dataset.publicSocialToggle);
    return;
  }
  const publicRotate = event.target.closest("#publicCharacterAutoRotateBtn");
  if (publicRotate) {
    setPublicCharacterAutoRotate(Boolean(publicRotate.checked));
    return;
  }
  if (event.target.closest("#publicAddFriendBtn")) {
    if (activePublicProfile?.name) addFriend(activePublicProfile.name);
    return;
  }
  if (event.target.closest("#publicSendMessageBtn")) {
    if (activePublicProfile?.name) sendMessageToPerson(activePublicProfile.name);
    return;
  }
  const personItem = event.target.closest("li[data-person]");
  if (personItem) {
    event.preventDefault();
    event.stopPropagation();
    openPersonProfile(personItem.dataset.person);
  }
});
els.publicProfilePage?.addEventListener("input", (event) => {
  const input = event.target.closest("input[type='search']");
  if (!input) return;
  const group = input.closest("[data-public-social-group]");
  const type = group?.dataset.publicSocialGroup;
  if (!type) return;
  publicSocialSearchState[type] = input.value.trim();
  renderPublicSocialList(type);
});
els.publicProfilePage?.addEventListener("contextmenu", (event) => {
  const item = event.target.closest("li[data-person]");
  if (item) showSocialContextMenu(event, item.dataset.person, item.dataset.socialType);
});
els.storyPrevPageBtn?.addEventListener("click", () => {
  if (appState.currentStorySectionIndex > 0) {
    appState.currentStorySectionIndex--;
    renderStory();
    resetSpeech();
    triggerPageTurnAnimation("prev");
  }
});
els.storyNextPageBtn?.addEventListener("click", () => {
  const story = appState.currentStory;
  if (story && appState.currentStorySectionIndex < story.sections.length - 1) {
    appState.currentStorySectionIndex++;
    renderStory();
    resetSpeech();
    triggerPageTurnAnimation("next");
  }
});

function triggerPageTurnAnimation(direction) {
  const cover = document.querySelector(".book-cover");
  if (!cover) return;
  cover.classList.remove("page-turn-next", "page-turn-prev");
  void cover.offsetWidth; // force reflow
  cover.classList.add(direction === "next" ? "page-turn-next" : "page-turn-prev");
}

els.bandSelect?.addEventListener("change", () => {
  const choices = getPracticeChoices();
  appState.practiceIndex = 0;
  appState.currentParagraph = choices[0] || activeParagraphs[0];
  appState.practiceUnlocked = false;
  resetSpeech();
  renderParagraph();
  renderStats();
  renderWordList();
});
els.newParagraphBtn?.addEventListener("click", () => pickParagraph(1));
els.practiceBackBtn?.addEventListener("click", () => pickParagraph(-1));
els.toggleTranslationBtn?.addEventListener("click", toggleTranslation);
els.slowAudioBtn?.addEventListener("click", () => speakSlowRussian());
els.pauseAudioBtn?.addEventListener("click", toggleReadingAudioPause);
els.restartAudioBtn?.addEventListener("click", restartReadingAudio);
els.storyLevelSelect?.addEventListener("change", selectStoryLevel);
els.storySelect?.addEventListener("change", selectStory);
els.generateStoryImageBtn?.addEventListener("click", generateStoryImage);
els.importStoryImageBtn?.addEventListener("click", importStoryImage);
els.storyImageFileInput?.addEventListener("change", saveImportedStoryImage);
els.toggleStoryTranslationBtn?.addEventListener("click", toggleStoryTranslation);
els.storyAudioBtn?.addEventListener("click", () => speakSlowRussian());
els.pauseStoryAudioBtn?.addEventListener("click", toggleReadingAudioPause);
els.restartStoryAudioBtn?.addEventListener("click", restartReadingAudio);
els.recordBtn?.addEventListener("click", toggleRecording);
els.searchInput?.addEventListener("input", renderWordList);

els.russianParagraph.addEventListener("mouseover", showTooltip);
els.russianParagraph.addEventListener("mousemove", moveTooltip);
els.russianParagraph.addEventListener("mouseout", hideTooltip);
els.russianParagraph.addEventListener("focusin", showTooltip);
els.russianParagraph.addEventListener("focusout", hideTooltip);
els.storyContent.addEventListener("mouseover", showTooltip);
els.storyContent.addEventListener("mousemove", moveTooltip);
els.storyContent.addEventListener("mouseout", hideTooltip);
els.storyContent.addEventListener("focusin", showTooltip);
els.storyContent.addEventListener("focusout", hideTooltip);

document.addEventListener("pointerover", (event) => {
  if (event.target.closest("button, select, .word-token, .story-visual")) setCharacterInteraction("pointing");
});
document.addEventListener("focusin", (event) => {
  if (event.target.closest("input, textarea, select")) setCharacterInteraction("typing");
});
document.addEventListener("click", (event) => {
  if (event.target.closest(".action-btn, .mascot-option, .collection-cell")) setCharacterInteraction("celebrating");
});
document.addEventListener("pointerout", (event) => {
  if (event.target.closest("button, select, .word-token, .story-visual")) setCharacterInteraction("idle");
});



// --- GAMIFICATION & ECONOMY ---
function updateCoins(amount) {
  appState.coins += amount;
  localStorage.setItem('nova_coins', appState.coins);
  els.coinCount.textContent = appState.coins;
  els.coinCount.parentElement.classList.remove("pulse-anim");
  void els.coinCount.parentElement.offsetWidth; // trigger reflow
  els.coinCount.parentElement.classList.add("pulse-anim");
}

function initEconomy() {
  els.coinCount.textContent = appState.coins;
  document.documentElement.style.setProperty('--app-bg', appState.activeTheme.startsWith("linear-gradient") ? appState.activeTheme : `url('${appState.activeTheme}')`);
}

// --- HAMBURGER MENU & MODALS ---
els.hamburgerBtn.addEventListener("click", () => els.hamburgerMenu.hidden = false);
els.closeHamburgerBtn.addEventListener("click", () => els.hamburgerMenu.hidden = true);

els.openStoreBtn.addEventListener("click", () => els.storeModal.hidden = false);
els.closeStoreBtn.addEventListener("click", () => els.storeModal.hidden = true);

function openMusicDock() {
  if (!els.musicDock) return;
  if (els.musicDock.hidden) {
    els.musicDock.hidden = false;
    els.musicDock.classList.remove("is-expanded");
  } else {
    els.musicDock.classList.add("is-expanded");
  }
  els.hamburgerMenu.hidden = true;
}

function closeMusicDock() {
  if (!els.musicDock) return;
  els.musicDock.hidden = true;
  els.musicDock.classList.remove("is-expanded");
  if (els.expandMusicBtn) {
    els.expandMusicBtn.textContent = "⌃";
    els.expandMusicBtn.setAttribute("aria-label", "Expand music queue");
  }
}

els.openMusicBtn.addEventListener("click", openMusicDock);
els.closeMusicBtn?.addEventListener("click", closeMusicDock);
els.musicDockCloseBtn?.addEventListener("click", closeMusicDock);
els.expandMusicBtn?.addEventListener("click", () => {
  if (!els.musicDock) return;
  els.musicDock.hidden = false;
  els.musicDock.classList.toggle("is-expanded");
  els.expandMusicBtn.textContent = els.musicDock.classList.contains("is-expanded") ? "⌄" : "⌃";
  els.expandMusicBtn.setAttribute("aria-label", els.musicDock.classList.contains("is-expanded") ? "Collapse music queue" : "Expand music queue");
});

els.openAchievementsBtn.addEventListener("click", () => {
  switchView("profile");
});

els.openSlotsBtn?.addEventListener("click", () => {
  els.slotsWidget.hidden = false;
  els.hamburgerMenu.hidden = true;
});
els.toggleSlotsBtn.addEventListener("click", () => els.slotsWidget.hidden = !els.slotsWidget.hidden);
els.slotsCloseBtn.addEventListener("click", () => els.slotsWidget.hidden = true);

els.toggleTwitchBtn.addEventListener("click", () => {
  renderGlobalChatKnowledge();
  els.twitchChat.hidden = !els.twitchChat.hidden;
});
els.closeTwitchBtn.addEventListener("click", () => els.twitchChat.hidden = true);

els.toggleDMBtn.addEventListener("click", () => {
  renderDMInbox();
  els.dmWidget.hidden = !els.dmWidget.hidden;
});
els.closeDMBtn.addEventListener("click", () => els.dmWidget.hidden = true);

// Add global window click to close modals if clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === els.storeModal) els.storeModal.hidden = true;
});

// Profile Logic
const mockAvatars = [
  "https://picsum.photos/200/200?random=50",
  "https://ui-avatars.com/api/?name=Connor&background=0D8ABC&color=fff",
  "https://robohash.org/connor?set=set4",
  "https://robohash.org/connor?set=set2",
  "https://picsum.photos/200/200?random=99"
];
let avatarIndex = 0;
els.editAvatarBtn?.addEventListener("click", () => {
  avatarIndex = (avatarIndex + 1) % mockAvatars.length;
  const newSrc = mockAvatars[avatarIndex];
  if (els.profilePageAvatar) els.profilePageAvatar.src = newSrc;
  if (els.profileAvatar) els.profileAvatar.src = newSrc;
});

// --- STORE & COINS ---
const coinPackages = [];
const basePrices = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
basePrices.forEach((price, index) => {
  let baseCoins = price * 1000;
  let bonusMultiplier = Math.pow(1.05, index);
  let totalCoins = Math.round((baseCoins * bonusMultiplier) / 100) * 100;
  coinPackages.push({ id: `coins_${price}`, price, coins: totalCoins });
});

async function startRealCheckout(provider, pkg) {
  const apiBase = (window.LANGUAGE_API_BASE || localStorage.getItem("language_api_base") || "").replace(/\/$/, "");
  if ((location.protocol === "file:" || location.hostname.includes("github.io")) && !apiBase) {
    alert("Real checkout needs a deployed backend URL. Set window.LANGUAGE_API_BASE or localStorage.language_api_base to your payment server.");
    return;
  }
  const endpoint = provider === "crypto" ? "/api/payments/coinbase-charge" : "/api/payments/stripe-checkout";
  const response = await fetch(`${apiBase}${endpoint}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ packageId: pkg.id })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Checkout could not be started.");
  if (!result.url) throw new Error("Checkout provider did not return a hosted payment URL.");
  window.location.href = result.url;
}

function renderStore() {
  els.storeGrid.replaceChildren(...coinPackages.map(pkg => {
    const card = document.createElement("div");
    card.className = "coin-package-card";
    card.innerHTML = `
      <strong>${pkg.coins.toLocaleString()} 🪙</strong>
      <span>$${pkg.price}.00</span>
    `;
    card.addEventListener("click", () => {
      alert(`Redirecting to Stripe to buy ${pkg.coins} coins for $${pkg.price}... Purchase Successful!`);
      updateCoins(pkg.coins);
      els.storeModal.hidden = true;
    });
    return card;
  }));
}

els.watchAdBtn.addEventListener("click", () => {
  els.watchAdBtn.textContent = "Watching Ad...";
  els.watchAdBtn.disabled = true;
  setTimeout(() => {
    updateCoins(50);
    els.watchAdBtn.textContent = "Watch Ad (+50 Coins)";
    els.watchAdBtn.disabled = false;
  }, 1000);
});

function renderStore() {
  els.storeGrid.replaceChildren(...coinPackages.map((pkg) => {
    const card = document.createElement("div");
    card.className = "coin-package-card";
    card.innerHTML = `
      <strong>${pkg.coins.toLocaleString()} coins</strong>
      <span>$${pkg.price}.00</span>
      <div class="coin-package-actions">
        <button type="button" data-provider="card">Card</button>
        <button type="button" data-provider="crypto">Crypto</button>
      </div>
    `;
    card.querySelectorAll("[data-provider]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.stopPropagation();
        button.disabled = true;
        button.textContent = "Opening...";
        try {
          await startRealCheckout(button.dataset.provider, pkg);
        } catch (error) {
          alert(error.message);
          button.disabled = false;
          button.textContent = button.dataset.provider === "crypto" ? "Crypto" : "Card";
        }
      });
    });
    return card;
  }));
}

async function loadRewardedAdConfig() {
  const apiBase = (window.LANGUAGE_API_BASE || localStorage.getItem("language_api_base") || "").replace(/\/$/, "");
  if ((location.protocol === "file:" || location.hostname.includes("github.io")) && !apiBase) return null;
  const response = await fetch(`${apiBase}/api/ads/config`);
  if (!response.ok) return null;
  const config = await response.json();
  return config.enabled ? config : null;
}

els.watchAdBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  els.watchAdBtn.textContent = "Checking ads...";
  els.watchAdBtn.disabled = true;
  try {
    const config = await loadRewardedAdConfig();
    if (!config) {
      alert("Real rewarded ads are not configured yet. Set GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_REWARDED_SLOT, and GOOGLE_ADSENSE_PUBLISHER_ID on the backend.");
      return;
    }
    alert("AdSense is configured. Reward credit should be granted only after a verified ad completion callback.");
  } finally {
    els.watchAdBtn.textContent = "Watch Ad (+50 Coins)";
    els.watchAdBtn.disabled = false;
  }
}, true);

// --- THEMES SHOP ---
const themePrices = {
  10: 0, 9: 0, 8: 0,
  7: 100, 6: 200, 5: 400,
  4: 800, 3: 1600, 2: 3200, 1: 6400
};
const japaneseThemes = {
  jp10: { price: 0, name: "Sakura Dawn", bg: "linear-gradient(135deg, #fff1f2, #fecdd3 45%, #bfdbfe)" },
  jp9: { price: 0, name: "Tokyo Night", bg: "linear-gradient(135deg, #111827, #3730a3 48%, #db2777)" },
  jp8: { price: 0, name: "Fuji Morning", bg: "linear-gradient(135deg, #e0f2fe, #f8fafc 45%, #bae6fd)" },
  jp7: { price: 100, name: "Bamboo Path", bg: "linear-gradient(135deg, #ecfccb, #86efac 48%, #14532d)" },
  jp6: { price: 200, name: "Kyoto Lanterns", bg: "linear-gradient(135deg, #450a0a, #dc2626 50%, #fbbf24)" },
  jp5: { price: 400, name: "Ink Wash", bg: "linear-gradient(135deg, #f8fafc, #cbd5e1 52%, #334155)" },
  jp4: { price: 800, name: "Shinkansen", bg: "linear-gradient(135deg, #eff6ff, #60a5fa 45%, #1d4ed8)" },
  jp3: { price: 1600, name: "Matcha Garden", bg: "linear-gradient(135deg, #f7fee7, #a3e635 50%, #365314)" },
  jp2: { price: 3200, name: "Festival Gold", bg: "linear-gradient(135deg, #7f1d1d, #f97316 48%, #fde68a)" },
  jp1: { price: 6400, name: "Neon Crossing", bg: "linear-gradient(135deg, #020617, #7c3aed 46%, #22d3ee)" }
};

function renderThemes() {
  const entries = appState.targetLanguage === "japanese"
    ? Object.entries(japaneseThemes)
    : Object.keys(themePrices).sort((a,b) => b-a).map((id) => [id, { price: themePrices[id], name: `Theme ${id}` }]);
  els.themeSelect.replaceChildren(...entries.map(([id, config]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = `${config.name} (${config.price === 0 ? "FREE" : config.price + " Coins"})`;
    return opt;
  }));
  
  els.themeSelect.onchange = (e) => {
    const id = e.target.value;
    const price = japaneseThemes[id]?.price ?? themePrices[id];
    
    if (price > 0 && !appState.unlockedThemes.includes(id)) {
      if (appState.coins >= price) {
        if (confirm(`Buy this theme for ${price} coins?`)) {
          updateCoins(-price);
          appState.unlockedThemes.push(id);
          localStorage.setItem('nova_unlocked_themes', JSON.stringify(appState.unlockedThemes));
          applyTheme(id);
        }
      } else {
        alert("Not enough coins!");
        els.themeSelect.value = entries[0]?.[0] || 10;
      }
    } else {
      applyTheme(id);
    }
  };
}

function applyTheme(id) {
  if (japaneseThemes[id]) {
    appState.activeTheme = japaneseThemes[id].bg;
    localStorage.setItem('nova_active_theme', appState.activeTheme);
    document.documentElement.style.setProperty('--app-bg', japaneseThemes[id].bg);
    return;
  }
  const url = `languages/japanese/assets/themes/${id}.png`;
  appState.activeTheme = url;
  localStorage.setItem('nova_active_theme', url);
  document.documentElement.style.setProperty('--app-bg', `url('${url}')`);
}

// --- ACHIEVEMENTS ---
const achievements = [
  { id: "first_spin", title: "First Spin", desc: "You spun the minislots for the first time.", icon: "🎰" },
  { id: "millionaire", title: "Millionaire", desc: "You accumulated 1,000,000 coins.", icon: "💎" },
  { id: "polyglot", title: "Polyglot", desc: "Talked to the chatbot in 5 different languages.", icon: "🌍" }
];
function renderAchievements() {
  if (!els.achievementsList) return;
  const language = languageDatasets[appState.targetLanguage]?.label || "Language";
  const languageAchievements = [
    { title: `First ${language} Page`, desc: `Read your first ${language} page.`, icon: "📖" },
    { title: `${language} Story Reader`, desc: `Open 10 ${language} story pages.`, icon: "🖼" },
    { title: `${language} Listener`, desc: `Play story audio in ${language}.`, icon: "🎧" },
    { title: `${language} Speaker`, desc: `Read aloud and earn XP in ${language}.`, icon: "🎙" },
    { title: `100 ${language} Words`, desc: `Learn 100 words while reading ${language}.`, icon: "🏅" },
    { title: `${language} Collector`, desc: `Fill item slots while practicing ${language}.`, icon: "💠" }
  ];
  els.achievementsList.replaceChildren(...languageAchievements.map(ach => {
    const div = document.createElement("div");
    div.className = "achievement-item";
    div.innerHTML = `
      <div class="achievement-icon">${ach.icon}</div>
      <div>
        <h4>${ach.title}</h4>
        <p>${ach.desc}</p>
      </div>
    `;
    return div;
  }));
}

// --- MINI SLOTS ---
const slotSymbols = ["🍒", "🍋", "🍉", "⭐", "💎", "🔔", "7️⃣"];
let autoSpinInterval = null;

function spinSlots() {
  const bet = parseInt(els.slotBetSelect.value);
  const reelsCount = parseInt(els.slotReelSelect.value);
  
  if (appState.coins < bet) {
    els.slotResultOverlay.textContent = "Not enough coins!";
    els.slotResultOverlay.hidden = false;
    if (autoSpinInterval) {
       clearInterval(autoSpinInterval);
       autoSpinInterval = null;
       els.autoSpinCheck.checked = false;
       els.spinBtn.textContent = "Spin";
    }
    setTimeout(() => els.slotResultOverlay.hidden = true, 1500);
    return;
  }
  
  updateCoins(-bet);
  els.slotResultOverlay.hidden = true;
  els.slotLever.classList.add("pulled");
  
  els.slotsDisplay.innerHTML = "";
  const reelEls = [];
  for(let i=0; i<reelsCount; i++) {
    if(i > 0) {
      const divider = document.createElement("div");
      divider.className = "reel-divider";
      els.slotsDisplay.append(divider);
    }
    const span = document.createElement("span");
    span.className = "slot-reel";
    span.textContent = "🍒";
    els.slotsDisplay.append(span);
    reelEls.push(span);
  }
  els.slotsDisplay.append(els.slotResultOverlay);
  
  let spins = 0;
  const interval = setInterval(() => {
    reelEls.forEach(el => {
      el.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    });
    spins++;
    if (spins > 10) {
      clearInterval(interval);
      els.slotLever.classList.remove("pulled");
      
      const first = reelEls[0].textContent;
      const allMatch = reelEls.every(el => el.textContent === first);
      
      if (allMatch) {
        const win = bet * (10 * reelsCount);
        updateCoins(win);
        els.slotResultOverlay.textContent = `WINNER! +${win}`;
      } else {
        els.slotResultOverlay.textContent = "LOSER";
      }
      els.slotResultOverlay.hidden = false;
      setTimeout(() => els.slotResultOverlay.hidden = true, 1500);
    }
  }, 80);
}

els.spinBtn.addEventListener("click", () => {
  if (els.autoSpinCheck.checked) {
    if (autoSpinInterval) {
       clearInterval(autoSpinInterval);
       autoSpinInterval = null;
       els.spinBtn.textContent = "Spin";
    } else {
       spinSlots();
       autoSpinInterval = setInterval(spinSlots, 1600);
       els.spinBtn.textContent = "Stop";
    }
  } else {
    spinSlots();
  }
});
els.slotLever.addEventListener("click", spinSlots);

// --- CHATBOT ---
const chatLanguages = {
  russian: { label: "Russian", speechLang: "ru-RU", intro: "Привет! Я Nova. Я могу помочь с чтением, словами, грамматикой и произношением.", fallback: "Хороший вопрос. Давай разберем это медленно: сначала найди ключевые слова, потом прочитай предложение вслух и сравни смысл с переводом." },
  japanese: { label: "Japanese", speechLang: "ja-JP", intro: "こんにちは。Novaです。読解、単語、文法、発音を手伝います。", fallback: "いい質問です。まず大事な単語を見つけて、文をゆっくり読んで、意味を英語と比べましょう。" },
  mandarin: { label: "Mandarin", speechLang: "zh-CN", intro: "你好！我是 Nova。我可以帮助你练习阅读、词汇、语法和发音。", fallback: "这是一个好问题。我们先找关键词，再慢慢读句子，然后把意思和英文翻译比较。" },
  hindi: { label: "Hindi", speechLang: "hi-IN", intro: "नमस्ते! मैं Nova हूँ। मैं पढ़ने, शब्दों, व्याकरण और उच्चारण में मदद कर सकता हूँ।", fallback: "अच्छा सवाल है। पहले मुख्य शब्द खोजो, फिर वाक्य को धीरे-धीरे पढ़ो और अर्थ को अंग्रेज़ी अनुवाद से मिलाओ।" },
  arabic: { label: "Arabic", speechLang: "ar-SA", intro: "مرحبا! أنا Nova. أستطيع مساعدتك في القراءة والمفردات والقواعد والنطق.", fallback: "سؤال جيد. لنبدأ بالكلمات المهمة، ثم نقرأ الجملة ببطء، وبعد ذلك نقارن المعنى بالترجمة الإنجليزية." }
};
const chatHistory = [];

function activeChatLanguageKey() {
  return chatLanguages[els.chatLanguageSelect?.value] ? els.chatLanguageSelect.value : appState.targetLanguage;
}

function setupChatLanguages() {
  if (!els.chatLanguageSelect) return;
  els.chatLanguageSelect.replaceChildren(...Object.entries(chatLanguages).map(([value, config]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = config.label;
    return option;
  }));
  els.chatLanguageSelect.value = chatLanguages[appState.targetLanguage] ? appState.targetLanguage : "russian";
  updateChatIntro();
}

function speakChatText(text) {
  const synth = window.speechSynthesis;
  if (!synth || !text || appState.settings?.muteAssistant) return;
  const config = chatLanguages[activeChatLanguageKey()] || chatLanguages.russian;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.speechLang;
  utterance.rate = Number(appState.settings?.audioRate || 0.92);
  synth.speak(utterance);
}

function updateChatIntro() {
  const config = chatLanguages[activeChatLanguageKey()] || chatLanguages.russian;
  if (els.chatWelcomeMsg) {
    els.chatWelcomeMsg.textContent = config.intro;
    els.chatWelcomeMsg.lang = config.speechLang.slice(0, 2);
    els.chatWelcomeMsg.dir = activeChatLanguageKey() === "arabic" ? "rtl" : "ltr";
  }
  if (els.chatInput) {
    els.chatInput.placeholder = config.label === "Arabic" ? "اكتب رسالتك..." : `Ask Nova in ${config.label}...`;
  }
}

function detectChatLanguageFromText(text) {
  if (/[\u0600-\u06ff]/.test(text)) return "arabic";
  if (/[\u0900-\u097f]/.test(text)) return "hindi";
  if (/[\u3040-\u30ff]/.test(text)) return "japanese";
  if (/[\u4e00-\u9fff]/.test(text)) return "mandarin";
  if (/[\u0400-\u04ff]/.test(text)) return "russian";
  return "";
}

function getSiteChatSnapshot() {
  const dataset = languageDatasets[appState.targetLanguage] || languageDatasets.russian;
  const profile = appState.profile || {};
  const story = appState.currentStory || {};
  const sections = Array.isArray(story.sections) ? story.sections : [];
  const currentSection = sections[appState.currentStorySectionIndex] || sections[0] || {};
  const level = profile.xp !== undefined ? getLevelInfo(Number(profile.xp || 0)) : { level: 0, progress: 0, needed: 1000 };
  return {
    languageLabel: dataset.label,
    view: appState.activeView,
    practiceTitle: appState.currentParagraph?.title || "Practice",
    storyTitle: story.title || "No story selected",
    storyLevel: story.level || "beginner",
    storyPage: sections.length ? appState.currentStorySectionIndex + 1 : 0,
    storyPages: sections.length,
    storyText: (currentSection.text || getCurrentReadingText() || "").slice(0, 220),
    wordsTotal: appState.words?.length || 0,
    learnedWords: appState.learnedWords?.length || 0,
    storiesTotal: storyLibrary.length,
    coins: appState.coins || 0,
    displayName: profile.displayName || "Learner",
    username: profile.username || "learner",
    bio: profile.bio || "No bio yet.",
    followers: profile.social?.followers?.length || 0,
    following: profile.social?.following?.length || 0,
    friends: profile.social?.friends?.length || 0,
    collection: profile.collection?.length || 0,
    level
  };
}

function getLocalChatTopic(text) {
  const lower = text.toLowerCase();
  const topics = [
    ["media", ["image", "picture", "photo", "screenshot", "video", "voice", "recording", "upload", "camera", "audio file", "الصورة", "فيديو", "صوت", "चित्र", "वीडियो", "आवाज", "图片", "照片", "视频", "音声", "写真", "動画"]],
    ["purchase", ["buy", "purchase", "coin", "coins", "store", "ad", "ads", "stripe", "payment", "money", "checkout", "खरीद", "सिक्का", "شراء", "إعلان", "购买", "广告", "購入", "広告"]],
    ["profile", ["profile", "followers", "following", "friends", "bio", "username", "display name", "mascot", "collection", "achievement", "प्रोफाइल", "दोस्त", "ملف", "أصدقاء", "个人资料", "朋友", "プロフィール", "友達"]],
    ["stories", ["story", "stories", "chapter", "page", "read", "library", "कहानी", "अध्याय", "قصة", "فصل", "故事", "章节", "物語", "章"]],
    ["practice", ["practice", "paragraph", "word list", "vocabulary", "common words", "learned words", "translate", "meaning", "अभ्यास", "शब्द", "مفردات", "ترجمة", "练习", "词汇", "翻译", "練習", "単語", "翻訳"]],
    ["audio", ["pronunciation", "say", "speak", "play audio", "record", "microphone", "voice score", "उच्चारण", "रिकॉर्ड", "نطق", "تسجيل", "发音", "录音", "発音", "録音"]],
    ["chat", ["chat", "dm", "message", "global", "live chat", "bot", "assistant", "संदेश", "رسالة", "聊天", "消息", "チャット", "メッセージ"]],
    ["music", ["music", "song", "playlist", "player", "spotify", "संगीत", "موسيقى", "音乐", "音楽"]],
    ["slots", ["slot", "slots", "bet", "reels", "spin", "gamble", "رهان", "فتحات", "老虎机", "賭け", "スロット"]],
    ["language", ["language", "russian", "japanese", "mandarin", "hindi", "arabic", "switch", "भाषा", "لغة", "语言", "言語"]]
  ];
  return topics.find(([, words]) => words.some((word) => lower.includes(word)))?.[0] || "default";
}

function buildLocalChatReply(topic, text) {
  const detected = detectChatLanguageFromText(text);
  if (detected && chatLanguages[detected] && els.chatLanguageSelect) {
    els.chatLanguageSelect.value = detected;
    updateChatIntro();
  }
  const key = chatLanguages[detected] ? detected : activeChatLanguageKey();
  const snap = getSiteChatSnapshot();
  const replies = {
    russian: {
      default: `Я работаю локально по данным этого сайта. Сейчас выбран язык ${snap.languageLabel}, открыта вкладка ${snap.view}, изучено ${snap.learnedWords} из ${snap.wordsTotal} слов.`,
      practice: `Практика показывает текущий абзац "${snap.practiceTitle}", список изученных слов и перевод по наведению. Кнопка перевода открывает английский смысл всего текста.`,
      stories: `В библиотеке ${snap.storiesTotal} историй для ${snap.languageLabel}. Сейчас: "${snap.storyTitle}", уровень ${snap.storyLevel}, страница ${snap.storyPage}/${snap.storyPages}.`,
      audio: `Аудио читает текущий абзац или страницу истории голосом ${snap.languageLabel}. Запись сравнивает вашу речь с текущим текстом, когда браузер поддерживает распознавание речи.`,
      profile: `Профиль: ${snap.displayName} (@${snap.username}), ${snap.followers} followers, ${snap.following} following, ${snap.friends} friends, коллекция ${snap.collection}/16, уровень ${snap.level.level}.`,
      media: `Я могу локально читать данные файла: имя, тип, размер, длительность и размеры изображения. Для настоящего OCR, понимания объектов или расшифровки речи нужен локальный ML-модуль в браузере или отдельный сервер.`,
      purchase: `Сейчас монеты и магазин локальные: ${snap.coins} coins. Реальные покупки требуют платежный сервер и webhook; секретные ключи нельзя хранить в статическом HTML или GitHub Pages.`,
      chat: `Чат, DMs и live chat сейчас работают как данные в браузере. Чтобы они были реальными между пользователями, нужен логин, база данных и realtime backend.`,
      music: `Музыкальный плеер открывает нижнюю панель и может расширить плейлист. Сейчас это локальный демо-плеер без реального каталога песен.`,
      slots: `Mini Slots использует локальные настройки Bet и Reels. Это не реальные деньги и не должно подключаться к настоящим платежам без backend-проверок.`,
      language: `Доступные языки: Russian, Japanese, Mandarin, Hindi и Arabic. При смене языка меняются слова, истории, достижения, направление текста и голос.`
    },
    japanese: {
      default: `私はこのサイト内のローカルデータだけで答えます。今の学習言語は${snap.languageLabel}、画面は${snap.view}、学習済み単語は${snap.learnedWords}/${snap.wordsTotal}です。`,
      practice: `Practiceでは「${snap.practiceTitle}」の文章、覚えた単語、ホバー翻訳を使います。Translateボタンで英語の全体訳を見られます。`,
      stories: `${snap.languageLabel}のストーリーは${snap.storiesTotal}あります。現在は「${snap.storyTitle}」、${snap.storyLevel}、ページ${snap.storyPage}/${snap.storyPages}です。`,
      audio: `Play Audioは現在の文章を${snap.languageLabel}で読み上げます。録音評価はブラウザの音声認識が使える時に現在の文章と比べます。`,
      profile: `プロフィール: ${snap.displayName} (@${snap.username})、followers ${snap.followers}、following ${snap.following}、friends ${snap.friends}、collection ${snap.collection}/16、level ${snap.level.level}。`,
      media: `ローカルではファイル名、種類、サイズ、画像の幅と高さ、音声や動画の長さを読めます。文字認識や内容理解にはローカルMLモデルか別サーバーが必要です。`,
      purchase: `CoinsとStoreは今ローカルデータです。実際の購入には支払い用サーバーとwebhookが必要で、秘密キーはGitHub PagesやHTMLに入れられません。`,
      chat: `DMとlive chatは今ブラウザ内データです。本物のユーザー間チャットには認証、データベース、realtime backendが必要です。`,
      music: `Music Playerは下のバーを開き、展開するとプレイリストを見せます。今はローカルのデモ曲です。`,
      slots: `Mini SlotsはローカルのBetとReelsで動きます。実際のお金にはつなげません。`,
      language: `使える言語はRussian, Japanese, Mandarin, Hindi, Arabicです。切り替えると単語、物語、実績、文字方向、音声が変わります。`
    },
    mandarin: {
      default: `我只根据这个网站里的本地数据回答。当前学习语言是${snap.languageLabel}，页面是${snap.view}，已学单词${snap.learnedWords}/${snap.wordsTotal}。`,
      practice: `Practice 显示当前段落“${snap.practiceTitle}”、已学词汇和悬停翻译。Translate 按钮会显示整页英文意思。`,
      stories: `${snap.languageLabel}故事库有${snap.storiesTotal}篇。当前是“${snap.storyTitle}”，等级${snap.storyLevel}，第${snap.storyPage}/${snap.storyPages}页。`,
      audio: `Play Audio 会用${snap.languageLabel}朗读当前段落或故事页。录音评分会在浏览器支持语音识别时和当前文本比较。`,
      profile: `个人资料：${snap.displayName} (@${snap.username})，followers ${snap.followers}，following ${snap.following}，friends ${snap.friends}，collection ${snap.collection}/16，level ${snap.level.level}。`,
      media: `本地可以读取文件名、类型、大小、图片尺寸、音频或视频时长。真正识别图片文字、物体或语音内容需要本地机器学习模型或服务器。`,
      purchase: `Coins 和 Store 现在是本地数据：${snap.coins} coins。真实购买需要支付服务器和 webhook，密钥不能放在 HTML 或 GitHub Pages。`,
      chat: `DM 和 live chat 现在是浏览器数据。真实用户聊天需要登录、数据库和实时后端。`,
      music: `Music Player 会打开底部播放条，展开后显示播放列表。现在使用本地示例歌曲。`,
      slots: `Mini Slots 使用本地 Bet 和 Reels 设置，不连接真钱。`,
      language: `可用语言：Russian、Japanese、Mandarin、Hindi、Arabic。切换后会改变词汇、故事、成就、文字方向和语音。`
    },
    hindi: {
      default: `मैं इस साइट के स्थानीय डेटा से ही जवाब देता हूं। अभी भाषा ${snap.languageLabel} है, पेज ${snap.view} है, और सीखे हुए शब्द ${snap.learnedWords}/${snap.wordsTotal} हैं।`,
      practice: `Practice में "${snap.practiceTitle}" वाला paragraph, सीखे हुए शब्द और hover translation दिखते हैं। Translate बटन पूरे text का English meaning दिखाता है।`,
      stories: `${snap.languageLabel} के लिए ${snap.storiesTotal} stories हैं। अभी "${snap.storyTitle}", level ${snap.storyLevel}, page ${snap.storyPage}/${snap.storyPages} खुला है।`,
      audio: `Play Audio मौजूदा paragraph या story page को ${snap.languageLabel} में पढ़ता है। Recording score browser speech recognition उपलब्ध होने पर text से तुलना करता है।`,
      profile: `Profile: ${snap.displayName} (@${snap.username}), followers ${snap.followers}, following ${snap.following}, friends ${snap.friends}, collection ${snap.collection}/16, level ${snap.level.level}.`,
      media: `Local mode में मैं file name, type, size, image dimensions और audio/video duration पढ़ सकता हूं। असली OCR, object पहचान या speech transcription के लिए local ML model या server चाहिए।`,
      purchase: `Coins और Store अभी local हैं: ${snap.coins} coins। Real purchases के लिए payment server और webhook चाहिए; secret keys HTML या GitHub Pages में नहीं रखे जा सकते।`,
      chat: `DMs और live chat अभी browser data हैं। Real users के लिए auth, database और realtime backend चाहिए।`,
      music: `Music Player bottom bar खोलता है और expand होने पर playlist दिखाता है। अभी songs local demo हैं।`,
      slots: `Mini Slots local Bet और Reels settings से चलता है। यह real money से जुड़ा नहीं है।`,
      language: `Languages: Russian, Japanese, Mandarin, Hindi और Arabic. Switch करने पर words, stories, achievements, text direction और voice बदलते हैं।`
    },
    arabic: {
      default: `أنا أجيب من بيانات هذا الموقع محليا فقط. اللغة الحالية ${snap.languageLabel}، الصفحة ${snap.view}، والكلمات المتعلمة ${snap.learnedWords}/${snap.wordsTotal}.`,
      practice: `قسم Practice يعرض الفقرة "${snap.practiceTitle}" وقائمة الكلمات المتعلمة وترجمة عند تمرير المؤشر. زر Translate يعرض المعنى بالإنجليزية للنص كله.`,
      stories: `مكتبة ${snap.languageLabel} فيها ${snap.storiesTotal} قصة. الحالي: "${snap.storyTitle}"، المستوى ${snap.storyLevel}، الصفحة ${snap.storyPage}/${snap.storyPages}.`,
      audio: `Play Audio يقرأ الفقرة أو صفحة القصة الحالية بلغة ${snap.languageLabel}. التسجيل يقارن صوتك بالنص عندما يدعم المتصفح التعرف على الكلام.`,
      profile: `الملف: ${snap.displayName} (@${snap.username})، followers ${snap.followers}، following ${snap.following}، friends ${snap.friends}، collection ${snap.collection}/16، level ${snap.level.level}.`,
      media: `محليا أستطيع قراءة اسم الملف ونوعه وحجمه وأبعاد الصورة ومدة الصوت أو الفيديو. فهم النص داخل الصورة أو الكلام يحتاج نموذجا محليا أو خادما منفصلا.`,
      purchase: `Coins و Store حاليا بيانات محلية: ${snap.coins} coins. الشراء الحقيقي يحتاج خادم دفع و webhook، ولا يمكن وضع الأسرار في HTML أو GitHub Pages.`,
      chat: `DMs و live chat حاليا بيانات في المتصفح. لجعلها حقيقية بين المستخدمين نحتاج تسجيل دخول وقاعدة بيانات و realtime backend.`,
      music: `Music Player يفتح شريطا في الأسفل، وعند التوسيع يعرض playlist. حاليا هو demo محلي.`,
      slots: `Mini Slots يستخدم Bet و Reels محليا ولا يتصل بمال حقيقي.`,
      language: `اللغات المتاحة: Russian و Japanese و Mandarin و Hindi و Arabic. عند التبديل تتغير الكلمات والقصص والإنجازات واتجاه النص والصوت.`
    }
  };
  return (replies[key] || replies.russian)[topic] || (replies[key] || replies.russian).default;
}

function offlineChatReply(text) {
  return buildLocalChatReply(getLocalChatTopic(text), text);
}

async function getChatbotReply(text) {
  return offlineChatReply(text);
}

function appendGlobalChatMessage(author, text, type = "site") {
  if (!els.twitchMessages) return;
  const msg = document.createElement("div");
  msg.className = `twitch-msg ${type}`;
  const name = document.createElement("strong");
  name.textContent = author;
  const body = document.createElement("span");
  body.textContent = ` ${text}`;
  msg.append(name, body);
  els.twitchMessages.append(msg);
  els.twitchMessages.scrollTop = els.twitchMessages.scrollHeight;
}

const twitchSimulatedChat = [
  ["WordRunner", "That hover translation helped me remember the new word."],
  ["KanaQuest", "First five songs are free, then unlock with coins."],
  ["GrammarGrind", "Try Stories after Practice if you want longer reading."],
  ["MoscowMode", "Play Audio is good for checking rhythm before recording."],
  ["HindiHero", "The profile stats update from pronunciation practice."],
  ["ArabLearner", "Switch languages from the top selector to change stories and voices."],
  ["MandarinMax", "Collection items can appear inside story pages and images."],
  ["CoinCoach", "Mini Slots uses local coins only, not real money."]
];
let twitchSimulatedIndex = 0;
let twitchSimulatedTimer = null;

function startTwitchSimulation() {
  if (twitchSimulatedTimer) return;
  twitchSimulatedTimer = setInterval(() => {
    if (!els.twitchChat || els.twitchChat.hidden) return;
    const [author, text] = twitchSimulatedChat[twitchSimulatedIndex % twitchSimulatedChat.length];
    twitchSimulatedIndex += 1;
    appendGlobalChatMessage(author, text, "viewer");
  }, 4200);
}

function renderGlobalChatKnowledge() {
  if (!els.twitchMessages || els.twitchMessages.dataset.ready === "true") return;
  els.twitchMessages.dataset.ready = "true";
  appendGlobalChatMessage("Site Guide", "Ask me about stories, practice, audio, profiles, DMs, coins, music, slots, settings, languages, or purchases.");
  appendGlobalChatMessage("Site Guide", offlineChatReply("language"));
  twitchSimulatedChat.slice(0, 4).forEach(([author, text]) => appendGlobalChatMessage(author, text, "viewer"));
  startTwitchSimulation();
}

function sendGlobalChatMessage() {
  const text = els.globalChatInput?.value?.trim();
  if (!text) return;
  els.globalChatInput.value = "";
  appendGlobalChatMessage("You", text, "user");
  appendGlobalChatMessage("Site Guide", offlineChatReply(text), "site");
}

els.chatLanguageSelect?.addEventListener("change", updateChatIntro);

els.chatToggleBtn.addEventListener("click", () => {
  els.chatWindow.hidden = !els.chatWindow.hidden;
  if (!els.chatWindow.hidden) {
    updateChatIntro();
  }
});
els.closeChatBtn.addEventListener("click", () => els.chatWindow.hidden = true);
els.globalChatSendBtn?.addEventListener("click", sendGlobalChatMessage);
els.globalChatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendGlobalChatMessage();
});

function appendChat(text, type, options = {}) {
  const msg = document.createElement("div");
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  const config = chatLanguages[activeChatLanguageKey()] || chatLanguages.russian;
  msg.lang = config.speechLang.slice(0, 2);
  msg.dir = activeChatLanguageKey() === "arabic" ? "rtl" : "ltr";
  els.chatMessages.append(msg);
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  if (type === "ai" && options.speak) speakChatText(text);
}

async function sendChatMessage() {
  const text = els.chatInput.value.trim();
  if (!text) return;
  const detectedLanguage = detectChatLanguageFromText(text);
  if (detectedLanguage && chatLanguages[detectedLanguage] && els.chatLanguageSelect) {
    els.chatLanguageSelect.value = detectedLanguage;
    updateChatIntro();
  }
  els.chatInput.value = "";
  appendChat(text, "user");
  chatHistory.push({ role: "user", content: text });
  els.chatSendBtn.disabled = true;
  const thinking = document.createElement("div");
  thinking.className = "chat-msg ai is-thinking";
  thinking.textContent = "Nova is thinking...";
  els.chatMessages.append(thinking);
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  try {
    const reply = await getChatbotReply(text);
    thinking.remove();
    appendChat(reply, "ai", { speak: true });
    chatHistory.push({ role: "assistant", content: reply });
    while (chatHistory.length > 10) chatHistory.shift();
  } catch (error) {
    thinking.remove();
    const reply = offlineChatReply(text);
    appendChat(reply, "ai", { speak: true });
    chatHistory.push({ role: "assistant", content: reply });
  } finally {
    els.chatSendBtn.disabled = false;
  }
}

els.chatSendBtn.addEventListener("click", sendChatMessage);
els.chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendChatMessage();
});

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return "unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getMediaMetadata(file, kind) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const done = (extra = "") => {
      URL.revokeObjectURL(url);
      resolve(extra);
    };
    if (kind === "image") {
      const image = new Image();
      image.onload = () => done(` Dimensions: ${image.naturalWidth}x${image.naturalHeight}.`);
      image.onerror = () => done("");
      image.src = url;
      return;
    }
    const media = document.createElement(kind === "video" ? "video" : "audio");
    media.preload = "metadata";
    media.onloadedmetadata = () => {
      const duration = Number.isFinite(media.duration) ? ` Duration: ${media.duration.toFixed(1)} seconds.` : "";
      done(duration);
    };
    media.onerror = () => done("");
    media.src = url;
  });
}

async function handleChatFile(file, kind) {
  if (!file) return;
  const label = kind === "image" ? "image" : kind === "video" ? "screen/video recording" : "voice/audio recording";
  appendChat(`[Uploaded ${label}: ${file.name}]`, "user");
  const extra = await getMediaMetadata(file, kind);
  const basic = `Local file read: ${file.name}. Type: ${file.type || "unknown"}. Size: ${formatFileSize(file.size)}.${extra}`;
  appendChat(`${basic} ${offlineChatReply("uploaded image video voice media")}`, "ai", { speak: true });
}

els.uploadScreenshotBtn.addEventListener("click", () => els.chatImageInput?.click());
els.uploadVideoBtn.addEventListener("click", () => els.chatVideoInput?.click());
els.uploadVoiceBtn.addEventListener("click", () => els.chatAudioInput?.click());
els.uploadTranscribeBtn.addEventListener("click", () => els.chatAudioInput?.click());
els.chatImageInput?.addEventListener("change", (event) => {
  handleChatFile(event.target.files?.[0], "image");
  event.target.value = "";
});
els.chatVideoInput?.addEventListener("change", (event) => {
  handleChatFile(event.target.files?.[0], "video");
  event.target.value = "";
});
els.chatAudioInput?.addEventListener("change", (event) => {
  handleChatFile(event.target.files?.[0], "audio");
  event.target.value = "";
});

// --- SPOTIFY MUSIC PLAYER ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let currentOsc = null;
let noteInterval = null;
let currentAudio = null;
const demoSongs = [
  { id: 1, title: "Morning Walk", album: "Language Learners Vol. 1", duration: "1:20", notes: [261.63, 293.66, 329.63, 349.23], price: 0 },
  { id: 2, title: "City Lights", album: "Language Learners Vol. 1", duration: "2:05", notes: [440.00, 493.88, 523.25, 587.33], price: 50 },
  { id: 3, title: "History's Echo", album: "Classics", duration: "3:10", notes: [220.00, 246.94, 261.63, 329.63], price: 150 },
  { id: 4, title: "Road to Winter", album: "Seasons", duration: "4:00", notes: [392.00, 349.23, 329.63, 261.63], price: 300 },
  { id: 5, title: "Polyglot Anthem", album: "Language Learners Vol. 2", duration: "5:30", notes: [523.25, 587.33, 659.25, 698.46], price: 1000 }
];
let activeSongIndex = 0;

function getLanguageSongs() {
  const manifest = window.languageMusicManifest || {};
  const tracks = manifest[appState.targetLanguage] || [];
  return tracks.length ? tracks : demoSongs;
}

function isSongUnlocked(song, index) {
  return song.free || song.price === 0 || index < 5 || appState.unlockedSongs.includes(song.id);
}

function getActiveSongList() {
  const list = getLanguageSongs();
  if (activeSongIndex >= list.length) activeSongIndex = 0;
  return list;
}

function renderSpotifyPlaylist() {
  const songs = getActiveSongList();
  els.spotifyPlaylist.replaceChildren(...songs.map((song, i) => {
    const isUnlocked = isSongUnlocked(song, i);
    const tr = document.createElement("tr");
    tr.className = isUnlocked ? "spotify-song-row is-unlocked" : "spotify-song-row is-locked";
    if (i === activeSongIndex) tr.classList.add("is-active");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(i + 1);

    const titleCell = document.createElement("td");
    titleCell.className = "spotify-title-cell";
    const cover = document.createElement("div");
    cover.className = "spotify-row-cover";
    if (song.cover) {
      const img = document.createElement("img");
      img.src = encodeURI(resolveMediaUrl(song.cover));
      img.alt = `${song.album || song.title} cover`;
      img.addEventListener("error", () => cover.replaceChildren(createMusicCoverFallback(song)), { once: true });
      cover.append(img);
    } else {
      cover.append(createMusicCoverFallback(song));
    }
    const titleCopy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = song.title;
    const meta = document.createElement("small");
    meta.textContent = `${song.artist || "Language Artist"} - ${song.album || "Language Music"}`;
    titleCopy.append(title, document.createElement("br"), meta);
    titleCell.append(cover, titleCopy);

    const statusCell = document.createElement("td");
    statusCell.textContent = isUnlocked ? (i < 5 ? "Free" : "Unlocked") : "Locked";

    const durationCell = document.createElement("td");
    durationCell.textContent = song.duration || "--";

    const actionCell = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.index = String(i);
    button.className = isUnlocked ? "player-btn play-row-btn" : "spotify-unlock-btn";
    button.textContent = isUnlocked ? "Play" : `Unlock (${song.price} coins)`;
    actionCell.append(button);

    tr.append(numberCell, titleCell, statusCell, durationCell, actionCell);
    button.addEventListener("click", () => {
      if (isUnlocked) {
        activeSongIndex = i;
        updatePlayerUI();
        if (!appState.isPlaying) togglePlay();
        return;
      }
      if (appState.coins >= song.price) {
        updateCoins(-song.price);
        appState.unlockedSongs.push(song.id);
        localStorage.setItem("nova_unlocked_songs", JSON.stringify(appState.unlockedSongs));
        renderSpotifyPlaylist();
        updatePlayerUI();
      } else {
        alert("Not enough coins.");
      }
    });
    return tr;
  }));
}

function highlightActiveSongRow() {
  if (!els.spotifyPlaylist) return;
  [...els.spotifyPlaylist.querySelectorAll(".spotify-song-row")].forEach((row, index) => {
    row.classList.toggle("is-active", index === activeSongIndex);
  });
}

function playSynthSong(song) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (currentOsc) {
    currentOsc.stop();
    clearInterval(noteInterval);
  }
  let step = 0;
  noteInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(song.notes[step % song.notes.length], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
    step++;
  }, 500);
  currentOsc = { stop: () => clearInterval(noteInterval) };
}

function playAudioSong(song) {
  if (currentOsc) {
    currentOsc.stop();
    clearInterval(noteInterval);
    currentOsc = null;
  }
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(encodeURI(resolveMediaUrl(song.src)));
  currentAudio.addEventListener("ended", () => {
    appState.isPlaying = false;
    els.playSongBtn.textContent = "Play";
    els.songStatus.textContent = "Paused";
  });
  currentAudio.play().catch((error) => {
    els.songStatus.textContent = "Could not play file";
    console.warn("Music playback failed", error);
  });
}

function createMusicCoverFallback(song) {
  const fallback = document.createElement("div");
  fallback.className = "music-cover-fallback";
  fallback.setAttribute("aria-label", `${song.album || song.title || "Language music"} cover fallback`);
  fallback.textContent = (song.title || "LL").trim().slice(0, 1).toUpperCase();
  return fallback;
}

function renderSongArtwork(song) {
  if (!els.songArtwork) return;
  els.songArtwork.replaceChildren();
  if (!song.cover) {
    els.songArtwork.append(createMusicCoverFallback(song));
    return;
  }
  const img = document.createElement("img");
  img.src = encodeURI(resolveMediaUrl(song.cover));
  img.alt = `${song.album || song.title} cover`;
  img.addEventListener("error", () => {
    els.songArtwork.replaceChildren(createMusicCoverFallback(song));
  }, { once: true });
  els.songArtwork.append(img);
}

els.playSongBtn.addEventListener("click", togglePlay);
els.nextSongBtn.addEventListener("click", () => {
  const songs = getActiveSongList();
  activeSongIndex = (activeSongIndex + 1) % songs.length;
  updatePlayerUI();
});
els.prevSongBtn.addEventListener("click", () => {
  const songs = getActiveSongList();
  activeSongIndex = (activeSongIndex - 1 + songs.length) % songs.length;
  updatePlayerUI();
});

function updatePlayerUI() {
  const songs = getActiveSongList();
  const song = songs[activeSongIndex] || songs[0];
  if (!song) return;
  if (!isSongUnlocked(song, activeSongIndex)) {
    if (currentOsc) currentOsc.stop();
    if (currentAudio) currentAudio.pause();
    els.currentSongTitle.textContent = `${song.title} - locked`;
    els.songStatus.textContent = `Unlock for ${song.price} coins`;
    renderSongArtwork(song);
    appState.isPlaying = false;
    els.playSongBtn.textContent = "Play";
    highlightActiveSongRow();
    return;
  }
  els.currentSongTitle.textContent = song.title;
  els.songStatus.textContent = appState.isPlaying ? "Playing" : "Paused";
  renderSongArtwork(song);
  highlightActiveSongRow();
  if (appState.isPlaying) {
    if (currentOsc) currentOsc.stop();
    if (song.src) playAudioSong(song);
    else playSynthSong(song);
  }
}

function togglePlay() {
  const songs = getActiveSongList();
  const song = songs[activeSongIndex] || songs[0];
  if (!song) return;
  if (appState.isPlaying) {
    if (currentOsc) currentOsc.stop();
    if (currentAudio) currentAudio.pause();
    appState.isPlaying = false;
    els.playSongBtn.textContent = "Play";
    els.songStatus.textContent = "Paused";
    return;
  }
  if (!isSongUnlocked(song, activeSongIndex)) {
    els.songStatus.textContent = `Unlock for ${song.price} coins`;
    return;
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  appState.isPlaying = true;
  els.playSongBtn.textContent = "Pause";
  els.songStatus.textContent = "Playing";
  updatePlayerUI();
}

// --- PROFILE & CHARACTER LAB ---
const inappropriateWords = [
  "bad", "rude", "mean", "hate", "violent", "sexual", "kill", "drug", "spam", "scam",
  "admin", "moderator", "support", "official", "fuck", "shit", "bitch", "asshole",
  "nazi", "terror", "abuse", "predator"
];
const usernameCooldownMs = 7 * 24 * 60 * 60 * 1000;
const socialSearchState = { followers: "", following: "", friends: "" };
let activeSocialPerson = null;
const defaultSocial = {
  followers: ["Mila Petrova", "Alexei Romanov", "Sofia Ivanova", "Nadia Volkova", "Dima Sokolov", "Irina Orlova", "Pavel Morozov", "Lena Smirnova"],
  following: ["Russian Daily", "Moscow Reader", "Grammar Coach", "Speak Slow Club", "Cafe Phrases", "Story Lab"],
  friends: ["Mila Petrova", "Dima Sokolov", "Lena Smirnova", "Oleg Kuznetsov"]
};
const socialProfilePool = [
  "Mila Petrova", "Alexei Romanov", "Sofia Ivanova", "Nadia Volkova", "Dima Sokolov", "Irina Orlova",
  "Pavel Morozov", "Lena Smirnova", "Oleg Kuznetsov", "Yuki Tanaka", "Hana Sato", "Mei Lin",
  "Chen Wei", "Aarav Sharma", "Priya Patel", "Fatima Haddad", "Omar Nasser", "Sara Khan",
  "Noah Reed", "Emma Clark", "Nikolai Orlov", "Anika Rao", "Layla Mansour", "Takashi Mori"
];
const profileSettingsDefaults = {
  showFollowers: true,
  showFollowing: true,
  showFriends: true,
  compactProfile: false,
  reduceMotion: false,
  muteAssistant: false,
  audioRate: 1,
  notifyMessages: true,
  notifyAchievements: true,
  profileTheme: "system",
  autoMatchChatLanguage: true,
  autoTranslate: false,
  allowFriendRequests: true,
  filterMessages: true,
  characterGuide: true
};
const publicSocialSearchState = { followers: "", following: "", friends: "" };
let activePublicProfile = null;
let publicProfileStack = [];
const socialGraphKey = "nova_social_graph_v1";
const socialMessagesKey = "nova_social_messages_v1";
const socialFriendRequestsKey = "nova_friend_requests_v1";
const socialGroupChatsKey = "nova_group_chats_v1";

function normalizeProfileSettings(settings = {}) {
  return {
    ...profileSettingsDefaults,
    ...settings,
    audioRate: Math.min(1.4, Math.max(0.6, Number(settings.audioRate || profileSettingsDefaults.audioRate))),
    profileTheme: ["system", "light", "warm", "focus"].includes(settings.profileTheme) ? settings.profileTheme : "system"
  };
}

function saveProfileSettings() {
  appState.settings = normalizeProfileSettings(appState.settings);
  localStorage.setItem("nova_profile_settings", JSON.stringify(appState.settings));
  applyProfileSettings();
  if (els.profileSettingsStatus) els.profileSettingsStatus.textContent = "Settings saved.";
}

function applyProfileSettings() {
  const settings = normalizeProfileSettings(appState.settings);
  document.documentElement.classList.toggle("profile-compact", settings.compactProfile);
  document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion);
  document.documentElement.dataset.profileTheme = settings.profileTheme;
  if (els.playbackSpeed) {
    els.playbackSpeed.value = String(settings.audioRate);
    handleSpeedChange({ target: els.playbackSpeed }, els.speedLabel);
  }
  if (els.playbackSpeedStories) {
    els.playbackSpeedStories.value = String(settings.audioRate);
    handleSpeedChange({ target: els.playbackSpeedStories }, els.speedLabelStories);
  }
}

function renderProfileSettings() {
  appState.settings = normalizeProfileSettings(appState.settings);
  const s = appState.settings;
  if (els.settingShowFollowers) els.settingShowFollowers.checked = s.showFollowers;
  if (els.settingShowFollowing) els.settingShowFollowing.checked = s.showFollowing;
  if (els.settingShowFriends) els.settingShowFriends.checked = s.showFriends;
  if (els.settingCompactProfile) els.settingCompactProfile.checked = s.compactProfile;
  if (els.settingReduceMotion) els.settingReduceMotion.checked = s.reduceMotion;
  if (els.settingMuteAssistant) els.settingMuteAssistant.checked = s.muteAssistant;
  if (els.settingAudioRate) els.settingAudioRate.value = String(s.audioRate);
  if (els.settingAudioRateValue) els.settingAudioRateValue.textContent = `${Number(s.audioRate).toFixed(1)}x`;
  if (els.settingNotifyMessages) els.settingNotifyMessages.checked = s.notifyMessages;
  if (els.settingNotifyAchievements) els.settingNotifyAchievements.checked = s.notifyAchievements;
  if (els.settingProfileTheme) els.settingProfileTheme.value = s.profileTheme;
  if (els.settingAutoMatchChatLanguage) els.settingAutoMatchChatLanguage.checked = s.autoMatchChatLanguage;
  if (els.settingAutoTranslate) els.settingAutoTranslate.checked = s.autoTranslate;
  if (els.settingAllowFriendRequests) els.settingAllowFriendRequests.checked = s.allowFriendRequests;
  if (els.settingFilterMessages) els.settingFilterMessages.checked = s.filterMessages;
  if (els.characterGuideToggle) els.characterGuideToggle.checked = s.characterGuide;
  applyProfileSettings();
}

appState.settings = normalizeProfileSettings(appState.settings);

function mergeSocialPeople(saved = [], defaults = []) {
  return Array.from(new Set([...(Array.isArray(saved) ? saved : []), ...defaults]));
}
const mascotOptions = [
  "🦊", "🐉", "🐼", "🐯", "🐰", "🐻", "🐺", "🦅",
  "🐸", "🦭", "🦁", "🐒", "🐘", "🐙", "🐧", "🦄",
  "🐢", "🦋", "🐍", "🐴", "🦌", "🦇", "🐳", "🦍",
  "🦏", "🦛", "🐊", "🦈", "🐪", "🦒", "🦘", "🦡"
];
const tierConfig = {
  standard: { label: "Standard", weight: 80, items: ["Phrase Card", "Metro Token", "Notebook", "Tea Cup", "Street Map", "Bread Stamp"], color: "#64748b" },
  rare: { label: "Rare", weight: 16, items: ["Silver Dictionary", "Blue Scarf", "Museum Pass", "Grammar Badge"], color: "#2563eb" },
  legendary: { label: "Legendary", weight: 4, items: ["Golden Samovar", "Winter Coat", "Master Reader Badge"], color: "#a855f7" },
  god: { label: "God", weight: 1, items: ["Aurora Crown", "Language Oracle"], color: "#f59e0b" }
};
const tierUnlockRules = {
  standard: { tasks: 0, label: "Unlocked from the start" },
  rare: { tasks: 4, label: "Complete 4 reading tasks" },
  legendary: { tasks: 10, label: "Complete 10 reading tasks" },
  god: { tasks: 18, label: "Complete 18 reading tasks" }
};
let character3d = null;
let characterRotateFrame = null;
let publicCharacter3d = null;
let publicCharacterRotateFrame = null;
let loadingThree = false;

function checkInappropriate(text) {
  const normalized = text.toLowerCase()
    .replace(/[@$!0]/g, (char) => ({ "@": "a", "$": "s", "!": "i", "0": "o" }[char] || char))
    .replace(/[^a-zа-яё0-9]+/gi, "");
  return inappropriateWords.some(word => normalized.includes(word));
}

function enforceCleanProfileField(input, label) {
  if (!input) return;
  const current = input.value;
  if (!checkInappropriate(current)) {
    input.dataset.cleanValue = current;
    if (els.profileSaveStatus?.dataset.reason === "blocked-language") {
      els.profileSaveStatus.textContent = "";
      delete els.profileSaveStatus.dataset.reason;
    }
    return;
  }
  input.value = input.dataset.cleanValue || "";
  if (els.profileSaveStatus) {
    els.profileSaveStatus.dataset.reason = "blocked-language";
    els.profileSaveStatus.textContent = `${label} cannot contain profanity or inappropriate words.`;
  }
  if (input === els.editBio) updateBioCount();
}

function normalizeProfile(profile = {}) {
  return {
    displayName: profile.displayName || "Connor",
    username: profile.username || "connor_ll",
    bio: profile.bio || "Learning Russian!",
    xp: Number(profile.xp || 0),
    lastUsernameChange: Number(profile.lastUsernameChange || 0),
    social: {
      followers: mergeSocialPeople(profile.social?.followers, defaultSocial.followers),
      following: mergeSocialPeople(profile.social?.following, defaultSocial.following),
      friends: mergeSocialPeople(profile.social?.friends, defaultSocial.friends)
    },
    customization: {
      mascot: profile.customization?.mascot || "Fox",
      hair: profile.customization?.hair || "short",
      eyeShape: profile.customization?.eyeShape || "round",
      nose: profile.customization?.nose || "soft",
      mouth: profile.customization?.mouth || "smile",
      arms: profile.customization?.arms || "relaxed",
      legs: profile.customization?.legs || "straight",
      shirt: profile.customization?.shirt || profile.customization?.outfit || "tee",
      pants: profile.customization?.pants || "slim",
      shoes: profile.customization?.shoes || "trainers",
      hairColor: profile.customization?.hairColor || "#2f241f",
      eyeColor: profile.customization?.eyeColor || profile.customization?.eyes || "#2b6cb0",
      faceColor: profile.customization?.faceColor || "#ed8936",
      shirtColor: profile.customization?.shirtColor || "#3182ce",
      pantsColor: profile.customization?.pantsColor || "#1f2937",
      shoesColor: profile.customization?.shoesColor || "#111827"
    },
    collection: Array.isArray(profile.collection) ? profile.collection.slice(0, 16) : [],
    storyProgress: {
      completedTasks: Number(profile.storyProgress?.completedTasks || 0),
      completedPages: Array.isArray(profile.storyProgress?.completedPages) ? profile.storyProgress.completedPages : [],
      claimedTreasures: Array.isArray(profile.storyProgress?.claimedTreasures) ? profile.storyProgress.claimedTreasures : []
    }
  };
}

function renderMascotAvatar(target, mascot, options = {}) {
  if (!target) return;
  const label = mascot || "LL";
  const size = options.small ? "1.15rem" : "3.1rem";
  target.innerHTML = `
    <div class="mascot-avatar-face" aria-label="Selected mascot">
      <span>${label}</span>
    </div>
  `;
  const face = target.querySelector(".mascot-avatar-face");
  if (face) {
    face.style.setProperty("--mascot-avatar-size", size);
    if (options.color) face.style.setProperty("--mascot-avatar-accent", options.color);
  }
}

function renderProfile() {
  const p = appState.profile;
  if (els.profileLayout) els.profileLayout.hidden = false;
  if (els.publicProfilePage) els.publicProfilePage.hidden = true;
  els.profileDisplayName.textContent = p.displayName;
  if (els.profileDisplayNameSummary) els.profileDisplayNameSummary.textContent = p.displayName;
  els.profileUsername.textContent = `@${p.username}`;
  if (els.profileUsernameSummary) els.profileUsernameSummary.textContent = `@${p.username}`;
  els.profileBioText.textContent = p.bio || "No bio yet.";
  
  const accentColor = p.customization?.avatarColor || "#f59e0b";
  document.documentElement.style.setProperty("--avatar-accent", accentColor);
  const avatarWrappers = document.querySelectorAll('.circular-avatar-wrapper');
  avatarWrappers.forEach(w => w.style.setProperty('--avatar-accent', accentColor));
  renderMascotAvatar(els.profilePageAvatarContainer, p.customization?.mascot, { color: accentColor });
  renderMascotAvatar(els.profileAvatarContainer, p.customization?.mascot, { color: accentColor, small: true });
  
  renderSocialList("friends");
  renderSocialList("followers");
  renderSocialList("following");
  els.followersCount.textContent = p.social.followers.length.toLocaleString();
  els.followingCount.textContent = p.social.following.length.toLocaleString();
  els.friendsCount.textContent = p.social.friends.length.toLocaleString();
  els.editDisplayName.value = p.displayName || "";
  els.editUsername.value = p.username || "";
  els.editBio.value = p.bio || "";
  els.editDisplayName.dataset.cleanValue = els.editDisplayName.value;
  els.editUsername.dataset.cleanValue = els.editUsername.value;
  els.editBio.dataset.cleanValue = els.editBio.value;
  updateBioCount();
  renderUsernameRule();
  renderMascotGrid();
  
  if (els.hairSelect) els.hairSelect.value = p.customization.hair;
  if (els.eyeShapeSelect) els.eyeShapeSelect.value = p.customization.eyeShape;
  if (els.noseSelect) els.noseSelect.value = p.customization.nose;
  if (els.mouthSelect) els.mouthSelect.value = p.customization.mouth;
  if (els.armSelect) els.armSelect.value = p.customization.arms;
  if (els.legSelect) els.legSelect.value = p.customization.legs;
  if (els.shirtSelect) els.shirtSelect.value = p.customization.shirt;
  if (els.pantsSelect) els.pantsSelect.value = p.customization.pants;
  if (els.shoesSelect) els.shoesSelect.value = p.customization.shoes;
  if (els.hairColor) els.hairColor.value = p.customization.hairColor;
  if (els.eyeColor) els.eyeColor.value = p.customization.eyeColor;
  if (els.faceColor) els.faceColor.value = p.customization.faceColor;
  if (els.shirtColor) els.shirtColor.value = p.customization.shirtColor;
  if (els.pantsColor) els.pantsColor.value = p.customization.pantsColor;
  if (els.shoesColor) els.shoesColor.value = p.customization.shoesColor;
  
  initCharacter3d();
  updateCharacterVisuals();
  renderCollection();
  renderProfilePracticeStats();
  renderLevelBar();
  renderAchievements();
  renderProfileSettings();
}

function renderProfilePracticeStats() {
  const stats = appState.lastPracticeScore || {};
  if (els.profileBestAccuracy) els.profileBestAccuracy.textContent = stats.bestAccuracy !== undefined ? `${stats.bestAccuracy}%` : "--";
  if (els.profileLastAccuracy) els.profileLastAccuracy.textContent = stats.lastAccuracy !== undefined ? `${stats.lastAccuracy}%` : "--";
  if (els.profileWordsMatched) els.profileWordsMatched.textContent = stats.lastMatched !== undefined ? `${stats.lastMatched}/${stats.lastTotal || 0}` : "--";
  if (els.profileMismatchedWords) els.profileMismatchedWords.textContent = stats.lastMissed !== undefined ? String(stats.lastMissed) : "--";
}

function renderSocialList(type) {
  const listMap = { followers: els.followersList, following: els.followingList, friends: els.friendsList };
  const people = appState.profile.social[type] || [];
  const query = socialSearchState[type] || "";
  const listEl = listMap[type];
  const filtered = people.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  listEl.replaceChildren(...filtered.map((name) => {
    const li = document.createElement("li");
    const initials = name.split(" ").map(part => part[0]).join("").slice(0, 2);
    li.dataset.person = name;
    li.dataset.socialType = type;
    li.innerHTML = `
      <button class="social-person-btn" type="button">
        <span>${initials}</span>
        <strong>${name}</strong>
      </button>
    `;
    li.querySelector(".social-person-btn")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openPersonProfile(name);
    });
    return li;
  }));
  if (!filtered.length) {
    const li = document.createElement("li");
    li.className = "social-empty";
    li.textContent = "No matches";
    listEl.append(li);
  }
}

function toggleSocialDropdown(type) {
  const group = document.querySelector(`[data-social-group="${type}"]`);
  const dropdown = group?.querySelector(".social-dropdown");
  if (!dropdown) return;
  const opening = dropdown.hidden;
  document.querySelectorAll(".social-group").forEach((item) => {
    if (item !== group) {
      item.classList.remove("is-open");
      const otherDropdown = item.querySelector(".social-dropdown");
      if (otherDropdown) otherDropdown.hidden = true;
    }
  });
  if (opening) {
    socialSearchState[type] = "";
    const input = dropdown.querySelector("input");
    if (input) input.value = "";
    renderSocialList(type);
  }
  dropdown.hidden = !opening;
  group.classList.toggle("is-open", opening);
  if (opening) dropdown.querySelector("input")?.focus();
}

function hashString(value) {
  return Array.from(String(value)).reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function profileHandleFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function seededPeople(name, type, count) {
  const pool = socialProfilePool.filter((person) => person !== name);
  const seed = Math.abs(hashString(`${name}:${type}`));
  return Array.from({ length: count }, (_, index) => pool[(seed + index * 5) % pool.length])
    .filter((person, index, arr) => arr.indexOf(person) === index);
}

function buildSocialProfile(name) {
  const hash = Math.abs(hashString(name));
  const language = languageDatasets[appState.targetLanguage]?.label || "Russian";
  const social = {
    followers: seededPeople(name, "followers", 7 + (hash % 5)),
    following: seededPeople(name, "following", 5 + (hash % 4)),
    friends: seededPeople(name, "friends", 4 + (hash % 4))
  };
  return {
    name,
    handle: profileHandleFromName(name),
    bio: `${name} is practicing ${language} reading, listening, and vocabulary. Current focus: stories, pronunciation, and learned words.`,
    social,
    privacy: {
      showFollowers: hash % 7 !== 0,
      showFollowing: hash % 6 !== 0,
      showFriends: hash % 5 !== 0
    },
    updatedAt: Date.now()
  };
}

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const socialDataStore = {
  readGraph() {
    return readLocalJson(socialGraphKey, {});
  },
  writeGraph(graph) {
    localStorage.setItem(socialGraphKey, JSON.stringify(graph));
  },
  getOwnName() {
    return appState.profile?.displayName || "Connor";
  },
  getProfile(name) {
    const graph = this.readGraph();
    if (!graph[name]) {
      graph[name] = buildSocialProfile(name);
      this.writeGraph(graph);
    }
    return graph[name];
  },
  saveProfile(profile) {
    const graph = this.readGraph();
    graph[profile.name] = { ...profile, updatedAt: Date.now() };
    this.writeGraph(graph);
    return graph[profile.name];
  },
  syncOwnProfileFromApp() {
    if (!appState.profile) return;
    const ownName = this.getOwnName();
    const graph = this.readGraph();
    const existing = graph[ownName] || buildSocialProfile(ownName);
    const mergedSocial = {
      followers: mergeSocialPeople(appState.profile.social?.followers, existing.social?.followers),
      following: mergeSocialPeople(appState.profile.social?.following, existing.social?.following),
      friends: mergeSocialPeople(appState.profile.social?.friends, existing.social?.friends)
    };
    graph[ownName] = {
      ...existing,
      name: ownName,
      handle: appState.profile.username || existing.handle,
      bio: appState.profile.bio || existing.bio,
      social: mergedSocial,
      privacy: {
        showFollowers: appState.settings?.showFollowers !== false,
        showFollowing: appState.settings?.showFollowing !== false,
        showFriends: appState.settings?.showFriends !== false
      },
      updatedAt: Date.now()
    };
    appState.profile.social = mergedSocial;
    this.writeGraph(graph);
  },
  readFriendRequests() {
    return readLocalJson(socialFriendRequestsKey, []);
  },
  writeFriendRequests(requests) {
    localStorage.setItem(socialFriendRequestsKey, JSON.stringify(requests));
  },
  sendFriendRequest(to) {
    const ownName = this.getOwnName();
    const requests = this.readFriendRequests();
    const existing = requests.find((request) => request.from === ownName && request.to === to && request.status === "pending");
    if (existing) return existing;
    const request = {
      id: `friend-${Date.now()}-${Math.abs(hashString(`${ownName}:${to}`))}`,
      from: ownName,
      to,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    requests.push(request);
    this.writeFriendRequests(requests.slice(-200));
    return request;
  },
  acceptFriendRequest(id) {
    const requests = this.readFriendRequests();
    const request = requests.find((item) => item.id === id);
    if (!request) return null;
    request.status = "accepted";
    const graph = this.readGraph();
    const own = graph[request.to] || buildSocialProfile(request.to);
    const target = graph[request.from] || buildSocialProfile(request.from);
    own.social.friends = mergeSocialPeople(own.social.friends, [request.from]);
    target.social.friends = mergeSocialPeople(target.social.friends, [request.to]);
    graph[request.to] = { ...own, updatedAt: Date.now() };
    graph[request.from] = { ...target, updatedAt: Date.now() };
    this.writeGraph(graph);
    this.writeFriendRequests(requests);
    if (request.to === this.getOwnName()) {
      appState.profile.social = graph[request.to].social;
      saveProfile();
    }
    return request;
  },
  readMessages() {
    return readLocalJson(socialMessagesKey, []);
  },
  writeMessages(messages) {
    localStorage.setItem(socialMessagesKey, JSON.stringify(messages));
  },
  pendingMessagesTo(name) {
    return this.readMessages().filter((message) => message.to === name && message.status === "pending").length;
  },
  sendMessage(to, text) {
    const messages = this.readMessages();
    const message = {
      id: `msg-${Date.now()}-${Math.abs(hashString(`${to}:${text}`))}`,
      from: this.getOwnName(),
      to,
      text,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    messages.push(message);
    this.writeMessages(messages.slice(-200));
    return this.pendingMessagesTo(to);
  },
  readGroupChats() {
    const groups = readLocalJson(socialGroupChatsKey, null);
    if (groups) return groups;
    const defaults = [
      { id: "group-polyglot", name: "Polyglot Practice", members: ["Connor", "Mila Petrova", "Aarav Sharma"], lastMessage: "Share today's reading score.", updatedAt: new Date().toISOString() },
      { id: "group-story", name: "Story Club", members: ["Connor", "Sofia Ivanova", "Yuki Tanaka"], lastMessage: "Pick a beginner story and read aloud.", updatedAt: new Date().toISOString() }
    ];
    localStorage.setItem(socialGroupChatsKey, JSON.stringify(defaults));
    return defaults;
  }
};

function formatSocialTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function makeDMSection(title, rows) {
  const section = document.createElement("section");
  section.className = "dm-section";
  const heading = document.createElement("h4");
  heading.textContent = title;
  section.append(heading);
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "dm-empty";
    empty.textContent = "Nothing here yet.";
    section.append(empty);
    return section;
  }
  rows.forEach((row) => section.append(row));
  return section;
}

function makeDMRow({ title, preview, meta, actionLabel, actionId, person }) {
  const row = document.createElement("article");
  row.className = "dm-thread";
  if (person) row.dataset.person = person;
  const initials = title.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const avatar = document.createElement("div");
  avatar.className = "dm-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = initials;
  const copy = document.createElement("div");
  copy.className = "dm-copy";
  const titleEl = document.createElement("strong");
  titleEl.textContent = title;
  const previewEl = document.createElement("span");
  previewEl.className = "dm-preview";
  previewEl.textContent = preview;
  const metaEl = document.createElement("small");
  metaEl.textContent = meta;
  copy.append(titleEl, previewEl, metaEl);
  row.append(avatar, copy);
  if (actionId) {
    const button = document.createElement("button");
    button.className = "dm-inline-action";
    button.type = "button";
    button.dataset.acceptRequest = actionId;
    button.textContent = actionLabel || "Accept";
    row.append(button);
  }
  return row;
}

function renderDMInbox() {
  if (!els.dmList) return;
  const ownName = socialDataStore.getOwnName();
  const requests = socialDataStore.readFriendRequests();
  const messages = socialDataStore.readMessages();
  const groups = socialDataStore.readGroupChats();
  const pendingRequests = requests
    .filter((request) => request.status === "pending")
    .map((request) => {
      const incoming = request.to === ownName;
      return makeDMRow({
        title: incoming ? request.from : request.to,
        preview: incoming ? "Sent you a friend request." : "Friend request sent.",
        meta: formatSocialTime(request.createdAt),
        actionId: incoming ? request.id : "",
        actionLabel: "Accept",
        person: incoming ? request.from : request.to
      });
    });
  const pendingMessages = messages
    .filter((message) => message.status === "pending" && (message.to === ownName || message.from === ownName))
    .slice(-20)
    .reverse()
    .map((message) => makeDMRow({
      title: message.from === ownName ? message.to : message.from,
      preview: `${message.from === ownName ? "You: " : ""}${message.text}`,
      meta: formatSocialTime(message.createdAt),
      person: message.from === ownName ? message.to : message.from
    }));
  const sentMessages = messages
    .filter((message) => message.from === ownName)
    .slice(-20)
    .reverse()
    .map((message) => makeDMRow({
      title: message.to,
      preview: message.text,
      meta: `${message.status} - ${formatSocialTime(message.createdAt)}`,
      person: message.to
    }));
  const groupRows = groups.map((group) => makeDMRow({
    title: group.name,
    preview: group.lastMessage || `${group.members.length} members`,
    meta: `${group.members.length} members - ${formatSocialTime(group.updatedAt)}`
  }));
  els.dmList.replaceChildren(
    makeDMSection("DM Requests", [...pendingRequests, ...pendingMessages]),
    makeDMSection("Regular Messages Sent", sentMessages),
    makeDMSection("Group Chats", groupRows)
  );
}

function initDMs() {
  renderDMInbox();
}

els.dmList?.addEventListener("click", (event) => {
  const acceptButton = event.target.closest("[data-accept-request]");
  const personRow = event.target.closest("[data-person]");
  if (acceptButton) {
    socialDataStore.acceptFriendRequest(acceptButton.dataset.acceptRequest);
    renderProfile();
    renderDMInbox();
    return;
  }
  if (personRow) openPersonProfile(personRow.dataset.person);
});

function createPublicCustomization(name) {
  const hash = Math.abs(hashString(`character:${name}`));
  const pick = (items, offset = 0) => items[(hash + offset) % items.length];
  const skinColors = ["#d08a45", "#b86b35", "#f0a15f", "#8f4f2a", "#e8b07a", "#6f3b21"];
  const hairColors = ["#241713", "#5b331b", "#9a671e", "#d9b441", "#111827", "#7c2d12"];
  const eyeColors = ["#2563eb", "#0f766e", "#92400e", "#111827", "#7c3aed"];
  const shirtColors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f97316", "#0d9488"];
  const pantsColors = ["#111827", "#1e3a8a", "#334155", "#3f2f20"];
  const shoeColors = ["#0f172a", "#7f1d1d", "#1f2937", "#111827"];
  return {
    mascot: pick(mascotOptions, 4),
    hair: pick(["short", "long", "spiky", "sidepart", "curly"], 1),
    eyeShape: pick(["round", "anime", "determined", "happy"], 2),
    nose: pick(["soft", "straight", "sharp", "cute"], 3),
    mouth: pick(["smile", "neutral", "grin", "surprised"], 4),
    arms: pick(["relaxed", "waving", "athletic"], 5),
    legs: pick(["straight", "wide", "athletic"], 6),
    shirt: pick(["tee", "hoodie", "jersey"], 7),
    pants: pick(["slim", "shorts", "cargo"], 8),
    shoes: pick(["trainers", "boots", "formal"], 9),
    hairColor: pick(hairColors, 10),
    eyeColor: pick(eyeColors, 11),
    faceColor: pick(skinColors, 12),
    shirtColor: pick(shirtColors, 13),
    pantsColor: pick(pantsColors, 14),
    shoesColor: pick(shoeColors, 15)
  };
}

function createPublicProfile(name) {
  const hash = Math.abs(hashString(name));
  const language = languageDatasets[appState.targetLanguage]?.label || "Russian";
  const colors = ["#0f766e", "#2563eb", "#a855f7", "#d97706", "#dc2626", "#0891b2", "#16a34a", "#9333ea"];
  const level = hash % 18;
  const spentBeforeLevel = (level * (level + 1) * 1000) / 2;
  const neededForNext = (level + 1) * 1000;
  const xp = spentBeforeLevel + (hash % Math.max(1, neededForNext));
  const stored = socialDataStore.getProfile(name);
  const social = stored.social || { followers: [], following: [], friends: [] };
  const collectionItems = Array.from({ length: 16 }, (_, index) => {
    const tiers = ["standard", "standard", "standard", "rare", "legendary", "god"];
    return index < 8 + (hash % 6)
      ? { tier: tiers[(hash + index) % tiers.length], name: tierConfig[tiers[(hash + index) % tiers.length]].items[(hash + index) % tierConfig[tiers[(hash + index) % tiers.length]].items.length] }
      : null;
  });
  return {
    name,
    handle: stored.handle || profileHandleFromName(name),
    bio: stored.bio || `${name} is practicing ${language} reading, listening, and vocabulary. Current focus: stories, pronunciation, and learned words.`,
    followers: social.followers.length,
    following: social.following.length,
    friends: social.friends.length,
    social,
    privacy: stored.privacy || {
      showFollowers: hash % 7 !== 0,
      showFollowing: hash % 6 !== 0,
      showFriends: hash % 5 !== 0
    },
    level,
    xp,
    color: colors[hash % colors.length],
    customization: stored.customization || createPublicCustomization(name),
    achievements: [
      `First ${language} Page`,
      `${language} Story Reader`,
      `${language} Listener`,
      `100 ${language} Words`
    ],
    collectionItems
  };
}

function renderPublicProfileCollection(items) {
  if (!els.publicCollectionGrid) return;
  els.publicCollectionGrid.replaceChildren(...items.map((item, index) => {
    const cell = document.createElement("div");
    cell.className = `collection-cell ${item ? item.tier : "empty"}`;
    cell.innerHTML = item
      ? `<span>${item.tier}</span><strong>${item.name}</strong><small>#${index + 1}</small>`
      : `<span>empty</span><strong>Slot ${index + 1}</strong>`;
    return cell;
  }));
}

function renderPublicCharacter(profile) {
  const canvas = els.publicCharacterCanvas;
  if (window.THREE && renderPublicCharacter3d(profile)) return;
  const ctx = canvas?.getContext?.("2d");
  if (!canvas || !ctx || !profile?.customization) return;
  const c = profile.customization;
  const width = canvas.clientWidth || 300;
  const height = canvas.clientHeight || 360;
  const ratio = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(239, 246, 255, 0.95)");
  gradient.addColorStop(1, "rgba(204, 251, 241, 0.95)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const groundY = height * 0.91;
  const scale = Math.min(width / 300, height / 360);
  const spin = canvas.__publicAngle || 0;
  const facing = Math.cos(spin);
  const faceShift = Math.sin(spin) * 10 * scale;
  const bodySquash = canvas.__publicAutoRotate ? 0.78 + Math.abs(facing) * 0.22 : 1;
  ctx.fillStyle = "rgba(15, 23, 42, 0.14)";
  ctx.beginPath();
  ctx.ellipse(centerX, groundY, 72 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  const shoulderY = groundY - 164 * scale;
  drawArm(ctx, centerX - 55 * scale, shoulderY + 10 * scale, 18 * scale, 90 * scale, c.shirtColor, c.faceColor, -0.12);
  drawArm(ctx, centerX + 55 * scale, shoulderY + 10 * scale, 18 * scale, 90 * scale, c.shirtColor, c.faceColor, 0.12);
  drawLimb(ctx, centerX - 24 * scale, groundY - 96 * scale, 20 * scale, 92 * scale, c.pantsColor, 9 * scale);
  drawLimb(ctx, centerX + 24 * scale, groundY - 96 * scale, 20 * scale, 92 * scale, c.pantsColor, 9 * scale);
  drawShoe(ctx, centerX - 24 * scale, groundY - 18 * scale, c.shoesColor, c.shoes, scale * 0.82);
  drawShoe(ctx, centerX + 24 * scale, groundY - 18 * scale, c.shoesColor, c.shoes, scale * 0.82);
  drawNeck(ctx, centerX, groundY - 196 * scale, c.faceColor, scale * 0.78);
  drawJerseyBody(ctx, centerX, groundY - 174 * scale, 104 * scale * bodySquash, 136 * scale, c.shirtColor, c.pantsColor);
  drawEar(ctx, centerX - 43 * scale + faceShift, groundY - 236 * scale, c.faceColor, scale * 0.78);
  drawEar(ctx, centerX + 43 * scale + faceShift, groundY - 236 * scale, c.faceColor, scale * 0.78);
  drawHead(ctx, centerX + faceShift, groundY - 250 * scale, 88 * scale * bodySquash, 96 * scale, c.faceColor);
  drawPublicHair(ctx, centerX + faceShift, groundY - 305 * scale, c, scale);
  if (Math.abs(facing) > 0.18) {
    drawEye(ctx, centerX - 15 * scale * bodySquash + faceShift, groundY - 258 * scale, c.eyeColor, c.eyeShape, scale * 0.82);
    drawEye(ctx, centerX + 15 * scale * bodySquash + faceShift, groundY - 258 * scale, c.eyeColor, c.eyeShape, scale * 0.82);
    drawNose(ctx, centerX + faceShift, groundY - 240 * scale, c.nose, scale * 0.78);
    drawMouth(ctx, centerX + faceShift, groundY - 219 * scale, c.mouth, scale * 0.78);
  }
}

function renderPublicCharacter3d(profile) {
  const canvas = els.publicCharacterCanvas;
  const c = profile?.customization;
  if (!canvas || !c || !window.THREE) return false;
  try {
    const width = canvas.clientWidth || 300;
    const height = canvas.clientHeight || 360;
    const renderer = canvas.__publicRenderer || new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    canvas.__publicRenderer = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 9.2);
    camera.lookAt(0, -0.05, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x94a3b8, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(3, 4, 5);
    scene.add(key);
    const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.02 });
    const capsule = (radius, length, color, segments = 22) => {
      const geometry = THREE.CapsuleGeometry
        ? new THREE.CapsuleGeometry(radius, length, 9, segments)
        : new THREE.CylinderGeometry(radius, radius, length + radius * 2, segments);
      return new THREE.Mesh(geometry, material(color));
    };
    const group = new THREE.Group();
    group.position.y = -0.16;
    group.rotation.y = -0.22;
    scene.add(group);
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.28, 40),
      new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.12 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.64;
    const torso = capsule(0.48, 1.03, c.shirtColor, 32);
    torso.position.y = 0.04;
    torso.scale.set(1.04, 1.06, 0.78);
    const shorts = new THREE.Mesh(new THREE.SphereGeometry(0.47, 32, 18), material(c.pantsColor));
    shorts.position.y = -0.62;
    shorts.scale.set(1.04, 0.4, 0.74);
    const neck = capsule(0.15, 0.2, c.faceColor, 18);
    neck.position.y = 0.88;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 24), material(c.faceColor));
    head.position.y = 1.38;
    head.scale.set(0.95, 1.08, 0.9);
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.49, 30, 16, 0, Math.PI * 2, 0, Math.PI / 2), material(c.hairColor));
    hair.position.y = 1.73;
    hair.scale.set(c.hair === "long" ? 1.08 : 1, c.hair === "spiky" ? 0.78 : 0.55, 0.94);
    hair.visible = c.hair !== "none";
    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 12), material(c.faceColor));
    leftEar.position.set(-0.42, 1.38, 0.01);
    leftEar.scale.set(0.72, 1.14, 0.58);
    const rightEar = leftEar.clone();
    rightEar.material = leftEar.material.clone();
    rightEar.position.x = 0.42;
    const eyeWhiteMaterial = material(0xffffff);
    const eyeMaterial = material(c.eyeColor);
    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.066, 16, 12), eyeWhiteMaterial);
    leftEyeWhite.position.set(-0.15, 1.43, 0.38);
    leftEyeWhite.scale.set(1.08, c.eyeShape === "happy" ? 0.36 : 0.75, 0.34);
    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.x = 0.15;
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 10), eyeMaterial);
    leftEye.position.set(-0.15, 1.43, 0.425);
    const rightEye = leftEye.clone();
    rightEye.material = leftEye.material.clone();
    rightEye.position.x = 0.15;
    const nose = capsule(0.03, 0.16, "#b9652c", 12);
    nose.position.set(0, 1.34, 0.43);
    nose.rotation.x = Math.PI / 2;
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 28, Math.PI), material(0x51311c));
    mouth.position.set(0, 1.22, 0.4);
    mouth.rotation.set(0, 0, Math.PI);
    const leftMouthCorner = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), material(0x51311c));
    leftMouthCorner.position.set(-0.12, 1.22, 0.42);
    leftMouthCorner.scale.set(0.8, 0.58, 0.42);
    const rightMouthCorner = leftMouthCorner.clone();
    rightMouthCorner.material = leftMouthCorner.material.clone();
    rightMouthCorner.position.x = 0.12;
    const makeArm = (side) => {
      const arm = new THREE.Group();
      arm.position.set(side * 0.68, 0.62, 0.22);
      arm.rotation.z = side * -0.06;
      arm.rotation.x = 0.04;
      const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), material(c.shirtColor));
      shoulderCap.position.set(0, 0.02, 0.03);
      shoulderCap.scale.set(1.06, 0.82, 0.92);
      const sleeve = capsule(0.112, 0.54, c.shirtColor, 18);
      sleeve.position.set(side * 0.02, -0.31, 0.03);
      const forearm = capsule(0.092, 0.44, c.faceColor, 18);
      forearm.position.set(side * 0.07, -0.76, 0.11);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), material(c.faceColor));
      hand.position.set(side * 0.1, -1.03, 0.15);
      hand.scale.set(0.9, 1.06, 0.72);
      arm.add(shoulderCap, sleeve, forearm, hand);
      return arm;
    };
    const makeLeg = (side) => {
      const leg = new THREE.Group();
      leg.position.set(side * (c.legs === "wide" ? 0.32 : 0.24), -0.88, 0.02);
      const pant = capsule(0.116, 0.52, c.pantsColor, 18);
      pant.position.y = -0.18;
      const lowerLeg = capsule(0.09, 0.38, c.faceColor, 16);
      lowerLeg.position.y = -0.62;
      const shoe = new THREE.Group();
      shoe.position.set(side * 0.04, -0.91, 0.2);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.56), material(shadeHex(c.shoesColor, -0.34)));
      sole.position.y = -0.07;
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.43), material(c.shoesColor));
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 12), material(c.shoesColor));
      toe.position.z = 0.23;
      toe.scale.set(1.02, 0.44, 0.7);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.016, 0.33), material(shadeHex(c.shoesColor, 0.48)));
      stripe.position.set(0, 0.11, 0.02);
      shoe.add(sole, upper, toe, stripe);
      leg.add(pant, lowerLeg, shoe);
      return leg;
    };
    group.add(
      shadow,
      makeLeg(-1),
      makeLeg(1),
      makeArm(-1),
      makeArm(1),
      torso,
      shorts,
      neck,
      leftEar,
      rightEar,
      head,
      hair,
      leftEyeWhite,
      rightEyeWhite,
      leftEye,
      rightEye,
      nose,
      mouth,
      leftMouthCorner,
      rightMouthCorner
    );
    renderer.render(scene, camera);
    publicCharacter3d = {
      canvas,
      renderer,
      scene,
      camera,
      group,
      angle: 0,
      autoRotate: Boolean(canvas.__publicAutoRotate)
    };
    return true;
  } catch (error) {
    console.warn("Public 3D character failed; using canvas fallback.", error);
    return false;
  }
}

function runPublicCharacterRotation() {
  if (!activePublicProfile || !els.publicCharacterCanvas?.__publicAutoRotate) {
    publicCharacterRotateFrame = null;
    return;
  }
  if (publicCharacter3d?.group) {
    publicCharacter3d.angle += 0.035;
    publicCharacter3d.group.rotation.y = -0.22 + publicCharacter3d.angle;
    publicCharacter3d.renderer.render(publicCharacter3d.scene, publicCharacter3d.camera);
  } else {
    els.publicCharacterCanvas.__publicAngle = (els.publicCharacterCanvas.__publicAngle || 0) + 0.035;
    renderPublicCharacter(activePublicProfile);
  }
  publicCharacterRotateFrame = requestAnimationFrame(runPublicCharacterRotation);
}

function setPublicCharacterAutoRotate(enabled) {
  const canvas = els.publicCharacterCanvas;
  if (!canvas) return;
  canvas.__publicAutoRotate = Boolean(enabled);
  if (!enabled) {
    if (publicCharacterRotateFrame) cancelAnimationFrame(publicCharacterRotateFrame);
    publicCharacterRotateFrame = null;
    canvas.__publicAngle = 0;
    if (publicCharacter3d?.group) {
      publicCharacter3d.angle = 0;
      publicCharacter3d.group.rotation.y = -0.22;
      publicCharacter3d.renderer.render(publicCharacter3d.scene, publicCharacter3d.camera);
    } else {
      renderPublicCharacter(activePublicProfile);
    }
    return;
  }
  if (!publicCharacterRotateFrame) publicCharacterRotateFrame = requestAnimationFrame(runPublicCharacterRotation);
}

function drawPublicHair(ctx, x, y, c, scale = 1) {
  if (c.hair === "none") return;
  const gradient = ctx.createLinearGradient(x - 50 * scale, y, x + 50 * scale, y + 40 * scale);
  gradient.addColorStop(0, c.hairColor);
  gradient.addColorStop(1, "#1f130f");
  ctx.fillStyle = gradient;
  if (c.hair === "spiky") {
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 11 * scale, y + 24 * scale);
      ctx.lineTo(x + i * 11 * scale + 7 * scale, y - 10 * scale);
      ctx.lineTo(x + i * 11 * scale + 16 * scale, y + 24 * scale);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }
  ctx.beginPath();
  ctx.ellipse(x, y + 28 * scale, c.hair === "long" ? 50 * scale : 43 * scale, c.hair === "long" ? 40 * scale : 29 * scale, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(x + i * 13 * scale, y + 29 * scale, 11 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderPublicSocialList(type) {
  const listMap = { followers: els.publicFollowersList, following: els.publicFollowingList, friends: els.publicFriendsList };
  const profile = activePublicProfile;
  const listEl = listMap[type];
  if (!listEl || !profile) return;
  const privacyKey = type === "followers" ? "showFollowers" : type === "following" ? "showFollowing" : "showFriends";
  if (appState.settings?.[privacyKey] === false || !profile.privacy?.[privacyKey]) {
    const li = document.createElement("li");
    li.className = "social-empty";
    li.textContent = appState.settings?.[privacyKey] === false ? "Hidden by your privacy settings." : "This list is private.";
    listEl.replaceChildren(li);
    return;
  }
  const query = publicSocialSearchState[type] || "";
  const people = profile.social?.[type] || [];
  const filtered = people.filter((person) => person.toLowerCase().includes(query.toLowerCase()));
  listEl.replaceChildren(...filtered.map((person) => {
    const li = document.createElement("li");
    const initials = person.split(" ").map(part => part[0]).join("").slice(0, 2);
    li.dataset.person = person;
    li.dataset.socialType = type;
    li.innerHTML = `
      <button class="social-person-btn" type="button">
        <span>${initials}</span>
        <strong>${person}</strong>
      </button>
    `;
    li.querySelector(".social-person-btn")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openPersonProfile(person);
    });
    return li;
  }));
  if (!filtered.length) {
    const li = document.createElement("li");
    li.className = "social-empty";
    li.textContent = "No matches";
    listEl.append(li);
  }
}

function togglePublicSocialDropdown(type) {
  const group = document.querySelector(`[data-public-social-group="${type}"]`);
  const dropdown = group?.querySelector(".public-social-dropdown");
  if (!dropdown) return;
  const opening = dropdown.hidden;
  document.querySelectorAll(".public-social-group").forEach((item) => {
    if (item !== group) {
      item.classList.remove("is-open");
      const otherDropdown = item.querySelector(".public-social-dropdown");
      if (otherDropdown) otherDropdown.hidden = true;
    }
  });
  if (opening) {
    publicSocialSearchState[type] = "";
    const input = dropdown.querySelector("input");
    if (input) input.value = "";
    renderPublicSocialList(type);
  }
  dropdown.hidden = !opening;
  group.classList.toggle("is-open", opening);
  if (opening) dropdown.querySelector("input")?.focus();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function displayLabelFromValue(value) {
  return String(value || "standard")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function publicSocialGroupMarkup(type, count, label) {
  const safeType = escapeHtml(type);
  return `
    <div class="stat-item social-group public-social-group" data-public-social-group="${safeType}">
      <button class="social-toggle-btn public-social-toggle" type="button" data-public-social-toggle="${safeType}">
        <strong id="public${label}Count">${Number(count || 0).toLocaleString()}</strong>
        <span>${escapeHtml(label)} <span class="dropdown-arrow">▼</span></span>
      </button>
      <div class="social-dropdown public-social-dropdown glass-panel" hidden>
        <input id="public${label}Search" type="search" placeholder="Search ${safeType}">
        <ul id="public${label}List"></ul>
      </div>
    </div>
  `;
}

function readonlyCharacterControlMarkup(profile) {
  const c = profile.customization || {};
  const fields = [
    ["Hair Style", c.hair],
    ["Eye Shape", c.eyeShape],
    ["Nose Shape", c.nose],
    ["Mouth Shape", c.mouth],
    ["Arm Pose", c.arms],
    ["Leg Pose", c.legs],
    ["Outfit Style", c.shirt],
    ["Pants Style", c.pants],
    ["Shoes Style", c.shoes]
  ];
  const colors = [
    ["Hair", c.hairColor],
    ["Eyes", c.eyeColor],
    ["Skin", c.faceColor],
    ["Shirt", c.shirtColor],
    ["Pants", c.pantsColor],
    ["Shoes", c.shoesColor]
  ];
  return `
    <div class="customizer-grid readonly-customizer-grid">
      ${fields.map(([label, value]) => `
        <div class="control-group readonly-control-group">
          <label>${escapeHtml(label)}</label>
          <select disabled>
            <option>${escapeHtml(displayLabelFromValue(value))}</option>
          </select>
        </div>
      `).join("")}
    </div>
    <div class="color-pickers-section readonly-color-section">
      <h4>Color Studio</h4>
      <div class="color-pickers-grid">
        ${colors.map(([label, value]) => `
          <div class="color-picker-item readonly-color-item">
            <label>${escapeHtml(label)}</label>
            <span class="readonly-color-swatch" style="--readonly-color:${escapeHtml(value || "#111827")}"></span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function bindPublicProfilePageRefs() {
  const page = els.publicProfilePage;
  if (!page) return;
  els.publicProfileAvatar = page.querySelector("#publicPageAvatarContainer");
  els.publicProfileHandle = page.querySelector("#publicProfileHandle");
  els.publicProfileBio = page.querySelector("#publicProfileBio");
  els.publicProfileStatus = page.querySelector("#publicProfileStatus");
  els.publicFollowersCount = page.querySelector("#publicFollowersCount");
  els.publicFollowingCount = page.querySelector("#publicFollowingCount");
  els.publicFriendsCount = page.querySelector("#publicFriendsCount");
  els.publicFollowersSearch = page.querySelector("#publicFollowersSearch");
  els.publicFollowingSearch = page.querySelector("#publicFollowingSearch");
  els.publicFriendsSearch = page.querySelector("#publicFriendsSearch");
  els.publicFollowersList = page.querySelector("#publicFollowersList");
  els.publicFollowingList = page.querySelector("#publicFollowingList");
  els.publicFriendsList = page.querySelector("#publicFriendsList");
  els.publicAchievementsList = page.querySelector("#publicAchievementsList");
  els.publicCollectionGrid = page.querySelector("#publicCollectionGrid");
  els.publicBestAccuracy = page.querySelector("#publicBestAccuracy");
  els.publicWordsKnown = page.querySelector("#publicWordsKnown");
  els.publicStoriesRead = page.querySelector("#publicStoriesRead");
  els.publicStreakDays = page.querySelector("#publicStreakDays");
  els.publicLevelLabel = page.querySelector("#publicLevelLabel");
  els.publicLevelProgressFill = page.querySelector("#publicLevelProgressFill");
  els.publicLevelProgressText = page.querySelector("#publicLevelProgressText");
}

function renderPublicProfileShell(profile) {
  const progress = getLevelInfo(profile.xp);
  const progressPercent = Math.min(100, Math.round((progress.progress / progress.needed) * 100));
  const safeName = escapeHtml(profile.name);
  const safeHandle = escapeHtml(`@${profile.handle}`);
  const safeBio = escapeHtml(profile.bio);
  return `
    <div class="profile-layout public-mirror-profile-layout">
      <div class="profile-header-card glass-panel public-mirror-header">
        <div class="profile-header-top-row">
          <div class="circular-avatar-wrapper public-avatar-wrapper">
            <div id="publicPageAvatarContainer" class="circular-avatar-inner"></div>
          </div>
          <div class="profile-stats-horizontal public-profile-stats">
            ${publicSocialGroupMarkup("followers", profile.followers, "Followers")}
            ${publicSocialGroupMarkup("following", profile.following, "Following")}
            ${publicSocialGroupMarkup("friends", profile.friends, "Friends")}
          </div>
        </div>
        <div class="profile-bio-details public-profile-details">
          <span class="visiting-profile-label">Visiting Profile</span>
          <h2>${safeName}</h2>
          <p id="publicProfileHandle">${safeHandle}</p>
          <p id="publicProfileBio" class="bio-text-paragraph">${safeBio}</p>
          <div class="public-profile-actions">
            <button id="publicAddFriendBtn" class="action-btn public-action-btn" type="button">Add Friend</button>
            <button id="publicSendMessageBtn" class="action-btn secondary-btn public-action-btn" type="button">Send Message</button>
          </div>
          <p id="publicProfileStatus" class="profile-status"></p>
        </div>
      </div>

      <section class="achievements-panel glass-panel">
        <div class="profile-section-heading"><h3>Achievements</h3></div>
        <div id="publicAchievementsList" class="achievements-list"></div>
      </section>

      <section class="character-customization-panel glass-panel readonly-character-studio">
        <div class="profile-section-heading">
          <h3>Character Studio</h3>
          <span class="readonly-profile-chip">View Only</span>
        </div>
        <div class="studio-layout">
          <div class="customizer-controls readonly-customizer-controls">
            ${readonlyCharacterControlMarkup(profile)}
          </div>
          <div class="character-preview-frame public-character-preview-frame">
            <div id="publicCharacterCanvasMount" class="public-character-canvas-mount"></div>
            <label class="auto-rotate-toggle public-auto-rotate-toggle">
              <span>Auto-rotate</span>
              <input id="publicCharacterAutoRotateBtn" type="checkbox">
            </label>
          </div>
        </div>
      </section>

      <section class="collection-panel glass-panel">
        <div class="profile-section-heading"><h3>Collection Grid</h3></div>
        <div class="tier-odds">
          <span class="tier-chip standard">Standard 80%</span>
          <span class="tier-chip rare">Rare 16%</span>
          <span class="tier-chip legendary">Legendary 4%</span>
          <span class="tier-chip god">God 1%</span>
        </div>
        <div id="publicCollectionGrid" class="collection-grid" aria-label="${safeName} collectible items"></div>
      </section>

      <section class="profile-speech-stats-panel glass-panel">
        <div class="profile-section-heading"><h3>Practice Stats</h3></div>
        <div class="profile-speech-stats-grid">
          <div><strong id="publicBestAccuracy">--</strong><span>Best accuracy</span></div>
          <div><strong id="publicWordsKnown">--</strong><span>Words known</span></div>
          <div><strong id="publicStoriesRead">--</strong><span>Stories read</span></div>
          <div><strong id="publicStreakDays">--</strong><span>Day streak</span></div>
        </div>
      </section>

      <section class="level-panel glass-panel public-level-panel">
        <div class="profile-section-heading">
          <h3>Level</h3>
          <span id="publicLevelLabel">Level ${progress.level}</span>
        </div>
        <div class="level-progress"><div id="publicLevelProgressFill" style="width:${progressPercent}%"></div></div>
        <p id="publicLevelProgressText" class="profile-status">${progress.progress.toLocaleString()} / ${progress.needed.toLocaleString()} XP to Level ${progress.level + 1}</p>
      </section>
    </div>
  `;
}

function renderPublicProfile(name) {
  const profile = createPublicProfile(name);
  activePublicProfile = profile;
  switchView("profile");
  if (els.profileLayout) els.profileLayout.hidden = true;
  if (els.publicProfilePage) {
    els.publicProfilePage.hidden = false;
    if (publicCharacterRotateFrame) cancelAnimationFrame(publicCharacterRotateFrame);
    publicCharacterRotateFrame = null;
    publicCharacter3d = null;
    els.publicProfilePage.innerHTML = renderPublicProfileShell(profile);
    const canvas = els.publicCharacterCanvas || document.createElement("canvas");
    canvas.id = "publicCharacterCanvas";
    canvas.className = "public-character-canvas character-canvas";
    canvas.setAttribute("aria-label", "Read-only profile character");
    els.publicProfilePage.querySelector("#publicCharacterCanvasMount")?.replaceChildren(canvas);
    els.publicCharacterCanvas = canvas;
    bindPublicProfilePageRefs();
  }
  if (els.publicProfileModal) els.publicProfileModal.hidden = true;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  els.profileView?.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
  renderMascotAvatar(els.publicProfileAvatar, profile.customization?.mascot, { color: profile.color });
  renderPublicCharacter(profile);
  els.publicProfileHandle.textContent = `@${profile.handle}`;
  els.publicProfileBio.textContent = profile.bio;
  els.publicFollowersCount.textContent = profile.followers.toLocaleString();
  els.publicFollowingCount.textContent = profile.following.toLocaleString();
  els.publicFriendsCount.textContent = profile.friends.toLocaleString();
  renderPublicSocialList("followers");
  renderPublicSocialList("following");
  renderPublicSocialList("friends");
  els.publicAchievementsList.replaceChildren(...profile.achievements.map((title, index) => {
    const item = document.createElement("div");
    item.className = "achievement-item";
    item.innerHTML = `<div class="achievement-icon">${["📖", "🖼", "🎧", "🏅"][index] || "⭐"}</div><div><h4>${title}</h4><p>Public progress badge</p></div>`;
    return item;
  }));
  renderPublicProfileCollection(profile.collectionItems);
  if (els.publicBestAccuracy) els.publicBestAccuracy.textContent = `${62 + (Math.abs(hashString(name)) % 36)}%`;
  if (els.publicWordsKnown) els.publicWordsKnown.textContent = (120 + (Math.abs(hashString(`${name}:words`)) % 840)).toLocaleString();
  if (els.publicStoriesRead) els.publicStoriesRead.textContent = (8 + (Math.abs(hashString(`${name}:stories`)) % 160)).toLocaleString();
  if (els.publicStreakDays) els.publicStreakDays.textContent = (1 + (Math.abs(hashString(`${name}:streak`)) % 40)).toLocaleString();
  const progress = getLevelInfo(profile.xp);
  els.publicLevelLabel.textContent = `Level ${progress.level}`;
  els.publicLevelProgressFill.style.width = `${Math.min(100, Math.round((progress.progress / progress.needed) * 100))}%`;
  els.publicLevelProgressText.textContent = `${progress.progress.toLocaleString()} / ${progress.needed.toLocaleString()} XP to Level ${progress.level + 1}`;
  const pending = socialDataStore.pendingMessagesTo(name) || appState.outboundMessages[name] || 0;
  els.publicProfileStatus.textContent = pending ? `${pending}/3 messages waiting for a reply.` : "No pending messages.";
}

function openPersonProfile(name, options = {}) {
  if (activePublicProfile?.name && activePublicProfile.name !== name && options.stack !== false) {
    publicProfileStack.push(activePublicProfile.name);
  }
  renderPublicProfile(name);
}

function goBackFromPublicProfile() {
  const previous = publicProfileStack.pop();
  if (previous) {
    renderPublicProfile(previous);
    return;
  }
  activePublicProfile = null;
  if (els.publicProfilePage) els.publicProfilePage.hidden = true;
  if (els.profileLayout) {
    els.profileLayout.hidden = false;
    renderProfile();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
}

function closePublicProfileToHome() {
  publicProfileStack = [];
  activePublicProfile = null;
  if (publicCharacterRotateFrame) cancelAnimationFrame(publicCharacterRotateFrame);
  publicCharacterRotateFrame = null;
  publicCharacter3d = null;
  if (els.publicProfilePage) els.publicProfilePage.hidden = true;
  if (els.publicProfileModal) els.publicProfileModal.hidden = true;
  switchView("practice");
}

function addFriend(name) {
  if (!appState.settings?.allowFriendRequests) {
    els.publicProfileStatus.textContent = "Friend requests are currently disabled in your profile settings.";
    return;
  }
  socialDataStore.sendFriendRequest(name);
  renderDMInbox();
  if (els.dmWidget) els.dmWidget.hidden = false;
  els.publicProfileStatus.textContent = `Friend request sent to ${name}. They need to accept it before they are added.`;
}

function sendMessageToPerson(name) {
  const pending = socialDataStore.pendingMessagesTo(name) || appState.outboundMessages[name] || 0;
  if (pending >= 3) {
    els.publicProfileStatus.textContent = "Message limit reached. Wait for a reply before sending more.";
    return;
  }
  const message = window.prompt(`Message ${name}`);
  if (!message) return;
  if (appState.settings?.filterMessages && checkInappropriate(message)) {
    els.publicProfileStatus.textContent = "Message blocked by your safety filter.";
    return;
  }
  const nextPending = socialDataStore.sendMessage(name, message);
  appState.outboundMessages[name] = nextPending;
  localStorage.setItem("nova_outbound_messages", JSON.stringify(appState.outboundMessages));
  renderDMInbox();
  if (els.dmWidget) els.dmWidget.hidden = false;
  els.publicProfileStatus.textContent = appState.settings?.notifyMessages
    ? `Message sent. ${nextPending}/3 waiting for a reply.`
    : `Message saved silently. ${nextPending}/3 waiting for a reply.`;
}

function showSocialContextMenu(event, name, type) {
  event.preventDefault();
  activeSocialPerson = { name, type };
  const item = event.target.closest("li[data-person], [data-person]");
  const rect = item?.getBoundingClientRect();
  const menuWidth = 190;
  const menuHeight = 150;
  const leftFromName = rect ? rect.right + 10 : event.clientX + 10;
  const topFromName = rect ? rect.top : event.clientY;
  const left = Math.min(leftFromName, window.innerWidth - menuWidth - 10);
  const top = Math.min(Math.max(10, topFromName), window.innerHeight - menuHeight - 10);
  els.socialContextMenu.style.left = `${left}px`;
  els.socialContextMenu.style.top = `${top}px`;
  els.socialContextMenu.hidden = false;
}

function handleSocialAction(action) {
  if (!activeSocialPerson) return;
  const { name } = activeSocialPerson;
  els.socialContextMenu.hidden = true;
  if (action === "visit") openPersonProfile(name);
  if (action === "friend") {
    openPersonProfile(name);
    addFriend(name);
  }
  if (action === "message") {
    openPersonProfile(name);
    sendMessageToPerson(name);
  }
}

function renderMascotGrid() {
  if (!els.mascotGrid) return;
  const selected = appState.profile.customization.mascot;
  els.mascotGrid.replaceChildren(...mascotOptions.map((name, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mascot-option${name === selected ? " is-selected" : ""}`;
    button.dataset.mascot = name;
    button.innerHTML = `<span style="font-size: 2rem; line-height: 1;">${name}</span>`;
    return button;
  }));
}

function getLevelInfo(xp) {
  let level = 0;
  let spent = 0;
  while (xp >= spent + (level + 1) * 1000) {
    spent += (level + 1) * 1000;
    level++;
  }
  const needed = (level + 1) * 1000;
  const progress = xp - spent;
  return { level, progress, needed };
}

function renderLevelBar() {
  if (!els.levelLabel || !els.levelProgressFill || !els.levelProgressText) return;
  const info = getLevelInfo(appState.profile.xp || 0);
  els.levelLabel.textContent = `Level ${info.level}`;
  els.levelProgressFill.style.width = `${Math.min(100, Math.round((info.progress / info.needed) * 100))}%`;
  els.levelProgressText.textContent = `${info.progress.toLocaleString()} / ${info.needed.toLocaleString()} XP to Level ${info.level + 1}`;
}

function addXp(amount) {
  const previousLevel = getLevelInfo(appState.profile.xp || 0).level;
  appState.profile.xp = Number(appState.profile.xp || 0) + amount;
  saveProfile();
  renderLevelBar();
  const nextLevel = getLevelInfo(appState.profile.xp || 0).level;
  if (appState.settings?.notifyAchievements && nextLevel > previousLevel && els.collectionStatus) {
    els.collectionStatus.textContent = `Level up: Level ${nextLevel}`;
  }
}

function setCharacterInteraction(mode) {
  if (!character3d) return;
  character3d.interaction = mode;
  if (character3d.fallback) {
    drawCharacterFallback();
  } else {
    if (mode === "pointing") {
      character3d.rightArm.shoulder.rotation.z = -1.05;
      character3d.leftArm.shoulder.rotation.z = 0.18;
    } else if (mode === "celebrating") {
      character3d.rightArm.shoulder.rotation.z = -1.25;
      character3d.leftArm.shoulder.rotation.z = 1.25;
    } else {
      updateCharacterVisuals();
      return;
    }
    animateCharacter3d();
  }
}

function updateBioCount() {
  els.bioCount.textContent = String(els.editBio.value.length);
}

function renderUsernameRule() {
  const last = Number(appState.profile.lastUsernameChange || 0);
  const remaining = usernameCooldownMs - (Date.now() - last);
  if (last && remaining > 0) {
    const days = Math.ceil(remaining / (24 * 60 * 60 * 1000));
    els.usernameRuleText.textContent = `Username changes are locked for ${days} more day${days === 1 ? "" : "s"}.`;
  } else {
    els.usernameRuleText.textContent = "Up to 64 characters. Can be changed once per week.";
  }
}

function canChangeUsername(nextUsername) {
  const current = appState.profile.username || "";
  if (nextUsername === current) return true;
  const last = Number(appState.profile.lastUsernameChange || 0);
  return !last || Date.now() - last >= usernameCooldownMs;
}

function loadThreeRuntime(onReady, onFail) {
  if (window.THREE) {
    onReady();
    return;
  }
  if (loadingThree) {
    window.addEventListener("three-ready", onReady, { once: true });
    window.addEventListener("three-failed", onFail, { once: true });
    return;
  }
  loadingThree = true;
  const urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r160/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"
  ];
  const tryLoad = (index) => {
    if (window.THREE) {
      loadingThree = false;
      window.dispatchEvent(new Event("three-ready"));
      onReady();
      return;
    }
    if (index >= urls.length) {
      loadingThree = false;
      window.dispatchEvent(new Event("three-failed"));
      onFail();
      return;
    }
    const script = document.createElement("script");
    script.src = urls[index];
    script.async = true;
    script.onload = () => tryLoad(index + 1);
    script.onerror = () => tryLoad(index + 1);
    document.head.append(script);
  };
  tryLoad(0);
}

function initCharacter3d() {
  if (character3d || !els.characterCanvas) return;
  if (!window.THREE) {
    loadThreeRuntime(() => {
      character3d = null;
      initCharacter3d();
      updateCharacterVisuals();
    }, initCharacterCanvasFallback);
    return;
  }
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: els.characterCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    camera.position.set(0, 0.16, 10.2);
    camera.lookAt(0, -0.03, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa0bf, 2.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(3.2, 4.6, 5.4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbdd7ff, 0.9);
    fill.position.set(-3, 2.3, 3);
    scene.add(fill);

    const group = new THREE.Group();
    group.position.y = -0.18;
    scene.add(group);
    const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.015 });
    const capsule = (radius, length, color, segments = 24) => {
      const geometry = THREE.CapsuleGeometry
        ? new THREE.CapsuleGeometry(radius, length, 10, segments)
        : new THREE.CylinderGeometry(radius, radius, length + radius * 2, segments);
      return new THREE.Mesh(geometry, material(color));
    };

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.62, 56),
      new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.12 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.86;

    const torso = capsule(0.5, 1.18, 0x3182ce, 36);
    torso.position.y = 0.06;
    torso.scale.set(1.04, 1.05, 0.82);

    const shirtSeam = new THREE.Mesh(
      new THREE.TorusGeometry(0.33, 0.012, 8, 32, Math.PI),
      material(0x1f5f9f)
    );
    shirtSeam.position.set(0, 0.85, 0.46);
    shirtSeam.rotation.set(0, 0, Math.PI);
    shirtSeam.scale.set(1.15, 0.35, 0.12);

    const shorts = new THREE.Mesh(new THREE.SphereGeometry(0.5, 36, 20), material(0x111827));
    shorts.position.y = -0.66;
    shorts.scale.set(1.06, 0.42, 0.76);

    const neck = capsule(0.2, 0.36, 0xed8936, 24);
    neck.position.y = 0.9;
    neck.scale.set(1.0, 1.08, 0.94);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.54, 42, 32), material(0xed8936));
    head.position.y = 1.35;
    head.scale.set(0.94, 1.06, 0.92);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.57, 42, 20, 0, Math.PI * 2, 0, Math.PI / 2), material(0x2f241f));
    hair.position.y = 1.79;
    hair.scale.set(1.02, 0.56, 0.96);

    const hairTufts = Array.from({ length: 7 }, (_, index) => {
      const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 12), material(0x2f241f));
      tuft.position.set((index - 3) * 0.13, 1.68 - Math.abs(index - 3) * 0.015, 0.34);
      tuft.scale.set(1.28, 0.82, 0.76);
      return tuft;
    });

    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 16), material(0xed8936));
    leftEar.position.set(-0.49, 1.4, 0.02);
    leftEar.scale.set(0.72, 1.18, 0.58);
    const rightEar = leftEar.clone();
    rightEar.material = leftEar.material.clone();
    rightEar.position.x = 0.47;

    const eyeWhiteMaterial = material(0xffffff);
    const eyeColorMaterial = material(0x2b6cb0);
    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), eyeWhiteMaterial);
    leftEyeWhite.position.set(-0.17, 1.45, 0.45);
    leftEyeWhite.scale.set(1.08, 0.76, 0.34);
    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.x = 0.17;
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 12), eyeColorMaterial);
    leftEye.position.set(-0.17, 1.45, 0.49);
    const rightEye = leftEye.clone();
    rightEye.material = leftEye.material.clone();
    rightEye.position.x = 0.17;

    const nose = capsule(0.035, 0.19, 0xb9652c, 14);
    nose.position.set(0, 1.35, 0.51);
    nose.rotation.x = Math.PI / 2;
    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.014, 8, 32, Math.PI),
      material(0x51311c)
    );
    mouth.position.set(0, 1.21, 0.48);
    mouth.rotation.set(0, 0, Math.PI);
    const leftMouthCorner = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 8), material(0x51311c));
    leftMouthCorner.position.set(-0.13, 1.21, 0.505);
    leftMouthCorner.scale.set(0.8, 0.62, 0.45);
    const rightMouthCorner = leftMouthCorner.clone();
    rightMouthCorner.material = leftMouthCorner.material.clone();
    rightMouthCorner.position.x = 0.13;

    const makeArm = (side) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.72, 0.69, 0.24);
      shoulder.rotation.z = side * -0.06;
      shoulder.rotation.x = 0.04;
      const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), material(0x3182ce));
      shoulderCap.position.set(side * 0.01, 0.03, 0.05);
      shoulderCap.scale.set(1.1, 0.84, 0.96);
      const sleeve = capsule(0.13, 0.6, 0x3182ce, 24);
      sleeve.position.set(side * 0.03, -0.34, 0.03);
      sleeve.rotation.z = side * 0.02;
      const forearm = capsule(0.108, 0.54, 0xed8936, 22);
      forearm.position.set(side * 0.08, -0.88, 0.13);
      forearm.rotation.z = side * 0.05;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 18), material(0xed8936));
      hand.position.set(side * 0.12, -1.2, 0.17);
      hand.scale.set(0.92, 1.1, 0.76);
      shoulder.add(shoulderCap, sleeve, forearm, hand);
      return { shoulder, shoulderCap, sleeve, forearm, hand };
    };
    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);

    const makeLeg = (side) => {
      const leg = new THREE.Group();
      leg.position.set(side * 0.27, -0.94, 0.02);
      const pant = capsule(0.14, 0.58, 0x111827, 22);
      pant.position.y = -0.13;
      const lowerLeg = capsule(0.108, 0.46, 0xed8936, 18);
      lowerLeg.position.y = -0.68;
      const shoe = new THREE.Group();
      shoe.position.set(side * 0.04, -1.0, 0.24);
      shoe.rotation.y = side * -0.08;
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.72), material(0x0b1120));
      sole.position.set(0, -0.08, 0.03);
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.54), material(0x111827));
      upper.position.set(0, 0.02, 0.0);
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), material(0x111827));
      toe.position.set(0, 0.02, 0.28);
      toe.scale.set(1.05, 0.46, 0.74);
      const heel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.2), material(0x111827));
      heel.position.set(0, 0.03, -0.24);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.018, 0.42), material(0xdbeafe));
      stripe.position.set(0, 0.125, 0.04);
      shoe.add(sole, upper, toe, heel, stripe);
      leg.add(pant, lowerLeg, shoe);
      return { leg, pant, lowerLeg, shoe, shoeParts: [upper, toe, heel], sole, stripe };
    };
    const leftLeg = makeLeg(-1);
    const rightLeg = makeLeg(1);

    group.add(
      shadow,
      leftLeg.leg,
      rightLeg.leg,
      leftArm.shoulder,
      rightArm.shoulder,
      torso,
      shirtSeam,
      shorts,
      neck,
      leftEar,
      rightEar,
      head,
      hair,
      ...hairTufts,
      leftEyeWhite,
      rightEyeWhite,
      leftEye,
      rightEye,
      nose,
      mouth,
      leftMouthCorner,
      rightMouthCorner
    );
    character3d = {
      scene,
      camera,
      renderer,
      group,
      torso,
      shirtSeam,
      shorts,
      neck,
      head,
      hair,
      hairTufts,
      leftEar,
      rightEar,
      leftEyeWhite,
      rightEyeWhite,
      leftEye,
      rightEye,
      nose,
      mouth,
      leftMouthCorner,
      rightMouthCorner,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      shadow,
      angle: 0,
      autoRotate: false
    };
    updateCharacterVisuals();
    updateAutoRotateButton();
    animateCharacter3d();
  } catch (error) {
    console.warn("3D character failed to initialize; falling back to canvas.", error);
    character3d = null;
    initCharacterCanvasFallback();
  }
}

function animateCharacter3d() {
  if (!character3d) return;
  if (character3d.fallback) {
    drawCharacterFallback();
    return;
  }
  const canvas = els.characterCanvas;
  const width = canvas.clientWidth || 680;
  const height = canvas.clientHeight || 540;
  if (character3d.renderWidth !== width || character3d.renderHeight !== height) {
    character3d.renderer.setSize(width, height, false);
    character3d.camera.aspect = width / height;
    character3d.camera.updateProjectionMatrix();
    character3d.renderWidth = width;
    character3d.renderHeight = height;
  }
  character3d.renderer.render(character3d.scene, character3d.camera);
}

function updateCharacterVisuals() {
  if (!character3d) return;
  const c = appState.profile.customization;
  if (character3d.fallback) {
    character3d.faceColor = c.faceColor;
    character3d.eyeColor = c.eyeColor;
    character3d.hairColor = c.hairColor;
    character3d.shirtColor = c.shirtColor;
    character3d.pantsColor = c.pantsColor;
    character3d.shoesColor = c.shoesColor;
    character3d.hair = c.hair;
    character3d.eyeShape = c.eyeShape;
    character3d.nose = c.nose;
    character3d.mouth = c.mouth;
    character3d.arms = c.arms;
    character3d.legs = c.legs;
    character3d.shirt = c.shirt;
    character3d.pants = c.pants;
    character3d.shoes = c.shoes;
    character3d.mascot = c.mascot;
    drawCharacterFallback();
    return;
  }
  const setColor = (mesh, color) => mesh?.material?.color?.set(color);
  const setGroupColor = (parts, color) => parts.forEach((part) => setColor(part, color));
  character3d.head.material.color.set(c.faceColor);
  setGroupColor([character3d.neck, character3d.leftEar, character3d.rightEar, character3d.leftArm.forearm, character3d.leftArm.hand, character3d.rightArm.forearm, character3d.rightArm.hand, character3d.leftLeg.lowerLeg, character3d.rightLeg.lowerLeg], c.faceColor);
  setGroupColor([character3d.leftEye, character3d.rightEye], c.eyeColor);
  setGroupColor([character3d.torso, character3d.leftArm.shoulderCap, character3d.leftArm.sleeve, character3d.rightArm.shoulderCap, character3d.rightArm.sleeve], c.shirtColor);
  setGroupColor([character3d.shirtSeam], c.shirtColor);
  setGroupColor([character3d.shorts, character3d.leftLeg.pant, character3d.rightLeg.pant], c.pantsColor);
  setGroupColor([...character3d.leftLeg.shoeParts, ...character3d.rightLeg.shoeParts], c.shoesColor);
  setGroupColor([character3d.leftLeg.sole, character3d.rightLeg.sole], shadeHex(c.shoesColor, -0.34));
  setGroupColor([character3d.leftLeg.stripe, character3d.rightLeg.stripe], shadeHex(c.shoesColor, 0.48));
  setGroupColor([character3d.hair, ...character3d.hairTufts], c.hairColor);
  character3d.hair.visible = c.hair !== "none";
  character3d.hairTufts.forEach((tuft) => { tuft.visible = c.hair !== "none"; });
  const hairScale = { short: [1, 0.54, 0.94], long: [1.06, 1.05, 1.02], spiky: [0.92, 0.78, 0.92], sidepart: [1.08, 0.46, 0.96], curly: [1, 0.6, 0.94] }[c.hair] || [1, 0.54, 0.94];
  character3d.hair.scale.set(...hairScale);
  character3d.hairTufts.forEach((tuft, index) => {
    tuft.scale.set(c.hair === "spiky" ? 0.88 : c.hair === "curly" ? 1.25 : 1.0, c.hair === "spiky" ? 1.45 : 0.85, 0.78);
    tuft.position.y = 1.78 + (c.hair === "spiky" ? Math.abs(index - 3) * 0.035 : 0) - Math.abs(index - 3) * 0.015;
  });
  character3d.leftEyeWhite.scale.set(c.eyeShape === "determined" ? 1.16 : c.eyeShape === "anime" ? 1.32 : 1.08, c.eyeShape === "happy" ? 0.36 : 0.76, 0.34);
  character3d.rightEyeWhite.scale.copy(character3d.leftEyeWhite.scale);
  character3d.nose.scale.set(c.nose === "sharp" ? 0.9 : c.nose === "cute" ? 0.76 : 1, c.nose === "straight" ? 1.2 : 1, c.nose === "sharp" ? 1.24 : 1);
  const mouthScaleX = c.mouth === "grin" || c.mouth === "wide" || c.mouth === "laugh" ? 1.45 : c.mouth === "neutral" || c.mouth === "focused" ? 1.05 : c.mouth === "surprised" || c.mouth === "open" ? 0.62 : 1;
  const mouthScaleY = c.mouth === "surprised" || c.mouth === "open" ? 1.7 : c.mouth === "neutral" || c.mouth === "focused" ? 0.35 : 1;
  character3d.mouth.scale.set(mouthScaleX, mouthScaleY, 1);
  const cornerSpread = c.mouth === "grin" || c.mouth === "wide" || c.mouth === "laugh" ? 0.18 : c.mouth === "neutral" || c.mouth === "focused" ? 0.13 : 0.14;
  if (character3d.leftMouthCorner && character3d.rightMouthCorner) {
    character3d.leftMouthCorner.visible = c.mouth !== "surprised" && c.mouth !== "open";
    character3d.rightMouthCorner.visible = character3d.leftMouthCorner.visible;
    character3d.leftMouthCorner.position.x = -cornerSpread;
    character3d.rightMouthCorner.position.x = cornerSpread;
  }
  const armPose = {
    waving: [0.92, -0.92],
    athletic: [0.36, -0.36],
    front: [0.04, -0.04],
    crossed: [-0.58, 0.58],
    pointing: [0.18, -1.05],
    hero: [0.28, -0.28],
    running: [-0.72, 0.72],
    open: [0.54, -0.54],
    thinking: [0.16, -0.76],
    dance: [-0.95, 0.44],
    ready: [0.28, -0.28],
    relaxed: [0.12, -0.12]
  }[c.arms] || [0.12, -0.12];
  character3d.leftArm.shoulder.rotation.z = armPose[0];
  character3d.rightArm.shoulder.rotation.z = armPose[1];
  const legPose = {
    wide: [-0.36, 0.36, 0, 0],
    athletic: [-0.32, 0.32, 0.08, -0.08],
    hero: [-0.35, 0.35, -0.06, 0.06],
    casual: [-0.27, 0.3, -0.04, -0.02],
    runner: [-0.31, 0.3, 0.14, -0.16],
    step: [-0.26, 0.31, 0.02, -0.1],
    balanced: [-0.29, 0.29, 0, 0],
    narrow: [-0.2, 0.2, 0, 0],
    dance: [-0.34, 0.26, -0.18, 0.12],
    skater: [-0.38, 0.38, -0.12, 0.12],
    power: [-0.4, 0.4, -0.04, 0.04],
    straight: [-0.27, 0.27, 0, 0]
  }[c.legs] || [-0.27, 0.27, 0, 0];
  character3d.leftLeg.leg.position.x = legPose[0];
  character3d.rightLeg.leg.position.x = legPose[1];
  character3d.leftLeg.leg.rotation.z = legPose[2];
  character3d.rightLeg.leg.rotation.z = legPose[3];
  character3d.torso.scale.set(c.shirt === "hoodie" ? 1.14 : c.shirt === "jersey" ? 1.08 : 1.05, 1.08, 0.78);
  character3d.shorts.scale.set(c.pants === "shorts" ? 1.1 : 1.06, c.pants === "cargo" ? 0.48 : 0.42, c.pants === "baggy" || c.pants === "wide" ? 0.84 : 0.76);
  const shoeScale = {
    boots: [1.1, 1.22, 1.08],
    "work-boots": [1.14, 1.28, 1.12],
    formal: [0.94, 0.94, 0.94],
    trainers: [1.08, 1, 1.18],
    sneakers: [1.16, 1.06, 1.2],
    "high-top": [1.12, 1.2, 1.1],
    runner: [1.08, 0.95, 1.24],
    sandals: [0.96, 0.78, 1.02],
    cleats: [1.08, 1, 1.16],
    "slip-ons": [1.02, 0.9, 1.08],
    space: [1.22, 1.32, 1.18],
    retro: [1.14, 1.08, 1.16]
  }[c.shoes] || [1, 1, 1.12];
  character3d.leftLeg.shoe.scale.set(...shoeScale);
  character3d.rightLeg.shoe.scale.copy(character3d.leftLeg.shoe.scale);
  animateCharacter3d();
}

function shadeHex(hex, amount) {
  const raw = String(hex || "#111827").replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((ch) => ch + ch).join("") : raw.padEnd(6, "0").slice(0, 6);
  const value = parseInt(full, 16);
  const mix = amount >= 0 ? 255 : 0;
  const ratio = Math.min(1, Math.abs(amount));
  const channel = (shift) => Math.round(((value >> shift) & 255) * (1 - ratio) + mix * ratio);
  return (channel(16) << 16) + (channel(8) << 8) + channel(0);
}

function initCharacterCanvasFallback() {
  const ctx = els.characterCanvas.getContext("2d");
  if (!ctx) {
    els.characterFallback.hidden = false;
    return;
  }
  els.characterFallback.hidden = true;
  character3d = {
    fallback: true,
    ctx,
    angle: 0,
    faceColor: "#ed8936",
    eyeColor: "#2b6cb0",
    hairColor: "#2f241f",
    shirtColor: "#3182ce",
    pantsColor: "#1f2937",
    shoesColor: "#111827",
    mascot: "Fox",
    interaction: "idle",
    autoRotate: false,
    hair: "short",
    eyeShape: "round",
    nose: "soft",
    mouth: "smile",
    arms: "relaxed",
    legs: "straight",
    shirt: "tee",
    pants: "slim",
    shoes: "trainers"
  };
  drawCharacterFallback();
  updateAutoRotateButton();
}

function drawCharacterFallback() {
  const { ctx } = character3d;
  const canvas = els.characterCanvas;
  const width = canvas.clientWidth || 420;
  const height = canvas.clientHeight || 520;
  const ratio = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
  if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const spin = character3d.autoRotate ? character3d.angle : 0;
  const turn = Math.sin(spin) * 0.5;
  const facing = Math.cos(spin);
  const centerX = width / 2;
  const groundY = height * 0.91;
  const scale = Math.min(width / 420, height / 520);
  const shadowW = 156 * scale;
  const bodySquash = character3d.autoRotate ? 0.72 + Math.abs(facing) * 0.28 : 1;
  const faceShift = turn * 18 * scale;

  ctx.save();
  ctx.translate(centerX, groundY);
  ctx.scale(1, 1);
  const shadowGradient = ctx.createRadialGradient(0, 0, 8, 0, 0, shadowW);
  shadowGradient.addColorStop(0, "rgba(15, 23, 42, 0.24)");
  shadowGradient.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = shadowGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, shadowW * 0.64, 18 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const shoulderY = groundY - 226 * scale;
  const isPointing = character3d.interaction === "pointing";
  const isTyping = character3d.interaction === "typing";
  const isCelebrating = character3d.interaction === "celebrating";
  const legSpread = (character3d.legs === "wide" ? 42 : character3d.legs === "athletic" ? 36 : 31) * scale;
  const legWidth = (character3d.legs === "wide" ? 30 : 25) * scale;
  const armSpread = (character3d.arms === "athletic" ? 80 : character3d.arms === "waving" ? 74 : 68) * scale;
  const rightArmTilt = isPointing ? -1.22 : isCelebrating ? 1.02 : isTyping ? -0.62 : character3d.arms === "waving" ? -0.95 : 0.16;
  const leftArmTilt = isCelebrating ? -1.02 : isTyping ? 0.62 : character3d.arms === "athletic" ? -0.36 : -0.16;

  ctx.save();
  ctx.translate(centerX, 0);
  ctx.scale(bodySquash, 1);
  ctx.translate(-centerX, 0);
  drawArm(ctx, centerX - armSpread, shoulderY + 16 * scale, 24 * scale, isCelebrating ? 104 * scale : 126 * scale, character3d.shirtColor, character3d.faceColor, leftArmTilt);
  drawArm(ctx, centerX + armSpread, shoulderY + 16 * scale, 24 * scale, isPointing ? 142 * scale : isCelebrating ? 104 * scale : 126 * scale, character3d.shirtColor, character3d.faceColor, rightArmTilt, isPointing);
  drawLimb(ctx, centerX - legSpread, groundY - 132 * scale, legWidth, 126 * scale, character3d.pantsColor, 11 * scale);
  drawLimb(ctx, centerX + legSpread, groundY - 132 * scale, legWidth, 126 * scale, character3d.pantsColor, 11 * scale);
  drawShoe(ctx, centerX - legSpread, groundY - 24 * scale, character3d.shoesColor, character3d.shoes, scale);
  drawShoe(ctx, centerX + legSpread, groundY - 24 * scale, character3d.shoesColor, character3d.shoes, scale);
  drawNeck(ctx, centerX, groundY - 270 * scale, character3d.faceColor, scale);
  drawJerseyBody(ctx, centerX, groundY - 244 * scale, 140 * scale, 190 * scale, character3d.shirtColor, character3d.pantsColor);
  ctx.restore();

  drawEar(ctx, centerX - 58 * scale + faceShift, groundY - 322 * scale, character3d.faceColor, scale);
  drawEar(ctx, centerX + 58 * scale + faceShift, groundY - 322 * scale, character3d.faceColor, scale);
  drawHead(ctx, centerX + faceShift, groundY - 344 * scale, 116 * scale, 126 * scale, character3d.faceColor);
  drawFallbackHair(ctx, centerX + faceShift, groundY - 416 * scale, character3d.hair, scale);

  if (facing > -0.2) {
    const eyeOffset = 19 * scale;
    drawEye(ctx, centerX - eyeOffset + faceShift, groundY - 354 * scale, character3d.eyeColor, character3d.eyeShape, scale);
    drawEye(ctx, centerX + eyeOffset + faceShift, groundY - 354 * scale, character3d.eyeColor, character3d.eyeShape, scale);
    drawNose(ctx, centerX + faceShift, groundY - 330 * scale, character3d.nose, scale);
    drawMouth(ctx, centerX + faceShift, groundY - 302 * scale, isCelebrating ? "wide" : character3d.mouth, scale);
  }
}

function updateAutoRotateButton() {
  if (!els.characterAutoRotateBtn || !character3d) return;
  els.characterAutoRotateBtn.checked = Boolean(character3d.autoRotate);
  els.characterAutoRotateBtn.setAttribute("aria-checked", String(Boolean(character3d.autoRotate)));
}

function runCharacterRotation() {
  if (!character3d?.autoRotate) {
    characterRotateFrame = null;
    return;
  }
  character3d.angle += 0.035;
  if (character3d.fallback) {
    drawCharacterFallback();
  } else {
    character3d.group.rotation.y = character3d.angle;
    animateCharacter3d();
  }
  characterRotateFrame = requestAnimationFrame(runCharacterRotation);
}

function setCharacterAutoRotate(enabled) {
  if (!character3d) return;
  character3d.autoRotate = enabled;
  updateAutoRotateButton();
  if (!enabled) {
    character3d.angle = 0;
    if (characterRotateFrame) cancelAnimationFrame(characterRotateFrame);
    characterRotateFrame = null;
    if (character3d.fallback) {
      drawCharacterFallback();
    } else {
      character3d.group.rotation.y = 0;
      animateCharacter3d();
    }
    return;
  }
  if (!characterRotateFrame) characterRotateFrame = requestAnimationFrame(runCharacterRotation);
}

function drawHead(ctx, x, y, width, height, color) {
  const gradient = ctx.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
  gradient.addColorStop(0, "#ffd3a8");
  gradient.addColorStop(0.18, color);
  gradient.addColorStop(1, "#7c3f1d");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, width * 0.34);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.beginPath();
  ctx.ellipse(x - width * 0.2, y - height * 0.08, width * 0.16, height * 0.34, 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
  ctx.lineWidth = Math.max(1, width * 0.02);
  ctx.stroke();
}

function drawJerseyBody(ctx, x, y, width, height, shirtColor, pantsColor) {
  const jersey = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
  jersey.addColorStop(0, shirtColor);
  jersey.addColorStop(0.64, shirtColor);
  jersey.addColorStop(1, "#12315d");
  ctx.fillStyle = jersey;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y, width, height, width * 0.22);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.beginPath();
  ctx.moveTo(x - width * 0.16, y + 1);
  ctx.lineTo(x + width * 0.16, y + 1);
  ctx.quadraticCurveTo(x + width * 0.09, y + height * 0.12, x, y + height * 0.15);
  ctx.quadraticCurveTo(x - width * 0.09, y + height * 0.12, x - width * 0.16, y + 1);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.beginPath();
  ctx.moveTo(x - width * 0.28, y + height * 0.05);
  ctx.lineTo(x + width * 0.05, y + height * 0.05);
  ctx.quadraticCurveTo(x - width * 0.04, y + height * 0.42, x - width * 0.22, y + height * 0.58);
  ctx.quadraticCurveTo(x - width * 0.4, y + height * 0.32, x - width * 0.28, y + height * 0.05);
  ctx.fill();
  const waistY = y + height * 0.79;
  const pantsGradient = ctx.createLinearGradient(x - width / 2, waistY, x + width / 2, y + height);
  pantsGradient.addColorStop(0, pantsColor);
  pantsGradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = pantsGradient;
  ctx.beginPath();
  ctx.roundRect(x - width * 0.39, waistY, width * 0.34, height * 0.22, width * 0.08);
  ctx.roundRect(x + width * 0.05, waistY, width * 0.34, height * 0.22, width * 0.08);
  ctx.fill();
  ctx.strokeStyle = "rgba(15, 23, 42, 0.18)";
  ctx.lineWidth = Math.max(1, width * 0.018);
  ctx.beginPath();
  ctx.moveTo(x, waistY + height * 0.02);
  ctx.lineTo(x, y + height * 0.99);
  ctx.stroke();
}

function drawRoundedBody(ctx, x, y, width, height, color) {
  const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y, width, height, width * 0.32);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x - width * 0.18, y + height * 0.26, width * 0.18, height * 0.36, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLimb(ctx, x, y, width, height, color, radius = 12) {
  const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y, width, height, radius);
  ctx.fill();
}

function drawArm(ctx, x, y, width, height, sleeveColor, skinColor, tilt, pointing = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  const capGradient = ctx.createRadialGradient(-width * 0.24, -width * 0.24, width * 0.08, 0, 0, width * 0.74);
  capGradient.addColorStop(0, shadeCssColor(sleeveColor, 0.32));
  capGradient.addColorStop(1, sleeveColor);
  ctx.fillStyle = capGradient;
  ctx.beginPath();
  ctx.ellipse(0, -height * 0.02, width * 0.72, width * 0.58, 0.16, 0, Math.PI * 2);
  ctx.fill();
  drawLimb(ctx, 0, 0, width, height * 0.66, sleeveColor, width * 0.42);
  drawLimb(ctx, 0, height * 0.58, width * 0.82, height * 0.36, skinColor, width * 0.34);
  const handGradient = ctx.createRadialGradient(-width * 0.2, height * 0.82, width * 0.06, 0, height * 0.94, width * 0.58);
  handGradient.addColorStop(0, shadeCssColor(skinColor, 0.24));
  handGradient.addColorStop(1, skinColor);
  ctx.fillStyle = handGradient;
  ctx.beginPath();
  ctx.ellipse(0, height * 0.94, width * 0.48, width * 0.58, -0.12, 0, Math.PI * 2);
  ctx.fill();
  if (pointing) {
    ctx.strokeStyle = skinColor;
    ctx.lineWidth = Math.max(3, width * 0.22);
    ctx.beginPath();
    ctx.moveTo(width * 0.24, height * 0.9);
    ctx.lineTo(width * 1.05, height * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawNeck(ctx, x, y, color, scale = 1) {
  const gradient = ctx.createLinearGradient(x - 20 * scale, y, x + 20 * scale, y + 50 * scale);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#b95f25");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - 19 * scale, y, 38 * scale, 54 * scale, 14 * scale);
  ctx.fill();
}

function drawEar(ctx, x, y, color, scale = 1) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 11 * scale, 17 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(15, 23, 42, 0.18)";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(x, y, 5 * scale, -1.2, 1.2);
  ctx.stroke();
}

function drawShoe(ctx, x, y, color, shape, scale = 1) {
  const width = (shape === "formal" ? 46 : shape === "sandals" ? 44 : 54) * scale;
  const height = (shape === "boots" || shape === "work-boots" || shape === "space" ? 25 : 21) * scale;
  const shoeGradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
  shoeGradient.addColorStop(0, shadeCssColor(color, 0.22));
  shoeGradient.addColorStop(0.55, color);
  shoeGradient.addColorStop(1, shadeCssColor(color, -0.34));
  ctx.fillStyle = shoeGradient;
  ctx.beginPath();
  ctx.roundRect(x - width * 0.5, y + height * 0.08, width, height * 0.84, 9 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(15, 23, 42, 0.58)";
  ctx.beginPath();
  ctx.roundRect(x - width * 0.54, y + height * 0.72, width * 1.08, 8 * scale, 5 * scale);
  ctx.fill();
  ctx.fillStyle = shadeCssColor(color, 0.1);
  ctx.beginPath();
  ctx.roundRect(x - width * 0.1, y + 2 * scale, width * 0.56, height * 0.72, 8 * scale);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.beginPath();
  ctx.moveTo(x - width * 0.24, y + height * 0.28);
  ctx.lineTo(x + width * 0.16, y + height * 0.28);
  ctx.stroke();
  if (shape === "boots" || shape === "work-boots") {
    ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
    ctx.fillRect(x - width * 0.38, y + height - 5 * scale, width * 0.76, 3 * scale);
  }
}

function shadeCssColor(color, amount) {
  const scratch = document.createElement("canvas").getContext("2d");
  scratch.fillStyle = color || "#111827";
  const normalized = scratch.fillStyle;
  const hex = normalized.startsWith("#") ? normalized : "#111827";
  const raw = hex.replace("#", "");
  const value = parseInt(raw.length === 3 ? raw.split("").map((ch) => ch + ch).join("") : raw.padEnd(6, "0").slice(0, 6), 16);
  const mix = amount >= 0 ? 255 : 0;
  const ratio = Math.min(1, Math.abs(amount));
  const channel = (shift) => Math.round(((value >> shift) & 255) * (1 - ratio) + mix * ratio);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function drawEye(ctx, x, y, color, shape = "round", scale = 1) {
  const width = (shape === "determined" ? 15 : shape === "anime" ? 20 : 17) * scale;
  const height = (shape === "happy" ? 5 : shape === "anime" ? 10 : shape === "determined" ? 6 : 7) * scale;
  if (shape === "happy") {
    ctx.strokeStyle = "rgba(15, 23, 42, 0.7)";
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(x, y + 4, width / 2, Math.PI + 0.1, Math.PI * 2 - 0.1);
    ctx.stroke();
    return;
  }
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(x, y, width / 2, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, (shape === "anime" ? 5.4 : 4) * scale, 0, Math.PI * 2);
  ctx.fill();
  if (shape === "anime") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.beginPath();
    ctx.arc(x - 2 * scale, y - 3 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  if (shape === "determined") {
    ctx.strokeStyle = "rgba(15, 23, 42, 0.45)";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y - height);
    ctx.lineTo(x + width / 2, y - height - 3);
    ctx.stroke();
  }
}

function drawNose(ctx, x, y, shape, scale = 1) {
  ctx.strokeStyle = "rgba(15, 23, 42, 0.25)";
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  if (shape === "cute") {
    ctx.arc(x, y + 3 * scale, 5 * scale, 0, Math.PI * 2);
  } else if (shape === "sharp") {
    ctx.moveTo(x, y - 10 * scale);
    ctx.lineTo(x + 8 * scale, y + 8 * scale);
    ctx.lineTo(x - 2 * scale, y + 10 * scale);
  } else {
    ctx.moveTo(x, y - 8 * scale);
    ctx.quadraticCurveTo(x + (shape === "straight" ? 1 : 6) * scale, y + 2 * scale, x, y + 10 * scale);
  }
  ctx.stroke();
}

function drawMouth(ctx, x, y, shape, scale = 1) {
  ctx.strokeStyle = "rgba(15, 23, 42, 0.4)";
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  if (shape === "neutral") {
    ctx.moveTo(x - 16 * scale, y);
    ctx.lineTo(x + 16 * scale, y);
  } else if (shape === "surprised") {
    ctx.ellipse(x, y - 3 * scale, 9 * scale, 13 * scale, 0, 0, Math.PI * 2);
  } else if (shape === "grin") {
    ctx.roundRect(x - 18 * scale, y - 10 * scale, 36 * scale, 16 * scale, 7 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 14 * scale, y - 2 * scale);
    ctx.lineTo(x + 14 * scale, y - 2 * scale);
  } else {
    ctx.arc(x, y - (shape === "wide" ? 4 : 6) * scale, (shape === "wide" ? 24 : 16) * scale, 0.18, Math.PI - 0.18);
  }
  ctx.stroke();
}

function drawFallbackHair(ctx, x, y, hair, scale = 1) {
  if (hair === "none") return;
  const hairGradient = ctx.createLinearGradient(x - 60 * scale, y - 18 * scale, x + 58 * scale, y + 68 * scale);
  hairGradient.addColorStop(0, character3d.hairColor);
  hairGradient.addColorStop(1, "#1f130f");
  ctx.fillStyle = hairGradient;
  if (hair === "spiky") {
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 14 * scale, y + 28 * scale);
      ctx.lineTo(x + i * 14 * scale + 8 * scale, y - (16 + Math.abs(i) * 2) * scale);
      ctx.lineTo(x + i * 14 * scale + 18 * scale, y + 28 * scale);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }
  if (hair === "curly") {
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(x + i * 14 * scale, y + (28 + (Math.abs(i) % 2) * 4) * scale, 15 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (hair === "sidepart") {
    ctx.beginPath();
    ctx.ellipse(x, y + 30 * scale, 52 * scale, 32 * scale, -0.18, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(x - 8 * scale, y + 4 * scale, 4 * scale, 42 * scale);
    return;
  }
  ctx.beginPath();
  ctx.ellipse(x, y + 30 * scale, (hair === "long" ? 60 : 54) * scale, (hair === "long" ? 54 : 36) * scale, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(x + i * 16 * scale, y + (34 + Math.abs(i) * 1.5) * scale, 13 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  if (hair === "long") {
    ctx.fillRect(x - 54 * scale, y + 30 * scale, 108 * scale, 66 * scale);
  }
}

function renderCollection() {
  const collection = appState.profile.collection;
  const cells = Array.from({ length: 16 }, (_, index) => {
    const item = collection[index];
    const cell = document.createElement("div");
    cell.className = `collection-cell ${item ? item.tier : "empty"}`;
    if (item) {
      cell.innerHTML = `<span>${item.tier}</span><strong>${item.name}</strong><small>#${index + 1}</small>`;
    } else {
      cell.innerHTML = `<span>empty</span><strong>Slot ${index + 1}</strong>`;
    }
    return cell;
  });
  els.collectionGrid.replaceChildren(...cells);
}

function rollTier() {
  const entries = Object.entries(tierConfig);
  const total = entries.reduce((sum, [, config]) => sum + config.weight, 0);
  let roll = Math.random() * total;
  for (const [tier, config] of entries) {
    roll -= config.weight;
    if (roll <= 0) return tier;
  }
  return "standard";
}

function collectItem() {
  if (appState.profile.collection.length >= 16) {
    els.collectionStatus.textContent = "Your 4 x 4 collection grid is full.";
    return;
  }
  const unlockedTiers = getUnlockedTiers();
  let tier = rollTier();
  if (!unlockedTiers.includes(tier)) tier = "standard";
  const config = tierConfig[tier];
  const name = seedAt(config.items, Date.now());
  const item = { id: `manual:${Date.now()}`, tier, name, source: "Collection roll", collectedAt: Date.now() };
  appState.profile.collection.push(item);
  saveProfile();
  renderCollection();
  const nextLocked = Object.entries(tierUnlockRules).find(([lockedTier, rule]) => !unlockedTiers.includes(lockedTier) && Number(appState.profile.storyProgress?.completedTasks || 0) < rule.tasks);
  els.collectionStatus.textContent = nextLocked
    ? `Collected ${config.label}: ${name}. Next tier: ${tierConfig[nextLocked[0]].label} after ${nextLocked[1].tasks} reading tasks.`
    : `Collected ${config.label}: ${name}.`;
}

function clearCollection() {
  appState.profile.collection = [];
  saveProfile();
  renderCollection();
  els.collectionStatus.textContent = "Collection grid cleared.";
}

const customizationInputs = [
  els.hairSelect, els.eyeShapeSelect, els.noseSelect, els.mouthSelect, els.armSelect,
  els.legSelect, els.shirtSelect, els.pantsSelect, els.shoesSelect, els.hairColor,
  els.eyeColor, els.faceColor, els.shirtColor, els.pantsColor, els.shoesColor
];

customizationInputs.forEach(el => {
  el?.addEventListener("input", () => {
    appState.profile.customization = {
      hair: els.hairSelect.value,
      eyeShape: els.eyeShapeSelect.value,
      nose: els.noseSelect.value,
      mouth: els.mouthSelect.value,
      arms: els.armSelect.value,
      legs: els.legSelect.value,
      shirt: els.shirtSelect.value,
      pants: els.pantsSelect.value,
      shoes: els.shoesSelect.value,
      hairColor: els.hairColor.value,
      eyeColor: els.eyeColor.value,
      faceColor: els.faceColor.value,
      shirtColor: els.shirtColor.value,
      pantsColor: els.pantsColor.value,
      shoesColor: els.shoesColor.value
    };
    updateCharacterVisuals();
    saveProfile();
  });
});

els.editBio.addEventListener("input", updateBioCount);
[
  [els.editDisplayName, "Display name"],
  [els.editUsername, "Username"],
  [els.editBio, "Bio"]
].forEach(([input, label]) => {
  input?.addEventListener("beforeinput", () => {
    input.dataset.cleanValue = input.value;
  });
  input?.addEventListener("input", () => enforceCleanProfileField(input, label));
  input?.addEventListener("paste", () => setTimeout(() => enforceCleanProfileField(input, label), 0));
});
els.characterAutoRotateBtn?.addEventListener("change", () => {
  if (!character3d) initCharacter3d();
  setCharacterAutoRotate(Boolean(els.characterAutoRotateBtn.checked));
});
els.collectItemBtn.addEventListener("click", collectItem);
els.clearCollectionBtn.addEventListener("click", clearCollection);

els.saveProfileBtn.addEventListener("click", () => {
  const dName = els.editDisplayName.value.trim();
  const uName = els.editUsername.value.trim().replace(/^@/, "");
  const bio = els.editBio.value.trim();
  
  if (checkInappropriate(dName) || checkInappropriate(uName) || checkInappropriate(bio)) {
    els.profileSaveStatus.textContent = "Inappropriate content detected in display name, username, or bio.";
    return;
  }
  if (!dName || dName.length > 64) {
    els.profileSaveStatus.textContent = "Display name must be 1-64 characters.";
    return;
  }
  if (!/^[a-zA-Z0-9_.-]{1,64}$/.test(uName)) {
    els.profileSaveStatus.textContent = "Username must be 1-64 characters and use letters, numbers, dots, underscores, or hyphens.";
    return;
  }
  if (bio.length > 1000) {
    els.profileSaveStatus.textContent = "Bio must be 1000 characters or fewer.";
    return;
  }
  if (!canChangeUsername(uName)) {
    renderUsernameRule();
    els.profileSaveStatus.textContent = "Username can only be changed once per week.";
    return;
  }
  if (uName !== appState.profile.username) appState.profile.lastUsernameChange = Date.now();
  appState.profile.displayName = dName;
  appState.profile.username = uName;
  appState.profile.bio = bio;
  saveProfile();
  renderProfile();
  if (els.profileEditPanel) els.profileEditPanel.hidden = true;
  if (els.editProfileModal) els.editProfileModal.hidden = true;
  if (els.editProfileBtn) els.editProfileBtn.textContent = "Edit";
  els.profileSaveStatus.textContent = "Profile saved.";
});

function saveProfile() {
  localStorage.setItem('nova_profile', JSON.stringify(appState.profile));
  socialDataStore?.syncOwnProfileFromApp();
}

// --- COLOR WHEEL ---
let colorWheelActive = false;
function initColorWheel() {
  if (!els.colorWheelCanvas) return;
  const ctx = els.colorWheelCanvas.getContext('2d');
  const size = els.colorWheelCanvas.width;
  const radius = size / 2;
  
  // Draw wheel
  for (let angle = 0; angle < 360; angle++) {
    const startAngle = (angle - 1) * Math.PI / 180;
    const endAngle = (angle + 1) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.closePath();
    const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Update swatch UI
  const updateSwatch = (color) => {
    els.colorWheelSwatch.style.background = color;
    els.colorWheelHex.textContent = color;
    appState.profile.customization = appState.profile.customization || {};
    appState.profile.customization.avatarColor = color;
  };
  
  // Setup interaction
  const pickColor = (e) => {
    const rect = els.colorWheelCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if inside circle
    const dx = x - radius;
    const dy = y - radius;
    if (dx * dx + dy * dy > radius * radius) return; // Outside
    
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    updateSwatch(hex);
  };
  
  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }
  
  if (!colorWheelActive) {
    els.colorWheelCanvas.addEventListener('mousedown', (e) => {
      pickColor(e);
      const onMove = (ev) => pickColor(ev);
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
    colorWheelActive = true;
  }
}

// --- DRAG AND DROP ---
function makeDraggable(el, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

if (els.twitchChat) makeDraggable(els.twitchChat, els.twitchChat.querySelector('.drag-handle'));
if (els.dmWidget) makeDraggable(els.dmWidget, els.dmWidget.querySelector('.drag-handle'));

if (typeof initDMs === "function") initDMs();

// REWARD FOR SPEECH
const originalEvaluateSpeech = evaluateSpeech;
evaluateSpeech = function(transcript) {
  originalEvaluateSpeech(transcript);
  if (els.accuracyScore.textContent !== "--") {
     const accuracy = parseInt(els.accuracyScore.textContent);
      if (accuracy > 50) {
        updateCoins(10);
        addXp(100);
      }
  }
}

// Initialize App State
appState.unlockedThemes = JSON.parse(localStorage.getItem('nova_unlocked_themes')) || ["10", "9", "8"];
appState.profile = normalizeProfile(JSON.parse(localStorage.getItem('nova_profile')) || {
  displayName: "Connor",
  username: "connor_ll",
  bio: "Learning Russian!",
  customization: {
    mascot: "Fox",
    hair: "short",
    eyeShape: "round",
    nose: "soft",
    mouth: "smile",
    arms: "relaxed",
    legs: "straight",
    shirt: "tee",
    pants: "slim",
    shoes: "trainers",
    hairColor: "#2f241f",
    eyeColor: "#2b6cb0",
    faceColor: "#ed8936",
    shirtColor: "#3182ce",
    pantsColor: "#1f2937",
    shoesColor: "#111827"
  }
});
renderProfilePracticeStats();
socialDataStore.syncOwnProfileFromApp();

if (els.targetLanguageSelect) els.targetLanguageSelect.value = appState.targetLanguage;
if (els.appTitle) els.appTitle.textContent = languageDatasets[appState.targetLanguage].title;
const initialWritingMeta = getLanguageWritingMeta();
els.russianParagraph?.setAttribute("lang", initialWritingMeta.lang);
els.russianParagraph?.setAttribute("dir", initialWritingMeta.dir);
els.storyContent?.setAttribute("lang", initialWritingMeta.lang);
els.storyContent?.setAttribute("dir", initialWritingMeta.dir);

initEconomy();
renderStore();
renderThemes();
renderSpotifyPlaylist();
updatePlayerUI();
setupChatLanguages();

setupSpeechRecognition();
renderStoryOptions();
renderStats();
renderParagraph();
renderStory();
renderWordList();
loadFullRussianWords();

// Social Context Menu logic
const socialContextMenu = document.getElementById("socialContextMenu");
let ctxMenuTarget = null;
let unsolicitedMsgCount = 3;

document.addEventListener("contextmenu", (e) => {
  const item = e.target.closest("li[data-person]");
  if (item && item.parentElement.id.includes("List")) {
    e.preventDefault();
    ctxMenuTarget = item.dataset.person;
    showSocialContextMenu(e, ctxMenuTarget, item.dataset.socialType);
  } else {
    socialContextMenu.hidden = true;
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#socialContextMenu")) {
    socialContextMenu.hidden = true;
  }
});

document.getElementById("ctxVisitProfile")?.addEventListener("click", () => {
  if (ctxMenuTarget) openPersonProfile(ctxMenuTarget);
  socialContextMenu.hidden = true;
});

document.getElementById("ctxAddFriend")?.addEventListener("click", () => {
  alert("Friend request sent to " + ctxMenuTarget);
  socialContextMenu.hidden = true;
});

document.getElementById("ctxSendMessage")?.addEventListener("click", () => {
  if (unsolicitedMsgCount > 0) {
    unsolicitedMsgCount--;
    document.getElementById("ctxMessageCount").textContent = unsolicitedMsgCount;
    alert("Message sent to " + ctxMenuTarget);
  } else {
    alert("You have reached your limit of unsolicited messages.");
  }
  socialContextMenu.hidden = true;
});

// Clippy Guide
const clippyGuide = document.getElementById("clippyGuide");
const clippyAvatar = document.getElementById("clippyAvatar");
const clippyMessage = document.getElementById("clippyMessage");

function updateClippy() {
  if (!clippyGuide) return;
  if (appState.settings?.characterGuide === false) {
    clippyGuide.hidden = true;
    return;
  }
  const targetLang = appState.targetLanguage;
  clippyGuide.hidden = false;
  clippyAvatar.innerHTML = `<span style="font-size: 3rem; line-height: 70px;">${appState.profile.customization.mascot || "🦊"}</span>`;
  
  renderMascotAvatar(clippyAvatar, appState.profile.customization.mascot || "LL");
  if (appState.activeView === "practice") {
    clippyMessage.textContent = `Hover over words to translate them! Practice makes perfect in ${targetLang}!`;
  } else if (appState.activeView === "stories") {
    clippyMessage.textContent = `Read stories to immerse yourself in ${targetLang}.`;
  } else if (appState.activeView === "profile") {
    clippyMessage.textContent = `Customize your profile, check your ${targetLang} achievements, and make friends!`;
  } else {
    clippyMessage.textContent = `Welcome to Language Learners!`;
  }
}

function updateCharacterGuide() {
  updateClippy();
}

// Intercept switchView to update Clippy
const originalSwitchView = switchView;
switchView = function(viewId) {
  originalSwitchView(viewId);
  updateClippy();
};

// Initialize clippy periodically if mascot changes
setInterval(updateClippy, 2000);

function renderAchievements() {
  if (!els.achievementsList) return;
  const lang = appState.targetLanguage.charAt(0).toUpperCase() + appState.targetLanguage.slice(1);
  const achievements = [
    { name: `${lang} Beginner`, desc: `Read 10 words in ${lang}`, progress: 100 },
    { name: `${lang} Storyteller`, desc: `Read 5 stories in ${lang}`, progress: 40 },
    { name: `${lang} Master`, desc: `Learn 1000 words in ${lang}`, progress: 15 }
  ];
  
  els.achievementsList.replaceChildren(...achievements.map(a => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.background = "rgba(0,0,0,0.05)";
    div.style.borderRadius = "8px";
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <div style="font-weight: bold;">${a.name}</div>
      <div style="font-size: 0.85rem; color: #555;">${a.desc}</div>
      <div style="width: 100%; height: 8px; background: #ddd; border-radius: 4px; margin-top: 6px;">
        <div style="width: ${a.progress}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
      </div>
    `;
    return div;
  }));
}

// Hook into target language switch
const originalSwitchTargetLanguage = switchTargetLanguage;
switchTargetLanguage = function(language) {
  originalSwitchTargetLanguage(language);
  renderAchievements();
  updateClippy();
};

// Also hook into switchView because achievements might be rendered on profile open
const originalRenderProfile = renderProfile;
renderProfile = function() {
  originalRenderProfile();
  renderAchievements();
};
