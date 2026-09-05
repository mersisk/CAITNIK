import assert from "node:assert/strict";
import test from "node:test";
import { formatApplicationForMax, sendApplicationToMax } from "./max-bot.mjs";

const application = {
  id: 123,
  first_name: "Иван",
  last_name: "Иванов",
  phone: "+79991234567",
  event_date: "2099-10-20",
  city: "Владивосток",
  venue: "Банкетный зал",
  messenger: "MAX",
  event_type: "Свадьба",
  order_type: "catalog",
  wishes: "Светлые оттенки",
  cart_items: [{ id: "wedding-photo-panels", name: "Фотозона из панелей", price: "от 20 000 ₽", quantity: 1 }],
};

test("формирует сообщение каталога", () => {
  const text = formatApplicationForMax(application);
  assert.match(text, /Новая заявка №123/);
  assert.match(text, /Мероприятие: Свадьба/);
  assert.match(text, /Фотозона из панелей — от 20 000 ₽/);
});

test("формирует сообщение индивидуального заказа", () => {
  const text = formatApplicationForMax({ ...application, order_type: "custom", wishes: "Арка у моря", cart_items: [] });
  assert.match(text, /Новая индивидуальная заявка №123/);
  assert.match(text, /Идея клиента:\nАрка у моря/);
});

test("не обращается к MAX без токена и chat id", async () => {
  let called = false;
  const result = await sendApplicationToMax(application, { token: "", chatId: "", fetchImpl: async () => { called = true; } });
  assert.deepEqual(result, { sent: false, skipped: true });
  assert.equal(called, false);
});

test("передаёт токен только в Authorization и chat id в query", async () => {
  let request;
  await sendApplicationToMax(application, {
    token: "test-token",
    chatId: "456",
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return { ok: true, status: 200 };
    },
  });
  assert.equal(request.url, "https://platform-api2.max.ru/messages?chat_id=456");
  assert.equal(request.options.headers.Authorization, "test-token");
  assert.equal(request.url.includes("test-token"), false);
});
