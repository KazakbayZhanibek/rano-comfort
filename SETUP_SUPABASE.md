# Инструкция по подключению Supabase к проекту RANO Komfort

## Шаг 1: Создай аккаунт на Supabase
1. Перейди на https://supabase.com
2. Нажми "Start your project"
3. Зарегистрируйся через GitHub (быстрее) или email

## Шаг 2: Создай новый проект
1. Нажми "New project"
2. Выбери имя: `rano-komfort`
3. Пароль для БД: используй надёжный пароль (сохрани его!)
4. Регион: выбери ближайший (например, Singapore, Tokyo или Europe)
5. Жди 1-2 минуты загрузки

## Шаг 3: Получи Connection String
1. В Supabase откройся Settings → Database
2. Найди "Connection string" → URI tab
3. Скопируй строку (выглядит так):
   ```
   postgresql://postgres:[PASSWORD]@db.[RANDOM].supabase.co:5432/postgres
   ```

## Шаг 4: Обнови .env.local
Вставь скопированную строку в файл `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[ТВоЙ_ПАРОЛЬ]@db.[ТВОЙ_ID].supabase.co:5432/postgres"
NEXTAUTH_SECRET="dev-secret-key-2024"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

⚠️ Замени:
- `[ТВоЙ_ПАРОЛЬ]` — на пароль, который установил при создании проекта
- `[ТВОЙ_ID]` — на ID проекта из URL Supabase (например: `abcdefghijklmnop`)

## Шаг 5: Проверь подключение
Выполни в терминале:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Если всё хорошо — поздравляем! БД готова 🎉

## Полезные ссылки
- Supabase Dashboard: https://app.supabase.com
- Prisma Studio (видеть все данные): `npm run prisma:studio`
- Документация Supabase: https://supabase.com/docs
