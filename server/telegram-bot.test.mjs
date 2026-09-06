import assert from "node:assert/strict";
import test from "node:test";
import { formatApplicationForTelegram, sendApplicationToTelegram } from "./telegram-bot.mjs";

const application = {
  id: 123,
  first_name: "Иван",
  last_name: "Иванов",
  phone: "+79991234567",
  event_date: "2099-10-20",
  city: "Владивосток",
  venue: "Банкетный зал",
  messenger: "Telegram",
  event_type: "Свадьба",
  order_type: "catalog",
  wishes: "Светлые оттенки",
  cart_items: [{ id: "wedding-photo-panels", name: "Фотозона из панелей", price: "от 20 000 ₽", quantity: 1 }],
};

async function withTelegramEnv({ token, chatId }, callback) {
  const previousToken = process.env.TELEGRAM_BOT_TOKEN;
  const previousChatId = process.env.TELEGRAM_CHAT_ID;
  if (token === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
  else process.env.TELEGRAM_BOT_TOKEN = token;
  if (chatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
  else process.env.TELEGRAM_CHAT_ID = chatId;
  try {
    return await callback();
  } finally {
    if (previousToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
    else process.env.TELEGRAM_BOT_TOKEN = previousToken;
    if (previousChatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
    else process.env.TELEGRAM_CHAT_ID = previousChatId;
  }
}

test("формирует сообщение каталога для Telegram", () => {
  const text = formatApplicationForTelegram(application);
  assert.match(text, /Новая заявка №123/);
  assert.match(text, /Мероприятие: Свадьба/);
  assert.match(text, /Удобный мессенджер клиента: Telegram/);
  assert.match(text, /Фотозона из панелей — от 20 000 ₽/);
});

test("формирует сообщение индивидуального заказа для Telegram", () => {
  const text = formatApplicationForTelegram({ ...application, order_type: "custom", wishes: "Арка у моря", cart_items: [] });
  assert.match(text, /Новая индивидуальная заявка №123/);
  assert.match(text, /Идея клиента:\nАрка у моря/);
});

test("без Telegram token или chat id безопасно пропускает отправку", async () => {
  for (const credentials of [
    { token: undefined, chatId: undefined },
    { token: "test-token", chatId: undefined },
    { token: undefined, chatId: "456" },
  ]) {
    let called = false;
    const result = await withTelegramEnv(credentials, () => sendApplicationToTelegram(application, {
      fetchImpl: async () => { called = true; },
    }));
    assert.deepEqual(result, { sent: false, skipped: true });
    assert.equal(called, false);
  }
});

test("успешно отправляет JSON через официальный Telegram Bot API", async () => {
  let request;
  const result = await withTelegramEnv({ token: "test-token", chatId: "-100456" }, () => sendApplicationToTelegram(application, {
    fetchImpl: async (url, options) => {
      request = { url: String(url), options };
      return { ok: true, status: 200, json: async () => ({ ok: true, result: { message_id: 1 } }) };
    },
  }));

  assert.deepEqual(result, { sent: true, skipped: false });
  assert.equal(request.url, "https://api.telegram.org/bottest-token/sendMessage");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  const body = JSON.parse(request.options.body);
  assert.equal(body.chat_id, "-100456");
  assert.match(body.text, /Новая заявка №123/);
});

test("ошибка Telegram не содержит token в сообщении исключения", async () => {
  const token = "secret-test-token";
  await assert.rejects(
    withTelegramEnv({ token, chatId: "456" }, () => sendApplicationToTelegram(application, {
      fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ ok: false }) }),
    })),
    (error) => {
      assert.equal(error.message.includes(token), false);
      assert.match(error.message, /Telegram Bot API/);
      return true;
    },
  );
});
