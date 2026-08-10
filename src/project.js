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

const events = [
  { id: "birthday", title: "День рождения", text: "Шары, фотозоны и оформление площадки для детских и взрослых праздников.", tone: "rose" },
  { id: "wedding", title: "Свадьба", text: "Фотозоны, церемония, президиум, гостевые столы и оформление под ключ.", tone: "sage" },
  { id: "gender", title: "Гендер-пати", text: "Сюрприз для раскрытия пола малыша, фотозона и оформление всей площадки.", tone: "lilac" },
  { id: "anniversary", title: "Юбилей", text: "Фотозона, декор главного стола и оформление банкетного пространства.", tone: "gold" },
  { id: "graduation", title: "Выпускной", text: "Памятная фотозона, welcome-зона и оформление зала для выпускников.", tone: "blue" },
  { id: "first-birthday", title: "Годовасие", text: "Нежные композиции из шаров и фотозоны для первого дня рождения.", tone: "blue" },
  { id: "maternity", title: "Выписка из роддома", text: "Шары, именные композиции и декор для первой семейной встречи.", tone: "rose" },
  { id: "romantic", title: "Романтический вечер", text: "Свечи, цветы, текстиль и камерное оформление для двоих.", tone: "gold" },
  { id: "proposal", title: "Предложение руки и сердца", text: "Декор главного момента: надпись, цветы, свет и место для фотографий.", tone: "rose" },
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
    id: "wedding-details", eventId: "wedding", name: "Свадебные детали", price: "от 2 500 ₽",
    includes: "Отдельные элементы, которые можно добавить к основному оформлению.", tone: "sage",
    variants: [
      variant("wedding-details-tables", "Композиции на гостевые столы", "от 2 500 ₽", "Небольшие цветочные или декоративные композиции для одного стола.", "sage"),
      variant("wedding-details-couple", "Декор стола молодожёнов", "от 3 000 ₽", "Текстиль, свечи и небольшая композиция без оформления заднего фона.", "gold"),
      variant("wedding-details-bouquet", "Букет невесты", "от 4 500 ₽", "Сезонные цветы, сборка букета и декоративная лента.", "rose"),
      variant("wedding-details-car", "Украшение свадебного автомобиля", "от 6 000 ₽", "Кольца, ленты и декоративные элементы на автомобиль.", "lilac"),
    ],
  },
  {
    id: "wedding-photo", eventId: "wedding", name: "Свадебная фотозона", price: "от 20 000 ₽",
    includes: "Компактная зона для фотографий гостей и молодожёнов.", tone: "sage",
    variants: [
      variant("wedding-photo-panels", "Фотозона из панелей", "от 20 000 ₽", "Фигурные панели, надпись, небольшой цветочный акцент и монтаж.", "sage"),
      variant("wedding-photo-banner", "Фотозона с персональным баннером", "от 20 000 ₽", "Фон с именами или датой, декоративный каркас и свет.", "blue"),
      variant("wedding-photo-flowers", "Фотозона с цветочными акцентами", "от 30 000 ₽", "Панели, цветочные композиции, тумбы и персональная надпись.", "rose"),
    ],
  },
  {
    id: "wedding-photo-plus", eventId: "wedding", name: "Расширенная свадебная фотозона", price: "от 35 000 ₽",
    includes: "Выразительный фон, крупные детали, свет и место для общей фотографии.", tone: "gold",
    variants: [
      variant("wedding-photo-fabric", "Фотозона из ткани", "от 35 000 ₽", "Многослойная драпировка, персональная надпись, свечи или цветы.", "rose"),
      variant("wedding-photo-paillettes", "Фотозона с пайетками", "от 35 000 ₽", "Стена из пайеток, надпись или неон, свет и декоративные акценты.", "gold"),
      variant("wedding-photo-sculptural", "Фотозона из фигурных панелей", "от 35 000 ₽", "Несколько панелей разной высоты, подиумы и цветочные композиции.", "sage"),
      variant("wedding-photo-flower-wall", "Цветочная стена", "от 40 000 ₽", "Объёмный цветочный фон, надпись и направленный свет.", "lilac"),
    ],
  },
  {
    id: "wedding-ceremony", eventId: "wedding", name: "Выездная регистрация", price: "от 25 000 ₽",
    includes: "Церемониальная зона с аркой или фоном, дорожкой и монтажом.", tone: "rose",
    variants: [
      variant("wedding-ceremony-drape", "Арка с тканевой драпировкой", "от 25 000 ₽", "Каркас, многослойная ткань, небольшие цветочные акценты и дорожка.", "rose"),
      variant("wedding-ceremony-floral", "Цветочная арка", "от 35 000 ₽", "Арка с объёмной флористикой, дорожка и оформление зоны церемонии.", "sage"),
      variant("wedding-ceremony-panels", "Церемония с фигурными панелями", "от 40 000 ₽", "Сценический фон из панелей, цветы, свечи и проход к церемонии.", "gold"),
    ],
  },
  {
    id: "wedding-presidium", eventId: "wedding", name: "Президиум молодожёнов", price: "от 10 000 ₽",
    includes: "Стол молодожёнов и декоративный фон за ним.", tone: "gold",
    variants: [
      variant("wedding-presidium-light", "Лаконичный президиум", "от 10 000 ₽", "Текстиль, свечи, небольшая композиция и аккуратный задний фон.", "sage"),
      variant("wedding-presidium-fabric", "Президиум с драпировкой", "от 15 000 ₽", "Тканевый фон, свет, текстиль и цветочные акценты.", "rose"),
      variant("wedding-presidium-floral", "Президиум с цветами", "от 25 000 ₽", "Объёмный фон, крупная флористика, свечи и оформление стола.", "gold"),
    ],
  },
  {
    id: "wedding-full", eventId: "wedding", name: "Оформление свадебной площадки", price: "от 30 000 ₽",
    includes: "Несколько свадебных зон в единой палитре и стилистике.", tone: "sage",
    variants: [
      variant("wedding-full-hall", "Декор помещения", "от 30 000 ₽", "Президиум, текстиль, свечи и основные декоративные акценты.", "sage"),
      variant("wedding-full-main", "Главные зоны свадьбы", "от 60 000 ₽", "Президиум, фотозона, welcome-зона и часть гостевых столов.", "rose"),
      variant("wedding-full-all", "Свадьба под ключ", "от 90 000 ₽", "Церемония, фотозона, президиум, welcome-зона и оформление столов гостей.", "gold"),
    ],
  },
  {
    id: "gender-reveal", eventId: "gender", name: "Сюрприз для гендер-пати", price: "от 2 500 ₽",
    includes: "Отдельный безопасный способ сообщить пол малыша.", tone: "lilac",
    variants: [
      variant("gender-reveal-ball", "Гендерный шар-сюрприз", "от 2 500 ₽", "Большой шар с конфетти или маленькими шарами нужного цвета.", "blue"),
      variant("gender-reveal-gold", "Золотой шар с надписью", "от 3 600 ₽", "Шар-сюрприз, индивидуальная надпись и декоративные кисточки.", "gold"),
      variant("gender-reveal-box", "Гендер-бокс", "от 5 600 ₽", "Коробка с сюрпризом внутри без необходимости лопать шар.", "rose"),
    ],
  },
  {
    id: "gender-photo", eventId: "gender", name: "Фотозона для гендер-пати", price: "от 20 000 ₽",
    includes: "Фон, шары и зона раскрытия пола малыша.", tone: "lilac",
    variants: [
      variant("gender-photo-balloons", "Фотозона с шарами", "от 20 000 ₽", "Фигурные панели, гирлянда из шаров, надпись и шар-сюрприз.", "blue"),
      variant("gender-photo-fabric", "Фотозона с тканью", "от 25 000 ₽", "Мягкая драпировка, нейтральный фон, цветовые акценты и свет.", "lilac"),
      variant("gender-photo-full", "Фотозона и стол", "от 32 000 ₽", "Фотозона, reveal-элемент и оформление главного стола.", "rose"),
    ],
  },
  {
    id: "anniversary-photo", eventId: "anniversary", name: "Фотозона на юбилей", price: "от 20 000 ₽",
    includes: "Фон, дата или имя, декоративные акценты и монтаж.", tone: "gold",
    variants: [
      variant("anniversary-photo-panels", "Фотозона с датой", "от 20 000 ₽", "Панели, крупная дата, надпись и небольшой декор.", "gold"),
      variant("anniversary-photo-fabric", "Фотозона с тканью", "от 25 000 ₽", "Драпировка, свет, имя или дата и цветочные акценты.", "rose"),
      variant("anniversary-photo-sequin", "Фотозона с пайетками", "от 30 000 ₽", "Пайетки, неоновая надпись, свет и тумбы.", "lilac"),
    ],
  },
  {
    id: "anniversary-banquet", eventId: "anniversary", name: "Оформление юбилея", price: "от 32 000 ₽",
    includes: "Фотозона и декор основных зон банкета.", tone: "gold",
    variants: [
      variant("anniversary-banquet-family", "Семейный вечер", "от 32 000 ₽", "Фотозона, главный стол, свечи и небольшие композиции.", "gold"),
      variant("anniversary-banquet-hall", "Праздничный банкет", "от 50 000 ₽", "Фотозона, welcome-зона и декор гостевых столов.", "rose"),
      variant("anniversary-banquet-full", "Юбилей под ключ", "от 80 000 ₽", "Единая концепция и оформление всех основных зон площадки.", "sage"),
    ],
  },
  {
    id: "graduation-photo", eventId: "graduation", name: "Фотозона на выпускной", price: "от 20 000 ₽",
    includes: "Памятный фон с годом выпуска, названием класса или группы.", tone: "blue",
    variants: [
      variant("graduation-photo-school", "Школьный выпускной", "от 20 000 ₽", "Панели, год выпуска, название школы и монтаж.", "blue"),
      variant("graduation-photo-sequin", "Фотозона с пайетками", "от 25 000 ₽", "Пайетки, крупные цифры, неон и свет.", "gold"),
      variant("graduation-photo-fabric", "Фотозона с драпировкой", "от 30 000 ₽", "Тканевый фон, год выпуска и декоративные композиции.", "lilac"),
    ],
  },
  {
    id: "graduation-hall", eventId: "graduation", name: "Оформление выпускного", price: "от 32 000 ₽",
    includes: "Фотозона и оформление основных зон зала.", tone: "blue",
    variants: [
      variant("graduation-hall-start", "Выпускной Start", "от 32 000 ₽", "Фотозона, входная зона и декоративные цифры.", "blue"),
      variant("graduation-hall-plus", "Выпускной Plus", "от 50 000 ₽", "Фотозона, сцена или главный стол и декор зала.", "lilac"),
      variant("graduation-hall-full", "Выпускной под ключ", "от 75 000 ₽", "Общая концепция, фотозона, сцена, вход и гостевые столы.", "gold"),
    ],
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
    id: "maternity-balloons", eventId: "maternity", name: "Шары на выписку", price: "от 3 985 ₽",
    includes: "Готовые композиции для встречи малыша дома или у роддома.", tone: "rose",
    variants: [
      variant("maternity-son", "Фонтан «Ура, сын!»", "от 3 985 ₽", "Фольгированные и латексные шары со звездой и фигурой малыша.", "blue"),
      variant("maternity-box", "Коробка с шарами", "от 4 100 ₽", "Большая коробка, шары нужной палитры и надпись.", "rose"),
      variant("maternity-name", "Именная композиция", "от 7 450 ₽", "Шар с именем малыша, звёзды и несколько связок шаров.", "gold"),
    ],
  },
  {
    id: "maternity-welcome", eventId: "maternity", name: "Оформление встречи малыша", price: "от 10 000 ₽",
    includes: "Небольшая фотозона и декор места встречи.", tone: "rose",
    variants: [
      variant("maternity-welcome-home", "Добро пожаловать домой", "от 10 000 ₽", "Гирлянда из шаров, имя малыша и зона для семейных фотографий.", "rose"),
      variant("maternity-welcome-photo", "Первая фотозона", "от 15 000 ₽", "Фон, именная надпись, шары и декоративные фигуры.", "blue"),
      variant("maternity-welcome-full", "Встреча малыша Plus", "от 20 000 ₽", "Фотозона, входная композиция и декор комнаты.", "gold"),
    ],
  },
  {
    id: "romantic-table", eventId: "romantic", name: "Романтическое оформление", price: "от 5 560 ₽",
    includes: "Камерный декор для дома, номера, террасы или отдельного столика.", tone: "gold",
    variants: [
      variant("romantic-table-candles", "Вечер при свечах", "от 5 560 ₽", "Свечи, лепестки, небольшой текстиль и оформление стола.", "gold"),
      variant("romantic-table-flowers", "Стол с цветами", "от 10 000 ₽", "Цветочная композиция, свечи, текстиль и сервировочные детали.", "rose"),
      variant("romantic-table-terrace", "Романтическая терраса", "от 20 000 ₽", "Свет, цветы, текстиль и оформление отдельной зоны.", "sage"),
    ],
  },
  {
    id: "romantic-photo", eventId: "romantic", name: "Фотозона для двоих", price: "от 20 000 ₽",
    includes: "Декоративный фон для вечера и памятных фотографий.", tone: "rose",
    variants: [
      variant("romantic-photo-neon", "Фотозона с неоном", "от 20 000 ₽", "Фон, световая надпись, свечи и цветочные акценты.", "rose"),
      variant("romantic-photo-fabric", "Фотозона с тканью", "от 25 000 ₽", "Драпировка, мягкий свет, свечи и цветы.", "gold"),
      variant("romantic-photo-flowers", "Цветочная фотозона", "от 35 000 ₽", "Объёмный цветочный фон, свет и оформление пола.", "lilac"),
    ],
  },
  {
    id: "proposal-decor", eventId: "proposal", name: "Оформление предложения", price: "от 5 560 ₽",
    includes: "Надпись, свечи или цветы для главного вопроса.", tone: "rose",
    variants: [
      variant("proposal-decor-candles", "Дорожка из свечей", "от 5 560 ₽", "Безопасные свечи, лепестки и небольшая надпись.", "gold"),
      variant("proposal-decor-letters", "Светящиеся буквы", "от 15 000 ₽", "Крупная надпись, свечи, цветы и подготовка места.", "rose"),
      variant("proposal-decor-view", "Предложение с фотозоной", "от 20 000 ₽", "Декоративный фон, надпись, свет и цветочные акценты.", "lilac"),
    ],
  },
  {
    id: "proposal-full", eventId: "proposal", name: "Особенный момент под ключ", price: "от 30 000 ₽",
    includes: "Полное оформление выбранной площадки для предложения.", tone: "rose",
    variants: [
      variant("proposal-full-room", "Романтический зал", "от 30 000 ₽", "Фотозона, свечи, цветы и оформление стола.", "rose"),
      variant("proposal-full-outdoor", "Предложение на открытом воздухе", "от 35 000 ₽", "Арка или фон, дорожка, свет и цветочные композиции.", "sage"),
      variant("proposal-full-premium", "Предложение Premium", "от 50 000 ₽", "Авторская зона, крупная флористика, свет и полный монтаж.", "gold"),
    ],
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
  events,
  packages: catalog.map(({ variants, tone, ...item }) => ({ ...item, image: variants[0]?.image || photo(item.name, tone) })),
};

export const packageDetails = Object.fromEntries(catalog.map((item) => [item.id, {
  heading: item.name,
  description: item.includes,
  gallery: item.variants.slice(0, 3).map((entry) => entry.image),
  variants: item.variants,
}]));
