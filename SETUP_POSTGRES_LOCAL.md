# Установка PostgreSQL локально (Windows)

## Шаг 1: Скачай PostgreSQL

1. Перейди на https://www.postgresql.org/download/windows/
2. Скачай **PostgreSQL 15 или 16** (Latest Stable Releases)
3. Выбери версию для Windows (64-bit рекомендуется)

## Шаг 2: Установи PostgreSQL

1. Запусти скачанный файл `postgresql-*.exe`
2. Выбери язык: English
3. Директория установки: оставь по умолчанию (`C:\Program Files\PostgreSQL\16`)
4. **Важно:** Установи пароль для пользователя `postgres`
   - Запомни этот пароль! (например: `postgres123`)
5. Порт: оставь `5432` (по умолчанию)
6. Локаль: выбери `English, United States` или свою локаль
7. Проверь все параметры и нажми Finish

## Шаг 3: Проверь установку

Откройи PowerShell и выполни:
```powershell
psql --version
```

Если показало версию (например `psql (PostgreSQL) 16.0`) — всё отлично!

## Шаг 4: Создай новую БД для RANO

```powershell
psql -U postgres
```

Введи пароль, который установил при инсталляции.

Затем выполни:
```sql
CREATE DATABASE rano_komfort;
```

Если все хорошо, увидишь: `CREATE DATABASE`

Выход:
```sql
\q
```

## Шаг 5: Обнови .env.local

Добавь или обнови этот файл:

```env
DATABASE_URL="postgresql://postgres:ТВОЙ_ПАРОЛЬ@localhost:5432/rano_komfort"
NEXTAUTH_SECRET="dev-secret-key-2024-rano"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Замени `ТВОЙ_ПАРОЛЬ` на пароль, который установил для `postgres`.

## Шаг 6: Проверь подключение

В проекте выполни:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Если всё прошло без ошибок — БД готова!

## Полезные команды

### Запуск PostgreSQL в фоне
PostgreSQL запускается автоматически как сервис. Если нужно остановить:
```powershell
# Остановить сервис
Stop-Service postgresql-x64-16

# Запустить сервис
Start-Service postgresql-x64-16
```

### Просмотр данных через Prisma Studio
```bash
npm run prisma:studio
```

Откроется веб-интерфейс на http://localhost:5555

### Подключение через pgAdmin (графический интерфейс)
pgAdmin установится вместе с PostgreSQL.
Запусти из: `C:\Program Files\PostgreSQL\16\bin\pgadmin4.exe`

---

**Готово? Дай мне знать, и я помогу запустить проект! 🚀**
