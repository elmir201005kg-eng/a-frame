# База данных — A-FRAME KG

## 1. Общая информация

**Проект:** A-FRAME KG  
**Назначение:** онлайн-сервис поиска и бронирования A-frame домиков в Кыргызстане.

База данных проектируется для хранения пользователей, владельцев домиков, объектов размещения, фотографий, удобств, бронирований, отзывов, избранного и других данных, необходимых для работы сервиса.

> **Важно:** 21 экран из ТЗ не означает 21 таблицу БД. Таблицы создаются по сущностям и данным системы, поэтому один экран может использовать несколько таблиц, а одна таблица может использоваться несколькими экранами.

---

## 2. Условные обозначения

| Обозначение | Значение |
|---|---|
| PK | Primary Key — первичный ключ |
| FK | Foreign Key — внешний ключ |
| UNIQUE | уникальное значение |
| ENUM | перечисление допустимых значений |
| NOT NULL | обязательное поле |

---

# 3. Таблицы базы данных

## 3.1. users

Хранит данные всех пользователей системы.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | Уникальный ID пользователя |
| first_name | VARCHAR(100) | | Имя |
| last_name | VARCHAR(100) | | Фамилия |
| email | VARCHAR(255) | UNIQUE | Электронная почта |
| phone | VARCHAR(30) | | Номер телефона |
| password_hash | VARCHAR(255) | | Хэш пароля |
| role | ENUM | | Роль пользователя |
| status | ENUM | | Статус пользователя |
| avatar_url | TEXT | | Ссылка на аватар |
| is_verified | BOOLEAN | | Подтверждён ли аккаунт |
| created_at | TIMESTAMP | | Дата регистрации |
| updated_at | TIMESTAMP | | Дата изменения |

---

## 3.2. owner_profiles

Дополнительная информация о владельцах A-frame домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID профиля владельца |
| user_id | BIGINT | FK, UNIQUE | Связь с users |
| business_name | VARCHAR(255) | | Название бизнеса |
| description | TEXT | | Описание владельца/компании |
| contact_phone | VARCHAR(30) | | Контактный телефон |
| verification_status | ENUM | | Статус проверки владельца |
| created_at | TIMESTAMP | | Дата создания |
| updated_at | TIMESTAMP | | Дата изменения |

---

## 3.3. regions

Список регионов Кыргызстана.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | INT | PK | ID региона |
| name | VARCHAR(100) | UNIQUE | Название региона |
| slug | VARCHAR(100) | UNIQUE | URL-идентификатор |
| is_active | BOOLEAN | | Активен ли регион |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.4. locations

Точное расположение A-frame домика.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID локации |
| region_id | INT | FK | Регион |
| city | VARCHAR(150) | | Город |
| village | VARCHAR(150) | | Село/посёлок |
| address | TEXT | | Адрес |
| latitude | DECIMAL(10,7) | | Географическая широта |
| longitude | DECIMAL(10,7) | | Географическая долгота |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.5. cabins

Главная таблица A-frame домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID домика |
| owner_id | BIGINT | FK | Владелец домика |
| location_id | BIGINT | FK | Локация домика |
| title | VARCHAR(255) | | Название домика |
| slug | VARCHAR(255) | UNIQUE | URL-идентификатор |
| description | TEXT | | Описание |
| price_per_night | DECIMAL(10,2) | | Цена за ночь |
| max_guests | INT | | Максимальное количество гостей |
| bedrooms | INT | | Количество спален |
| beds | INT | | Количество кроватей |
| bathrooms | INT | | Количество санузлов |
| rating | DECIMAL(2,1) | | Средний рейтинг |
| reviews_count | INT | | Количество отзывов |
| status | ENUM | | Статус домика |
| created_at | TIMESTAMP | | Дата создания |
| updated_at | TIMESTAMP | | Дата изменения |

---

## 3.6. cabin_images

Фотографии A-frame домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID изображения |
| cabin_id | BIGINT | FK | Домик |
| image_url | TEXT | | Ссылка на изображение |
| alt_text | VARCHAR(255) | | Описание изображения |
| sort_order | INT | | Порядок отображения |
| is_main | BOOLEAN | | Главное изображение |
| created_at | TIMESTAMP | | Дата добавления |

