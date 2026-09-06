const photo = (label, tone = "rose", index = 1) => {
  const colors = {
    rose: ["#f4d8e2", "#9d4765"],
    gold: ["#f4e4bd", "#8a622a"],
    blue: ["#d9e8f3", "#41667e"],
    sage: ["#dfe9df", "#4f7058"],
    lilac: ["#e7ddf1", "#67527c"],
  };
  const [background, accent] = colors[tone] || colors.rose;
  const safeLabel = String(label).replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${background}"/><circle cx="1020" cy="140" r="220" fill="${accent}" opacity=".16"/><circle cx="180" cy="700" r="280" fill="${accent}" opacity=".12"/><path d="M0 590C240 470 390 720 650 570s390-30 550-110v340H0z" fill="${accent}" opacity=".13"/><text x="600" y="360" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="42" font-weight="700">${safeLabel}</text><text x="600" y="420" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="24">место для фотографии ${index}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const variant = (id, name, price, includes, tone = "rose") => ({
  id,
  name,
  price,
  includes,
  image: photo(name, tone),
  gallery: [1, 2, 3, 4].map((index) => photo(name, tone, index)),
});

const exampleVariant = (id, name, price, includes, tone = "rose") => ({
  ...variant(id, name, price, includes, tone),
  example: true,
});

const placeholderGallery = (label, tone = "rose", count = 4) => Array.from(
  { length: count },
  (_, index) => photo(label, tone, index + 1),
);

const events = [
  { id: "birthday", title: "День рождения", text: "Шары, фотозоны и оформление площадки для детских и взрослых праздников.", tone: "rose" },
  { id: "wedding", title: "Свадьба", text: "Фотозоны, церемония, президиум, гостевые столы и оформление под ключ.", tone: "sage" },
  { id: "gender", title: "Гендер-пати", text: "Сюрприз для раскрытия пола малыша, фотозона и оформление всей площадки.", tone: "lilac" },
  { id: "anniversary", title: "Юбилей", text: "Фотозона, декор главного стола и оформление банкетного пространства.", tone: "gold" },
  { id: "graduation", title: "Выпускной", text: "Памятная фотозона, welcome-зона и оформление зала для выпускников.", tone: "blue" },
  { id: "first-birthday", title: "Годовасие", text: "Нежные композиции из шаров и фотозоны для первого дня рождения.", tone: "blue" },
  { id: "maternity", title: "Выписка из роддома", text: "Шары, именные композиции и декор для первой семейной встречи.", tone: "rose" },
  { id: "corporate", title: "Событие для компании", text: "Брендированные фотозоны, welcome-зоны и оформление площадки.", tone: "blue" },
].map((event) => ({ ...event, image: photo(event.title, event.tone) }));

