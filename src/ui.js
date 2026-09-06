import { project } from "./project.js";

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

function socialIcon(id) {
  if (id === "instagram") {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.7" r="1"></circle></svg>`;
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3.8 10.6c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.1c.2.7.1 1 .9 1 .6 0 .9-.3 1.2-.6l2.1-2 4.5 3.3c.8.5 1.4.2 1.6-.8L23 5.4C23.3 4.2 22.5 3.6 21 4Z"></path><path d="m9 13.2 9.3-5.8" class="social-icon__line"></path></svg>`;
}

export function renderSocials() {
  return project.socials.map((social) => {
    const content = `${socialIcon(social.id)}<span>${escapeHtml(social.label)}</span>`;
    if (!social.url) return `<span class="social-link social-link--pending" title="Ссылка будет добавлена" aria-label="${escapeHtml(social.label)}: ссылка будет добавлена">${content}</span>`;
    return `<a class="social-link" href="${escapeHtml(social.url)}" target="_blank" rel="noreferrer" aria-label="Открыть ${escapeHtml(social.label)} Арт-деко">${content}</a>`;
  }).join("");
}

export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function setNotice(message, type = "success") {
  const node = qs("#global-notice");
  if (!node) return;
  node.textContent = message;
  node.className = `notice notice--${type}`;
  node.setAttribute("role", type === "error" ? "alert" : "status");
  node.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  node.hidden = false;
  window.clearTimeout(window.__aircNoticeTimer);
  window.__aircNoticeTimer = window.setTimeout(() => {
    node.hidden = true;
  }, 4500);
}

export function renderShell({ title, nav, content }) {
  document.title = title;
  const root = qs("#app");
  root.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="Арт-деко — на главную">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-name">Арт-деко</span>
      </a>
      <nav class="nav" aria-label="Главная навигация">
        ${nav.map((item) => `<a href="${item.href}" ${item.active ? 'aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`).join("")}
      </nav>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <div id="global-notice" class="notice" hidden role="status" aria-live="polite"></div>
    <footer class="site-footer">
      <span>Арт-деко · декор для особенных событий</span>
      <div class="social-links" aria-label="Социальные сети Арт-деко">${renderSocials()}</div>
    </footer>
  `;
}

export function route() {
  const cleanPath = location.pathname.replace(/\/+$/, "") || "/";
  if (!location.hash && ["/privacy", "/personal-data-consent"].includes(cleanPath)) return cleanPath;
  const hash = location.hash.replace(/^#/, "") || "/";
  return hash.split("?")[0];
}

export function onRouteChange(callback) {
  addEventListener("hashchange", callback);
  callback();
}

export function statusLabel(status) {
  return ({
    new: "Новая",
    in_progress: "В работе",
    done: "Готово",
    archived: "Архив",
    contacted: "Связались",
    proposal: "Предложение",
    won: "Договорились",
    lost: "Закрыто",
    blocked: "Заблокировано",
  })[status] || status;
}

export function renderLogin() {
  return `
    <section class="panel narrow">
      <p class="eyebrow">Внутренний экран</p>
      <h1>Войди как владелец</h1>
      <p class="lead">В локальном режиме вход не нужен. Эта форма появляется, когда включён Supabase.</p>
      <form id="login-form" class="stack">
        <label>Почта<input name="email" type="email" autocomplete="username" required></label>
        <label>Пароль<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="button" type="submit">Войти в рабочее пространство</button>
        <p id="login-error" class="field-error" hidden></p>
      </form>
    </section>
  `;
}
