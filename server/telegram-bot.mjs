const TELEGRAM_TEXT_LIMIT = 4096;

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

export async function sendApplicationToTelegram(application, {
  fetchImpl = fetch,
} = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { sent: false, skipped: true };

  const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatApplicationForTelegram(application),
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) throw new Error(`Telegram Bot API вернул HTTP ${response.status}`);
  const result = await response.json().catch(() => null);
  if (!result?.ok) throw new Error("Telegram Bot API отклонил сообщение");
  return { sent: true, skipped: false };
}