---

## 3.7. amenities

Справочник удобств.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | INT | PK | ID удобства |
| name | VARCHAR(100) | UNIQUE | Название удобства |
| slug | VARCHAR(100) | UNIQUE | URL-идентификатор |
| icon | VARCHAR(100) | | Иконка |
| is_active | BOOLEAN | | Активно ли удобство |

Примеры: Wi-Fi, кухня, парковка, бассейн, отопление.

---

## 3.8. cabin_amenities

Связующая таблица между домиками и удобствами.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| cabin_id | BIGINT | PK, FK | ID домика |
| amenity_id | INT | PK, FK | ID удобства |

Связь: **cabins N:M amenities**.

---

## 3.9. cabin_rules

Правила проживания в домике.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID правила |
| cabin_id | BIGINT | FK | Домик |
| title | VARCHAR(255) | | Название правила |
| description | TEXT | | Описание правила |
| is_active | BOOLEAN | | Активно ли правило |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.10. favorites

Избранные домики пользователя.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID записи |
| user_id | BIGINT | FK | Пользователь |
| cabin_id | BIGINT | FK | Домик |
| created_at | TIMESTAMP | | Дата добавления |

**Ограничение:** одна пара `user_id + cabin_id` должна быть уникальной.

---

## 3.11. bookings

Бронирования домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID бронирования |
| booking_number | VARCHAR(30) | UNIQUE | Номер бронирования |
| user_id | BIGINT | FK | Пользователь |
| cabin_id | BIGINT | FK | Забронированный домик |
| check_in | DATE | | Дата заезда |
| check_out | DATE | | Дата выезда |
| guests_count | INT | | Количество гостей |
| guest_name | VARCHAR(200) | | Имя гостя |
| guest_phone | VARCHAR(30) | | Телефон гостя |
| guest_email | VARCHAR(255) | | Email гостя |
| price_per_night | DECIMAL(10,2) | | Цена за ночь на момент брони |
| nights | INT | | Количество ночей |
| subtotal | DECIMAL(10,2) | | Стоимость проживания |
| discount_amount | DECIMAL(10,2) | | Сумма скидки |
| service_fee | DECIMAL(10,2) | | Сервисный сбор |
| total_amount | DECIMAL(10,2) | | Итоговая стоимость |
| status | ENUM | | Статус бронирования |
| cancellation_reason | TEXT | | Причина отмены |
| created_at | TIMESTAMP | | Дата создания |
| updated_at | TIMESTAMP | | Дата изменения |

---

## 3.12. cabin_availability

Календарь доступности домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID записи |
| cabin_id | BIGINT | FK | Домик |
| date | DATE | | Дата |
| status | ENUM | | Доступность |
| price | DECIMAL(10,2) | | Цена на конкретную дату |
| note | TEXT | | Примечание |

**Ограничение:** пара `cabin_id + date` должна быть уникальной.

---

## 3.13. reviews

Отзывы пользователей о домиках.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID отзыва |
| user_id | BIGINT | FK | Автор отзыва |
| cabin_id | BIGINT | FK | Домик |
| booking_id | BIGINT | FK | Бронирование |
| rating | INT | | Оценка от 1 до 5 |
| text | TEXT | | Текст отзыва |
| status | ENUM | | Статус публикации |
| created_at | TIMESTAMP | | Дата создания |
| updated_at | TIMESTAMP | | Дата изменения |

Правило: отзыв может оставить пользователь с завершённым бронированием.

---

## 3.14. review_images

Фотографии, прикреплённые к отзывам.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID изображения |
| review_id | BIGINT | FK | Отзыв |
| image_url | TEXT | | Ссылка на изображение |
| created_at | TIMESTAMP | | Дата добавления |

---

## 3.15. notifications

