import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { formatApplicationForTelegram, safeTelegramErrorDetails, sendApplicationToTelegram } from "./telegram-bot.mjs";

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

const envNames = {
  token: "TELEGRAM_BOT_TOKEN",
  chatId: "TELEGRAM_CHAT_ID",
  proxyHost: "TELEGRAM_PROXY_HOST",
  proxyPort: "TELEGRAM_PROXY_PORT",
  proxyUsername: "TELEGRAM_PROXY_USERNAME",
  proxyPassword: "TELEGRAM_PROXY_PASSWORD",
};

async function withTelegramEnv(values, callback) {
  const previous = Object.fromEntries(Object.values(envNames).map((name) => [name, process.env[name]]));
  for (const [key, name] of Object.entries(envNames)) {
    const value = values[key];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  try {
    return await callback();
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

function mockRequest({ status = 200, responseBody = { ok: true } } = {}, capture = {}) {
  return (url, options, callback) => {
    const request = new EventEmitter();
    request.setTimeout = (timeout, onTimeout) => Object.assign(capture, { timeout, onTimeout });
    request.destroy = (error) => queueMicrotask(() => request.emit("error", error));
    request.end = (body) => {
      Object.assign(capture, { url: String(url), options, body });
      queueMicrotask(() => {
        const response = new EventEmitter();
        response.statusCode = status;
        response.setEncoding = () => {};
        callback(response);
        response.emit("data", JSON.stringify(responseBody));
        response.emit("end");
      });
    };
    return request;
  };
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
      requestImpl: () => { called = true; },
    }));
    assert.deepEqual(result, { sent: false, skipped: true });
    assert.equal(called, false);
  }
});

test("успешно отправляет JSON через официальный Telegram Bot API", async () => {
  const request = {};
  const result = await withTelegramEnv({ token: "test-token", chatId: "-100456" }, () => sendApplicationToTelegram(application, {
    requestImpl: mockRequest({}, request),
  }));

  assert.deepEqual(result, { sent: true, skipped: false });
  assert.equal(request.url, "https://api.telegram.org/bottest-token/sendMessage");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.equal(request.options.agent, undefined);
  assert.equal("dispatcher" in request.options, false);
  assert.equal(request.timeout, 5000);
  assert.equal(request.options.signal instanceof AbortSignal, true);
  const body = JSON.parse(request.body);
  assert.equal(body.chat_id, "-100456");
  assert.match(body.text, /Новая заявка №123/);
});

test("использует socks5h proxy только для HTTPS-запроса Telegram", async () => {
  const request = {};
  const agent = { name: "test-socks-agent" };
  let proxyUrl;
  await withTelegramEnv({
    token: "test-token",
    chatId: "-100456",
    proxyHost: "proxy.example",
    proxyPort: "1080",
    proxyUsername: "proxy-user",
    proxyPassword: "proxy-password",
  }, () => sendApplicationToTelegram(application, {
    requestImpl: mockRequest({}, request),
    agentFactory(url) {
      proxyUrl = String(url);
      return agent;
    },
  }));

  assert.equal(request.url, "https://api.telegram.org/bottest-token/sendMessage");
  assert.equal(request.options.agent, agent);
  assert.equal("dispatcher" in request.options, false);
  assert.equal(proxyUrl, "socks5h://proxy-user:proxy-password@proxy.example:1080");
});

test("прерывает зависший Telegram-запрос по таймауту", async () => {
  await assert.rejects(
    withTelegramEnv({ token: "test-token", chatId: "456" }, () => sendApplicationToTelegram(application, {
      requestImpl(_url, _options, _callback) {
        const request = new EventEmitter();
        request.setTimeout = (_timeout, onTimeout) => queueMicrotask(onTimeout);
        request.destroy = (error) => queueMicrotask(() => request.emit("error", error));
        request.end = () => {};
        return request;
      },
    })),
    (error) => error.code === "TELEGRAM_TIMEOUT" && error.message === "Telegram request timed out",
  );
});

test("не использует proxy при полностью пустых proxy-настройках", async () => {
  const request = {};
  await withTelegramEnv({ token: "test-token", chatId: "456" }, () => sendApplicationToTelegram(application, {
    requestImpl: mockRequest({}, request),
    agentFactory() {
      throw new Error("agentFactory не должен вызываться");
    },
  }));
  assert.equal(request.options.agent, undefined);
});

test("не выполняет Telegram-запрос с неполной proxy-конфигурацией", async () => {
  let called = false;
  await assert.rejects(
    withTelegramEnv({ token: "test-token", chatId: "456", proxyHost: "proxy.example" }, () => sendApplicationToTelegram(application, {
      requestImpl: () => { called = true; },
    })),
    /настроен не полностью/,
  );
  assert.equal(called, false);
});

test("ошибка Telegram не содержит token в сообщении исключения", async () => {
  const token = "secret-test-token";
  await assert.rejects(
    withTelegramEnv({ token, chatId: "456" }, () => sendApplicationToTelegram(application, {
      requestImpl: mockRequest({ status: 401, responseBody: { ok: false } }),
    })),
    (error) => {
      assert.equal(error.message.includes(token), false);
      assert.match(error.message, /Telegram Bot API/);
      return true;
    },
  );
});

test("подготавливает безопасные message и code для серверного лога", () => {
  const details = safeTelegramErrorDetails(Object.assign(new Error("secret token and proxy password"), { code: "SECRET_CODE" }));
  assert.deepEqual(details, { code: "TELEGRAM_ERROR", message: "Telegram request failed" });
  assert.equal(JSON.stringify(details).includes("secret"), false);
});
