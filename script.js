document.addEventListener("DOMContentLoaded", () => {
  updateNavigation();
  loadEntries();
  setupLinks();
  setupGalaxy();
});

function setupLinks() {
  document.querySelectorAll("a[href]").forEach(link => {
    if (link.hostname === location.hostname) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => location.href = this.href, 500);
      });
    }
  });
}

function setupGalaxy() {
  if (document.getElementById("galaxy-bg")) return;

  let bg = document.createElement("div");
  bg.id = "galaxy-bg";

  bg.innerHTML = `
    <div class="star-layer layer1"></div>
    <div class="star-layer layer2"></div>
    <div class="star-layer layer3"></div>
  `;

  document.body.prepend(bg);
}

function updateNavigation() {
  const nav = document.getElementById("navArea");
  if (!nav) return;

  const navLeft = document.querySelector(".nav-left .main-nav");
  const user = localStorage.getItem("currentUser");

  if (user) {

    if (!document.getElementById("diaryBtn") && navLeft) {
      const diaryLink = document.createElement("a");
      diaryLink.href = "diary.html";
      diaryLink.id = "diaryBtn";
      diaryLink.innerText = "Мой дневник";
      navLeft.appendChild(diaryLink);
    }

    nav.innerHTML = `<a href="#" class="nav-btn" onclick="logout()">Выйти</a>`;

  } else {

    const diaryBtn = document.getElementById("diaryBtn");
    if (diaryBtn) diaryBtn.remove();

    nav.innerHTML = `<a href="auth.html" class="nav-btn">Войти</a>`;
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function register() {
  const u = document.getElementById("regUsername")?.value.trim();
  const p = document.getElementById("regPassword")?.value.trim();

  if (!u || !p) {
    return showToast("Заполните все поля");
  }

  if (p.length < 8) {
    return showToast("Пароль минимум 8 символов");
  }

  // Проверка телефона
  const phonePattern = /^(\+7|7|8)\d{10}$/;

  // Проверка почты
  const emailPattern = /^[^\s@]+@(mail\.ru|gmail\.com)$/;

  if (!phonePattern.test(u) && !emailPattern.test(u)) {
    return showToast("Введите номер (+7,7,8) или почту @mail.ru / @gmail.com");
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(x => x.username === u)) {
    return showToast("Пользователь уже существует");
  }

  users.push({ username: u, password: p });

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", u);

  showToast("Аккаунт создан 🚀");

  setTimeout(() => {
    window.location = "diary.html";
  }, 1200);
}

function login() {
  const u = document.getElementById("loginUsername")?.value.trim();
  const p = document.getElementById("loginPassword")?.value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(x => x.username === u && x.password === p);

  if (!user) {
    return showToast("Неверные данные");
  }

  localStorage.setItem("currentUser", u);

  showToast("Добро пожаловать 🚀");

  setTimeout(() => {
    window.location = "diary.html";
  }, 1200);
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location = "index.html";
}

function addEntry() {
  let user = localStorage.getItem("currentUser");
  if (!user) return;

  let title = document.getElementById("title")?.value;
  let date = document.getElementById("eventDate")?.value;
  let content = document.getElementById("content")?.value;

  if (!title || !date || !content) {
    return showToast("Заполните все поля");
  }

  let entries = JSON.parse(localStorage.getItem(user)) || [];

  entries.unshift({
    title,
    date,
    content
  });

  localStorage.setItem(user, JSON.stringify(entries));

  showToast("Запись сохранена 🌌");

  loadEntries();
}

function loadEntries() {
  let user = localStorage.getItem("currentUser");
  let container = document.getElementById("entries");

  if (!user || !container) return;

  let entries = JSON.parse(localStorage.getItem(user)) || [];

  container.innerHTML = "";

  entries.forEach((e, i) => {

    container.innerHTML += `
      <div class="entry">
        <h3>${e.title}</h3>
        <p>${e.content}</p>
        <small>${new Date(e.date).toLocaleString()}</small>
        <button onclick="deleteEntry(${i})">Удалить</button>
      </div>
    `;

  });
}

function deleteEntry(i) {
  let user = localStorage.getItem("currentUser");

  let entries = JSON.parse(localStorage.getItem(user)) || [];

  entries.splice(i, 1);

  localStorage.setItem(user, JSON.stringify(entries));

  showToast("Запись удалена");

  loadEntries();
}
