# 🤖 Установка Telegram бота — Полная инструкция

## ✅ Что создано:

1. **`TELEGRAM_BOT_GUIDE.md`** — Инструкция по созданию бота через @BotFather
2. **`lib/telegram-bot.ts`** — Логика бота (команды, меню, интеграция с Prisma)
3. **`app/api/telegram/webhook/route.ts`** — Webhook endpoint для получения сообщений
4. **`scripts/setup-telegram-webhook.ts`** — Скрипт настройки webhook
5. Обновлён **`.env.local`** — добавлена переменная `TELEGRAM_BOT_TOKEN`
6. Обновлён **`package.json`** — добавлена библиотека `grammy`

---

## 📋 Шаг 1: Создай бота

Следуй инструкции в файле **`TELEGRAM_BOT_GUIDE.md`**.

Кратко:
1. Открой Telegram → Найди **@BotFather**
2. Отправь `/newbot`
3. Задай имя: **A-Frame KG**
4. Задай username: **aframe_kg_bot** (или другой)
5. **Скопируй токен!**

Пример токена:
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
```

---

## 📋 Шаг 2: Добавь токен в проект

Открой файл **`.env.local`** и замени:

```env
TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN_HERE"
```

На свой токен:

```env
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789"
```

---

## 📋 Шаг 3: Установи зависимости

Открой **CMD** (не PowerShell!) и выполни:

```cmd
cd C:\Users\ASUS\OneDrive\Desktop\a-frame
npm install
```

Будет установлена библиотека **`grammy`** для работы с Telegram Bot API.

---

## 📋 Шаг 4: Настрой публичный URL (для webhook)

### Вариант А: Локальная разработка через ngrok

Если разрабатываешь локально, нужен публичный URL для webhook.

1. **Скачай ngrok:** https://ngrok.com/download
2. **Зарегистрируйся** на ngrok.com
3. **Получи authtoken** и установи:
   ```cmd
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```
4. **Запусти туннель:**
   ```cmd
   ngrok http 3000
   ```
5. **Скопируй HTTPS URL** (например: `https://abc123.ngrok.io`)
6. **Обнови `.env.local`:**
   ```env
   NEXT_PUBLIC_APP_URL="https://abc123.ngrok.io"
   ```

### Вариант Б: Production (Vercel/Heroku/VPS)

Если деплоишь на сервер:
```env
NEXT_PUBLIC_APP_URL="https://aframe.kg"
```

---

## 📋 Шаг 5: Запусти приложение

```cmd
npm run dev
```

Приложение запустится на http://localhost:3000

---

## 📋 Шаг 6: Установи webhook

В новом окне CMD выполни:

```cmd
npm run telegram:setup
```

**Вывод должен быть:**
```
🔧 Настройка Telegram Webhook...
📡 Webhook URL: https://abc123.ngrok.io/api/telegram/webhook

✅ Webhook установлен успешно!
📩 Описание: Webhook was set

📊 Информация о webhook:
   URL: https://abc123.ngrok.io/api/telegram/webhook
   Pending updates: 0
```

---

## 📋 Шаг 7: Проверь работу бота

1. Открой Telegram
2. Найди своего бота: **@aframe_kg_bot**
3. Нажми **Start** или отправь `/start`

Должен прийти ответ с кнопками:
```
🏠 Добро пожаловать в A-Frame KG!

Найдите уютный домик для отдыха в горах Кыргызстана.

Выберите действие:
[🔍 Поиск домиков] [⭐ Популярные] [📍 По регионам]
[📅 Мои бронирования] [❤️ Избранное]
```

---

## 🎮 Доступные команды бота:

```
/start          - Главное меню с кнопками
/search         - Поиск домиков по регионам
/mybookings     - Мои бронирования
/help           - Справка
/contact        - Контакты
```

---

## 🔧 Что делает бот:

### 1. Команда `/start`
- Показывает главное меню с кнопками
- Кнопка "Поиск" → список регионов
- Кнопка "Популярные" → топ-5 домиков по рейтингу
- Кнопка "Мои бронирования" → история бронирований

### 2. Команда `/search`
- Показывает список регионов Кыргызстана из БД
- После выбора региона → список домиков в этом регионе
- Данные берутся из Prisma (таблицы `regions`, `cabins`)

### 3. Команда `/mybookings`
- Показывает последние 5 бронирований пользователя
- Информация: домик, даты, сумма, статус
- Данные из таблицы `bookings`

### 4. Кнопка "Популярные"
- Топ-5 домиков по рейтингу
- Показывает название, локацию, рейтинг, цену

### 5. Выбор региона
- Показывает все домики в выбранном регионе
- До 10 домиков с ценами и рейтингами

---

## 📊 Интеграция с БД:

Бот подключён к Prisma и работает с данными из БД:

```typescript
// Получить регионы
const regions = await prisma.region.findMany({
  where: { isActive: true }
});

// Получить домики в регионе
const cabins = await prisma.cabin.findMany({
  where: {
    status: 'PUBLISHED',
    location: { regionId: regionId }
  }
});

// Получить бронирования пользователя
const bookings = await prisma.booking.findMany({
  where: { userId: user.id }
});
```

---

## ❗ Устранение проблем

### Webhook не работает
```cmd
# Проверь статус webhook
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Удали webhook
curl https://api.telegram.org/bot<TOKEN>/deleteWebhook

# Установи заново
npm run telegram:setup
```

### Бот не отвечает
1. Проверь что приложение запущено: `npm run dev`
2. Проверь что ngrok работает (если локально)
3. Проверь логи в консоли Next.js
4. Проверь webhook: `npm run telegram:setup`

### Ошибка "TELEGRAM_BOT_TOKEN not found"
Убедись что токен добавлен в `.env.local` и перезапусти приложение.

---

## 🚀 Production deployment

### Vercel
1. Деплой проекта на Vercel
2. Добавь переменную окружения `TELEGRAM_BOT_TOKEN`
3. Установи `NEXT_PUBLIC_APP_URL` = URL Vercel
4. Запусти `npm run telegram:setup` локально

### Heroku
1. Деплой на Heroku
2. `heroku config:set TELEGRAM_BOT_TOKEN=...`
3. `heroku config:set NEXT_PUBLIC_APP_URL=https://yourapp.herokuapp.com`
4. Запусти setup webhook

---

## 📝 Дальнейшие улучшения:

- [ ] Добавить поле `telegramId` в таблицу `User`
- [ ] Регистрация через бота
- [ ] Бронирование через бота с оплатой
- [ ] Уведомления о новых бронированиях
- [ ] Inline mode для быстрого поиска
- [ ] Отправка фото домиков
- [ ] Напоминания о заезде

---

## ✅ Готово!

Telegram бот полностью интегрирован с проектом! 🎉

**Попробуй отправить `/start` своему боту!**
