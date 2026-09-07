import https from "node:https";
import { SocksProxyAgent } from "socks-proxy-agent";

const TELEGRAM_TEXT_LIMIT = 4096;
const TELEGRAM_RESPONSE_LIMIT = 64 * 1024;
const TELEGRAM_TIMEOUT_MS = 5000;
const SAFE_TELEGRAM_ERROR_CODES = new Set([
  "ABORT_ERR",
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
  "TELEGRAM_API_REJECTED",
  "TELEGRAM_HTTP_ERROR",
  "TELEGRAM_NETWORK_ERROR",
  "TELEGRAM_PROXY_CONFIG",
  "TELEGRAM_TIMEOUT",
]);

function telegramError(message, code) {
  return Object.assign(new Error(message), { code });
}

export function safeTelegramErrorDetails(error) {
  const incomingCode = typeof error?.code === "string" ? error.code : "";
  const code = SAFE_TELEGRAM_ERROR_CODES.has(incomingCode) ? incomingCode : "TELEGRAM_ERROR";
  const incomingMessage = error instanceof Error ? error.message : "";
  const messageIsSafe = [
    "Telegram HTTPS request failed",
    "Telegram request timed out",
    "Telegram SOCKS5 proxy настроен не полностью",
    "Некорректный порт Telegram SOCKS5 proxy",
    "Telegram Bot API отклонил сообщение",
  ].includes(incomingMessage) || /^Telegram Bot API вернул HTTP \d{3}$/.test(incomingMessage);
  return { code, message: messageIsSafe ? incomingMessage : "Telegram request failed" };
}

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
  if (!host || !port) throw telegramError("Telegram SOCKS5 proxy настроен не полностью", "TELEGRAM_PROXY_CONFIG");
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw telegramError("Некорректный порт Telegram SOCKS5 proxy", "TELEGRAM_PROXY_CONFIG");
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
    request.setTimeout?.(TELEGRAM_TIMEOUT_MS, () => {
      request.destroy(telegramError("Telegram request timed out", "TELEGRAM_TIMEOUT"));
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
  let response;
  try {
    response = await requestJson(`https://api.telegram.org/bot${token}/sendMessage`, {
      body,
      agent,
      requestImpl,
    });
  } catch (error) {
    if (error?.code === "TELEGRAM_TIMEOUT" || error?.code === "ABORT_ERR") {
      throw telegramError("Telegram request timed out", "TELEGRAM_TIMEOUT");
    }
    const code = SAFE_TELEGRAM_ERROR_CODES.has(error?.code) ? error.code : "TELEGRAM_NETWORK_ERROR";
    throw telegramError("Telegram HTTPS request failed", code);
  }

  if (!response.ok) throw telegramError(`Telegram Bot API вернул HTTP ${response.status}`, "TELEGRAM_HTTP_ERROR");
  if (!response.data?.ok) throw telegramError("Telegram Bot API отклонил сообщение", "TELEGRAM_API_REJECTED");
  return { sent: true, skipped: false };
}
