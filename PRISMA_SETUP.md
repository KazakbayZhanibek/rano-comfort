# 🚀 Запуск Prisma и подготовка БД

## 1️⃣ Первый запуск (если БД еще нет)

### Создать и применить миграцию:
```bash
npx prisma migrate dev --name init
```

Это:
- Создаст новую миграцию в папке `prisma/migrations`
- Применит её к БД (SQLite файл будет создан)
- Сгенерирует Prisma Client

### Результат:
- 📄 Новый файл БД: `.env.local` содержит `DATABASE_URL`
- 📁 Папка миграций: `prisma/migrations/`
- ✅ Prisma Client готов к использованию

---

## 2️⃣ Добавление новых функций профиля

Мы уже обновили схему с новыми моделями. Теперь запустите:

```bash
npx prisma migrate dev --name add_profile_features
```

Это создаст миграцию для:
- ✅ User (с аватаром и паролем)
- ✅ Address (сохранённые адреса)
- ✅ LoyaltyPoints (система лояльности)
- ✅ PasswordHistory (история паролей)

---

## 3️⃣ Просмотр и редактирование данных

### Открыть Prisma Studio (графический интерфейс):
```bash
npx prisma studio
```

Откроется веб-интерфейс на http://localhost:5555

Здесь вы можете:
- 👀 Просмотреть все данные
- ➕ Добавить новые записи
- ✏️ Отредактировать существующие
- 🗑️ Удалить записи

---

## 4️⃣ Регенерировать Prisma Client

Если отредактировали `prisma/schema.prisma`:

```bash
npx prisma generate
```

Или применить изменения:
```bash
npx prisma migrate dev
```

---

## 5️⃣ Проверить схему БД

```bash
npx prisma db validate
```

Проверит, что схема БД совпадает с `prisma/schema.prisma`

---

## 6️⃣ Очистить и пересоздать БД

⚠️ **Внимание! Это удалит все данные!**

```bash
npx prisma migrate reset
```

Это:
- 🗑️ Удалит БД
- 📁 Пересоздаст её с нуля
- 📋 Применит все миграции
- 🌱 Запустит seed скрипт (если есть)

---

## 7️⃣ Seed данные (заполнить тестовые данные)

Создайте скрипт `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Очистить существующие данные
  await prisma.user.deleteMany()

  // Создать тестового пользователя
  const user = await prisma.user.create({
    data: {
      name: 'Айгерим Сейткали',
      email: 'aigerim@mail.ru',
      phone: '+7 (777) 123-45-67',
      password: 'hashedPassword123',
      avatar: 'АС',
      loyaltyPoints: {
        create: {
          totalSpent: 11540,
          points: 1154,
          tier: 'silver',
        },
      },
      addresses: {
        createMany: {
          data: [
            {
              label: 'Дом',
              fullAddress: 'Шымкент, ул. Абая 123, кв. 45',
              city: 'Шымкент',
              street: 'ул. Абая',
              building: '123',
              apartment: '45',
              isDefault: true,
            },
            {
              label: 'Работа',
              fullAddress: 'Шымкент, пр. Аль-Фараби 77',
              city: 'Шымкент',
              street: 'пр. Аль-Фараби',
              building: '77',
              apartment: null,
              isDefault: false,
            },
          ],
        },
      },
    },
  })

  console.log('✅ Seed данные созданы:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

Затем запустите:
```bash
npx prisma db seed
```

---

## 8️⃣ Полный процесс инициализации

```bash
# 1. Создать схему и миграции
npx prisma migrate dev --name init

# 2. Создать seed скрипт (скопируйте код выше в prisma/seed.ts)

# 3. Запустить seed (заполнить тестовые данные)
npx prisma db seed

# 4. Открыть Prisma Studio и проверить
npx prisma studio

# 5. Запустить dev сервер
npm run dev

# 6. Перейти на http://localhost:3000/profile
```

---

## 🎯 Команды для запоминания

| Команда | Что делает |
|---------|-----------|
| `npx prisma migrate dev` | Создать и применить миграцию |
| `npx prisma studio` | Открыть графический интерфейс |
| `npx prisma generate` | Регенерировать Prisma Client |
| `npx prisma db validate` | Проверить консистентность БД |
| `npx prisma migrate reset` | Пересоздать БД (удалит данные!) |
| `npx prisma db seed` | Заполнить тестовыми данными |
| `npx prisma db push` | Применить изменения без миграций (для прототипирования) |

---

## 🔗 Полезные ссылки

- 📚 [Prisma документация](https://www.prisma.io/docs/)
- 📖 [Миграции в Prisma](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- 🎨 [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)
- 💾 [SQLite с Prisma](https://www.prisma.io/docs/concepts/database-connectors/sqlite)

---

## ✅ Проверка

После выполнения всех команд:

```bash
# Убедитесь что БД создана
ls -la prisma/dev.db

# Проверьте что Prisma Client сгенерирован
ls -la node_modules/@prisma/client

# Запустите сервер
npm run dev
```

Если всё работает - вы готовы к использованию профиля! 🎉

---

**Создано:** 8 мая 2026
**Обновлено:** Во время разработки профиля
