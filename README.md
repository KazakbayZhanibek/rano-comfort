# RANO Komfort Service — E-commerce Platform

Интернет-магазин бытовой химии для лаборатории RANO Komfort Service (Алматы, Казахстан).

## Стек технологий

- **Next.js 14** — React фреймворк с App Router
- **TypeScript** — Типизация для JavaScript
- **Prisma 5** — ORM для PostgreSQL
- **Zustand 4.4** — Управление состоянием (cart store)
- **React Hot Toast 2.4** — Уведомления
- **Tailwind CSS** — Инлайн стили с CSS переменными
- **PostgreSQL** — База данных

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
# или
pnpm install
```

### 2. Настройка базы данных

#### Вариант A: Локальная PostgreSQL
1. Установи PostgreSQL локально
2. Создай базу данных:
```sql
CREATE DATABASE rano_komfort;
```

3. Обнови `.env.local`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/rano_komfort"
```

#### Вариант B: Облачное решение (рекомендуется)
Используй сервис вроде [Supabase](https://supabase.com/) или [Railway](https://railway.app/):
1. Создай новый проект
2. Скопируй connection string в `.env.local`

### 3. Инициализация БД

```bash
# Генерируем Prisma клиент
npm run prisma:generate

# Запускаем миграции
npm run prisma:migrate

# Заполняем тестовыми данными (опционально)
npm run prisma:seed
```

### 4. Запуск в разработке
```bash
npm run dev
```

Откройди http://localhost:3000

## Структура проекта

```
app/
├── page.tsx                 # Главная страница
├── layout.tsx              # Корневой layout с Header/Footer
├── globals.css             # Глобальные стили и CSS переменные
├── catalog/
│   ├── page.tsx            # Каталог товаров с фильтром
│   └── [slug]/
│       └── page.tsx        # Деталь товара
├── cart/page.tsx           # Корзина
├── checkout/page.tsx       # Оформление заказа
├── order-success/page.tsx  # Подтверждение заказа
├── about/page.tsx          # О компании
├── delivery/page.tsx       # Доставка и способы оплаты
├── contacts/page.tsx       # Контакты
└── api/                    # API routes
    ├── products/route.ts   # GET все товары (с фильтром)
    ├── products/[slug]/route.ts  # GET товар по slug
    ├── categories/route.ts # GET все категории
    └── orders/route.ts     # POST заказ, GET заказы по номеру телефона

components/
├── layout/
│   ├── Header.tsx          # Навигация с корзиной
│   └── Footer.tsx          # Подвал сайта
├── home/
│   ├── Hero.tsx            # Герой секция
│   ├── Categories.tsx      # 6 категорий товаров
│   ├── BestSellers.tsx     # Лучшие товары
│   ├── WhyUs.tsx           # Преимущества компании
│   └── Reviews.tsx         # Отзывы клиентов
└── catalog/
    ├── ProductCard.tsx     # Карточка товара
    ├── ProductGrid.tsx     # Сетка товаров с фильтром
    └── FilterBar.tsx       # Фильтр и поиск

lib/
├── cart.ts                 # Zustand store для корзины
└── prisma.ts              # Prisma клиент (синглтон)

prisma/
├── schema.prisma           # БД схема (4 модели)
└── seed.ts                # Заполнение тестовыми данными
```

## Модели БД

### Category
- `id` — Уникальный ID
- `name` — Название категории
- `slug` — URL-friendly версия названия
- `icon` — Emoji иконка
- `products` — Товары в категории

### Product
- `id` — Уникальный ID
- `name`, `slug`, `description` — Информация о товаре
- `price`, `oldPrice` — Цены (для скидок)
- `volume` — Размер упаковки (750мл, 1л и т.д.)
- `stock` — Количество в наличии
- `images` — Массив URL или emoji
- `flags` — `isBestseller`, `isNew`, `isEco` (boolean)
- `categoryId` — Связь с категорией
- `createdAt`, `updatedAt` — Временные метки

### Order
- `id` — Уникальный ID
- `name`, `phone`, `address` — Данные клиента
- `delivery` — Способ доставки (home/pickup)
- `payment` — Способ оплаты (cash/card/transfer)
- `subtotal`, `deliveryFee`, `total` — Суммы
- `status` — Статус заказа (new/confirmed/shipped/delivered/cancelled)
- `items` — Связанные OrderItem

### OrderItem
- `id` — Уникальный ID
- `orderId`, `productId` — Внешние ключи
- `name`, `price`, `volume`, `quantity` — Информация о товаре в заказе

## API Routes

### `GET /api/products`
Получить все товары с опциональной фильтрацией

**Query параметры:**
- `category` — slug категории (например: `stirka`)
- `search` — поисковая строка
- `sort` — способ сортировки: `newest`, `price-low`, `price-high`, `bestseller`

**Пример:**
```
GET /api/products?category=posuda&sort=price-low
```

### `GET /api/products/[slug]`
Получить один товар по slug

### `GET /api/categories`
Получить все категории с кол-вом товаров

### `POST /api/orders`
Создать новый заказ

**Body:**
```json
{
  "name": "Иван Петров",
  "phone": "+7 (777) 123-45-67",
  "address": "ул. Абая, 100",
  "delivery": "home",
  "payment": "cash",
  "items": [
    {
      "id": "1",
      "name": "Жидкое мыло",
      "price": 1200,
      "volume": "750мл",
      "quantity": 2
    }
  ],
  "subtotal": 2400,
  "deliveryFee": 500,
  "total": 2900
}
```

### `GET /api/orders`
Получить заказы по номеру телефона

**Query параметры:**
- `phone` — номер телефона клиента

## Дизайн система

Все цвета и стили определены как CSS переменные в `app/globals.css`:

```css
--primary: #1B6B2F        /* Зелёный основной */
--secondary: #4CAF50      /* Зелёный вторичный */
--accent: #8BC34A         /* Зелёный акцент */
--text: #333              /* Основной текст */
--light-bg: #F5F5F5       /* Светлый фон */
--border: #E0E0E0         /* Границы */
```

## Команды разработки

```bash
# Запуск на http://localhost:3000
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшена
npm start

# Линтинг кода
npm run lint

# Открыть Prisma Studio (визуальный редактор БД)
npm run prisma:studio

# Создать новую миграцию
npm run prisma:migrate

# Заполнить тестовыми данными
npm run prisma:seed

# Применить схему без миграций (для разработки)
npm run db:push
```

## Что дальше?

- [ ] Добавить NextAuth для аутентификации
- [ ] Интегрировать платежи (Stripe, Kaspi.kz)
- [ ] Создать Telegram бот для уведомлений
- [ ] Добавить загрузку изображений товаров
- [ ] Создать админ-панель управления товарами
- [ ] Оптимизировать производительность (ISR, incremental static generation)
- [ ] Добавить analytics (Яндекс.Метрика, Google Analytics)
- [ ] Настроить SMTP для email уведомлений

## Контакты

**RANO Komfort Service**
- 📍 Алматы, Казахстан
- 📞 +7 (777) 123-45-67
- 💬 WhatsApp/Telegram
- 📧 info@rano-komfort.kz

---

Создано с ❤️ для RANO Komfort Service
