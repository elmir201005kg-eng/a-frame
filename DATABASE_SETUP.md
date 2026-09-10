# 🗄️ Настройка базы данных A-FRAME KG

## Структура БД

Реализовано **21 таблица** из спецификации `A-FRAME_KG_DB.md`:

### Основные таблицы
1. **users** — пользователи (USER / OWNER / ADMIN)
2. **owner_profiles** — профили владельцев домиков
3. **regions** — регионы Кыргызстана
4. **locations** — локации с координатами
5. **cabins** — A-frame домики
6. **cabin_images** — галереи фото
7. **amenities** — справочник удобств (Wi-Fi, кухня...)
8. **cabin_amenities** — связь домик ↔ удобства
9. **cabin_rules** — правила проживания
10. **favorites** — избранное пользователей

### Бронирование
11. **bookings** — бронирования
12. **cabin_availability** — календарь доступности

### Отзывы
13. **reviews** — отзывы с рейтингом
14. **review_images** — фото к отзывам

### Уведомления и история
15. **notifications** — уведомления
16. **search_history** — история поиска

### Коммерческие функции
17. **promotions** — акции и скидки
18. **payments** — платежи
19. **cabin_views** — статистика просмотров
20. **owner_payouts** — выплаты владельцам
21. **audit_logs** — журнал действий

---

## 📋 Шаг 1: Установка зависимостей

```bash
npm install
```

Будут установлены:
- `@prisma/client` — клиент Prisma
- `prisma` — CLI и генератор
- `tsx` — для выполнения seed.ts

---

## 📋 Шаг 2: Настройка подключения

Отредактируй `.env.local`:

```env
DATABASE_URL="postgresql://postgres:ТУТ_ТВОЙ_ПАРОЛЬ@localhost:5432/aframe_db?schema=public"
```

**Где взять пароль?**
- Это пароль, который ты вводил при установке PostgreSQL
- Обычно это `postgres` или тот, что ты сам задал

---

## 📋 Шаг 3: Создай базу данных

### Вариант А: через pgAdmin 4 (графический интерфейс)

1. Открой **pgAdmin 4**
2. Подключись к серверу (введи пароль)
3. Правой кнопкой на `Databases` → `Create` → `Database...`
4. Имя базы: **`aframe_db`**
5. Owner: `postgres`
6. Нажми **Save**

### Вариант Б: через командную строку

```bash
# Если psql установлен
psql -U postgres -c "CREATE DATABASE aframe_db;"
```

---

## 📋 Шаг 4: Выполни миграцию (создание таблиц)

```bash
npm run db:push
```

**Что произойдёт:**
- Prisma прочитает `prisma/schema.prisma`
- Подключится к `aframe_db`
- Создаст все 21 таблицу со связями
- Сгенерирует Prisma Client

---

## 📋 Шаг 5: Заполни начальными данными (seed)

```bash
npm run db:seed
```

**Что будет создано:**
- 8 регионов Кыргызстана (Иссык-Куль, Чуй, Нарын...)
- 15 удобств (Wi-Fi, кухня, парковка, бассейн...)
- Тестовый владелец: `owner@aframe.kg`
- Тестовый домик "Mountain A-Frame на Иссык-Куле"
- Локация в Чолпон-Ате
- Фотографии и правила

---

## 📋 Шаг 6: Открой визуальный редактор БД

```bash
npm run db:studio
```

Откроется браузер на `http://localhost:5555` — Prisma Studio.

**Можно:**
- Просматривать таблицы
- Редактировать записи
- Добавлять данные вручную

---

## 📋 Шаг 7: Запусти приложение

```bash
npm run dev
```

Открой в браузере:
- **Приложение:** http://localhost:3000
- **Тест БД:** http://localhost:3000/api/test-db

Если видишь `{ "success": true, "users_count": 1 }` — всё работает! ✅

---

## 🔧 Полезные команды

```bash
# Генерация Prisma Client (после изменения схемы)
npm run db:generate

# Создание миграции с именем
npm run db:migrate

# Push изменений без создания файла миграции
npm run db:push

# Открыть Prisma Studio
npm run db:studio

# Заполнить seed-данными
npm run db:seed

# Сбросить БД и заполнить заново
npx prisma migrate reset
```

---

## 🗺️ Проверка в pgAdmin 4

После миграции в pgAdmin 4:

1. Обнови список таблиц (правой кнопкой → Refresh)
2. Разверни `aframe_db` → `Schemas` → `public` → `Tables`
3. Увидишь все 21 таблицу:
   - `users`
   - `owner_profiles`
   - `regions`
   - `locations`
   - `cabins`
   - `cabin_images`
   - `amenities`
   - ...и остальные

---

## ❗ Проблемы и решения

### "Password authentication failed"
→ Неверный пароль в `DATABASE_URL`. Проверь пароль от PostgreSQL.

### "Database does not exist"
→ Создай базу `aframe_db` через pgAdmin 4 (Шаг 3).

### "Cannot find module 'tsx'"
→ Запусти `npm install` ещё раз.

### "Port 5432 is already in use"
→ PostgreSQL уже запущен. Это норма, просто продолжай.

### Таблицы не отображаются в pgAdmin
→ Нажми правой кнопкой на `Tables` → `Refresh`.

---

## 📊 Схема связей (упрощённая)

```
USER ──┬── OWNER_PROFILE
       ├── BOOKINGS ──┬── PAYMENT
       │              ├── REVIEW
       │              └── OWNER_PAYOUT
       ├── FAVORITES
       ├── REVIEWS
       └── CABIN ──┬── CABIN_IMAGE
                   ├── CABIN_AMENITY ──→ AMENITY
                   ├── CABIN_RULE
                   ├── CABIN_AVAILABILITY
                   ├── PROMOTION
                   └── CABIN_VIEW

REGION ──→ LOCATION ──→ CABIN
```

---

## 📝 Следующие шаги

После настройки БД можешь:

1. **Создать API routes** для работы с данными
2. **Реализовать авторизацию** (NextAuth.js + Prisma)
3. **Добавить компоненты** для отображения домиков
4. **Настроить фильтры и поиск**
5. **Реализовать бронирование**

Удачи! 🚀
