# 🚀 Руководство по миграции БД A-FRAME KG

## Что создано:

1. **`prisma/manual-migration.sql`** — SQL-скрипт со всеми 21 таблицами
2. **`scripts/run-migration.js`** — Node.js скрипт для применения миграции
3. **`npm run db:migrate:manual`** — команда для запуска

---

## 📋 Шаг 1: Убедись, что база данных создана

### Вариант А: Через pgAdmin 4

1. Открой **pgAdmin 4**
2. Подключись к серверу (пароль: `postgres`)
3. Посмотри в списке `Databases` — есть ли `aframe_db`?
4. Если НЕТ — создай:
   - Правой кнопкой на `Databases` → `Create` → `Database`
   - Имя: **`aframe_db`**
   - Owner: `postgres`
   - **Save**

### Вариант Б: Через командную строку

```bash
psql -U postgres -c "CREATE DATABASE aframe_db;"
```

---

## 📋 Шаг 2: Установи зависимости

```bash
npm install
```

Будет установлен пакет `pg` для прямого подключения к PostgreSQL.

---

## 📋 Шаг 3: Выполни миграцию

```bash
npm run db:migrate:manual
```

**Что произойдёт:**
1. Скрипт подключится к `aframe_db`
2. Создаст все ENUM типы
3. Создаст 21 таблицу со связями
4. Создаст индексы для оптимизации

**Вывод в консоли:**
```
🔗 Подключение к базе данных...
✅ Подключено к PostgreSQL
📄 Выполняем миграцию...
✅ Миграция выполнена успешно!
📊 Создано 21 таблица:
   - users
   - owner_profiles
   - regions
   ...
🎉 Готово! Теперь запусти: npm run db:seed
```

---

## 📋 Шаг 4: Генерация Prisma Client

После создания таблиц нужно сгенерировать Prisma Client:

```bash
npm run db:generate
```

Prisma прочитает структуру БД и создаст типизированный клиент.

---

## 📋 Шаг 5: Заполни начальными данными

```bash
npm run db:seed
```

**Что будет создано:**
- 8 регионов Кыргызстана
- 15 удобств (Wi-Fi, кухня, парковка...)
- Тестовый владелец: `owner@aframe.kg`
- Демо-домик "Mountain A-Frame на Иссык-Куле"
- Локация в Чолпон-Ате

---

## 📋 Шаг 6: Проверь таблицы

### Через pgAdmin 4:

1. Обнови список таблиц (правой кнопкой → **Refresh**)
2. Разверни: `aframe_db` → `Schemas` → `public` → `Tables`
3. Должны появиться все 21 таблица

### Через Prisma Studio:

```bash
npm run db:studio
```

Откроется http://localhost:5555 — визуальный редактор БД.

### Через API:

```bash
npm run dev
```

Открой http://localhost:3000/api/test-db

Должен показать:
```json
{
  "success": true,
  "message": "Подключение к базе данных успешно!",
  "users_count": 1
}
```

---

## 📊 Список всех таблиц (21):

1. **users** — пользователи (USER / OWNER / ADMIN)
2. **owner_profiles** — профили владельцев
3. **regions** — регионы Кыргызстана
4. **locations** — локации с координатами
5. **cabins** — A-frame домики
6. **cabin_images** — галереи фото
7. **amenities** — удобства
8. **cabin_amenities** — связь домик ↔ удобства
9. **cabin_rules** — правила проживания
10. **favorites** — избранное
11. **bookings** — бронирования
12. **cabin_availability** — календарь доступности
13. **reviews** — отзывы
14. **review_images** — фото к отзывам
15. **notifications** — уведомления
16. **search_history** — история поиска
17. **promotions** — акции
18. **payments** — платежи
19. **cabin_views** — статистика просмотров
20. **owner_payouts** — выплаты владельцам
21. **audit_logs** — журнал действий

---

## ❗ Проблемы и решения

### "Database does not exist"
→ Создай базу `aframe_db` в pgAdmin 4 (Шаг 1).

### "Cannot connect to database"
→ Проверь, что PostgreSQL запущен. Проверь пароль в `.env.local`.

### "Permission denied"
→ Убедись, что пользователь `postgres` имеет права на создание таблиц.

### "Type already exists"
→ Скрипт пытается создать ENUM, который уже существует. Удали базу и создай заново, или отредактируй SQL-скрипт.

### Таблицы не видны в pgAdmin
→ Нажми правой кнопкой на `Tables` → **Refresh**.

---

## 🔄 Если нужно пересоздать БД

```bash
# Удали базу в pgAdmin 4 или через командную строку:
psql -U postgres -c "DROP DATABASE aframe_db;"
psql -U postgres -c "CREATE DATABASE aframe_db;"

# Запусти миграцию заново:
npm run db:migrate:manual
npm run db:generate
npm run db:seed
```

---

## 🎉 Готово!

Теперь у тебя:
- ✅ 21 таблица в PostgreSQL
- ✅ Все связи и индексы
- ✅ Prisma Client сгенерирован
- ✅ Начальные данные загружены

**Следующие шаги:**
1. Создавай API routes в `app/api/`
2. Реализуй авторизацию с NextAuth.js
3. Создавай компоненты для отображения домиков
4. Добавляй бронирование и оплату

Удачи! 🚀