const catalog = [
  {
    id: "birthday-balloons", eventId: "birthday", name: "Композиции из шаров", price: "от 5 390 ₽",
    includes: "Готовые композиции и небольшие зоны для дома, кафе или подарка.", tone: "rose",
    variants: [
      variant("birthday-balloons-one", "Фотозона «1 годик»", "от 5 390 ₽", "Набор шаров и композиция для семейных фотографий.", "blue"),
      variant("birthday-balloons-nougat", "Композиция «Нуга»", "от 7 610 ₽", "Воздушные шары в спокойной палитре и доставка.", "gold"),
      variant("birthday-balloons-paris", "Композиция «Парижский аромат»", "от 8 220 ₽", "Связки шаров с декоративными цепочками.", "lilac"),
      variant("birthday-balloons-chain", "Композиция с цепочками", "от 12 310 ₽", "Расширенный набор шаров с декоративными деталями.", "rose"),
    ],
  },
  {
    id: "birthday-photo", eventId: "birthday", name: "Фотозона на конструкциях", price: "от 15 000 ₽",
    includes: "Каркас, шары, персональная надпись, тумба и монтаж.", tone: "rose",
    variants: [
      variant("birthday-photo-cat", "Фотозона «С киской»", "от 15 000 ₽", "Прямоугольный каркас, гирлянда, надпись, тумба и тематическая фигура."),
      variant("birthday-photo-air", "Фотозона «Воздушный праздник»", "от 18 000 ₽", "Каркас, гирлянда из шаров, декоративные вставки, надпись и тумба.", "blue"),
      variant("birthday-photo-butterflies", "Фотозона «С бабочками»", "от 28 000 ₽", "Две панели, каркас, шары, крупные бабочки, надпись и тумба.", "lilac"),
      variant("birthday-photo-sequin", "Фотозона с пайетками", "от 30 000 ₽", "Панель с пайетками, фигурный каркас, гирлянда из шаров и надпись.", "gold"),
    ],
  },
  {
    id: "birthday-full", eventId: "birthday", name: "Оформление праздника под ключ", price: "от 32 000 ₽",
    includes: "Фотозона и связанные зоны праздника в одной стилистике.", tone: "lilac",
    variants: [
      variant("birthday-full-home", "Домашний праздник", "от 32 000 ₽", "Фотозона, декор стола для торта, шары и монтаж."),
      variant("birthday-full-cafe", "Праздник в кафе", "от 45 000 ₽", "Фотозона, главный стол, welcome-детали и оформление зала.", "gold"),
      variant("birthday-full-all", "Полное оформление площадки", "от 70 000 ₽", "Единая концепция, несколько зон, столы гостей, доставка и монтаж.", "sage"),
    ],
  },
  {
    id: "wedding-photo", eventId: "wedding", name: "Свадебная фотозона", price: "от 25 000 ₽",
    includes: "Выберите подходящий ценовой уровень. Фотографии будут показывать примеры работ, а цвет, форма, надпись и детали оформления согласуются по вашим пожеланиям.", tone: "sage",
    variants: [
      exampleVariant("wedding-photo-25000", "Фотозона от 25 000 ₽", "от 25 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид фотозоны создаётся по вашим пожеланиям.", "sage"),
      exampleVariant("wedding-photo-35000", "Фотозона от 35 000 ₽", "от 35 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид фотозоны создаётся по вашим пожеланиям.", "rose"),
      exampleVariant("wedding-photo-45000", "Фотозона от 45 000 ₽", "от 45 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид фотозоны создаётся по вашим пожеланиям.", "gold"),
    ],
  },
  {
    id: "wedding-presidium", eventId: "wedding", name: "Президиум молодожёнов", price: "от 25 000 ₽",
    includes: "Выберите подходящий ценовой уровень. Фотографии будут показывать примеры работ, а фон, текстиль, цветы и декоративные детали согласуются по вашим пожеланиям.", tone: "gold",
    variants: [
      exampleVariant("wedding-presidium-25000", "Президиум от 25 000 ₽", "от 25 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид президиума создаётся по вашим пожеланиям.", "sage"),
      exampleVariant("wedding-presidium-35000", "Президиум от 35 000 ₽", "от 35 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид президиума создаётся по вашим пожеланиям.", "rose"),
      exampleVariant("wedding-presidium-45000", "Президиум от 45 000 ₽", "от 45 000 ₽", "Четыре примера оформления этого ценового уровня. Точный вид президиума создаётся по вашим пожеланиям.", "gold"),
    ],
  },
  {
    id: "wedding-ceremony", eventId: "wedding", name: "Выездная регистрация", price: "от 35 000 ₽",
    includes: "Оформляем место церемонии в общей стилистике свадьбы. На странице будут фотографии-примеры, а точный состав согласуется для выбранной площадки.", tone: "rose",
    informational: true,
    gallery: placeholderGallery("Выездная регистрация", "rose", 4),
    inclusions: [
      "церемониальный фон или арка",
      "текстиль и декоративные композиции",
      "оформление прохода и зоны церемонии",
      "доставка, монтаж и демонтаж по договорённости",
    ],
    variants: [],
  },
  {
    id: "wedding-hall", eventId: "wedding", name: "Оформление свадебного зала", price: "Расчёт индивидуально",
    includes: "Оформляем пространство зала в единой стилистике свадьбы. Состав подбирается под площадку, число гостей и пожелания пары.", tone: "sage",
    informational: true,
    gallery: placeholderGallery("Оформление свадебного зала", "sage", 6),
    inclusions: [
      "столик на колёсах для свадебного торта",
      "текстильные салфетки и скатерти",
      "декоративные или цветочные композиции на гостевые столы",
      "чехлы и банты на стулья",
      "согласование деталей, доставка и монтаж оформления",
    ],
    variants: [],
  },
  {
    id: "wedding-full", eventId: "wedding", name: "Свадьба под ключ", price: "Расчёт индивидуально",
    includes: "Все основные зоны свадьбы оформляются в одной концепции. Итоговый состав и стоимость рассчитываются после обсуждения площадки, количества гостей и пожеланий пары.", tone: "gold",
    informational: true,
    gallery: placeholderGallery("Свадьба под ключ", "gold", 6),
    inclusions: [
      "свадебная фотозона",
      "президиум молодожёнов",
      "оформление выездной регистрации",
      "оформление свадебного зала",
      "единая концепция, согласование, доставка и монтаж",
    ],
    variants: [],
  },
  {
    id: "gender-extinguisher", eventId: "gender", name: "Гендерный огнетушитель", price: "от 3 500 ₽",
    includes: "Яркое облако голубого или розового цвета для эффектного раскрытия пола малыша на открытой площадке.", tone: "blue",
    directOrder: true,
    gallery: placeholderGallery("Гендерный огнетушитель", "blue", 4),
    variants: [],
  },
  {
    id: "gender-surprise-ball", eventId: "gender", name: "Гендерный шар-сюрприз", price: "от 2 500 ₽",
    includes: "Большой непрозрачный шар с голубым или розовым конфетти, цвет которого становится виден после хлопка.", tone: "lilac",
    directOrder: true,
    gallery: placeholderGallery("Гендерный шар-сюрприз", "lilac", 4),
    variants: [],
  },
  {
    id: "gender-photo", eventId: "gender", name: "Фотозона для гендер-пати", price: "от 20 000 ₽",
    includes: "Фотозона в выбранной стилистике с фоном, воздушными шарами и индивидуальной надписью.", tone: "rose",
    directOrder: true,
    gallery: placeholderGallery("Фотозона для гендер-пати", "rose", 4),
    variants: [],
  },
  {
    id: "anniversary-decoration", eventId: "anniversary", name: "Оформление юбилея", price: "от 25 000 ₽",
    includes: "Оформление праздничного пространства в выбранной стилистике с декором для памятных фотографий.", tone: "gold",
    directOrder: true,
    gallery: placeholderGallery("Оформление юбилея", "gold", 4),
    variants: [],
  },
  {
    id: "graduation-decoration", eventId: "graduation", name: "Оформление выпускного", price: "от 30 000 ₽",
    includes: "Оформление выпускного с памятной фотозоной, годом выпуска и декоративными деталями.", tone: "blue",
    directOrder: true,
    gallery: placeholderGallery("Оформление выпускного", "blue", 4),
    variants: [],
  },
  {
    id: "first-birthday-balloons", eventId: "first-birthday", name: "Шары на годовасие", price: "от 5 390 ₽",
    includes: "Именные композиции и наборы шаров для первого дня рождения.", tone: "blue",
    variants: [
      variant("first-birthday-blue", "Набор «1 годик»", "от 5 390 ₽", "Шары в выбранной палитре, цифра и небольшая композиция.", "blue"),
      variant("first-birthday-name", "Именная композиция", "от 8 000 ₽", "Шар-гигант с именем, цифра и связки гелиевых шаров.", "rose"),
      variant("first-birthday-cake", "Шары и стол для торта", "от 12 000 ₽", "Композиция из шаров, цифра и декор зоны для торта.", "gold"),
    ],
  },
  {
    id: "first-birthday-photo", eventId: "first-birthday", name: "Фотозона на годовасие", price: "от 15 000 ₽",
    includes: "Фон, цифра, имя ребёнка, шары и монтаж.", tone: "blue",
    variants: [
      variant("first-birthday-photo-light", "Нежная фотозона", "от 15 000 ₽", "Один фон, цифра, имя и гирлянда из шаров.", "blue"),
      variant("first-birthday-photo-theme", "Тематическая фотозона", "от 20 000 ₽", "Панели, тематические фигуры, шары и тумба.", "rose"),
      variant("first-birthday-photo-full", "Большая фотозона", "от 28 000 ₽", "Несколько панелей, объёмный декор, тумбы и монтаж.", "lilac"),
    ],
  },
  {
    id: "maternity-decoration", eventId: "maternity", name: "Оформление выписки из роддома", price: "от 25 000 ₽",
    includes: "Праздничное оформление встречи малыша с воздушными шарами, именной надписью и зоной для семейных фотографий.", tone: "rose",
    directOrder: true,
    gallery: placeholderGallery("Оформление выписки из роддома", "rose", 4),
    variants: [],
  },
  {
    id: "corporate-photo", eventId: "corporate", name: "Брендированная фотозона", price: "от 20 000 ₽",
    includes: "Фон с логотипом и цветами компании для гостей и команды.", tone: "blue",
    variants: [
      variant("corporate-photo-brandwall", "Бренд-волл", "от 20 000 ₽", "Печатный фон с логотипом, каркас и монтаж.", "blue"),
      variant("corporate-photo-panels", "Фотозона из панелей", "от 30 000 ₽", "Фигурные панели, объёмный логотип и свет.", "sage"),
      variant("corporate-photo-sequin", "Фотозона с пайетками", "от 35 000 ₽", "Пайетки в цветах бренда, логотип или неон и свет.", "gold"),
    ],
  },
  {
    id: "corporate-welcome", eventId: "corporate", name: "Welcome-зона компании", price: "от 29 000 ₽",
    includes: "Входная точка, навигация и место первой встречи гостей.", tone: "blue",
    variants: [
      variant("corporate-welcome-sign", "Входная группа", "от 29 000 ₽", "Брендированная вывеска, стойки и декоративные композиции.", "blue"),
      variant("corporate-welcome-register", "Welcome и регистрация", "от 40 000 ₽", "Стойка регистрации, навигация, фон и брендированные детали.", "sage"),
      variant("corporate-welcome-full", "Брендированная зона встречи", "от 50 000 ₽", "Вход, регистрация, фототочка и декор в цветах компании.", "gold"),
    ],
  },
  {
    id: "corporate-interactive", eventId: "corporate", name: "Интерактивная фотозона", price: "от 45 000 ₽",
    includes: "Фотозона с цифровыми эффектами и работой ассистента.", tone: "lilac",
    variants: [
      variant("corporate-interactive-two", "Kinect-фотозона — 2 часа", "от 45 000 ₽", "Интерактивный фон, печать фотографий, отправка на почту и ассистент.", "lilac"),
      variant("corporate-interactive-three", "Kinect-фотозона — 3 часа", "от 50 000 ₽", "Интерактивная фотозона и ассистент на три часа.", "blue"),
      variant("corporate-interactive-four", "Kinect-фотозона — 4 часа", "от 55 000 ₽", "Интерактивная фотозона и ассистент на четыре часа.", "gold"),
    ],
  },
];

