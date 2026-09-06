import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createApp } from "./app.mjs";

const servers = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))));
});

async function startApi(options = {}) {
  const calls = [];
  const telegramCalls = [];
  const pool = options.pool || {
    async query(sql, values) {
      calls.push({ sql, values });
      return { rows: [{ id: 123 }] };
    },
  };
  const logger = options.logger || { warn() {}, error() {} };
  const app = createApp({
    pool,
    logger,
    siteOrigin: "https://artdeco-vl.ru",
    sendToTelegram: options.sendToTelegram || (async (application) => { telegramCalls.push(application); return { sent: true }; }),
    rateLimitOptions: options.rateLimitOptions,
  });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  servers.push(server);
  return { url: `http://127.0.0.1:${server.address().port}`, calls, telegramCalls };
}

function validCatalogApplication() {
  return {
    first_name: "Иван",
    last_name: "Иванов",
    phone: "8 (999) 123-45-67",
    event_date: "2099-10-20",
    city: "Владивосток",
    venue: "Банкетный зал",
    messenger: "Telegram",
    event_type: "Свадьба",
    order_type: "catalog",
    wishes: "Тёплый свет",
    cart_items: [{ id: "wedding-photo-25000", name: "Подменённое имя", price: "1 ₽", quantity: 1 }],
    consent: true,
  };
}

test("catalog: сохраняет канонические позиции параметризованным SQL и вызывает Telegram", async () => {
  const api = await startApi();
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://artdeco-vl.ru" },
    body: JSON.stringify(validCatalogApplication()),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { success: true, id: 123 });
  assert.equal(api.calls.length, 1);
  assert.match(api.calls[0].sql, /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11::jsonb\)/);
  const savedCart = JSON.parse(api.calls[0].values[10]);
  assert.deepEqual(savedCart, [{ id: "wedding-photo-25000", name: "Фотозона от 25 000 ₽", price: "от 25 000 ₽", quantity: 1 }]);
  assert.equal(api.calls[0].values[2], "+79991234567");
  assert.equal(api.telegramCalls[0].id, 123);
});

test("catalog: сохраняет канонический ценовой уровень свадебной фотозоны", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.event_type = "Свадьба";
  application.cart_items = [{ id: "wedding-photo-35000", name: "Другое название", price: "1 ₽", quantity: 1 }];
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(JSON.parse(api.calls[0].values[10]), [{
    id: "wedding-photo-35000",
    name: "Фотозона от 35 000 ₽",
    price: "от 35 000 ₽",
    quantity: 1,
  }]);
});

test("catalog: сохраняет самостоятельную услугу гендер-пати без вложенного тарифа", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.event_type = "Гендер-пати";
  application.cart_items = [{ id: "gender-extinguisher", name: "Другое название", price: "1 ₽", quantity: 1 }];
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(JSON.parse(api.calls[0].values[10]), [{
    id: "gender-extinguisher",
    name: "Гендерный огнетушитель",
    price: "от 3 500 ₽",
    quantity: 1,
  }]);
});

test("catalog: сохраняет одиночные услуги юбилея, выписки, выпускного и компании", async () => {
  const services = [
    ["anniversary-decoration", "Юбилей", "Оформление юбилея", "от 25 000 ₽"],
    ["maternity-decoration", "Выписка из роддома", "Оформление выписки из роддома", "от 25 000 ₽"],
    ["graduation-decoration", "Выпускной", "Оформление выпускного", "от 30 000 ₽"],
    ["corporate-decoration", "Событие для компании", "Оформление события для компании", "от 30 000 ₽"],
  ];
  for (const [id, eventType, name, price] of services) {
    const api = await startApi();
    const application = validCatalogApplication();
    application.event_type = eventType;
    application.cart_items = [{ id, name: "Подменённое название", price: "1 ₽", quantity: 1 }];
    const response = await fetch(`${api.url}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });
    assert.equal(response.status, 201);
    assert.deepEqual(JSON.parse(api.calls[0].values[10]), [{ id, name, price, quantity: 1 }]);
  }
});

test("catalog: сохраняет одиночное оформление фотозоны на годовасие", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.event_type = "Годовасие";
  application.cart_items = [{ id: "first-birthday-photozone", name: "Другое название", price: "1 ₽", quantity: 1 }];
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(JSON.parse(api.calls[0].values[10]), [{
    id: "first-birthday-photozone",
    name: "Оформление фотозоны на годовасие",
    price: "от 15 000 ₽",
    quantity: 1,
  }]);
});

test("custom: требует wishes и пустую корзину", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.order_type = "custom";
  application.event_type = "Индивидуальное оформление";
  application.wishes = "";
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.ok(body.errors.wishes);
  assert.ok(body.errors.cart_items);
  assert.equal(api.calls.length, 0);
});

test("custom: принимает обязательную идею с пустой корзиной", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.order_type = "custom";
  application.event_type = "Индивидуальное оформление";
  application.wishes = "Цветочная арка у моря";
  application.cart_items = [];
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 201);
  assert.equal(api.calls[0].values[8], "custom");
  assert.deepEqual(JSON.parse(api.calls[0].values[10]), []);
});

test("принимает MAX как удобный мессенджер клиента", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.messenger = "MAX";
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 201);
  assert.equal(api.calls[0].values[6], "MAX");
});

test("не принимает заявку без явно подтверждённого consent=true", async () => {
  for (const consent of [undefined, false, "true", 1]) {
    const api = await startApi();
    const application = validCatalogApplication();
    if (consent === undefined) delete application.consent;
    else application.consent = consent;
    const response = await fetch(`${api.url}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.errors.consent, "Необходимо согласие на обработку персональных данных.");
    assert.equal(api.calls.length, 0);
    assert.equal(api.telegramCalls.length, 0);
  }
});

