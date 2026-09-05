# Backend «Арт-деко» на Ubuntu 24.04

Production-схема:

```text
https://artdeco-vl.ru          Nginx раздаёт dist/
https://api.artdeco-vl.ru      Nginx проксирует /api/ на 127.0.0.1:3000
                                         ↓
                                  Node.js / Express
                                         ↓
                            PostgreSQL на 127.0.0.1:5432
                                         ↓
                                   MAX Bot API
```

Node.js слушает только loopback-адрес. PostgreSQL также не должен принимать
подключения из интернета. В браузере нет пароля базы и токена бота.

## 1. Подготовка проекта локально

В корне проекта выполните:

```bash
npm ci
npm run check
npm run build
```

Основные команды:

- `npm run dev` — статический сайт на `http://127.0.0.1:4173`;
- `npm run api` — API на `http://127.0.0.1:3000`;
- `npm run api:dev` — API с перезапуском после изменения файлов;
- `npm run test:api` — тесты API без настоящей базы;
- `npm run check` — все проверки проекта;
- `npm run build` — сборка сайта в `dist/`.

## 2. Локальная переменная окружения

Скопируйте пример, затем отредактируйте только локальный `.env`:

```bash
cp .env.example .env
nano .env
```

Пример значения:

```dotenv
DATABASE_URL=postgresql://artdeco_user:ВАШ_ПАРОЛЬ@127.0.0.1:5432/artdeco
SITE_ORIGIN=https://artdeco-vl.ru
PORT=3000
MAX_BOT_TOKEN=
MAX_CHAT_ID=
```

`.env` исключён из Git. Если пароль содержит `@`, `:`, `/`, `#`, `%` или другие
служебные символы URL, их нужно закодировать. Получить закодированный пароль:

```bash
node -e "console.log(encodeURIComponent(process.argv[1]))" 'ВАШ_ПАРОЛЬ'
```

Пустые `MAX_BOT_TOKEN` и `MAX_CHAT_ID` допустимы: заявка сохранится в PostgreSQL,
а отправка в MAX будет пропущена.

## 3. Проверка структуры PostgreSQL

На сервере откройте базу:

```bash
sudo -u postgres psql -d artdeco
```

В `psql` выполните:

```sql
\d+ applications
```

Таблица должна содержать `first_name`, `last_name`, `phone`, `event_date`,
`city`, `venue`, `messenger`, `event_type`, `order_type`, `wishes` и
`cart_items jsonb`. У `id` должно быть автоматическое значение. Для `status` и
`created_at` рекомендуются значения по умолчанию, например `new` и `now()`.
Старое поле `description` не используется новым API, поэтому оно должно
допускать `NULL` или иметь значение по умолчанию. Иначе PostgreSQL отклонит
`INSERT`, в котором идея клиента сохраняется в `wishes`.

Проверка прав пользователя без показа пароля в истории команд:

```bash
psql 'postgresql://artdeco_user@127.0.0.1:5432/artdeco' -W
```

Внутри `psql`:

```sql
SELECT current_database(), current_user;
SELECT id, order_type, event_type, created_at
FROM applications
ORDER BY created_at DESC
LIMIT 5;
```

## 4. Локальный запуск backend

Терминал 1:

```bash
npm run api:dev
```

Терминал 2:

```bash
npm run dev
```

Откройте `http://127.0.0.1:4173`. `runtime-config.js` автоматически использует
локальный API `http://127.0.0.1:3000` для `localhost` и `127.0.0.1`.

Проверка здоровья API:

```bash
curl -i http://127.0.0.1:3000/api/health
```

Ожидаемый ответ: `HTTP/1.1 200 OK` и `{"success":true}`.

## 5. Проверка заказа из каталога

На сайте пройдите путь: каталог → событие → услуга → вариант → добавить в
корзину → корзина → заполнить данные заказа. После успешной отправки корзина
очищается. Если API недоступен, форма и корзина остаются заполненными.

Тот же сценарий через `curl`:

```bash
curl -i -X POST http://127.0.0.1:3000/api/applications \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:4173' \
  --data '{
    "first_name":"Иван",
    "last_name":"Иванов",
    "phone":"+7 999 123-45-67",
    "event_date":"2099-10-20",
    "city":"Владивосток",
    "venue":"Банкетный зал",
    "messenger":"MAX",
    "event_type":"Романтический вечер",
    "order_type":"catalog",
    "wishes":"Тёплый свет",
    "cart_items":[{
      "id":"romantic-table-candles",
      "name":"Вечер при свечах",
      "price":"от 5 560 ₽",
      "quantity":1
    }]
  }'
```

API сверяет `id` с каталогом и сам подставляет настоящее название и цену.
Ожидаемый ответ имеет вид `{"success":true,"id":123}`.

## 6. Проверка индивидуального оформления

На сайте откройте «Другое событие» или кнопку «Заказать индивидуальное
оформление» из пустой корзины. Для этого сценария пожелания обязательны.

Проверка через `curl`:

```bash
curl -i -X POST http://127.0.0.1:3000/api/applications \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://127.0.0.1:4173' \
  --data '{
    "first_name":"Анна",
    "last_name":"Петрова",
    "phone":"8 999 765-43-21",
    "event_date":"2099-11-15",
    "city":"Большой Камень",
    "venue":"Площадка уточняется",
    "messenger":"Telegram",
    "event_type":"Индивидуальное оформление",
    "order_type":"custom",
    "wishes":"Цветочная арка у моря",
    "cart_items":[]
  }'
```

## 7. Загрузка проекта на VDS

Создайте отдельного системного пользователя и каталог:

```bash
sudo useradd --system --home /var/www/artdeco --shell /usr/sbin/nologin artdeco
sudo mkdir -p /var/www/artdeco /etc/artdeco
sudo chown -R artdeco:artdeco /var/www/artdeco
```

Загрузите репозиторий в `/var/www/artdeco` через Git или `rsync`. Затем:

```bash
cd /var/www/artdeco
sudo -u artdeco npm ci --omit=dev
sudo -u artdeco npm run build
```

Если команда `sudo -u artdeco npm` не находит Node.js, выполните
`command -v node` и `command -v npm`. Для systemd используйте полный путь к
Node.js. Системная установка обычно находится в `/usr/bin/node`.

## 8. Production-файл окружения

Создайте файл вне каталога сайта:

```bash
sudo nano /etc/artdeco/artdeco.env
```

Содержимое:

```dotenv
DATABASE_URL=postgresql://artdeco_user:ЗАКОДИРОВАННЫЙ_ПАРОЛЬ@127.0.0.1:5432/artdeco
SITE_ORIGIN=https://artdeco-vl.ru
PORT=3000
MAX_BOT_TOKEN=
MAX_CHAT_ID=
```

Ограничьте доступ:

```bash
sudo chown root:artdeco /etc/artdeco/artdeco.env
sudo chmod 640 /etc/artdeco/artdeco.env
```

## 9. Запуск через systemd

Скопируйте пример службы:

```bash
sudo cp deploy/artdeco-api.service.example /etc/systemd/system/artdeco-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now artdeco-api
sudo systemctl status artdeco-api
```

Логи без вывода секретных переменных:

```bash
sudo journalctl -u artdeco-api -n 100 --no-pager
```

Проверка локального порта на VDS:

```bash
sudo ss -ltnp | grep 3000
curl http://127.0.0.1:3000/api/health
```

В выводе `ss` должен быть только `127.0.0.1:3000`, не `0.0.0.0:3000`.

## 10. Настройка Nginx

Скопируйте пример и включите сайт:

```bash
sudo cp deploy/nginx-artdeco.conf.example /etc/nginx/sites-available/artdeco
sudo ln -s /etc/nginx/sites-available/artdeco /etc/nginx/sites-enabled/artdeco
sudo nginx -t
sudo systemctl reload nginx
```

Если в `sites-enabled/default` есть конфликтующий `default_server`, отключите
его только после проверки своей конфигурации:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

PostgreSQL-порт `5432` не добавляйте в UFW. Снаружи нужны только SSH, HTTP и
HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## 11. DNS после делегирования

У регистратора создайте A-записи:

```text
@       → IPv4 вашего VDS
api     → IPv4 вашего VDS
www     → IPv4 вашего VDS (если нужен www)
```

Если сервер имеет настроенный IPv6, можно добавить соответствующие AAAA-записи.
Не добавляйте AAAA без рабочего IPv6: часть посетителей не сможет открыть сайт.

Проверяйте распространение DNS:

```bash
dig +short artdeco-vl.ru A
dig +short api.artdeco-vl.ru A
```

Оба имени должны вернуть IP вашего VDS. После этого проверьте по HTTP:

```bash
curl -i http://artdeco-vl.ru
curl -i http://api.artdeco-vl.ru/api/health
```

## 12. HTTPS через Certbot

Установите Certbot для Nginx:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Когда DNS уже указывает на VDS и порт 80 доступен:

```bash
sudo certbot --nginx -d artdeco-vl.ru -d www.artdeco-vl.ru
sudo certbot --nginx -d api.artdeco-vl.ru
```

Если `www` не создавался в DNS, исключите `-d www.artdeco-vl.ru` из команды.
Проверьте автоматическое продление:

```bash
sudo certbot renew --dry-run
```

Финальные проверки:

```bash
curl -i https://artdeco-vl.ru
curl -i https://api.artdeco-vl.ru/api/health
```

## 13. Проверка заявки в PostgreSQL

После тестовой отправки:

```bash
sudo -u postgres psql -d artdeco
```

```sql
SELECT id, first_name, last_name, phone, event_date, city, venue,
       messenger, event_type, order_type, wishes, cart_items, status, created_at
FROM applications
ORDER BY created_at DESC
LIMIT 10;
```

У заявки из каталога `cart_items` содержит канонические название и цену. У
индивидуальной заявки массив пуст, а идея находится в `wishes`.

## 14. Подключение и проверка MAX

Добавьте бота в нужный чат, получите `chat_id`, затем заполните на VDS только
файл `/etc/artdeco/artdeco.env`:

```dotenv
MAX_BOT_TOKEN=ТОКЕН_БОТА
MAX_CHAT_ID=ЧИСЛОВОЙ_ID_ЧАТА
```

Перезапустите API:

```bash
sudo systemctl restart artdeco-api
sudo journalctl -u artdeco-api -f
```

Отправьте одну тестовую заявку. Она должна появиться в PostgreSQL и в MAX. Если
MAX недоступен, API всё равно возвращает успех, заявка остаётся в базе, а журнал
содержит `MAX notification failed` и номер заявки без токена.

MAX принимает сообщения через `POST https://platform-api2.max.ru/messages` с
`chat_id` в query-параметре и токеном в заголовке `Authorization`. Токен нельзя
добавлять в frontend, Nginx-конфигурацию или Git.

## 15. Обновление проекта

После загрузки новой версии:

```bash
cd /var/www/artdeco
sudo -u artdeco npm ci --omit=dev
sudo -u artdeco npm run check
sudo -u artdeco npm run build
sudo systemctl restart artdeco-api
sudo nginx -t
sudo systemctl reload nginx
```

После обновления снова проверьте `/api/health`, оба сценария формы и последнюю
строку в `applications`.