export const project = {
  name: "Арт-деко",
  company: {
    title: "Оформляем праздники. Создаём воспоминания.",
    description: "«Арт-деко» — оформление свадеб, дней рождения и особенных событий в Приморье. От камерной фотозоны до декора всей площадки — продумываем каждую деталь вашего праздника.",
    experience: "17 лет опыта в декоре",
    geography: "Большой Камень · Владивосток · Приморье",
  },
  recentWorks: [
    { src: "./assets/photo_1_2026-09-05_20-25-50.jpg", alt: "Оформление гостевого стола: белые цветы и нежно-голубой текстиль", caption: "Нежные оттенки и живые цветы" },
    { src: "./assets/photo_10_2026-09-05_20-25-50.jpg", alt: "Розовая фотозона с цветами, шарами и клубничными акцентами", caption: "Яркие детали для особенного дня" },
    { src: "./assets/photo_50_2026-09-05_20-25-50.jpg", alt: "Свадебный президиум с бордовой драпировкой и золотыми подсвечниками", caption: "Свадебное оформление в бордо и золоте" },
    { src: "./assets/photo_75_2026-09-05_20-25-50.jpg", alt: "Букет невесты из белых роз и гипсофилы", caption: "Красота в каждой детали" },
  ],
  // Тексты и фотографии страницы «О компании» можно менять здесь.
  about: {
    decoratorPhoto: "./assets/photo_92_2026-09-05_20-25-50.jpg",
    decoratorPhotoAlt: "Декоратор Арт-деко рядом с созданной цветочной фотозоной",
    decoratorEyebrow: "Давайте знакомиться",
    decoratorTitle: "Человек, который создаёт атмосферу вашего праздника",
    decoratorText: "Я занимаюсь декором с 2009 года и по-настоящему люблю своё дело — создавать красоту, атмосферу и дарить людям праздник. За это время я оформила более 1000 мероприятий, работала с крупными государственными объектами, включая завод «Звезда» и ССК, а также с корпоративными клиентами.",
    recentTitle: "Последние работы компании",
    recentText: "Оформление павильона Приморского края на ВЭФ 2026. Создали зелёную фотозону в природной стилистике, вдохновлённую ландшафтами Приморья.",
    recentWorks: [
      { src: "./assets/recent-primorye-wall-01.png", alt: "Зелёная декоративная стена с телевизором, подсветкой и живыми деревьями", caption: "Проект «Отдыхай в Приморье»" },
      { src: "./assets/recent-primorye-wall-02.png", alt: "Фитостена с телевизором, хвойным силуэтом и растениями в кашпо", caption: "Оформление пространства растениями" },
      { src: "./assets/recent-primorye-wall-03.png", alt: "Декоративная зелёная стена с подсветкой и надписью «Отдыхай в Приморье»", caption: "Зелёная стена с подсветкой" },
      { src: "./assets/recent-primorye-wall-04.png", alt: "Крупный план фитостены, декоративных деревьев и подсветки", caption: "Детали зелёного оформления" },
    ],
    generalTitle: "Общая информация о компании",
    generalText: [
      "В «Арт-Деко» мы создаём оформление, которое подчёркивает характер события и делает пространство по-настоящему запоминающимся. В работе важны не только красивые детали, но и то, как всё выглядит вместе — от общей концепции до последнего акцента. Мы делаем оформление так, чтобы оно производило впечатление вживую, красиво смотрелось на фото и оставалось в памяти у гостей.",
    ],
    gallery: [
      { src: "./assets/photo_10_2026-09-05_20-25-50.jpg", alt: "Розовая фотозона с цветами и воздушными шарами" },
      { src: "./assets/photo_23_2026-09-05_20-25-50.jpg", alt: "Голубая фотозона с воздушными шарами и серебряным фоном" },
      { src: "./assets/photo_36_2026-09-05_20-25-50.jpg", alt: "Золотое оформление праздничной фотозоны" },
      { src: "./assets/photo_42_2026-09-05_20-25-50.jpg", alt: "Праздничный стол с цветочным оформлением в розовых оттенках" },
      { src: "./assets/photo_50_2026-09-05_20-25-50.jpg", alt: "Свадебный президиум с бордовой драпировкой" },
      { src: "./assets/photo_56_2026-09-05_20-25-50.jpg", alt: "Свадебная фотозона с цветами и светлой драпировкой" },
      { src: "./assets/photo_83_2026-09-05_20-25-50.jpg", alt: "Банкетный зал с чёрно-белым оформлением" },
      { src: "./assets/photo_100_2026-09-05_20-25-50.jpg", alt: "Светлое оформление стола с воздушными цветочными композициями" },
    ],
  },
  socials: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/artdeko.studio?igsi=bmlid2hjbXNha2Jn" },
    { id: "telegram", label: "Telegram-канал", url: "https://t.me/YRNbstP7931mOTli" },
  ],
  phone: {
    display: "+7 951 026-03-25",
    href: "tel:+79510260325",
  },
  eyebrow: "Оформление праздников",
  title: "Праздник без суеты начинается здесь",
  lead: "От идеи до последнего элемента декора — подготовим оформление вовремя и именно так, как вы задумали.",
  cta: "Выбрать праздник",
  secondaryCta: "Смотреть работы",
  audience: "Для тех, кто готовит день рождения, юбилей, свадьбу, гендер-пати или другой праздник.",
  benefits: [
    { title: "Оформление под задачу", text: "Подберём отдельную фотозону или соберём несколько зон праздника в одной концепции." },
    { title: "Связь с площадкой", text: "Согласуем с локацией время, доступ, монтаж и важные технические детали оформления." },
    { title: "Подготовка и монтаж", text: "Подготовим материалы, доставим декор и оформим площадку к согласованному времени." },
  ],
  form: {
    title: "Данные для заказа оформления",
    note: "Заполните карточку события — заявка сохранится, и декоратор сможет связаться с вами.",
    submitLabel: "Отправить заявку",
  },
  events,
  packages: catalog.map(({ variants = [], tone, ...item }) => ({
    ...item,
    image: item.gallery?.[0] || variants[0]?.image || photo(item.name, tone),
  })),
};

export const packageDetails = Object.fromEntries(catalog.map((item) => [item.id, {
  heading: item.name,
  description: item.includes,
  gallery: item.gallery?.length ? item.gallery : item.variants.slice(0, 3).map((entry) => entry.image),
  variants: item.variants || [],
  informational: Boolean(item.informational),
  directOrder: Boolean(item.directOrder),
  inclusions: item.inclusions || [],
}]));
