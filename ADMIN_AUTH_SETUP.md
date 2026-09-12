# Настройка аутентификации администратора

## 1. Установка зависимостей

Запустите файл `install-all-deps.bat` или выполните команду:

```bash
npm install bcryptjs jose next-intl
npm install --save-dev @types/bcryptjs
```

## 2. Настройка переменных окружения

Добавьте в файл `.env.local`:

```env
# JWT Secret для подписи токенов
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Telegram Bot Token (будет браться из БД, таблица settings)
# ADMIN_TELEGRAM_BOT_TOKEN хранится в settings
# ADMIN_TELEGRAM_USER_ID хранится в settings
```

## 3. Настройка базы данных

### 3.1. Создать администратора

Выполните SQL запрос для создания админа:

```sql
-- Создать пользователя-администратора
-- Пароль "admin123" (замените на свой)
INSERT INTO "User" (email, name, password, role, phone, "createdAt", "updatedAt")
VALUES (
  'admin@aframe.kg',
  'Администратор',
  '$2a$10$YourHashedPasswordHere',  -- Используйте bcrypt hash
  'ADMIN',
  '+996700000000',
  NOW(),
  NOW()
);
```

### 3.2. Создать хэш пароля

Используйте Node.js для создания хэша:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-secure-password';
const hash = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hash);
```

Или запустите скрипт:

```bash
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
```

### 3.3. Добавить настройки Telegram в таблицу settings

```sql
-- Telegram Bot Token
INSERT INTO "Settings" (key, value, "createdAt", "updatedAt")
VALUES (
  'ADMIN_TELEGRAM_BOT_TOKEN',
  'YOUR_BOT_TOKEN_HERE',
  NOW(),
  NOW()
);

-- Telegram User ID администратора
INSERT INTO "Settings" (key, value, "createdAt", "updatedAt")
VALUES (
  'ADMIN_TELEGRAM_USER_ID',
  'YOUR_TELEGRAM_USER_ID',
  NOW(),
  NOW()
);
```

### Как получить Telegram User ID:

1. Отправьте сообщение боту [@userinfobot](https://t.me/userinfobot)
2. Он отправит вам ваш Telegram ID

## 4. Как работает аутентификация

### Процесс входа:

1. **Шаг 1: Логин** (`/admin/login`)
   - Админ вводит email и пароль
   - Система проверяет учетные данные в БД
   - Проверяется роль `ADMIN`

2. **Шаг 2: 2FA через Telegram**
   - Генерируется 6-значный код
   - Код отправляется в Telegram админа
   - Код действителен 5 минут

3. **Шаг 3: Верификация кода**
   - Админ вводит код из Telegram
   - При успехе создается JWT токен
   - Токен сохраняется в HTTP-only cookie

### Защита страниц:

- Middleware проверяет токен на всех `/admin/*` маршрутах
- При отсутствии или невалидном токене - редирект на `/admin/login`
- Залогиненный админ не может попасть на страницу логина

## 5. API Endpoints

### POST `/api/admin/auth/login`
Первый шаг - проверка email/пароля и отправка кода

**Request:**
```json
{
  "email": "admin@aframe.kg",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": 1,
  "requiresTwoFactor": true
}
```

### POST `/api/admin/auth/verify`
Второй шаг - проверка кода из Telegram

**Request:**
```json
{
  "userId": 1,
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@aframe.kg",
    "name": "Администратор",
    "role": "ADMIN"
  }
}
```

### GET `/api/admin/auth/me`
Получить текущего пользователя

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@aframe.kg",
    "name": "Администратор",
    "role": "ADMIN"
  }
}
```

### POST `/api/admin/auth/logout`
Выйти из системы

**Response:**
```json
{
  "success": true
}
```

## 6. Безопасность

### Реализованные меры:

- ✅ Хэширование паролей с bcrypt
- ✅ JWT токены с подписью
- ✅ HTTP-only cookies (защита от XSS)
- ✅ Двухфакторная аутентификация через Telegram
- ✅ Время жизни кодов 2FA (5 минут)
- ✅ Проверка роли ADMIN
- ✅ Middleware защита всех admin маршрутов
- ✅ Автоматическое удаление использованных кодов

### Рекомендации:

1. Используйте сложный `JWT_SECRET` (минимум 32 символа)
2. В production используйте HTTPS
3. Регулярно меняйте пароль администратора
4. Не храните `JWT_SECRET` в коде - только в `.env.local`

## 7. Тестирование

### 7.1. Создать тестового админа

Запустите скрипт создания админа:

```bash
node scripts/create-admin.js
```

### 7.2. Войти в систему

1. Откройте http://localhost:3000/admin/login
2. Введите email и пароль
3. Получите код в Telegram
4. Введите код
5. Вы будете перенаправлены в `/admin`

## 8. Переводы

Все тексты страницы входа переведены на русский и кыргызский языки:

- `app/i18n/locales/ru/admin.json` - русский
- `app/i18n/locales/kg/admin.json` - кыргызский

Ключи переводов в секции `auth.*`

## 9. Устранение проблем

### Проблема: "Telegram не настроен"
- Проверьте наличие `ADMIN_TELEGRAM_BOT_TOKEN` и `ADMIN_TELEGRAM_USER_ID` в таблице `Settings`

### Проблема: "Неверный email или пароль"
- Проверьте правильность email (регистр не важен)
- Проверьте хэш пароля в БД
- Убедитесь что роль пользователя = `ADMIN`

### Проблема: "Код не приходит в Telegram"
- Проверьте корректность Bot Token
- Проверьте корректность Telegram User ID
- Убедитесь что вы запустили бота (отправили /start)

### Проблема: "Неверный код подтверждения"
- Код действителен только 5 минут
- Код можно использовать только один раз
- Запросите новый код кнопкой "Отправить код повторно"

## 10. Структура файлов

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx              # Страница входа
│   └── layout.tsx                # Layout с проверкой авторизации
├── api/
│   └── admin/
│       └── auth/
│           ├── login/route.ts    # Логин + отправка кода
│           ├── verify/route.ts   # Проверка кода + создание сессии
│           ├── logout/route.ts   # Выход
│           └── me/route.ts       # Получить текущего пользователя
components/
└── admin/
    └── AdminHeader.tsx           # Хедер с кнопкой выхода
middleware.ts                     # Защита admin маршрутов
```
