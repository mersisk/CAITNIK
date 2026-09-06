import https from "node:https";
import { SocksProxyAgent } from "socks-proxy-agent";

const TELEGRAM_TEXT_LIMIT = 4096;
const TELEGRAM_RESPONSE_LIMIT = 64 * 1024;
const TELEGRAM_TIMEOUT_MS = 5000;

function formatItems(items) {
  return items.map((item) => `- ${item.name} — ${item.price}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`).join("\n");
}

export function formatApplicationForTelegram(application) {
  const common = [
    `Клиент: ${application.first_name} ${application.last_name}`,
    `Телефон: ${application.phone}`,
    `Дата: ${application.event_date}`,
    `Город: ${application.city}`,
    `Место проведения: ${application.venue}`,
    `Удобный мессенджер клиента: ${application.messenger}`,
  ].join("\n");

  const text = application.order_type === "custom"
    ? `Новая индивидуальная заявка №${application.id}\n\n${common}\n\nИдея клиента:\n${application.wishes}`
    : `Новая заявка №${application.id}\n\nТип заказа: Из каталога\nМероприятие: ${application.event_type}\n\n${common}\n\nЗаказ:\n${formatItems(application.cart_items)}\n\nПожелания:\n${application.wishes || "Не указаны"}`;

  if (text.length <= TELEGRAM_TEXT_LIMIT) return text;
  return `${text.slice(0, TELEGRAM_TEXT_LIMIT - 20)}\n…сообщение сокращено`;
}

function createTelegramProxyAgent(agentFactory = (proxyUrl) => new SocksProxyAgent(proxyUrl)) {
  const host = process.env.TELEGRAM_PROXY_HOST?.trim();
  const port = process.env.TELEGRAM_PROXY_PORT?.trim();
  const username = process.env.TELEGRAM_PROXY_USERNAME || "";
  const password = process.env.TELEGRAM_PROXY_PASSWORD || "";
  const hasAnyProxySetting = Boolean(host || port || username || password);

  if (!hasAnyProxySetting) return undefined;
  if (!host || !port) throw new Error("Telegram SOCKS5 proxy настроен не полностью");
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error("Некорректный порт Telegram SOCKS5 proxy");
  }

  const proxyUrl = new URL("socks5h://localhost");
  proxyUrl.hostname = host;
  proxyUrl.port = port;
  proxyUrl.username = username;
  proxyUrl.password = password;
  return agentFactory(proxyUrl);
}

function requestJson(url, { body, agent, requestImpl = https.request }) {
  return new Promise((resolve, reject) => {
    const request = requestImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
      agent,
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    }, (response) => {
      let responseBody = "";
      let responseSize = 0;
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        responseSize += Buffer.byteLength(chunk);
        if (responseSize <= TELEGRAM_RESPONSE_LIMIT) responseBody += chunk;
      });
      response.on("end", () => {
        let data = null;
        try {
          data = JSON.parse(responseBody);
        } catch {
          // A malformed response is handled as a rejected Telegram request below.
        }
        resolve({ ok: response.statusCode >= 200 && response.statusCode < 300, status: response.statusCode, data });
      });
    });
    request.on("error", reject);
    request.end(body);
  });
}

export async function sendApplicationToTelegram(application, {
  requestImpl = https.request,
  agentFactory,
} = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { sent: false, skipped: true };

  const agent = createTelegramProxyAgent(agentFactory);
  const body = JSON.stringify({
      chat_id: chatId,
      text: formatApplicationForTelegram(application),
  });
  const response = await requestJson(`https://api.telegram.org/bot${token}/sendMessage`, {
    body,
    agent,
    requestImpl,
  });

  if (!response.ok) throw new Error(`Telegram Bot API вернул HTTP ${response.status}`);
  if (!response.data?.ok) throw new Error("Telegram Bot API отклонил сообщение");
  return { sent: true, skipped: false };
}
