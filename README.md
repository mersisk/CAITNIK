# airc-vibe-page

Сайт студии оформления «Арт-деко» с каталогом, корзиной и Node.js API заявок.

[Use this template](https://github.com/FocusSam/airc-vibe-page/generate) · [Live demo](https://focussam.github.io/airc-vibe-page/) · [Release v1.0.0](https://github.com/FocusSam/airc-vibe-page/releases/tag/v1.0.0)

Production-форма сохраняет заявки в PostgreSQL на российском VDS и уведомляет
декоратора через Telegram Bot API.

Начни с `START_HERE.md`. Готовые команды для агента лежат в `docs/INSTALL_WITH_AGENT.md`.

## Быстрый запуск

Нужен Node.js 22 или новее. Рекомендуем Node.js 24 LTS.

```bash
npm ci
npm run doctor
npm run check
npm run dev
```

Для формы также скопируй `.env.example` в `.env` и запусти `npm run api:dev` во
втором терминале. Открой `http://127.0.0.1:4173`.

## Экраны

- `#/` — главная страница.
- `#/request` — форма заказа из каталога.
- `#/request?type=custom` — индивидуальное оформление.
- `/privacy` — Политика обработки персональных данных.
- `/personal-data-consent` — Согласие на обработку персональных данных.
- `#/workspace` — список заявок владельца.
- `#/story` — пример длинной смысловой страницы.
- `#/styleguide` — визуальные правила.

## Данные заявок

Корзина хранится в браузере до успешной отправки. Заявки принимает endpoint
`POST /api/applications` и сохраняет в таблицу PostgreSQL `applications`.
Секреты находятся только в окружении backend. Подробная установка на Ubuntu:
`docs/VPS_BACKEND.md`.

## Что лежит в проекте

`PRODUCT.md`, `FLOW.md`, `DESIGN_SYSTEM.md` и `DATA_MODEL.md` хранят продуктовый контекст.

`AGENTS.md` читает Codex. `CLAUDE.md` читает Claude Code. Ядро правил у них одинаковое.

`DECISIONS.md` хранит важные решения. `TASKS.md` — ближайшие задачи.

`docs/` содержит инструкции по изменению проекта, данным, безопасности, публикации и работе с агентами.

## Публикация на GitHub Pages

В проект уже добавлен workflow `.github/workflows/pages.yml`.

1. Создай пустой репозиторий на GitHub.
2. Загрузи в его корень содержимое этой папки.
3. Открой `Settings → Pages`.
4. В поле `Source` выбери `GitHub Actions`.
5. Отправь изменение в ветку `main` или запусти workflow вручную.

Workflow сам выполнит `doctor`, `check`, `build` и опубликует папку `dist`. Подробности — в `docs/PUBLISH_STATIC.md`.

## Лицензия и происхождение

Starter распространяется по MIT-лицензии. Код написан для AI Room Club с нуля. В `THIRD_PARTY_NOTES.md` зафиксировано, что исходники `di-sukharev/vibe` не копировались.
