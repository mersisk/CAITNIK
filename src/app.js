import { packageDetails, project } from "./project.js";
import { store } from "./data/store.js";
import {
  escapeHtml,
  formatDate,
  onRouteChange,
  qs,
  qsa,
  renderLogin,
  renderShell,
  route,
  setNotice,
  statusLabel,
} from "./ui.js";
import { renderStyleguide } from "./styleguide.js";

const cart = [];

const nav = (active) => [
  { href: "#/", label: "Главная", active: active === "/" },
  { href: "#/catalog", label: "Каталог", active: active === "/catalog" },
  { href: "#/cart", label: `Подборка${cart.length ? ` · ${cart.length}` : ""}`, active: active === "/cart" },
  { href: "#/workspace", label: "Заявки", active: active === "/workspace" },
];

function selectedEventId() {
  return selectedParam("event");
}

function selectedPackageId() {
  return selectedParam("id");
}

function selectedVariantId() {
  return selectedParam("id");
}

function selectedParam(name) {
  const query = location.hash.split("?")[1] || "";
  return new URLSearchParams(query).get(name);
}

function addToCart(item) {
  if (cart.some((pack) => pack.id === item.id)) {
    setNotice("Этот вариант уже добавлен в подборку.");
    return false;
  }
  cart.push(item);
  setNotice("Вариант добавлен в подборку.");
  return true;
}

function eventCard(event) {
  return `
    <article class="event-card">
      <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}: пример оформления" loading="lazy">
      <div class="event-card__body">
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.text)}</p>
        <a class="text-link" href="#/catalog?event=${encodeURIComponent(event.id)}">Выбрать оформление <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `;
}

function customEventCard() {
  return `
    <article class="event-card event-card--custom">
      <div class="event-card__symbol" aria-hidden="true">✦</div>
      <div class="event-card__body">
        <h3>Другое событие</h3>
        <p>Корпоратив, выписка из роддома, помолвка или необычная идея — расскажите, что нужно оформить.</p>
        <a class="text-link" href="#/request?type=custom">Описать свой запрос <span aria-hidden="true">→</span></a>
      </div>
    </article>
  `;
}

function cartSummary() {
  if (!cart.length) return "";
  return `
    <aside class="cart-summary" aria-live="polite">
      <div>
        <span class="badge">Ваша подборка</span>
        <p><strong>${cart.length === 1 ? "Выбран 1 вариант" : `Выбрано вариантов: ${cart.length}`}</strong></p>
        <p class="muted small">${cart.map((item) => escapeHtml(item.name)).join(", ")}</p>
      </div>
      <a class="button" href="#/cart">Перейти к заявке</a>
    </aside>
  `;
}

