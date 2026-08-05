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

const CART_KEY = "art_deco_cart_v1";
const SUCCESS_KEY = "art_deco_show_success_v1";

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

const cart = readCart();

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch {
    setNotice("Не удалось сохранить корзину на этом устройстве.", "error");
    return false;
  }
}

function clearCart() {
  cart.length = 0;
  return saveCart();
}

const nav = (active) => [
  { href: "#/", label: "Главная", active: active === "/" },
  { href: "#/about", label: "О нас", active: active === "/about" },
  { href: "#/catalog", label: "Каталог", active: active === "/catalog" },
  { href: "#/cart", label: `Корзина${cart.length ? ` · ${cart.length}` : ""}`, active: active === "/cart" },
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
    setNotice("Этот вариант уже добавлен в корзину.");
    return false;
  }
  cart.push(item);
  if (!saveCart()) {
    cart.pop();
    return false;
  }
  setNotice("Вариант добавлен в корзину.");
  return true;
}

function eventCard(event) {
  return `
    <a class="event-card card-link" href="#/catalog?event=${encodeURIComponent(event.id)}" aria-label="${escapeHtml(event.title)} — выбрать оформление">
      <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}: пример оформления" loading="lazy">
      <div class="event-card__body">
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.text)}</p>
        <span class="text-link">Выбрать оформление <span aria-hidden="true">→</span></span>
      </div>
    </a>
  `;
}

function customEventCard() {
  return `
    <a class="event-card event-card--custom card-link" href="#/request?type=custom" aria-label="Описать другое событие">
      <div class="event-card__symbol" aria-hidden="true">✦</div>
      <div class="event-card__body">
        <h3>Другое событие</h3>
        <p>Корпоратив, выписка из роддома, помолвка или необычная идея — расскажите, что нужно оформить.</p>
        <span class="text-link">Описать свой запрос <span aria-hidden="true">→</span></span>
      </div>
    </a>
  `;
}

function cartSummary() {
  if (!cart.length) return "";
  return `
    <aside class="cart-summary" aria-live="polite">
      <div>
        <span class="badge">Ваша корзина</span>
        <p><strong>${cart.length === 1 ? "Выбран 1 вариант" : `Выбрано вариантов: ${cart.length}`}</strong></p>
        <p class="muted small">${cart.map((item) => escapeHtml(item.name)).join(", ")}</p>
      </div>
      <a class="button" href="#/cart">Перейти к заявке</a>
    </aside>
  `;
}

