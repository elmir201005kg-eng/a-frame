# 🚀 Быстрый старт - Админ-панель с 2FA

## Шаг 1: Установка зависимостей

Запустите файл `install-all-deps.bat` или выполните:

```bash
npm install bcryptjs jose next-intl @types/bcryptjs
```

## Шаг 2: Создать администратора

Запустите интерактивный скрипт:

```bash
npm run admin:create
```

Или создайте вручную через SQL:

```sql
-- 1. Создать хэш пароля (пример: пароль "admin123")
-- Запустите: npm run admin:hash-password

-- 2. Вставить пользователя
INSERT INTO "User" (email, name, password, role, phone, "createdAt", "updatedAt")
VALUES (
  'admin@aframe.kg',
  'Администратор',
  '$2a$10$YourBcryptHashHere',
  'ADMIN',
  '+996700000000',
  NOW(),
  NOW()
);
```

## Шаг 3: Настроить Telegram

### 3.1. Получить Telegram User ID

1. Откройте Telegram
2. Найдите бота [@userinfobot](https://t.me/userinfobot)
3. Отправьте ему любое сообщение
4. Скопируйте ваш ID (например: `123456789`)

### 3.2. Сохранить настройки в БД

Запустите интерактивный скрипт:

```bash
npm run admin:setup-telegram
```

Или добавьте вручную через SQL:

```sql
-- Bot Token (ваш существующий бот)
INSERT INTO "Settings" (key, value, "createdAt", "updatedAt")
VALUES (
  'ADMIN_TELEGRAM_BOT_TOKEN',
  '8610664270:AAFerD60XNOrtfh2BwURMf-3UpoYsoN2ub8',
  NOW(),
  NOW()
);

-- User ID администратора
INSERT INTO "Settings" (key, value, "createdAt", "updatedAt")
VALUES (
  'ADMIN_TELEGRAM_USER_ID',
  'YOUR_TELEGRAM_USER_ID_HERE',
  NOW(),
  NOW()
);
```

## Шаг 4: Проверить .env

Убедитесь что в `.env` или `.env.local` есть:

```env
JWT_SECRET="super-secret-jwt-key-change-in-production-32-chars-min"
```

## Шаг 5: Запустить проект

```bash
npm run dev
```

## Шаг 6: Войти в админ-панель

1. Откройте: http://localhost:3000/admin/login
2. Введите email и пароль
3. Получите 6-значный код в Telegram
4. Введите код
5. ✅ Вы в админ-панели!

---

## 📝 Полезные команды

```bash
# Создать администратора
npm run admin:create

# Получить хэш пароля
npm run admin:hash-password

# Настроить Telegram
npm run admin:setup-telegram

# Запустить dev сервер
npm run dev

# Открыть Prisma Studio
npm run db:studio
```

---

## 🔒 Безопасность

✅ Двухфакторная аутентификация  
✅ JWT токены с HTTP-only cookies  
✅ Bcrypt хэширование паролей  
✅ Middleware защита всех admin маршрутов  
✅ Коды 2FA действительны 5 минут  
✅ Автоматическое удаление использованных кодов

---

## 🌍 Мультиязычность

Страница входа поддерживает:
- 🇷🇺 Русский
- 🇰🇬 Кыргызский

Переключение языка доступно в хедере.

---

## ❓ Проблемы

### Код не приходит в Telegram?

1. Проверьте Bot Token в таблице Settings
2. Проверьте User ID в таблице Settings
3. Убедитесь что вы отправили `/start` боту

### Неверный email или пароль?

1. Email не чувствителен к регистру
2. Проверьте хэш пароля в БД
3. Убедитесь что role = 'ADMIN'

### Токен невалиден после входа?

1. Проверьте `JWT_SECRET` в .env
2. Очистите cookies браузера
3. Войдите заново

---

## 📚 Подробная документация

См. `ADMIN_AUTH_SETUP.md` для полной документации по:
- API endpoints
- Структуре файлов
- Безопасности
- Troubleshooting
