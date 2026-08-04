export const project = {
  name: "Арт-деко",
  eyebrow: "Оформление праздников",
  title: "Создаём праздник, который хочется запомнить",
  lead: "Выберите свой повод, посмотрите реальные варианты оформления и цены — менеджер поможет собрать декор для вашего события.",
  cta: "Выбрать праздник",
  secondaryCta: "Смотреть работы",
  audience: "Для тех, кто готовит день рождения, юбилей, свадьбу, гендер-пати или другой праздник.",
  benefits: [
    { title: "Варианты для любого события", text: "Подберите оформление для дня рождения, свадьбы, гендер-пати и других праздников." },
    { title: "Цена и состав услуги", text: "Сразу понятно, что входит в оформление и какой бюджет понадобится." },
    { title: "Заявка без лишнего", text: "Оставьте контакты — менеджер свяжется с вами и поможет уточнить детали." },
  ],
  form: {
    title: "Оставьте заявку на оформление",
    note: "Расскажите о празднике, а менеджер свяжется с вами для уточнения деталей.",
    submitLabel: "Отправить заявку",
    successLocal: "Заявка сохранена на этом устройстве. Менеджер свяжется с вами для уточнения деталей.",
    successRemote: "Заявка отправлена. Менеджер скоро свяжется с вами.",
  },
  events: [
    {
      id: "birthday",
      title: "День рождения",
      text: "Фотозоны, воздушные шары и яркие детали для детских и взрослых праздников.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "wedding",
      title: "Свадьба",
      text: "Нежные арки, оформление зала и цветочные композиции для церемонии и банкета.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "gender",
      title: "Гендер-пати",
      text: "Воздушные шары, фотозона и сюрприз для важного момента всей семьи.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "anniversary",
      title: "Юбилей",
      text: "Статусное оформление зала, welcome-зоны и праздничного стола для важной даты.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "graduation",
      title: "Выпускной",
      text: "Фотозоны и оформление зала для школьного или студенческого выпускного.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "first-birthday",
      title: "Годовасие",
      text: "Нежное оформление первого дня рождения с фотозоной и семейными деталями.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "maternity",
      title: "Выписка из роддома",
      text: "Тёплая встреча малыша: шары, надписи и декор для первых семейных фотографий.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "romantic",
      title: "Романтический вечер",
      text: "Камерное оформление с цветами, свечами и светом для особенного вечера.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "proposal",
      title: "Предложение руки и сердца",
      text: "Декорации для важного вопроса: цветы, свет, надписи и место для фотографий.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "corporate",
      title: "Событие для компании",
      text: "Оформление в цветах бренда, фотозоны, welcome-зоны и декор площадки.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  packages: [
    {
      id: "birthday-mini",
      eventId: "birthday",
      name: "Яркий акцент",
      price: "от 8 000 ₽",
      includes: "Гирлянда из шаров, 2 фонтана шаров, надпись и доставка по городу.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "birthday-photo",
      eventId: "birthday",
      name: "Праздничная фотозона",
      price: "от 15 000 ₽",
      includes: "Фотозона, композиция из шаров, индивидуальная надпись и монтаж.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "birthday-full",
      eventId: "birthday",
      name: "Праздник под ключ",
      price: "от 25 000 ₽",
      includes: "Оформление зала, фотозона, шары, сервировка и монтаж декора.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "wedding-ceremony",
      eventId: "wedding",
      name: "Выездная регистрация",
      price: "от 35 000 ₽",
      includes: "Свадебная арка, дорожка к церемонии и цветочные композиции.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "wedding-photo",
      eventId: "wedding",
      name: "Свадебная фотозона",
      price: "от 15 000 ₽",
      includes: "Фотозона для welcome-зоны, цветы, драпировка, надпись и монтаж.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "wedding-banquet",
      eventId: "wedding",
      name: "Банкетный зал",
      price: "от 55 000 ₽",
      includes: "Президиум, композиции на гостевые столы, текстиль и свечи.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "wedding-full",
      eventId: "wedding",
      name: "Свадьба под ключ",
      price: "от 90 000 ₽",
      includes: "Полное оформление церемонии, банкета и фотозоны с монтажом.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "gender-mini",
      eventId: "gender",
      name: "Нежный сюрприз",
      price: "от 12 000 ₽",
      includes: "Гирлянда из шаров, большой шар-сюрприз и оформление зоны.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "gender-photo",
      eventId: "gender",
      name: "Фотозона для reveal",
      price: "от 20 000 ₽",
      includes: "Фотозона, шар-сюрприз, композиции из шаров и монтаж.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "gender-full",
      eventId: "gender",
      name: "Особенный момент",
      price: "от 30 000 ₽",
      includes: "Полное оформление, декор стола, фотозона и сюрприз для гостей.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "anniversary-photo",
      eventId: "anniversary",
      name: "Юбилейная фотозона",
      price: "от 20 000 ₽",
      includes: "Фон, персональная дата, объёмный декор, тумбы и монтаж.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "anniversary-banquet",
      eventId: "anniversary",
      name: "Оформление юбилея",
      price: "от 50 000 ₽",
      includes: "Фотозона, декор стола виновника торжества и композиции на гостевые столы.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "graduation-photo", eventId: "graduation", name: "Выпускной с фотозоной", price: "от 25 000 ₽",
      includes: "Фотозона, год выпуска, декор в цветах класса и монтаж.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "first-birthday-photo", eventId: "first-birthday", name: "Первый день рождения", price: "от 18 000 ₽",
      includes: "Фотозона, цифра, имя ребёнка, шары и монтаж.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "maternity-welcome", eventId: "maternity", name: "Встреча малыша", price: "от 10 000 ₽",
      includes: "Композиции из шаров, имя малыша, декор встречи и доставка.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "romantic-evening", eventId: "romantic", name: "Романтический вечер", price: "от 20 000 ₽",
      includes: "Цветы, свечи, текстиль, свет и оформление выбранного места.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "proposal-decor", eventId: "proposal", name: "Особенное предложение", price: "от 30 000 ₽",
      includes: "Фотозона, цветы, свечи, надпись и монтаж.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "corporate-zone", eventId: "corporate", name: "Брендированная зона", price: "от 35 000 ₽",
      includes: "Фотозона, цвета и логотип компании, welcome-детали и монтаж.",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

const gallery = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
];

export const packageDetails = {
  "birthday-mini": {
    heading: "Акцентный декор для дня рождения",
    description: "Подходит для дома, кафе или небольшой площадки. Цвета и надпись подбираем под возраст, тему и характер праздника.",
    gallery,
    variants: [
      { id: "birthday-mini-base", name: "Лёгкий акцент", price: "от 8 000 ₽", includes: "Гирлянда до 3 метров, 2 фонтана шаров, тематическая надпись." },
      { id: "birthday-mini-plus", name: "Яркая зона", price: "от 12 000 ₽", includes: "Гирлянда до 5 метров, цифра, шары с гелием, декор стола для торта." },
    ],
  },
  "birthday-photo": {
    heading: "Фотозона на день рождения",
    description: "Главная точка праздника для фотографий гостей. Можно собрать в любимых цветах, добавить имя, цифру, цветы или тематические детали.",
    gallery,
    variants: [
      { id: "birthday-photo-base", name: "Фотозона Start", price: "от 15 000 ₽", includes: "Фон, гирлянда из шаров, надпись и один декоративный элемент." },
      { id: "birthday-photo-plus", name: "Фотозона Plus", price: "от 25 000 ₽", includes: "Объёмная фотозона, шары разных размеров, цифра, 2 тумбы и декор стола." },
      { id: "birthday-photo-premium", name: "Фотозона Premium", price: "от 40 000 ₽", includes: "Авторский фон, объёмная композиция, цветы или неон, тумбы и монтаж." },
    ],
  },
  "birthday-full": {
    heading: "День рождения под ключ",
    description: "Оформляем главную зону и столы гостей в одной стилистике, чтобы площадка выглядела цельно и была готова к фотографиям.",
    gallery,
    variants: [
      { id: "birthday-full-base", name: "Праздник для своих", price: "от 35 000 ₽", includes: "Фотозона, декор стола для торта, композиции из шаров и монтаж." },
      { id: "birthday-full-plus", name: "Большой праздник", price: "от 50 000 ₽", includes: "Фотозона, welcome-зона, декор стола для торта и композиции на гостевые столы." },
      { id: "birthday-full-premium", name: "Полное оформление", price: "от 75 000 ₽", includes: "Концепция, все зоны площадки, текстиль, цветы, шары, монтаж и демонтаж." },
    ],
  },
  "wedding-photo": {
    heading: "Свадебная фотозона",
    description: "Welcome-зона, где гости делают первые фотографии. Стилизуем под палитру свадьбы и добавляем имена пары или дату.",
    gallery,
    variants: [
      { id: "wedding-photo-base", name: "Фотозона Start", price: "от 15 000 ₽", includes: "Фон, драпировка, персональная надпись и монтаж." },
      { id: "wedding-photo-plus", name: "Фотозона с цветами", price: "от 30 000 ₽", includes: "Фон, драпировка, цветочные композиции, неон или объёмные буквы." },
      { id: "wedding-photo-premium", name: "Welcome-зона Premium", price: "от 50 000 ₽", includes: "Фотозона, рассадка, welcome-табличка, цветы и декор входной группы." },
    ],
  },
  "wedding-ceremony": {
    heading: "Выездная регистрация",
    description: "Создаём красивую точку для главного момента: арка, дорожка, стулья и флористика в палитре вашей свадьбы.",
    gallery,
    variants: [
      { id: "wedding-ceremony-base", name: "Церемония Start", price: "от 35 000 ₽", includes: "Арка, базовая флористика, дорожка к церемонии и монтаж." },
      { id: "wedding-ceremony-plus", name: "Церемония Plus", price: "от 60 000 ₽", includes: "Авторская арка, цветочные композиции, стулья с декором и welcome-зона." },
      { id: "wedding-ceremony-premium", name: "Церемония Premium", price: "от 90 000 ₽", includes: "Концепция церемонии, крупная флористика, дорожка, стулья, свет и полный монтаж." },
    ],
  },
  "wedding-banquet": {
    heading: "Оформление банкетного зала",
    description: "Собираем пространство вокруг стола молодожёнов и гостевых столов: цветы, текстиль, свечи и детали в общей концепции.",
    gallery,
    variants: [
      { id: "wedding-banquet-base", name: "Банкет Start", price: "от 55 000 ₽", includes: "Президиум молодожёнов, композиция на главный стол и свечи." },
      { id: "wedding-banquet-plus", name: "Банкет Plus", price: "от 85 000 ₽", includes: "Президиум, композиции на гостевые столы, текстиль, свечи и план рассадки." },
      { id: "wedding-banquet-premium", name: "Банкет Premium", price: "от 130 000 ₽", includes: "Полное оформление зала, крупная флористика, декор потолка или света и все столы." },
    ],
  },
  "wedding-full": {
    heading: "Свадьба под ключ",
    description: "Единая визуальная концепция от welcome-зоны до банкета: вам не нужно собирать отдельные услуги самостоятельно.",
    gallery,
    variants: [
      { id: "wedding-full-base", name: "Свадьба Classic", price: "от 120 000 ₽", includes: "Фотозона, церемония, президиум и декор гостевых столов." },
      { id: "wedding-full-plus", name: "Свадьба Signature", price: "от 180 000 ₽", includes: "Все основные зоны, флористика, текстиль, полиграфия и монтаж." },
      { id: "wedding-full-premium", name: "Свадьба Art-deco", price: "от 250 000 ₽", includes: "Авторская концепция, оформление всех зон, сложные конструкции, свет и полный продакшн." },
    ],
  },
  "gender-mini": {
    heading: "Декор для гендер-пати",
    description: "Нежная композиция для дома или небольшой площадки с главным моментом раскрытия пола малыша.",
    gallery,
    variants: [
      { id: "gender-mini-base", name: "Сюрприз Start", price: "от 12 000 ₽", includes: "Гирлянда из шаров, большой шар-сюрприз и тематическая надпись." },
      { id: "gender-mini-plus", name: "Сюрприз Plus", price: "от 18 000 ₽", includes: "Композиция из шаров, шар-сюрприз, тумбы и декор стола." },
    ],
  },
  "gender-photo": {
    heading: "Фотозона для гендер-пати",
    description: "Отдельное место для ожидания и фотографий до главного момента. Добавим нейтральные, розовые и голубые акценты по вашему желанию.",
    gallery,
    variants: [
      { id: "gender-photo-base", name: "Фотозона Start", price: "от 20 000 ₽", includes: "Фон, шары, надпись и шар-сюрприз." },
      { id: "gender-photo-plus", name: "Фотозона Plus", price: "от 32 000 ₽", includes: "Объёмный фон, композиции из шаров, тумбы и тематический декор." },
      { id: "gender-photo-premium", name: "Фотозона Premium", price: "от 48 000 ₽", includes: "Авторская фотозона, декор стола, welcome-детали и монтаж." },
    ],
  },
  "gender-full": {
    heading: "Гендер-пати под ключ",
    description: "Оформляем все главные точки праздника: вход, фотозону, стол и сам момент reveal в одном стиле.",
    gallery,
    variants: [
      { id: "gender-full-base", name: "Особенный момент", price: "от 30 000 ₽", includes: "Фотозона, шар-сюрприз и декор главного стола." },
      { id: "gender-full-plus", name: "Праздник Plus", price: "от 50 000 ₽", includes: "Входная зона, фотозона, шар или коробка-сюрприз, декор стола." },
      { id: "gender-full-premium", name: "Праздник Premium", price: "от 70 000 ₽", includes: "Полное оформление площадки, сценарная точка reveal, свет и монтаж." },
    ],
  },
  "anniversary-photo": {
    heading: "Фотозона на юбилей",
    description: "Оформление для фотографий с семьёй и гостями: дата, имя, цветы, шары или элегантная драпировка в выбранной палитре.",
    gallery,
    variants: [
      { id: "anniversary-photo-base", name: "Фотозона Start", price: "от 20 000 ₽", includes: "Фон, дата или надпись, композиция из шаров и монтаж." },
      { id: "anniversary-photo-plus", name: "Фотозона Plus", price: "от 35 000 ₽", includes: "Объёмная фотозона, тумбы, цветочные детали, дата и декор стола." },
      { id: "anniversary-photo-premium", name: "Фотозона Premium", price: "от 55 000 ₽", includes: "Авторская композиция, цветы, световые элементы и оформление welcome-зоны." },
    ],
  },
  "anniversary-banquet": {
    heading: "Юбилей под ключ",
    description: "Собираем общий стиль праздника: фотозону, главный стол и декор для гостей — от тёплого семейного вечера до большого банкета.",
    gallery,
    variants: [
      { id: "anniversary-banquet-base", name: "Тёплый вечер", price: "от 50 000 ₽", includes: "Фотозона, декор главного стола, свечи и композиции для зала." },
      { id: "anniversary-banquet-plus", name: "Праздничный банкет", price: "от 80 000 ₽", includes: "Фотозона, welcome-зона, главный стол и композиции на гостевых столах." },
      { id: "anniversary-banquet-premium", name: "Юбилей Premium", price: "от 120 000 ₽", includes: "Авторская концепция и полное оформление площадки с монтажом и демонтажом." },
    ],
  },
};

Object.assign(packageDetails, {
  "graduation-photo": {
    heading: "Оформление выпускного", description: "Фотозона и памятные детали для выпускников, учителей и родителей.", gallery,
    variants: [
      { id: "graduation-photo-start", name: "Выпускной Start", price: "от 25 000 ₽", includes: "Фотозона, год выпуска, надпись и монтаж." },
      { id: "graduation-photo-plus", name: "Выпускной Plus", price: "от 40 000 ₽", includes: "Объёмная фотозона, декор входа, свет и монтаж." },
    ],
  },
  "first-birthday-photo": {
    heading: "Годовасие", description: "Семейная фотозона для первого дня рождения малыша.", gallery,
    variants: [
      { id: "first-birthday-start", name: "Первый праздник", price: "от 18 000 ₽", includes: "Фон, цифра, имя и композиция из шаров." },
      { id: "first-birthday-plus", name: "Годовасие Plus", price: "от 30 000 ₽", includes: "Объёмный фон, тумбы, декор стола и монтаж." },
    ],
  },
  "maternity-welcome": {
    heading: "Выписка из роддома", description: "Декор для встречи малыша дома или у роддома.", gallery,
    variants: [
      { id: "maternity-start", name: "Добро пожаловать", price: "от 10 000 ₽", includes: "Шары, имя малыша и композиция для встречи." },
      { id: "maternity-plus", name: "Первая встреча Plus", price: "от 18 000 ₽", includes: "Фотозона, шары, имя и декор дома." },
    ],
  },
  "romantic-evening": {
    heading: "Романтический вечер", description: "Камерная атмосфера с цветами, свечами и мягким светом.", gallery,
    variants: [
      { id: "romantic-start", name: "Вечер для двоих", price: "от 20 000 ₽", includes: "Свечи, цветы, текстиль и сервировка." },
      { id: "romantic-plus", name: "Романтический вечер Plus", price: "от 35 000 ₽", includes: "Полное оформление зоны, свет, цветы и монтаж." },
    ],
  },
  "proposal-decor": {
    heading: "Предложение руки и сердца", description: "Оформление момента, который хочется запомнить навсегда.", gallery,
    variants: [
      { id: "proposal-start", name: "Главный вопрос", price: "от 30 000 ₽", includes: "Надпись, свечи, цветы и место для фотографий." },
      { id: "proposal-plus", name: "Особенный момент Plus", price: "от 50 000 ₽", includes: "Авторская зона, свет, цветы и полный монтаж." },
    ],
  },
  "corporate-zone": {
    heading: "Событие для компании", description: "Брендированное оформление для гостей, команды и партнёров.", gallery,
    variants: [
      { id: "corporate-start", name: "Бренд-зона Start", price: "от 35 000 ₽", includes: "Фотозона, логотип, цвета бренда и монтаж." },
      { id: "corporate-plus", name: "Корпоративное событие Plus", price: "от 65 000 ₽", includes: "Welcome-зона, фотозона, свет и декор площадки." },
    ],
  },
});
