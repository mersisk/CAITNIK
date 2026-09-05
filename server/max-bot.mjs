const MAX_MESSAGES_URL = "https://platform-api2.max.ru/messages";
const MAX_TEXT_LIMIT = 4000;

function formatItems(items) {
  return items.map((item) => `- ${item.name} — ${item.price}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`).join("\n");
}

export function formatApplicationForMax(application) {
  const common = [
    `Клиент: ${application.first_name} ${application.last_name}`,
    `Телефон: ${application.phone}`,
    `Дата: ${application.event_date}`,
    `Город: ${application.city}`,
    `Место проведения: ${application.venue}`,
    `Связаться через: ${application.messenger}`,
  ].join("\n");

  const text = application.order_type === "custom"
    ? `Новая индивидуальная заявка №${application.id}\n\n${common}\n\nИдея клиента:\n${application.wishes}`
    : `Новая заявка №${application.id}\n\nТип заказа: Из каталога\nМероприятие: ${application.event_type}\n\n${common}\n\nЗаказ:\n${formatItems(application.cart_items)}\n\nПожелания:\n${application.wishes || "Не указаны"}`;

  if (text.length <= MAX_TEXT_LIMIT) return text;
  return `${text.slice(0, MAX_TEXT_LIMIT - 20)}\n…сообщение сокращено`;
}

export async function sendApplicationToMax(application, {
  token = process.env.MAX_BOT_TOKEN,
  chatId = process.env.MAX_CHAT_ID,
  fetchImpl = fetch,
} = {}) {
  if (!token || !chatId) return { sent: false, skipped: true };
  const url = new URL(MAX_MESSAGES_URL);
  url.searchParams.set("chat_id", chatId);
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: formatApplicationForMax(application) }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`MAX Bot API вернул HTTP ${response.status}`);
  return { sent: true, skipped: false };
}
