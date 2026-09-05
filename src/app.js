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
    setNotice("Не удалось сохранить корзину. Освободите место в браузере и попробуйте добавить вариант ещё раз.", "error");
    return false;
  }
}

const nav = (active) => [
  { href: "#/", label: "Главная", active: active === "/" },
  { href: "#/about", label: "О компании", active: active === "/about" },
  { href: "#/catalog", label: "Каталог", active: active === "/catalog" },
  { href: "#/cart", label: `Корзина${cart.length ? ` · ${cart.length}` : ""}`, active: active === "/cart" },
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
    <a class="event-card event-card--custom card-link" href="#/custom-event" aria-label="Открыть страницу другого события">
      <div class="event-card__symbol" aria-hidden="true">✦</div>
      <div class="event-card__body">
        <h3>Другое событие</h3>
        <p>Корпоратив, выписка из роддома, помолвка или необычная идея — расскажите, что нужно оформить.</p>
        <span class="text-link">Обсудить другое событие <span aria-hidden="true">→</span></span>
      </div>
    </a>
  `;
}

function clearCart() {
  cart.splice(0, cart.length);
  saveCart();
}

function callPanel() {
  return `
    <aside class="call-panel panel" aria-labelledby="call-title">
      <div>
        <p class="eyebrow">Связь с декоратором</p>
        <h2 id="call-title">Позвоните, чтобы обсудить оформление</h2>
        <p>Назовите выбранные варианты — уточним свободную дату, размеры, состав и итоговую стоимость.</p>
      </div>
      <div class="call-panel__actions">
        <a class="phone-link" href="${escapeHtml(project.phone.href)}">${escapeHtml(project.phone.display)}</a>
        <a class="button" href="${escapeHtml(project.phone.href)}">Позвонить сейчас</a>
        <a class="button button--secondary" href="#/request">Заполнить данные заказа</a>
      </div>
    </aside>
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
      <a class="button" href="#/cart">Открыть корзину</a>
    </aside>
  `;
}

function renderHome() {
  const current = route();
  renderShell({
    title: `${project.name} — ${project.title}`,
    nav: nav(current),
    content: `
      <section class="hero hero--company" aria-labelledby="home-title">
        <div class="container company-grid">
          <div class="company-intro">
            <p class="eyebrow">Знакомьтесь, Арт-деко</p>
            <h1 id="home-title">${escapeHtml(project.company.title)}</h1>
            <p class="lead">${escapeHtml(project.company.description)}</p>
            <div class="company-experience"><span aria-hidden="true">✦</span> ${escapeHtml(project.company.experience)}</div>
            <p class="company-geography">${escapeHtml(project.company.geography)}</p>
            <div class="hero-primary-action">
              <div class="company-actions">
                <a class="button" href="#/catalog">${escapeHtml(project.cta)}</a>
                <a class="button button--company" href="#/about">О компании <span aria-hidden="true">→</span></a>
              </div>
              <a class="hero-contact" href="${escapeHtml(project.phone.href)}">
                <span class="hero-contact__symbol" aria-hidden="true">✦</span>
                <span class="hero-contact__text">
                  <small>Позвоните — обсудим ваш праздник</small>
                  <strong>${escapeHtml(project.phone.display)}</strong>
                </span>
              </a>
            </div>
          </div>
          <section class="home-works" aria-labelledby="home-works-title">
            <div class="home-works__heading"><h2 id="home-works-title">Недавние работы</h2><span>Сделано с любовью</span></div>
            ${carouselMarkup(project.recentWorks, "Недавние работы Арт-деко", true, 4000)}
          </section>
        </div>
      </section>

      <section class="trust-strip" aria-label="Что берём на себя"><div class="container trust-strip__grid"><p><strong>01</strong><span>Согласуем идею и детали</span></p><p><strong>02</strong><span>Свяжемся с площадкой</span></p><p><strong>03</strong><span>Подготовим и смонтируем декор</span></p></div></section>

      <section id="about" class="section section--soft">
        <div class="container">
          <div class="section-heading">
            <div><p class="eyebrow">О компании</p><h2>Оформление праздника — в одних руках</h2></div>
          </div>
          <div class="grid grid-3">
            ${project.benefits.map((item) => `
              <article class="card">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.text)}</p>
              </article>
            `).join("")}
          </div>
          <div class="actions"><a class="button button--secondary" href="#/about">Подробнее о компании</a></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Каталог</p>
              <h2>Какой праздник вы планируете?</h2>
            </div>
          </div>
          <div class="event-grid">
            ${project.events.slice(0, 3).map(eventCard).join("")}
          </div>
          <div class="catalog-more"><a class="button button--secondary" href="#/catalog">Перейти в каталог</a></div>
        </div>
      </section>

    `,
  });
  bindCarousels();

}

function floatingCart() {
  return `<a class="floating-cart" href="#/cart" aria-label="Открыть корзину, товаров: ${cart.length}"><span aria-hidden="true">🛒</span> Корзина${cart.length ? `<b>${cart.length}</b>` : ""}</a>`;
}

function mountFloatingCart() {
  qs(".floating-cart")?.remove();
  if (route() === "/request" || !cart.length) return;
  qs("#app")?.insertAdjacentHTML("beforeend", floatingCart());
}

function renderMissingPage(title, message) {
  renderShell({
    title: `${title} — ${project.name}`,
    nav: nav("/catalog"),
    content: `<section class="section"><div class="container"><a class="back-link" href="#/catalog">← Вернуться в каталог</a><div class="empty"><span class="empty__symbol" aria-hidden="true">✦</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><a class="button" href="#/catalog">Выбрать праздник</a></div></div></section>`,
  });
}

function carouselMarkup(images, label, autoplay = false, interval = 4500) {
  return `<div class="carousel" data-carousel data-autoplay="${autoplay}" data-interval="${interval}" role="region" aria-roledescription="карусель" aria-label="${escapeHtml(label)}">
    <div class="carousel__viewport" aria-live="${autoplay ? "off" : "polite"}">
      ${images.map((image, index) => {
        const photo = typeof image === "string" ? { src: image, alt: `${label}, фотография ${index + 1}` } : image;
        return `<figure class="carousel__slide" ${index ? "hidden" : ""} data-slide role="group" aria-roledescription="слайд" aria-label="${index + 1} из ${images.length}"><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" decoding="async" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`;
      }).join("")}
      <button class="carousel__arrow carousel__arrow--prev" type="button" data-carousel-prev aria-label="Предыдущая фотография">←</button>
      <button class="carousel__arrow carousel__arrow--next" type="button" data-carousel-next aria-label="Следующая фотография">→</button>
    </div>
    <div class="carousel__controls"><div class="carousel__dots" aria-label="Выбор фотографии">${images.map((_, index) => `<button type="button" data-carousel-dot="${index}" aria-label="Показать фотографию ${index + 1}" ${index ? "" : 'aria-current="true"'}></button>`).join("")}</div>${autoplay ? '<button class="carousel__pause" type="button" data-carousel-pause>Пауза</button>' : ""}</div>
  </div>`;
}

let disposeCarousels = () => {};

function bindCarousels() {
  disposeCarousels();
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const cleanups = [];
  qsa("[data-carousel]").forEach((carousel) => {
    const slides = qsa("[data-slide]", carousel);
    const dots = qsa("[data-carousel-dot]", carousel);
    if (!slides.length) return;
    const viewport = qs(".carousel__viewport", carousel);
    const pauseButton = qs("[data-carousel-pause]", carousel);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const autoplay = carousel.dataset.autoplay === "true" && slides.length > 1;
    let active = 0;
    let timer;
    let paused = motion.matches;
    let hovered = false;
    const stop = () => window.clearInterval(timer);
    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== active; });
      dots.forEach((dot, dotIndex) => {
        if (dotIndex === active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      // Load the next photograph before its turn, including on a slow connection.
      qs("img", slides[(active + 1) % slides.length]).loading = "eager";
    };
    const sync = () => {
      stop();
      const running = autoplay && !paused && !hovered && !document.hidden;
      viewport.setAttribute("aria-live", running ? "off" : "polite");
      if (pauseButton) pauseButton.textContent = paused ? "Продолжить" : "Пауза";
      if (running) timer = window.setInterval(() => show(active + 1), Number(carousel.dataset.interval));
    };
    const select = (index) => { show(index); sync(); };
    qs("[data-carousel-prev]", carousel)?.addEventListener("click", () => select(active - 1), options);
    qs("[data-carousel-next]", carousel)?.addEventListener("click", () => select(active + 1), options);
    dots.forEach((dot) => dot.addEventListener("click", () => select(Number(dot.dataset.carouselDot)), options));
    if (autoplay) {
      carousel.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") { hovered = true; sync(); }
      }, options);
      carousel.addEventListener("pointerleave", () => { hovered = false; sync(); }, options);
      carousel.addEventListener("focusin", (event) => {
        if (!carousel.contains(event.relatedTarget) && event.target !== pauseButton) { paused = true; sync(); }
      }, options);
      pauseButton?.addEventListener("click", () => { paused = !paused; sync(); }, options);
      document.addEventListener("visibilitychange", sync, options);
      motion.addEventListener("change", () => { paused = motion.matches; sync(); }, options);
    }
    show(0);
    sync();
    cleanups.push(stop);
  });
  disposeCarousels = () => { listeners.abort(); cleanups.forEach((stop) => stop()); };
}

function renderAbout() {
  renderShell({
    title: `О компании — ${project.name}`,
    nav: nav("/about"),
    content: `
      <section class="section about-hero page-intro">
        <div class="container">
          <a class="back-link" href="#/">← На главную</a>
          <div class="about-hero__grid">
            <figure class="about-decorator-photo">
              <img src="${escapeHtml(project.about.decoratorPhoto)}" alt="${escapeHtml(project.about.decoratorPhotoAlt)}">
            </figure>
            <div class="about-hero__copy">
              <p class="eyebrow">${escapeHtml(project.about.decoratorEyebrow)}</p>
              <h1>${escapeHtml(project.about.decoratorTitle)}</h1>
              <p class="lead">${escapeHtml(project.about.decoratorText)}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--soft about-recent" aria-labelledby="recent-work-title">
        <div class="container about-recent__grid">
          <div class="about-section-copy">
            <p class="eyebrow">Новые проекты</p>
            <h2 id="recent-work-title">${escapeHtml(project.about.recentTitle)}</h2>
            <p class="lead">${escapeHtml(project.about.recentText)}</p>
            <a class="button button--secondary" href="#/catalog">Посмотреть каталог</a>
          </div>
          ${carouselMarkup(project.about.recentWorks, "Последние работы Арт-деко", true, 4000)}
        </div>
      </section>

      <section class="section about-general" aria-labelledby="company-info-title">
        <div class="container">
          <div class="about-general__heading">
            <p class="eyebrow">Арт-деко</p>
            <h2 id="company-info-title">${escapeHtml(project.about.generalTitle)}</h2>
          </div>
          <div class="about-general__grid">
            <div class="about-general__copy">
              ${project.about.generalText.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              <div class="company-experience"><span aria-hidden="true">✦</span> ${escapeHtml(project.company.experience)}</div>
              <p class="company-geography">${escapeHtml(project.company.geography)}</p>
            </div>
            ${carouselMarkup(project.about.gallery, "Другие работы Арт-деко", true, 5000)}
          </div>
        </div>
      </section>
    `,
  });
  bindCarousels();
}

function renderCustomEvent() {
  renderShell({
    title: `Другое событие — ${project.name}`,
    nav: nav("/catalog"),
    content: `
      <section class="section page-intro">
        <div class="container">
          <a class="back-link" href="#/catalog">← Вернуться в каталог</a>
          <p class="eyebrow">Другое событие</p>
          <h1>Расскажите о празднике по телефону</h1>
          <p class="lead">Если подходящего повода нет в каталоге, позвоните декоратору. Обсудим вашу идею, дату и подходящий вариант оформления.</p>
        </div>
      </section>
      <section class="section section--soft">
        <div class="container">${callPanel()}</div>
      </section>
    `,
  });
}

function renderCatalog() {
  const eventId = selectedEventId();
  const activeEvent = project.events.find((event) => event.id === eventId);
  const packages = activeEvent ? project.packages.filter((item) => item.eventId === activeEvent.id) : [];

  if (eventId && !activeEvent) {
    renderMissingPage("Праздник не найден", "Возможно, ссылка устарела. Откройте каталог и выберите подходящий повод.");
    return;
  }

  renderShell({
    title: `Каталог — ${project.name}`,
    nav: nav("/catalog"),
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
                    <span class="card-link__action">Открыть варианты <span aria-hidden="true">→</span></span>
                  </div>
                </a>
              `).join("")}
            </div>${cartSummary()}` : `
              <div class="empty">
                <span class="empty__symbol" aria-hidden="true">✦</span>
                <h2>Для этого раздела пока нет готовых вариантов</h2>
                <p>Позвоните нам — обсудим праздник и предложим оформление под вашу задачу.</p>
                <a class="button" href="${escapeHtml(project.phone.href)}">Позвонить ${escapeHtml(project.phone.display)}</a>
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
    renderMissingPage("Услуга не найдена", "Возможно, ссылка устарела. В каталоге можно выбрать доступный вариант оформления.");
    return;
  }

  const event = project.events.find((item) => item.id === selectedPackage.eventId);
  renderShell({
    title: `${detail.heading} — ${project.name}`,
    nav: nav("/catalog"),
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
                <span class="card-link__action">Открыть оформление <span aria-hidden="true">→</span></span>
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
    renderMissingPage("Вариант не найден", "Возможно, ссылка устарела. Вернитесь в каталог и выберите другое оформление.");
    return;
  }

  renderShell({
    title: `${variant.name} — ${project.name}`,
    nav: nav("/catalog"),
    content: `
      <section class="section package-hero">
        <div class="container">
          <a class="back-link" href="#/package?id=${encodeURIComponent(selectedPackage.id)}">← К вариантам оформления</a>
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
    const added = addToCart({ ...variant, image: variant.image || selectedPackage.image, packageId: selectedPackage.id });
    if (!added) return;
    renderVariant();
    mountFloatingCart();
    setNotice("Вариант добавлен в корзину.");
  });
  bindCarousels();
}

function renderCart() {
  renderShell({
    title: `Корзина — ${project.name}`,
    nav: nav("/cart"),
    content: `
      <section class="section">
        <div class="container">
          <p class="eyebrow">Ваша корзина</p>
          <h1>Выбранные варианты</h1>
          ${cart.length ? `
            <div class="cart-list">
              ${cart.map((item) => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}: выбранное оформление"><div><p class="price">${escapeHtml(item.price)}</p><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.includes)}</p></div><button class="remove-cart button button--danger button--small" type="button" data-cart-id="${escapeHtml(item.id)}" aria-label="Удалить ${escapeHtml(item.name)} из корзины">Удалить вариант</button></article>`).join("")}
            </div>
            ${callPanel()}
            <div class="actions"><a class="button button--secondary" href="#/catalog">Выбрать ещё оформление</a></div>
          ` : `<div class="empty"><span class="empty__symbol" aria-hidden="true">✦</span><h2>Корзина пока пуста</h2><p>Выберите праздник в каталоге или расскажите о своём событии.</p><div class="actions actions--center"><a class="button" href="#/catalog">Открыть каталог</a><a class="button button--secondary" href="#/request?type=custom">Заказать индивидуальное оформление</a></div></div>`}
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
      mountFloatingCart();
      setNotice("Вариант удалён из корзины.");
    });
  });
}

function renderRequest(showSuccess = false) {
  const customRequest = selectedParam("type") === "custom";
  renderShell({
    title: `Оформление заказа — ${project.name}`,
    nav: nav("/request"),
    content: `
      <section class="section request-page">
        <div class="container request-back"><a class="back-link" href="#/cart">← Вернуться в корзину</a></div>
        <div class="container grid grid-2 request-layout">
          <div>
            <p class="eyebrow">Карточка заказа</p>
            <h1>${customRequest ? "Расскажите о вашем событии" : escapeHtml(project.form.title)}</h1>
            <p class="lead">${customRequest ? "Укажите основные сведения о празднике — по ним будет проще обсудить идею и рассчитать оформление." : escapeHtml(project.form.note)}</p>
            ${cart.length ? `<p class="selection-note"><strong>Выбрано:</strong> ${cart.map((item) => escapeHtml(item.name)).join(", ")}</p>` : '<p class="selection-note">Готовый вариант можно не выбирать: опишите идею в поле «Пожелания».</p>'}
            <p class="local-data-note">В этой версии карточка сохраняется только на вашем устройстве. Чтобы сразу связаться с декоратором, позвоните по номеру <a href="${escapeHtml(project.phone.href)}">${escapeHtml(project.phone.display)}</a>.</p>
          </div>
          <form id="lead-form" class="panel stack" novalidate>
            <p class="form-required-note"><span aria-hidden="true">*</span> Обязательные поля</p>
            <label><span class="field-label">Имя и фамилия <span class="required-mark" aria-hidden="true">*</span></span><input id="lead-name" name="name" autocomplete="name" maxlength="120" aria-describedby="name-help name-error" required><span id="name-help" class="help">Как к вам обращаться.</span><span id="name-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Номер телефона <span class="required-mark" aria-hidden="true">*</span></span><input id="lead-contact" name="contact" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" placeholder="Например, +7 999 123-45-67" aria-describedby="contact-help contact-error" required><span id="contact-help" class="help">Для согласования деталей оформления.</span><span id="contact-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Дата события <span class="required-mark" aria-hidden="true">*</span></span><input id="lead-date" name="eventDate" type="date" aria-describedby="eventDate-error" required><span id="eventDate-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Город <span class="required-mark" aria-hidden="true">*</span></span><input id="lead-city" name="city" autocomplete="address-level2" maxlength="100" aria-describedby="city-error" required><span id="city-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Место проведения <span class="required-mark" aria-hidden="true">*</span></span><input id="lead-venue" name="venue" autocomplete="street-address" maxlength="200" placeholder="Название площадки или адрес" aria-describedby="venue-help venue-error" required><span id="venue-help" class="help">Если площадка ещё не выбрана, напишите «Не выбрано».</span><span id="venue-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Удобный мессенджер <span class="required-mark" aria-hidden="true">*</span></span><select id="lead-messenger" name="messenger" aria-describedby="messenger-help messenger-error" required><option value="">Выберите мессенджер</option><option value="MAX">MAX</option><option value="Telegram">Telegram</option><option value="WhatsApp">WhatsApp</option></select><span id="messenger-help" class="help">Укажите, где вам удобнее получить ответ.</span><span id="messenger-error" class="field-error field-error--inline" hidden></span></label>
            <label><span class="field-label">Пожелания <span class="muted">(необязательно)</span></span><textarea name="details" maxlength="1200" placeholder="Например: число гостей, цвета, стиль и особенности площадки"></textarea><span class="help">Расскажите всё, что важно учесть при оформлении.</span></label>
            <p id="form-error" class="form-error-summary" role="alert" tabindex="-1" hidden></p>
            <button class="button" type="submit">${store.mode === "local" ? "Сохранить данные заказа" : escapeHtml(project.form.submitLabel)}</button>
          </form>
        </div>
      </section>
      ${showSuccess ? `<div class="modal-backdrop" role="presentation"><section class="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title"><button id="success-modal-close" class="modal-close" type="button" aria-label="Закрыть окно">×</button><p class="eyebrow">Карточка сохранена</p><h2 id="success-title">Данные заказа сохранены</h2><p>${store.mode === "local" ? "Они доступны только в этом браузере и пока не отправлены декоратору." : "Заявка отправлена. Декоратор свяжется с вами, чтобы уточнить детали."}</p><div class="actions"><a class="button" href="${escapeHtml(project.phone.href)}">Позвонить сейчас</a><a class="button button--secondary" href="#/">На главную</a></div></section></div>` : ""}
    `,
  });

  const closeSuccess = () => qs(".modal-backdrop")?.remove();
  qs("#success-modal-close")?.addEventListener("click", closeSuccess);
  if (showSuccess) qs("#success-modal-close")?.focus();

  const form = qs("#lead-form");
  const dateField = qs('[name="eventDate"]', form);
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateField.min = localToday;

  const clearFieldError = (field) => {
    field.removeAttribute("aria-invalid");
    const fieldError = qs(`#${field.name}-error`, form);
    if (fieldError) { fieldError.textContent = ""; fieldError.hidden = true; }
  };
  qsa("input, select, textarea", form).forEach((field) => field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => clearFieldError(field)));

  let submitting = false;
  const submissionId = crypto.randomUUID();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(form);
    const details = String(data.get("details") || "").trim();
    const selectedNames = cart.map((item) => item.name).join(", ");
    const payload = {
      submissionId,
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      eventDate: String(data.get("eventDate") || ""),
      city: String(data.get("city") || "").trim(),
      venue: String(data.get("venue") || "").trim(),
      messenger: String(data.get("messenger") || ""),
      details,
      selectedVariants: cart.map(({ id, name, price }) => ({ id, name, price })),
      problem: `${selectedNames ? `Выбрано: ${selectedNames}. ` : ""}${details}`.trim(),
    };
    const summary = qs("#form-error", form);
    qsa("[aria-invalid]", form).forEach(clearFieldError);
    summary.hidden = true;
    const errors = [];
    if (payload.name.length < 2) errors.push(["name", "Введите имя — не меньше 2 символов."]);
    if (payload.contact.replace(/\D/g, "").length < 5) errors.push(["contact", "Укажите номер телефона — не меньше 5 цифр."]);
    if (!payload.eventDate) errors.push(["eventDate", "Выберите дату события."]);
    else if (payload.eventDate < localToday) errors.push(["eventDate", "Выберите сегодняшнюю или будущую дату."]);
    if (!payload.city) errors.push(["city", "Укажите город проведения."]);
    if (!payload.venue) errors.push(["venue", "Укажите площадку, адрес или напишите «Не выбрано»."]);
    if (!payload.messenger) errors.push(["messenger", "Выберите удобный мессенджер."]);
    if (errors.length) {
      errors.forEach(([name, message]) => {
        const field = qs(`[name="${name}"]`, form);
        const fieldError = qs(`#${name}-error`, form);
        field.setAttribute("aria-invalid", "true");
        fieldError.textContent = message;
        fieldError.hidden = false;
      });
      summary.textContent = "Проверьте выделенные поля — рядом указано, что исправить.";
      summary.hidden = false;
      qs("[aria-invalid]", form)?.focus();
      return;
    }

    const button = qs('button[type="submit"]', form);
    const submitLabel = button.textContent;
    submitting = true;
    button.disabled = true;
    button.textContent = store.mode === "local" ? "Сохраняем…" : "Отправляем…";
    try {
      await store.create("lead", payload, "new");
      clearCart();
      renderRequest(true);
    } catch {
      summary.textContent = store.mode === "local" ? "Не удалось сохранить карточку. Данные остались в форме — освободите место в браузере и попробуйте ещё раз." : "Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз.";
      summary.hidden = false;
      summary.focus();
      submitting = false;
      button.disabled = false;
      button.textContent = submitLabel;
    }
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
                  <dl class="record-details">
                    ${record.payload.eventDate ? `<div><dt>Дата</dt><dd>${escapeHtml(record.payload.eventDate)}</dd></div>` : ""}
                    ${record.payload.city ? `<div><dt>Город</dt><dd>${escapeHtml(record.payload.city)}</dd></div>` : ""}
                    ${record.payload.venue ? `<div><dt>Площадка</dt><dd>${escapeHtml(record.payload.venue)}</dd></div>` : ""}
                    ${record.payload.messenger ? `<div><dt>Мессенджер</dt><dd>${escapeHtml(record.payload.messenger)}</dd></div>` : ""}
                  </dl>
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
                  <button class="archive button button--danger button--small">Переместить в архив</button>
                </div>
              </div>
            </article>
          `).join("") : `
            <div class="empty">
              <span class="empty__symbol" aria-hidden="true">✦</span>
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
    nav: nav("/workspace"),
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
  disposeCarousels();
  const current = route();
  window.scrollTo(0, 0);
  if (current === "/workspace") return renderWorkspace();
  if (current === "/catalog" || current === "/story") renderCatalog();
  else if (current === "/package") renderPackage();
  else if (current === "/variant") renderVariant();
  else if (current === "/cart") renderCart();
  else if (current === "/about") renderAbout();
  else if (current === "/custom-event") renderCustomEvent();
  else if (current === "/request") renderRequest();
  else if (current === "/styleguide") return renderStyleguide();
  else renderHome();
  mountFloatingCart();
}

onRouteChange(() => {
  render().catch((error) => {
    console.error(error);
    setNotice(error.message || "Ошибка приложения", "error");
  });
});

qs(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  const main = qs("#main");
  main?.focus();
  main?.scrollIntoView({ block: "start" });
});
