# 🚀 Деплой PPRPG в Discord Activities

## Шаг 1 — GitHub

1. Зайди на **github.com** → войди в аккаунт
2. Нажми **"New repository"** (зелёная кнопка)
3. Название: `pprpg-solaris`
4. Выбери **Public**
5. Нажми **"Create repository"**
6. На следующей странице нажми **"uploading an existing file"**
7. Перетащи ВСЕ файлы из папки PPRPG (index.html, script.js, dungeon.js, lang.js, style.css, dungeon.css и папку assets целиком)
8. Нажми **"Commit changes"**

---

## Шаг 2 — Cloudflare Pages

1. Зайди на **pages.cloudflare.com** → войди / зарегистрируйся (бесплатно)
2. Нажми **"Create a project"** → **"Connect to Git"**
3. Подключи GitHub аккаунт → выбери репозиторий `pprpg-solaris`
4. Настройки сборки:
   - Framework preset: **None**
   - Build command: **(оставь пустым)**
   - Build output directory: **(оставь пустым)**
5. Нажми **"Save and Deploy"**
6. Подожди ~1 минуту → получишь URL вида `pprpg-solaris.pages.dev`
7. **Скопируй этот URL** — он нужен для Discord

---

## Шаг 3 — Discord Developer Portal

1. Зайди на **discord.com/developers/applications**
2. Нажми **"New Application"** → назови **"PPRPG: Solaris Origins"**
3. Нажми **"Create"**
4. Слева в меню найди **"Activities"**
5. Включи переключатель **"Enable Activities"**
6. В поле **"URL Mapping"** → **"/"** вставь свой Cloudflare URL:
   ```
   https://pprpg-solaris.pages.dev
   ```
7. Сохрани

---

## Шаг 4 — Добавить тестировщика

1. В Discord Developer Portal слева → **"App Testers"**
2. Введи Discord username подруги (например `username#0000` или просто username)
3. Она получит уведомление и должна принять приглашение

**Подруга должна:**
- Принять приглашение
- Зайти в Discord → Настройки → Продвинутые → включить **"Application Test Mode"**

---

## Шаг 5 — Запустить активность

1. Зайди в голосовой канал в Discord (в сервере где вы обе)
2. Нажми иконку **ракеты** 🚀 (Activities)
3. В списке появится **PPRPG: Solaris Origins**
4. Запусти — игра откроется прямо в Discord!

---

## ⚠️ Важно

- Без верификации игра работает только в серверах **менее 25 участников**
- Для дня рождения этого хватит с запасом
- CLIENT_ID для SDK: найдёшь на странице приложения в Portal → "OAuth2" → скопируй Application ID
