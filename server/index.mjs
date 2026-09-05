import "dotenv/config";
import pg from "pg";
import { createApp } from "./app.mjs";

const { Pool } = pg;
const port = Number(process.env.PORT || 3000);
const host = "127.0.0.1";

if (!process.env.DATABASE_URL) {
  console.error("Не задана переменная DATABASE_URL");
  process.exit(1);
}
if (!process.env.SITE_ORIGIN) {
  console.error("Не задана переменная SITE_ORIGIN");
  process.exit(1);
}
try {
  const siteOrigin = new URL(process.env.SITE_ORIGIN);
  if (siteOrigin.protocol !== "https:" || siteOrigin.origin !== process.env.SITE_ORIGIN.replace(/\/$/, "")) throw new Error();
} catch {
  console.error("SITE_ORIGIN должен содержать полный HTTPS origin без пути");
  process.exit(1);
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT должен быть целым числом от 1 до 65535");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
pool.on("error", (error) => {
  console.error("Неожиданная ошибка пула PostgreSQL", { code: error?.code || "unknown" });
});

const app = createApp({ pool });
const server = app.listen(port, host, () => {
  console.log(`Artdeco API слушает http://${host}:${port}`);
});

async function shutdown(signal) {
  console.log(`Получен ${signal}, останавливаем API`);
  server.close(async () => {
    await pool.end().catch(() => null);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