function renderHome() {
  const current = route();
  const showSuccess = sessionStorage.getItem(SUCCESS_KEY) === "1";
  if (showSuccess) sessionStorage.removeItem(SUCCESS_KEY);
  renderShell({
    title: `${project.name} — ${project.title}`,
    nav: [...nav(current), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="hero hero--decor">
        <div class="container hero-grid">
          <div>
            <p class="hero-brand">Арт-деко</p>
            <p class="eyebrow">${escapeHtml(project.eyebrow)}</p>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="lead">${escapeHtml(project.lead)}</p>
            <div class="actions">
              <a class="button" href="#/catalog">${escapeHtml(project.cta)}</a>
            </div>
          </div>
          <aside class="hero-photo panel">
            <img src="${escapeHtml(project.events[0].image)}" alt="Праздничный декор Арт-деко">
            <div class="hero-photo__caption"><span>Арт-деко</span><strong>Ваш праздник — наша деталь</strong></div>
          </aside>
        </div>
      </section>

      <section class="trust-strip" aria-label="Что берём на себя"><div class="container trust-strip__grid"><p><strong>01</strong><span>Согласуем идею и детали</span></p><p><strong>02</strong><span>Свяжемся с площадкой</span></p><p><strong>03</strong><span>Подготовим и смонтируем декор</span></p></div></section>

      <section id="about" class="section section--soft">
        <div class="container">
          <div class="section-heading">
            <div><p class="eyebrow">О нас</p><h2>Оформление праздника — в одних руках</h2></div>
          </div>
          <div class="grid grid-3">
            ${project.benefits.map((item) => `
              <article class="card">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
              </article>
            `).join("")}
          </div>
          <div class="actions"><a class="button button--secondary" href="#/about">Подробнее о нас</a></div>
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
              ФИО
              <input name="name" autocomplete="name" maxlength="120" required>
              <span class="help">Как к вам обращаться.</span>
            </label>
            <label>
              Номер телефона
              <input name="contact" type="tel" autocomplete="tel" maxlength="30" required>
            </label>
            <label>
              Дата события
              <input name="eventDate" type="date" required>
            </label>
            <label>
              Город
              <input name="city" autocomplete="address-level2" maxlength="100" required>
            </label>
            <label>
              Место проведения
              <input name="venue" autocomplete="street-address" maxlength="200" required>
            </label>
            <label>
              Где вам удобнее ответить
              <select name="messenger" required>
                <option value="">Выберите мессенджер</option>
                <option value="MAX">MAX</option>
                <option value="Telegram">Telegram</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </label>
            <label>
              Пожелания <span class="muted">(необязательно)</span>
              <textarea name="details" maxlength="1200" placeholder="Например: сколько будет гостей? Какая цветовая гамма нравится? Есть ли особенности площадки?"></textarea>
              <span class="help">Можно указать число гостей, любимые цвета и важные детали праздника.</span>
            </label>
            <p id="form-error" class="field-error" hidden></p>
            <button class="button" type="submit">${escapeHtml(project.form.submitLabel)}</button>
          </form>
        </div>
      </section>
      ${showSuccess ? `
        <div class="modal-backdrop" role="presentation">
          <section class="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
            <button id="success-modal-close" class="modal-close" type="button" aria-label="Закрыть окно">×</button>
            <p class="eyebrow">Заявка принята</p>
            <h2 id="success-title">Спасибо за оформление заказа!</h2>
            <p>Заявка сохранена на этом устройстве. Пока сайт работает локально, она ещё не отправлена менеджеру.</p>
            <button id="success-modal-ok" class="button" type="button">Хорошо</button>
          </section>
        </div>
      ` : ""}
    `,
  });

  const closeSuccess = () => qs(".modal-backdrop")?.remove();
  qs("#success-modal-close")?.addEventListener("click", closeSuccess);
  qs("#success-modal-ok")?.addEventListener("click", closeSuccess);

  let submitting = false;
  const submissionId = crypto.randomUUID();
  qs("#lead-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedNames = cart.map((item) => item.name).join(", ");
    const details = String(data.get("details") || "").trim();
    const payload = {
      submissionId,
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      eventDate: String(data.get("eventDate") || ""),
      city: String(data.get("city") || "").trim(),
      venue: String(data.get("venue") || "").trim(),
      messenger: String(data.get("messenger") || ""),
      details,
      selectedVariants: cart.map((item) => ({ id: item.id, name: item.name, price: item.price })),
      problem: `${selectedNames ? `Выбрано: ${selectedNames}. ` : ""}${details}`.trim(),
    };
    const error = qs("#form-error");

    if (payload.name.length < 2 || payload.contact.length < 5 || !payload.eventDate || !payload.city || !payload.venue || !payload.messenger) {
      error.textContent = "Заполните ФИО, телефон, дату, город, место проведения и удобный мессенджер.";
      error.hidden = false;
      return;
    }

    error.hidden = true;
    const button = qs('button[type="submit"]', form);
    submitting = true;
    button.disabled = true;
    button.textContent = "Отправляем…";

    try {
      await store.create("lead", payload, "new");
      form.reset();
      clearCart();
      sessionStorage.setItem(SUCCESS_KEY, "1");
      if (route() === "/") renderHome();
      else location.hash = "#/";
    } catch (cause) {
      error.textContent = cause instanceof Error ? cause.message : "Не удалось сохранить заявку";
      error.hidden = false;
    } finally {
      submitting = false;
      button.disabled = false;
      button.textContent = project.form.submitLabel;
    }
  });

  if (current !== "/request") qs("#request")?.remove();
}

function renderRequest() {
  renderHome();
  const main = qs("#main");
  const request = qs("#request");
  if (!main || !request) return;
  [...main.children].forEach((section) => { if (section !== request) section.remove(); });
  request.classList.add("request-page");
  request.insertAdjacentHTML("afterbegin", `<div class="container request-back"><a class="back-link" href="#/cart">← Вернуться в корзину</a></div>`);
  document.title = `Оформление заявки — ${project.name}`;
}

function floatingCart() {
  return `<a class="floating-cart" href="#/cart" aria-label="Открыть корзину, товаров: ${cart.length}"><span aria-hidden="true">🛒</span> Корзина${cart.length ? `<b>${cart.length}</b>` : ""}</a>`;
}

function carouselMarkup(images, label, autoplay = false) {
  return `<div class="carousel" data-carousel data-autoplay="${autoplay}" aria-label="${escapeHtml(label)}">
    <div class="carousel__viewport" aria-live="polite">
      ${images.map((image, index) => `<figure class="carousel__slide" ${index ? "hidden" : ""} data-slide><img src="${escapeHtml(image)}" alt="${escapeHtml(label)}, фотография ${index + 1}"><figcaption>${index + 1} из ${images.length}</figcaption></figure>`).join("")}
      <button class="carousel__arrow carousel__arrow--prev" type="button" data-carousel-prev aria-label="Предыдущая фотография">←</button>
      <button class="carousel__arrow carousel__arrow--next" type="button" data-carousel-next aria-label="Следующая фотография">→</button>
    </div>
    <div class="carousel__controls"><div class="carousel__dots" aria-label="Выбор фотографии">${images.map((_, index) => `<button type="button" data-carousel-dot="${index}" aria-label="Показать фотографию ${index + 1}" ${index ? "" : 'aria-current="true"'}></button>`).join("")}</div>${autoplay ? '<button class="carousel__pause" type="button" data-carousel-pause>Пауза</button>' : ""}</div>
  </div>`;
}

function bindCarousels() {
  qsa("[data-carousel]").forEach((carousel) => {
    const slides = qsa("[data-slide]", carousel);
    const dots = qsa("[data-carousel-dot]", carousel);
    let active = 0;
    let timer;
    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== active; });
      dots.forEach((dot, dotIndex) => dot.toggleAttribute("aria-current", dotIndex === active));
    };
    const stop = () => window.clearInterval(timer);
    const start = () => { stop(); timer = window.setInterval(() => show(active + 1), 4500); };
    qs("[data-carousel-prev]", carousel)?.addEventListener("click", () => show(active - 1));
    qs("[data-carousel-next]", carousel)?.addEventListener("click", () => show(active + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.carouselDot))));
    const pauseButton = qs("[data-carousel-pause]", carousel);
    if (carousel.dataset.autoplay === "true" && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      start();
      carousel.addEventListener("pointerenter", stop);
      carousel.addEventListener("focusin", stop);
      pauseButton?.addEventListener("click", (event) => {
        const paused = event.currentTarget.textContent === "Продолжить";
        if (paused) { start(); event.currentTarget.textContent = "Пауза"; }
        else { stop(); event.currentTarget.textContent = "Продолжить"; }
      });
    } else if (pauseButton) {
      pauseButton.textContent = "Автопрокрутка выключена";
      pauseButton.disabled = true;
    }
  });
}

function renderAbout() {
  renderShell({
    title: `О нас — ${project.name}`,
    nav: [...nav("/about"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `<section class="section page-intro"><div class="container"><a class="back-link" href="#/">← На главную</a><p class="eyebrow">О компании</p><h1>Создаём оформление, которое собирает праздник в одно целое</h1><p class="lead">Здесь появится история «Арт-деко», опыт команды и фотографии настоящих проектов. Текст можно заменить, когда вы подготовите информацию о компании.</p></div></section>
      <section class="section section--soft"><div class="container">${carouselMarkup(project.events.slice(0, 8).map((event) => event.image), "Работы Арт-деко", true)}</div></section>
      <section class="section"><div class="container grid grid-3">${project.benefits.map((item) => `<article class="card detail-card"><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.text)}</p></article>`).join("")}</div></section>`,
  });
  bindCarousels();
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
          <p class="lead">${activeEvent ? "Варианты отличаются по составу и бюджету. Добавьте понравившийся в корзину — точные детали согласуем позже." : "Нажмите на повод, чтобы увидеть подходящие варианты оформления и цены."}</p>
          ${activeEvent ? '<p class="market-note">Цены «от» — временные ориентиры рынка. Итог зависит от размера, материалов, площадки и даты.</p>' : ""}
          ${activeEvent ? '<a class="back-link" href="#/catalog">← Все поводы</a>' : ""}
        </div>
      </section>
      <section class="section section--soft catalog-section">
        <div class="container">
          ${activeEvent ? `
            ${packages.length ? `<div class="package-grid">
              ${packages.map((item) => `
                <a class="package-card card-link" href="#/package?id=${encodeURIComponent(item.id)}" aria-label="${escapeHtml(item.name)} — посмотреть варианты">
                  <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}: пример оформления" loading="lazy">
                  <div class="package-card__body">
                    <p class="price">${escapeHtml(item.price)}</p>
                    <h2>${escapeHtml(item.name)}</h2>
                    <p>${escapeHtml(item.includes)}</p>
                    <span class="button">Посмотреть варианты</span>
                  </div>
                </a>
              `).join("")}
            </div>${cartSummary()}` : `
              <div class="empty">
                <h2>Для этого раздела пока нет готовых вариантов</h2>
                <p>Расскажите нам о своём празднике — мы предложим оформление под вашу задачу.</p>
                <a class="button" href="#/request?type=custom">Оставить заявку</a>
              </div>
            `}
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
          <a class="back-link" href="#/catalog?event=${encodeURIComponent(selectedPackage.eventId)}">← ${escapeHtml(event?.title || "Каталог")}</a>
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
              <a class="variant-card card-link" href="#/variant?id=${encodeURIComponent(variant.id)}&package=${encodeURIComponent(selectedPackage.id)}" aria-label="${escapeHtml(variant.name)} — посмотреть оформление">
                <img src="${escapeHtml(variant.image)}" alt="${escapeHtml(variant.name)}: место для будущей фотографии">
                <p class="price">${escapeHtml(variant.price)}</p>
                <h3>${escapeHtml(variant.name)}</h3>
                <p>${escapeHtml(variant.includes)}</p>
                <span class="button">Посмотреть оформление</span>
              </a>
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
          <a class="back-link" href="#/package?id=${encodeURIComponent(selectedPackage.id)}">← Все варианты услуги</a>
          <p class="eyebrow">${escapeHtml(detail.heading)}</p>
          <p class="price">${escapeHtml(variant.price)}</p>
          <h1>${escapeHtml(variant.name)}</h1>
          <p class="lead">Посмотрите места для будущих фотографий этого оформления. Финальные цвета, размер и детали согласуем перед заказом.</p>
          <p class="market-note">Цена указана как временный ориентир и не является окончательной сметой.</p>
        </div>
      </section>
      <section class="section section--soft package-details">
        <div class="container">
          <div class="variant-showcase">
            ${carouselMarkup(variant.gallery || detail.gallery, variant.name)}
            <div class="selected-variant panel">
            <div><span class="badge">Выбранный вариант</span><h2 style="margin-top:16px">${escapeHtml(variant.name)}</h2><p>${escapeHtml(variant.includes)}</p></div>
            <button id="add-selected-variant" class="button" type="button">Добавить в корзину</button>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  qs("#add-selected-variant").addEventListener("click", () => {
    addToCart({ ...variant, image: variant.image || selectedPackage.image, packageId: selectedPackage.id });
    renderVariant();
  });
  bindCarousels();
}

function renderCart() {
  renderShell({
    title: `Корзина — ${project.name}`,
    nav: [...nav("/cart"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="section">
        <div class="container">
          <p class="eyebrow">Ваша корзина</p>
          <h1>Выбранные варианты</h1>
          ${cart.length ? `
            <div class="cart-list">
              ${cart.map((item) => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt=""><div><p class="price">${escapeHtml(item.price)}</p><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.includes)}</p></div><button class="remove-cart button button--danger button--small" type="button" data-cart-id="${escapeHtml(item.id)}">Удалить</button></article>`).join("")}
            </div>
            <div class="actions"><a class="button" href="#/request">Оформить заявку</a><a class="button button--secondary" href="#/catalog">Добавить ещё</a></div>
          ` : `<div class="empty"><h2>Корзина пока пуста</h2><p>Выберите праздник в каталоге и добавьте понравившийся вариант.</p><a class="button" href="#/catalog">Открыть каталог</a></div>`}
        </div>
      </section>
    `,
  });

  qsa(".remove-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const index = cart.findIndex((item) => item.id === button.dataset.cartId);
      if (index === -1) return;
      const [removed] = cart.splice(index, 1);
      if (!saveCart()) {
        cart.splice(index, 0, removed);
        renderCart();
        return;
      }
      renderCart();
      setNotice("Вариант удалён из корзины.");
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
  window.scrollTo(0, 0);
  if (current === "/workspace") return renderWorkspace();
  if (current === "/catalog" || current === "/story") renderCatalog();
  else if (current === "/package") renderPackage();
  else if (current === "/variant") renderVariant();
  else if (current === "/cart") renderCart();
  else if (current === "/about") renderAbout();
  else if (current === "/request") renderRequest();
  else if (current === "/styleguide") return renderStyleguide();
  else renderHome();
  qs("#app")?.insertAdjacentHTML("beforeend", floatingCart());
}

onRouteChange(() => {
  render().catch((error) => {
    console.error(error);
    setNotice(error.message || "Ошибка приложения", "error");
  });
});