Уведомления пользователей.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID уведомления |
| user_id | BIGINT | FK | Получатель |
| type | VARCHAR(50) | | Тип уведомления |
| title | VARCHAR(255) | | Заголовок |
| message | TEXT | | Текст |
| booking_id | BIGINT | FK | Связанное бронирование |
| is_read | BOOLEAN | | Прочитано ли |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.16. search_history

История поиска пользователя.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID поиска |
| user_id | BIGINT | FK | Пользователь |
| region_id | INT | FK | Выбранный регион |
| check_in | DATE | | Дата заезда |
| check_out | DATE | | Дата выезда |
| guests_count | INT | | Количество гостей |
| min_price | DECIMAL(10,2) | | Минимальная цена |
| max_price | DECIMAL(10,2) | | Максимальная цена |
| created_at | TIMESTAMP | | Дата поиска |

---

## 3.17. promotions

Акции и специальные предложения.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID акции |
| cabin_id | BIGINT | FK | Домик |
| title | VARCHAR(255) | | Название акции |
| description | TEXT | | Описание |
| discount_type | ENUM | | Тип скидки |
| discount_value | DECIMAL(10,2) | | Размер скидки |
| start_date | DATE | | Начало акции |
| end_date | DATE | | Конец акции |
| is_active | BOOLEAN | | Активна ли акция |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.18. payments

Платежи за бронирования.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID платежа |
| booking_id | BIGINT | FK | Бронирование |
| user_id | BIGINT | FK | Пользователь |
| amount | DECIMAL(10,2) | | Сумма платежа |
| currency | VARCHAR(10) | | Валюта |
| payment_method | VARCHAR(50) | | Способ оплаты |
| status | ENUM | | Статус платежа |
| transaction_id | VARCHAR(255) | UNIQUE | ID транзакции |
| paid_at | TIMESTAMP | | Дата оплаты |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.19. cabin_views

Статистика просмотров домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID просмотра |
| cabin_id | BIGINT | FK | Домик |
| user_id | BIGINT | FK | Пользователь, если авторизован |
| viewed_at | TIMESTAMP | | Время просмотра |

---

## 3.20. owner_payouts

Выплаты владельцам домиков.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID выплаты |
| owner_id | BIGINT | FK | Владелец |
| booking_id | BIGINT | FK | Бронирование |
| gross_amount | DECIMAL(10,2) | | Общая сумма |
| commission_amount | DECIMAL(10,2) | | Комиссия сервиса |
| net_amount | DECIMAL(10,2) | | Сумма владельцу |
| status | ENUM | | Статус выплаты |
| paid_at | TIMESTAMP | | Дата выплаты |
| created_at | TIMESTAMP | | Дата создания |

---

## 3.21. audit_logs

Журнал важных действий пользователей и администраторов.

| Поле | Тип | Ключ | Описание |
|---|---|---|---|
| id | BIGINT | PK | ID записи |
| user_id | BIGINT | FK | Пользователь, выполнивший действие |
| action | VARCHAR(100) | | Выполненное действие |
| entity_type | VARCHAR(100) | | Тип изменённого объекта |
| entity_id | BIGINT | | ID объекта |
| old_data | JSON | | Старые данные |
| new_data | JSON | | Новые данные |
| created_at | TIMESTAMP | | Дата действия |

---

# 4. ENUM-справочники

## role_enum

```text
USER
OWNER
ADMIN
```

## user_status_enum

```text
ACTIVE
INACTIVE
BLOCKED
```

## cabin_status_enum

```text
DRAFT
PENDING
PUBLISHED
BLOCKED
ARCHIVED
```

