import { project } from "./project.js";
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

const nav = (active) => [
  { href: "#/", label: "Главная", active: active === "/" },
  { href: "#/story", label: "История", active: active === "/story" },
  { href: "#/workspace", label: "Заявки", active: active === "/workspace" },
];

function renderHome() {
  renderShell({
    title: `${project.name} — ${project.title}`,
    nav: [...nav("/"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">${escapeHtml(project.eyebrow)}</p>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="lead">${escapeHtml(project.lead)}</p>
            <div class="actions">
              <a class="button" href="#request">${escapeHtml(project.cta)}</a>
              <a class="button button--secondary" href="#/story">${escapeHtml(project.secondaryCta)}</a>
            </div>
          </div>
          <aside class="panel">
            <span class="badge">Кому подходит</span>
            <h2 style="margin-top:18px;font-size:32px">Один конкретный пользователь</h2>
            <p>${escapeHtml(project.audience)}</p>
            <p class="muted small">Замени этот текст через <code>src/project.js</code> или попроси агента изменить только смысловой слой.</p>
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

      <section id="request" class="section">
        <div class="container grid grid-2">
          <div>
            <p class="eyebrow">Главное действие</p>
            <h2>${escapeHtml(project.form.title)}</h2>
            <p class="lead">${escapeHtml(project.form.note)}</p>
          </div>
          <form id="lead-form" class="panel stack" novalidate>
            <label>
              Имя
              <input name="name" autocomplete="name" maxlength="80" required>
              <span class="help">Как к тебе обращаться.</span>
            </label>
            <label>
              Контакт
              <input name="contact" autocomplete="email" maxlength="120" required>
              <span class="help">Почта или Telegram.</span>
            </label>
            <label>
              Что сейчас не работает
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
    const payload = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      problem: String(data.get("problem") || "").trim(),
    };
    const error = qs("#form-error");

    if (payload.name.length < 2 || payload.contact.length < 3 || payload.problem.length < 10) {
      error.textContent = "Заполни имя, контакт и опиши ситуацию хотя бы одним предложением.";
      error.hidden = false;
      return;
    }

    error.hidden = true;
    const button = qs('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = "Сохраняю…";

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
}

function renderStory() {
  renderShell({
    title: `История — ${project.name}`,
    nav: [...nav("/story"), { href: "#/styleguide", label: "Стиль", active: false }],
    content: `
      <article class="story">
        <section class="story-scene">
          <p class="eyebrow">Пример анимационной статьи</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="lead">Сцены работают даже без анимации. Сначала смысл, потом движение.</p>
        </section>
        ${project.story.map((scene) => `
          <section class="story-scene">
            <span class="story-number">${escapeHtml(scene.label)}</span>
            <h2>${escapeHtml(scene.title)}</h2>
            <p class="lead">${escapeHtml(scene.text)}</p>
            <div class="story-visual" aria-label="${escapeHtml(scene.visual)}">${escapeHtml(scene.visual)}</div>
          </section>
        `).join("")}
        <section class="story-scene">
          <h2>Следующий шаг уже понятен</h2>
          <p class="lead">Вернись на главную и оставь тестовую заявку. Так статья заканчивается действием, а не тупиком.</p>
          <div class="actions"><a class="button" href="#/">Перейти к форме</a></div>
        </section>
      </article>
    `,
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
      { status: "new", payload: { name: "Анна", contact: "@anna_demo", problem: "Заявки теряются между Telegram и таблицей." } },
      { status: "contacted", payload: { name: "Михаил", contact: "mikhail@example.test", problem: "После созвона никто не фиксирует следующий шаг." } },
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
  if (current === "/story") return renderStory();
  if (current === "/styleguide") return renderStyleguide();
  return renderHome();
}

onRouteChange(() => {
  render().catch((error) => {
    console.error(error);
    setNotice(error.message || "Ошибка приложения", "error");
  });
});
