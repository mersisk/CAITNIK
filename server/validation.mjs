import { getCatalogItem } from "./catalog.mjs";

const ORDER_TYPES = new Set(["catalog", "custom"]);
const MESSENGERS = new Set(["Telegram", "WhatsApp"]);

function todayInVladivostok() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Vladivostok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function readString(source, field, { required = true, max }, errors) {
  const value = source?.[field];
  if (value === undefined || value === null || value === "") {
    if (required) errors[field] = "Поле обязательно.";
    return "";
  }
  if (typeof value !== "string") {
    errors[field] = "Ожидается строка.";
    return "";
  }
  const normalized = value.trim();
  if (required && !normalized) errors[field] = "Поле обязательно.";
  if (normalized.length > max) errors[field] = `Не больше ${max} символов.`;
  return normalized;
}

function normalizePhone(value, errors) {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Укажите телефон, содержащий от 10 до 15 цифр.";
    return "";
  }
  return `+${digits}`;
}

function validCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeCartItems(value, errors) {
  if (!Array.isArray(value)) {
    errors.cart_items = "Ожидается массив позиций.";
    return { items: [], eventTypes: [] };
  }
  if (value.length > 25) {
    errors.cart_items = "В одной заявке может быть не больше 25 позиций.";
    return { items: [], eventTypes: [] };
  }

  const items = [];
  const eventTypes = [];
  const seen = new Set();
  for (const [index, rawItem] of value.entries()) {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
      errors.cart_items = `Позиция ${index + 1} имеет неверный формат.`;
      continue;
    }
    if (typeof rawItem.id !== "string" || !rawItem.id.trim() || rawItem.id.length > 120) {
      errors.cart_items = `У позиции ${index + 1} неверный идентификатор.`;
      continue;
    }
    if (rawItem.name !== undefined && (typeof rawItem.name !== "string" || rawItem.name.length > 200)) {
      errors.cart_items = `У позиции ${index + 1} неверное название.`;
      continue;
    }
    if (rawItem.price !== undefined && (typeof rawItem.price !== "string" || rawItem.price.length > 60)) {
      errors.cart_items = `У позиции ${index + 1} неверная цена.`;
      continue;
    }
    const quantity = rawItem.quantity ?? 1;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      errors.cart_items = `У позиции ${index + 1} неверное количество.`;
      continue;
    }
    const canonical = getCatalogItem(rawItem.id.trim());
    if (!canonical) {
      errors.cart_items = `Позиция ${index + 1} отсутствует в каталоге.`;
      continue;
    }
    if (seen.has(canonical.id)) {
      errors.cart_items = `Позиция ${index + 1} повторяется.`;
      continue;
    }
    seen.add(canonical.id);
    items.push({ id: canonical.id, name: canonical.name, price: canonical.price, quantity });
    if (canonical.eventType && !eventTypes.includes(canonical.eventType)) eventTypes.push(canonical.eventType);
  }
  return { items, eventTypes };
}

export function validateApplication(input, { today = todayInVladivostok() } = {}) {
  const errors = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: { body: "Ожидается JSON-объект." } };
  }

  const firstName = readString(input, "first_name", { max: 80 }, errors);
  const lastName = readString(input, "last_name", { max: 80 }, errors);
  const rawPhone = readString(input, "phone", { max: 40 }, errors);
  const eventDate = readString(input, "event_date", { max: 10 }, errors);
  const city = readString(input, "city", { max: 100 }, errors);
  const venue = readString(input, "venue", { max: 200 }, errors);
  const messenger = readString(input, "messenger", { max: 40 }, errors);
  const incomingEventType = readString(input, "event_type", { max: 160 }, errors);
  const orderType = readString(input, "order_type", { max: 20 }, errors);
  const wishes = readString(input, "wishes", { required: false, max: 2000 }, errors);
  const phone = normalizePhone(rawPhone, errors);

  if (eventDate && !validCalendarDate(eventDate)) errors.event_date = "Используйте формат YYYY-MM-DD.";
  else if (eventDate && eventDate < today) errors.event_date = "Дата события не может быть в прошлом.";
  if (messenger && !MESSENGERS.has(messenger)) errors.messenger = "Выберите доступный мессенджер.";
  if (orderType && !ORDER_TYPES.has(orderType)) errors.order_type = "Допустимы только catalog или custom.";

  const { items: cartItems, eventTypes } = normalizeCartItems(input.cart_items, errors);
  let eventType = incomingEventType;
  if (orderType === "catalog") {
    if (!cartItems.length) errors.cart_items = "Добавьте хотя бы одну позицию из каталога.";
    const canonicalEventType = eventTypes.join(", ");
    if (canonicalEventType && incomingEventType !== canonicalEventType) {
      errors.event_type = "Тип события не соответствует выбранным позициям.";
    }
    eventType = canonicalEventType || incomingEventType;
  }
  if (orderType === "custom") {
    if (cartItems.length || (Array.isArray(input.cart_items) && input.cart_items.length)) {
      errors.cart_items = "Для индивидуального оформления корзина должна быть пустой.";
    }
    if (!wishes) errors.wishes = "Опишите идею индивидуального оформления.";
    if (incomingEventType !== "Индивидуальное оформление") {
      errors.event_type = "Для индивидуальной заявки укажите «Индивидуальное оформление».";
    }
    eventType = "Индивидуальное оформление";
  }

  if (Object.keys(errors).length) return { valid: false, errors };
  return {
    valid: true,
    value: {
      first_name: firstName,
      last_name: lastName,
      phone,
      event_date: eventDate,
      city,
      venue,
      messenger,
      event_type: eventType,
      order_type: orderType,
      wishes,
      cart_items: cartItems,
    },
  };
}