test("проверяет формат и давность даты", async () => {
  const api = await startApi();
  for (const eventDate of ["2026-02-30", "2000-01-01", "20.10.2099"]) {
    const application = validCatalogApplication();
    application.event_date = eventDate;
    const response = await fetch(`${api.url}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    });
    assert.equal(response.status, 400);
    assert.ok((await response.json()).errors.event_date);
  }
});

test("не принимает удалённую позицию романтического вечера", async () => {
  const api = await startApi();
  const application = validCatalogApplication();
  application.cart_items = [{ id: "romantic-table-candles", name: "Вечер при свечах", price: "от 5 560 ₽", quantity: 1 }];
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  assert.equal(response.status, 400);
  assert.ok((await response.json()).errors.cart_items);
});

test("CORS разрешает production и localhost, но отклоняет чужой origin", async () => {
  const api = await startApi();
  const health = await fetch(`${api.url}/api/health`, { headers: { Origin: "http://localhost:4173" } });
  assert.equal(health.status, 200);
  assert.equal(health.headers.get("access-control-allow-origin"), "http://localhost:4173");
  const denied = await fetch(`${api.url}/api/health`, { headers: { Origin: "https://evil.example" } });
  assert.equal(denied.status, 403);
});

test("ограничивает JSON body размером 16 КБ", async () => {
  const api = await startApi();
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishes: "x".repeat(17 * 1024) }),
  });
  assert.equal(response.status, 413);
});

test("rate limit ограничивает число заявок с одного IP", async () => {
  const api = await startApi({ rateLimitOptions: { limit: 2, windowMs: 60_000 } });
  const send = () => fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validCatalogApplication()),
  });
  assert.equal((await send()).status, 201);
  assert.equal((await send()).status, 201);
  const blocked = await send();
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).success, false);
});

test("ошибка PostgreSQL не раскрывается клиенту", async () => {
  const api = await startApi({ pool: { query: async () => { throw Object.assign(new Error("secret SQL detail"), { code: "XX000" }); } } });
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validCatalogApplication()),
  });
  assert.equal(response.status, 500);
  const body = await response.json();
  assert.equal(JSON.stringify(body).includes("secret SQL detail"), false);
  assert.equal(api.telegramCalls.length, 0);
});

test("сбой Telegram не отменяет сохранённую заявку, token и proxy password не попадают в лог", async () => {
  const secretToken = "secret-telegram-token";
  const secretProxyPassword = "secret-proxy-password";
  const logEntries = [];
  const logger = {
    warn(...args) { logEntries.push(args); },
    error(...args) { logEntries.push(args); },
  };
  const api = await startApi({
    logger,
    sendToTelegram: async () => { throw new Error(`Telegram unavailable: ${secretToken} ${secretProxyPassword}`); },
  });
  const response = await fetch(`${api.url}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validCatalogApplication()),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { success: true, id: 123 });
  assert.equal(api.calls.length, 1);
  assert.equal(JSON.stringify(logEntries).includes(secretToken), false);
  assert.equal(JSON.stringify(logEntries).includes(secretProxyPassword), false);
  assert.match(JSON.stringify(logEntries), /Telegram notification failed/);
});