function renderHome() {
  renderShell({
    title: `${project.name} — ${project.title}`,
    nav: [...nav("/"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="hero hero--decor">
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(project.eyebrow)}</p>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="lead">${escapeHtml(project.lead)}</p>
            <div class="actions">
              <a class="button" href="#/catalog">${escapeHtml(project.cta)}</a>
              <a class="button button--secondary" href="#/story">${escapeHtml(project.secondaryCta)}</a>
            </div>
          </div>
          <aside class="hero-photo panel">
            <img src="${escapeHtml(project.events[0].image)}" alt="Праздничный декор Арт-деко">
            <div class="hero-photo__caption"><span>Арт-деко</span><strong>Ваш праздник — наша деталь</strong></div>
          </aside>
        </div>
      </section>

      <section class="section section--soft">
        <div class="container grid grid-3">
          ${project.benefits.map((item) => `
            <article class="card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Каталог</p>
              <h2>Какой праздник вы планируете?</h2>
            </div>
            <a class="text-link" href="#/catalog">Открыть весь каталог <span aria-hidden="true">→</span></a>
          </div>
          <div class="event-grid">
            ${project.events.map(eventCard).join("")}${customEventCard()}
          </div>
        </div>
      </section>

      <section id="request" class="section">
        <div class="container grid grid-2">
          <div>
            <p class="eyebrow">Главное действие</p>
            <h2>${route() === "/request" && selectedParam("type") === "custom" ? "Расскажите о вашем событии" : escapeHtml(project.form.title)}</h2>
            <p class="lead">${route() === "/request" && selectedParam("type") === "custom" ? "Опишите праздник, площадку и ваши пожелания — менеджер подберёт подходящее оформление." : escapeHtml(project.form.note)}</p>
            ${cart.length ? `<p class="selection-note"><strong>Выбрано:</strong> ${cart.map((item) => escapeHtml(item.name)).join(", ")}</p>` : ""}
          </div>
          <form id="lead-form" class="panel stack" novalidate>
            <label>
              Имя
              <input name="name" autocomplete="name" maxlength="80" required>
              <span class="help">Как к тебе обращаться.</span>
            </label>
            <label>
              Контакт для связи
              <input name="contact" autocomplete="email" maxlength="120" required>
              <span class="help">Телефон, почта или Telegram.</span>
            </label>
            <label>
              Какой праздник вы планируете
              <textarea name="problem" maxlength="1200" required></textarea>
            </label>
            <p id="form-error" class="field-error" hidden></p>
            <button class="button" type="submit">${escapeHtml(project.cta)}</button>
          </form>
        </div>
      </section>
    `,
  });

  qs("#lead-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedNames = cart.map((item) => item.name).join(", ");
    const payload = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      problem: `${selectedNames ? `Выбрано: ${selectedNames}. ` : ""}${String(data.get("problem") || "").trim()}`,
    };
    const error = qs("#form-error");

    if (payload.name.length < 2 || payload.contact.length < 3 || payload.problem.length < 10) {
      error.textContent = "Укажите имя, контакт и коротко расскажите о празднике.";
      error.hidden = false;
      return;
    }

    error.hidden = true;
    const button = qs('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = "Отправляем…";

    try {
      await store.create("lead", payload, "new");
      form.reset();
      setNotice(store.mode === "local" ? project.form.successLocal : project.form.successRemote);
    } catch (cause) {
      error.textContent = cause instanceof Error ? cause.message : "Не удалось сохранить заявку";
      error.hidden = false;
    } finally {
      button.disabled = false;
      button.textContent = project.cta;
    }
  });

  if (route() === "/request") requestAnimationFrame(() => qs("#request")?.scrollIntoView());
}

function renderCatalog() {
  const eventId = selectedEventId();
  const activeEvent = project.events.find((event) => event.id === eventId);
  const packages = activeEvent ? project.packages.filter((item) => item.eventId === activeEvent.id) : [];

  renderShell({
    title: `Каталог — ${project.name}`,
    nav: [...nav("/catalog"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="section catalog-hero">
        <div class="container">
          <p class="eyebrow">Каталог Арт-деко</p>
          <h1>${activeEvent ? escapeHtml(activeEvent.title) : "Выберите ваш праздник"}</h1>
          <p class="lead">${activeEvent ? "Варианты отличаются по составу и бюджету. Добавьте понравившийся в подборку — менеджер уточнит детали." : "Нажмите на повод, чтобы увидеть подходящие варианты оформления и цены."}</p>
          ${activeEvent ? '<a class="text-link" href="#/catalog">← Все поводы</a>' : ""}
        </div>
      </section>
      <section class="section section--soft catalog-section">
        <div class="container">
          ${activeEvent ? `
            <div class="package-grid">
              ${packages.map((item) => `
                <article class="package-card">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}: пример оформления" loading="lazy">
                  <div class="package-card__body">
                    <p class="price">${escapeHtml(item.price)}</p>
                    <h2>${escapeHtml(item.name)}</h2>
                    <p>${escapeHtml(item.includes)}</p>
                    <a class="button" href="#/package?id=${encodeURIComponent(item.id)}">Посмотреть варианты</a>
                  </div>
                </article>
              `).join("")}
            </div>
            ${cartSummary()}
          ` : `<div class="event-grid">${project.events.map(eventCard).join("")}${customEventCard()}</div>`}
        </div>
      </section>
    `,
  });

}

function renderPackage() {
  const packageId = selectedPackageId();
  const selectedPackage = project.packages.find((item) => item.id === packageId);
  const detail = selectedPackage ? packageDetails[selectedPackage.id] : null;

  if (!selectedPackage || !detail) {
    location.hash = "#/catalog";
    return;
  }

  const event = project.events.find((item) => item.id === selectedPackage.eventId);
  renderShell({
    title: `${detail.heading} — ${project.name}`,
    nav: [...nav("/catalog"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="section package-hero">
        <div class="container">
          <a class="text-link" href="#/catalog?event=${encodeURIComponent(selectedPackage.eventId)}">← ${escapeHtml(event?.title || "Каталог")}</a>
          <p class="eyebrow">${escapeHtml(event?.title || "Оформление")}</p>
          <h1>${escapeHtml(detail.heading)}</h1>
          <p class="lead">${escapeHtml(detail.description)}</p>
        </div>
      </section>
      <section class="section section--soft package-details">
        <div class="container">
          <div class="gallery-grid" aria-label="Примеры оформления">
            ${detail.gallery.map((image, index) => `<img src="${escapeHtml(image)}" alt="${escapeHtml(detail.heading)}: пример оформления ${index + 1}" loading="${index ? "lazy" : "eager"}">`).join("")}
          </div>
          <div class="section-heading package-heading">
            <div><p class="eyebrow">Выберите масштаб</p><h2>Варианты оформления</h2></div>
            <p class="muted">Точная смета зависит от площадки, сезона и числа гостей.</p>
          </div>
          <div class="variant-grid">
            ${detail.variants.map((variant) => `
              <article class="variant-card">
                <p class="price">${escapeHtml(variant.price)}</p>
                <h3>${escapeHtml(variant.name)}</h3>
                <p>${escapeHtml(variant.includes)}</p>
                <a class="button" href="#/variant?id=${encodeURIComponent(variant.id)}&package=${encodeURIComponent(selectedPackage.id)}">Посмотреть оформление</a>
              </article>
            `).join("")}
          </div>
          ${cartSummary()}
        </div>
      </section>
    `,
  });

}

function renderVariant() {
  const packageId = selectedParam("package");
  const variantId = selectedVariantId();
  const selectedPackage = project.packages.find((item) => item.id === packageId);
  const detail = selectedPackage ? packageDetails[selectedPackage.id] : null;
  const variant = detail?.variants.find((item) => item.id === variantId);

  if (!selectedPackage || !detail || !variant) {
    location.hash = "#/catalog";
    return;
  }

  renderShell({
    title: `${variant.name} — ${project.name}`,
    nav: [...nav("/catalog"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="section package-hero">
        <div class="container">
          <a class="text-link" href="#/package?id=${encodeURIComponent(selectedPackage.id)}">← Все варианты услуги</a>
          <p class="eyebrow">${escapeHtml(detail.heading)}</p>
          <p class="price">${escapeHtml(variant.price)}</p>
          <h1>${escapeHtml(variant.name)}</h1>
          <p class="lead">Посмотрите примеры этого оформления. Финальные цвета и детали согласуем с вами перед заказом.</p>
        </div>
      </section>
      <section class="section section--soft package-details">
        <div class="container">
          <div class="gallery-grid" aria-label="Фотографии выбранного варианта">
            ${detail.gallery.map((image, index) => `<img src="${escapeHtml(image)}" alt="${escapeHtml(variant.name)}: фотография оформления ${index + 1}" loading="${index ? "lazy" : "eager"}">`).join("")}
          </div>
          <div class="selected-variant panel">
            <div><span class="badge">Выбранный вариант</span><h2 style="margin-top:16px">${escapeHtml(variant.name)}</h2><p>${escapeHtml(variant.includes)}</p></div>
            <button id="add-selected-variant" class="button" type="button">Добавить в подборку</button>
          </div>
        </div>
      </section>
    `,
  });

  qs("#add-selected-variant").addEventListener("click", () => {
    addToCart({ ...variant, image: selectedPackage.image, packageId: selectedPackage.id });
    renderVariant();
  });
}

function renderCart() {
  renderShell({
    title: `Подборка — ${project.name}`,
    nav: [...nav("/cart"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="section">
        <div class="container">
          <p class="eyebrow">Ваша подборка</p>
          <h1>Выбранные варианты</h1>
          ${cart.length ? `
            <div class="cart-list">
              ${cart.map((item) => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt=""><div><p class="price">${escapeHtml(item.price)}</p><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.includes)}</p></div><button class="remove-cart button button--danger button--small" type="button" data-cart-id="${escapeHtml(item.id)}">Удалить</button></article>`).join("")}
            </div>
            <div class="actions"><a class="button" href="#/request">Оформить заявку</a><a class="button button--secondary" href="#/catalog">Добавить ещё</a></div>
          ` : `<div class="empty"><h2>Подборка пока пуста</h2><p>Выберите праздник в каталоге и добавьте понравившийся вариант.</p><a class="button" href="#/catalog">Открыть каталог</a></div>`}
        </div>
      </section>
    `,
  });

  qsa(".remove-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const index = cart.findIndex((item) => item.id === button.dataset.cartId);
      if (index === -1) return;
      cart.splice(index, 1);
      renderCart();
      setNotice("Вариант удалён из подборки.");
    });
  });
}

async function workspaceContent() {
  const session = await store.session();
  if (store.mode === "supabase" && !session) return renderLogin();

  const records = await store.list("lead");
  return `
    <section class="section">
      <div class="container">
        <div class="split">
          <div>
            <p class="eyebrow">Рабочий экран</p>
            <h1 style="font-size:clamp(38px,6vw,64px)">Заявки</h1>
            <p class="lead">${store.mode === "local"
              ? "Локальные записи видны только в этом браузере."
              : `Вход: ${escapeHtml(session?.user?.email || "владелец")}`}</p>
          </div>
          <div class="inline">
            ${store.mode === "local" ? '<button id="seed-leads" class="button button--secondary">Вернуть демо-данные</button>' : ""}
            ${store.mode === "supabase" ? '<button id="logout" class="button button--secondary">Выйти</button>' : ""}
          </div>
        </div>

        <div class="record-list" style="margin-top:30px">
          ${records.length ? records.map((record) => `
            <article class="record" data-id="${record.id}">
              <div class="split">
                <div>
                  <span class="badge">${escapeHtml(statusLabel(record.status))}</span>
                  <h3 style="margin-top:12px">${escapeHtml(record.payload.name || "Без имени")}</h3>
                  <p><strong>${escapeHtml(record.payload.contact || "Контакт не указан")}</strong></p>
                  <p>${escapeHtml(record.payload.problem || "")}</p>
                  <p class="record-meta">${formatDate(record.created_at)}</p>
                </div>
                <div class="stack" style="min-width:180px">
                  <label>
                    Статус
                    <select class="status-select">
                      ${["new", "contacted", "done"].map((status) => `
                        <option value="${status}" ${record.status === status ? "selected" : ""}>${statusLabel(status)}</option>
                      `).join("")}
                    </select>
                  </label>
                  <button class="archive button button--danger button--small">В архив</button>
                </div>
              </div>
            </article>
          `).join("") : `
            <div class="empty">
              <h3>Заявок пока нет</h3>
              <p>Открой главную и отправь первую тестовую форму.</p>
              <a class="button" href="#/">Открыть форму</a>
            </div>
          `}
        </div>
      </div>
    </section>
  `;
}

async function renderWorkspace() {
  renderShell({
    title: `Заявки — ${project.name}`,
    nav: [...nav("/workspace"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: '<section class="section"><div class="container"><p>Загружаю записи…</p></div></section>',
  });

  qs("#main").innerHTML = await workspaceContent();

  const loginForm = qs("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const error = qs("#login-error");
      try {
        await store.signIn(String(data.get("email")), String(data.get("password")));
        await renderWorkspace();
      } catch (cause) {
        error.textContent = cause instanceof Error ? cause.message : "Не удалось войти";
        error.hidden = false;
      }
    });
    return;
  }

  qs("#seed-leads")?.addEventListener("click", async () => {
    await store.reset("lead", [
      { status: "new", payload: { name: "Анна", contact: "+7 900 000-00-00", problem: "Планируем день рождения на 15 гостей. Нужна фотозона и шары в розово-золотых тонах." } },
      { status: "contacted", payload: { name: "Михаил", contact: "mikhail@example.test", problem: "Ищем оформление для свадьбы: арка, декор стола молодожёнов и композиции на гостевые столы." } },
    ]);
    await renderWorkspace();
  });

  qs("#logout")?.addEventListener("click", async () => {
    await store.signOut();
    await renderWorkspace();
  });

  for (const node of qsa(".record")) {
    const id = node.dataset.id;
    qs(".status-select", node).addEventListener("change", async (event) => {
      try {
        await store.update(id, { status: event.currentTarget.value });
        setNotice("Статус сохранён");
      } catch (cause) {
        setNotice(cause instanceof Error ? cause.message : "Не удалось сохранить", "error");
      }
    });
    qs(".archive", node).addEventListener("click", async () => {
      try {
        await store.archive(id);
        await renderWorkspace();
        setNotice("Заявка отправлена в архив");
      } catch (cause) {
        setNotice(cause instanceof Error ? cause.message : "Не удалось архивировать", "error");
      }
    });
  }
}

async function render() {
  const current = route();
  if (current === "/workspace") return renderWorkspace();
  if (current === "/catalog" || current === "/story") return renderCatalog();
  if (current === "/package") return renderPackage();
  if (current === "/variant") return renderVariant();
  if (current === "/cart") return renderCart();
  if (current === "/styleguide") return renderStyleguide();
  return renderHome();
}

onRouteChange(() => {
  render().catch((error) => {
    console.error(error);
    setNotice(error.message || "Ошибка приложения", "error");
  });
});
