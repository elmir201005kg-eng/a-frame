# 🚀 Пошаговая инструкция — Миграция БД

## Проблема
PowerShell блокирует выполнение npm/npx команд.

## ✅ Решение — Запуск через CMD

### Шаг 1: Открой CMD (не PowerShell!)

1. Нажми `Win + R`
2. Введи: `cmd`
3. Нажми Enter

### Шаг 2: Перейди в папку проекта

```cmd
cd C:\Users\ASUS\OneDrive\Desktop\a-frame
```

### Шаг 3: Установи зависимости

```cmd
npm install
```

### Шаг 4: Примени миграцию (создание таблиц)

```cmd
npx prisma db push
```

**Что произойдёт:**
- Prisma подключится к Neon БД
- Прочитает `schema.prisma`
- Создаст все 21 таблицу
- Создаст все связи и индексы

**Вывод должен быть примерно такой:**
```
🚀 Your database is now in sync with your Prisma schema. Done in 5.2s

✔ Generated Prisma Client
```

### Шаг 5: Заполни начальными данными

```cmd
npm run db:seed
```

**Что будет создано:**
- 8 регионов Кыргызстана
- 15 удобств (Wi-Fi, кухня...)
- Тестовый владелец
- Демо-домик на Иссык-Куле

### Шаг 6: Открой визуальный редактор

```cmd
npm run db:studio
```

Откроется браузер на http://localhost:5555 — увидишь все таблицы с данными!

### Шаг 7: Запусти приложение

```cmd
npm run dev
```

Открой http://localhost:3000/api/test-db — проверь подключение к БД.

---

## 📊 Проверка в Neon Dashboard

1. Зайди: https://console.neon.tech/app/projects/floral-night-18429536/branches/br-polished-glade-ayw27ssp/tables
2. Обнови страницу (F5)
3. Увидишь все 21 таблицу:
   - `users`
   - `owner_profiles`
   - `regions`
   - `locations`
   - `cabins`
   - `cabin_images`
   - `amenities`
   - `cabin_amenities`
   - `cabin_rules`
   - `favorites`
   - `bookings`
   - `cabin_availability`
   - `reviews`
   - `review_images`
   - `notifications`
   - `search_history`
   - `promotions`
   - `payments`
   - `cabin_views`
   - `owner_payouts`
   - `audit_logs`

---

## ❗ Если возникла ошибка

### "Error: P1001: Can't reach database server"
→ Проверь интернет-соединение. Neon — облачная БД.

### "Error: P3009: ... already exists"
→ Таблицы уже созданы! Всё в порядке, переходи к seed.

### "SSL connection required"
→ Уже настроено в `.env.local`. Просто запусти ещё раз.

---

## 🎯 Краткая версия (копируй и запускай)

Открой **CMD** (не PowerShell) и запусти:

```cmd
cd C:\Users\ASUS\OneDrive\Desktop\a-frame
npm install
npx prisma db push
npm run db:seed
npm run db:studio
```

---

## ✅ После успешной миграции

Ты увидишь в CMD:
```
✔ Generated Prisma Client
```

В Neon Dashboard:
- 21 таблица
- Все связи и индексы

В Prisma Studio (http://localhost:5555):
- Все таблицы с данными
- Можно редактировать записи

---

Удачи! 🚀