## booking_status_enum

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
REJECTED
```

## availability_status_enum

```text
AVAILABLE
BOOKED
BLOCKED
```

## review_status_enum

```text
PENDING
PUBLISHED
HIDDEN
```

## verification_status_enum

```text
PENDING
VERIFIED
REJECTED
```

## discount_type_enum

```text
PERCENT
FIXED
```

## payment_status_enum

```text
PENDING
PAID
FAILED
REFUNDED
```

## payout_status_enum

```text
PENDING
PAID
CANCELLED
```

---

# 5. Связи между таблицами

| Таблица 1 | Связь | Таблица 2 |
|---|---|---|
| users | 1 : 1 | owner_profiles |
| users | 1 : N | cabins |
| regions | 1 : N | locations |
| locations | 1 : N | cabins |
| cabins | 1 : N | cabin_images |
| cabins | N : M | amenities |
| cabins | 1 : N | cabin_rules |
| users | 1 : N | favorites |
| cabins | 1 : N | favorites |
| users | 1 : N | bookings |
| cabins | 1 : N | bookings |
| cabins | 1 : N | cabin_availability |
| users | 1 : N | reviews |
| cabins | 1 : N | reviews |
| bookings | 1 : 1 | reviews |
| reviews | 1 : N | review_images |
| users | 1 : N | notifications |
| bookings | 1 : N | payments |
| cabins | 1 : N | promotions |
| cabins | 1 : N | cabin_views |
| users | 1 : N | search_history |
| users | 1 : N | owner_payouts |
| bookings | 1 : 1 | owner_payouts |
| users | 1 : N | audit_logs |

---

# 6. Основная схема связей

```text
                         ┌───────────────┐
                         │     USERS     │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        FAVORITES            BOOKINGS            REVIEWS
              │                  │                  │
              │                  ▼                  │
              │              PAYMENTS              │
              │                                     │
              └──────────────┐       ┌──────────────┘
                             ▼       ▼
                           ┌────────────┐
                           │   CABINS   │
                           └─────┬──────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
       CABIN_IMAGES        CABIN_AMENITIES   CABIN_AVAILABILITY
                                  │
                                  ▼
                              AMENITIES

             ┌────────────┐
             │  REGIONS   │
             └─────┬──────┘
                   │
                   ▼
             ┌────────────┐
             │ LOCATIONS  │
             └─────┬──────┘
                   │
                   ▼
                 CABINS
```

---

# 7. Какие экраны используют БД

| Экран из ТЗ | Основные таблицы |
|---|---|
| Splash | — |
| Login | users |
| Register | users |
| Home | cabins, cabin_images, regions, promotions |
| Catalog | cabins, cabin_images, locations |
| Search | cabins, locations, regions |
| Filters | cabins, amenities, cabin_amenities |
| Search Results | cabins, cabin_images, locations, amenities |
| Cabin Details | cabins, cabin_images, amenities, cabin_amenities, cabin_rules, reviews |
| Gallery | cabin_images |
| Reviews | reviews, review_images, users |
| Date Selection | cabin_availability, bookings |
| Booking | bookings, cabins, users |
| Confirmation | bookings, payments |
| Favorites | favorites, cabins, cabin_images |
| My Bookings | bookings, cabins, cabin_images |
| Booking Details | bookings, cabins, locations, payments |
| Profile | users, bookings, favorites |
| Owner Dashboard | users, cabins, bookings, cabin_views, owner_payouts |
| My Cabins | cabins, cabin_images |
| Add Cabin | cabins, locations, cabin_images, amenities, cabin_amenities, cabin_rules |

---

# 8. MVP

Для первой версии проекта необязательно сразу реализовывать все 21 таблицу.

### Основные таблицы MVP:

```text
users
cabins
locations
regions
cabin_images
amenities
cabin_amenities
favorites
bookings
cabin_availability
reviews
```

### Дополнительные таблицы для полноценного коммерческого проекта:

```text
owner_profiles
cabin_rules
review_images
notifications
search_history
promotions
payments
cabin_views
owner_payouts
audit_logs
```

---

# 9. Итог

База данных A-FRAME KG состоит из **21 основных таблиц**, которые покрывают:

- регистрацию и авторизацию;
- роли USER / OWNER / ADMIN;
- каталог A-frame домиков;
- регионы и локации;
- фотографии;
- удобства;
- правила проживания;
- избранное;
- поиск и фильтры;
- календарь доступности;
- бронирование;
- отзывы;
- уведомления;
- акции;
- оплату;
- статистику;
- выплаты владельцам;
- административный контроль и журнал действий.

Структура рассчитана на возможность сначала реализовать **MVP на React + LocalStorage/Mock API**, а затем подключить полноценный Backend, REST API и SQL-базу данных.
