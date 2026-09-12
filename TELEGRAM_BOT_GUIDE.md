# 🤖 Создание Telegram бота для A-FRAME KG

## 📋 Шаг 1: Создание бота через BotFather

### 1.1. Открой Telegram и найди @BotFather
1. Открой приложение **Telegram**
2. В поиске введи: **@BotFather**
3. Нажми на официального бота (с синей галочкой ✓)

### 1.2. Создай нового бота
Отправь команды по очереди:

```
/start
```

Затем:

```
/newbot
```

### 1.3. Задай имя боту
BotFather спросит: **"Alright, a new bot. How are we going to call it?"**

Введи название (может содержать пробелы):
```
A-Frame KG
```

### 1.4. Задай username боту
BotFather спросит: **"Good. Now let's choose a username for your bot."**

Username должен:
- Быть уникальным
- Заканчиваться на `bot`
- Быть без пробелов

Примеры:
```
aframe_kg_bot
```
или
```
aframe_booking_bot
```

### 1.5. Получи токен
После создания BotFather отправит сообщение с **токеном**:

```
Done! Congratulations on your new bot. You will find it at t.me/aframe_kg_bot.
You can now add a description...

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789

Keep your token secure and store it safely...
```

**⚠️ ВАЖНО:** Скопируй токен — он нужен для подключения!

---

## 📋 Шаг 2: Настройка бота

### 2.1. Добавь описание
```
/setdescription
```
Выбери своего бота, затем отправь:
```
🏠 A-Frame KG — бронирование уютных A-frame домиков в Кыргызстане.

Найди идеальный домик для отдыха на природе!
```

### 2.2. Добавь короткое описание
```
/setabouttext
```
Выбери бота, отправь:
```
Бронирование A-frame домиков в Кыргызстане 🏔️
```

### 2.3. Добавь команды
```
/setcommands
```
Выбери бота, отправь:
```
start - Главное меню
search - Поиск домиков
mybookings - Мои бронирования
favorites - Избранное
help - Помощь
contact - Связаться с нами
```

### 2.4. Добавь фото профиля (опционально)
```
/setuserpic
```
Выбери бота, загрузи изображение (логотип A-Frame).

---

## 📋 Шаг 3: Дополнительные настройки

### 3.1. Включи inline mode (опционально)
```
/setinline
```
Это позволит искать домики прямо в чате.

### 3.2. Настрой кнопки меню
```
/setmenubutton
```

---

## ✅ Готово! Токен получен

Теперь используй токен в проекте:

```env
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789"
```

---

## 🚀 Следующие шаги

1. Скопируй токен
2. Добавь его в `.env.local`
3. Запусти команды установки (см. ниже)
4. Открой бота в Telegram: `t.me/aframe_kg_bot`
5. Нажми `/start`

---

## 📞 Полезные команды BotFather

```
/mybots          - Список твоих ботов
/token           - Получить токен заново (revoke старый)
/revoke          - Отменить текущий токен
/setname         - Изменить имя бота
/setdescription  - Изменить описание
/setabouttext    - Изменить короткое описание
/setuserpic      - Изменить фото профиля
/setcommands     - Изменить список команд
/deletebot       - Удалить бота
```

---

## 🔒 Безопасность

⚠️ **НИКОГДА НЕ ПУБЛИКУЙ ТОКЕН В ОТКРЫТОМ ДОСТУПЕ!**

- Храни токен только в `.env.local`
- Не коммить `.env.local` в Git
- Если токен утёк — используй `/revoke` и создай новый

---

## 📱 Примеры username'ов

✅ Хорошие:
- `aframe_kg_bot`
- `aframe_booking_bot`
- `aframekgbot`
- `aframe_cabins_bot`

❌ Плохие:
- `aframe` (не заканчивается на bot)
- `a-frame_kg_bot` (дефис не разрешён)
- `aframe kg bot` (пробелы не разрешены)

---

Готов создать бота? Следуй инструкциям выше! 🚀
