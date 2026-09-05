import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { createApplication } from "./applications.mjs";
import { sendApplicationToMax } from "./max-bot.mjs";
import { validateApplication } from "./validation.mjs";

export function isAllowedOrigin(origin, siteOrigin = process.env.SITE_ORIGIN) {
  if (!origin) return true;
  const normalizedSite = String(siteOrigin || "").replace(/\/$/, "");
  if (normalizedSite && origin === normalizedSite) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function createApp({
  pool,
  logger = console,
  sendToMax = sendApplicationToMax,
  siteOrigin = process.env.SITE_ORIGIN,
  rateLimitOptions = {},
} = {}) {
  if (!pool?.query) throw new Error("Для API требуется pg.Pool");
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin, siteOrigin)) callback(null, true);
      else callback(Object.assign(new Error("CORS_ORIGIN_DENIED"), { status: 403 }));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400,
  }));
  app.use(express.json({ limit: "16kb", strict: true }));

  const applicationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, error: "Слишком много попыток. Попробуйте через 15 минут." },
    ...rateLimitOptions,
  });

  app.get("/api/health", async (_request, response) => {
    try {
      await pool.query("SELECT 1");
      return response.json({ success: true });
    } catch (error) {
      logger.error("PostgreSQL health check failed", { code: error?.code || "unknown" });
      return response.status(503).json({ success: false, error: "База данных недоступна." });
    }
  });

  app.post("/api/applications", applicationLimiter, async (request, response) => {
    const validation = validateApplication(request.body);
    if (!validation.valid) {
      return response.status(400).json({ success: false, errors: validation.errors });
    }
    try {
      const id = await createApplication(pool, validation.value);
      const application = { id, ...validation.value };
      try {
        const maxResult = await sendToMax(application);
        if (maxResult?.skipped) logger.warn("MAX notification skipped: bot is not configured", { applicationId: id });
      } catch (error) {
        logger.error("MAX notification failed", {
          applicationId: id,
          message: error instanceof Error ? error.message : "Unknown MAX error",
        });
      }
      return response.status(201).json({ success: true, id });
    } catch (error) {
      logger.error("PostgreSQL application insert failed", {
        code: error?.code || "unknown",
        message: error instanceof Error ? error.message : "Unknown database error",
      });
      return response.status(500).json({ success: false, error: "Не удалось сохранить заявку. Попробуйте ещё раз." });
    }
  });

  app.use((error, _request, response, _next) => {
    if (error?.type === "entity.too.large") {
      return response.status(413).json({ success: false, error: "Размер заявки превышает 16 КБ." });
    }
    if (error instanceof SyntaxError && error?.status === 400) {
      return response.status(400).json({ success: false, error: "Некорректный JSON." });
    }
    if (error?.message === "CORS_ORIGIN_DENIED") {
      return response.status(403).json({ success: false, error: "Источник запроса не разрешён." });
    }
    logger.error("Unhandled API error", { message: error instanceof Error ? error.message : "Unknown error" });
    return response.status(500).json({ success: false, error: "Внутренняя ошибка сервера." });
  });

  return app;
}
