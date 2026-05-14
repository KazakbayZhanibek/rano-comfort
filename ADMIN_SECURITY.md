# 🔐 Улучшение безопасности Админ-панели

## Что было обновлено

### 1. **Система Session Tokens** 
Вместо хранения пароля в cookie, теперь используются безопасные session токены:
- Каждая сессия имеет уникальный 64-байтовый токен (256 bits)
- Токены хранятся в базе данных с сроком действия (7 дней)
- После истечения срока сессия автоматически удаляется
- Используются `HttpOnly` cookies (не доступны из JavaScript)
- `Secure` флаг установлен в production (только HTTPS)

### 2. **Rate Limiting на логин**
- Максимум 5 неудачных попыток входа за час
- После 5 неудачных попыток возвращается ошибка 429 (Too Many Requests)
- Отслеживание по IP адресу клиента
- Старые попытки (старше 1 часа) автоматически удаляются

### 3. **Логирование попыток входа**
Модель `AdminLoginAttempt` записывает:
- IP адрес
- Успешность входа
- Время попытки
- Индекс для быстрой фильтрации

### 4. **Session Management**
- Сессии хранятся в БД (таблица `AdminSession`)
- Поддержка выхода (logout) с удалением сессии
- Автоматическое удаление истекших сессий
- Обновление времени последней активности при каждом запросе

### 5. **Обновленный Middleware**
- Проверка наличия session cookie
- Редирект на страницу логина если сессия отсутствует
- Исключение для `/admin/login` и `/admin/logout`

## Новые файлы

### Утилиты
- **`lib/admin-auth.ts`** - все функции для работы с админ сессиями:
  - `createAdminSession()` - создание новой сессии
  - `validateAdminSession()` - проверка валидности
  - `deleteAdminSession()` - удаление сессии (logout)
  - `logLoginAttempt()` - логирование попыток
  - `checkLoginRateLimit()` - проверка rate limit

### Компоненты
- **`components/admin/AdminHeader.tsx`** - заголовок с кнопкой выхода

### Модели Prisma
```prisma
model AdminSession {
  id        Int       @id @default(autoincrement())
  token     String    @unique
  expiresAt DateTime
  createdAt DateTime  @default(now())
  lastActivity DateTime @updatedAt
  @@index([expiresAt])
}

model AdminLoginAttempt {
  id        Int       @id @default(autoincrement())
  ipAddress String
  success   Boolean
  createdAt DateTime  @default(now())
  @@index([ipAddress, createdAt])
}
```

## Обновленные файлы

- **`app/api/admin/login/route.ts`** - новая логика с session tokens и rate limiting
- **`app/api/admin/logout/route.ts`** - поддержка POST запроса и удаления сессии
- **`middleware.ts`** - проверка session token вместо пароля
- **`app/admin/page.tsx`** - добавление AdminHeader компонента
- **`app/admin/login/page.tsx`** - улучшенная обработка ошибок

## Переменные окружения

Убедитесь, что в `.env` установлена переменная `ADMIN_SECRET`:
```
ADMIN_SECRET=your-secure-password-here
```

## Рекомендации по дополнительной безопасности

### ✅ Сделано
- [x] Session tokens вместо пароля в cookie
- [x] Rate limiting (5 попыток за час)
- [x] HttpOnly cookies
- [x] Логирование попыток входа
- [x] Автоматическое удаление истекших сессий
- [x] Кнопка выхода на админ-панели

### 🔄 Рекомендуется в будущем
- [ ] **Двухфакторная аутентификация (2FA)** - SMS или приложение для аутентификации
- [ ] **IP whitelisting** - ограничение доступа по IP адресам
- [ ] **Session rotation** - периодическая смена токенов
- [ ] **CSRF tokens** - добавить CSRF protection для форм
- [ ] **Логирование действий** - записывать что делает админ
- [ ] **Alerts** - отправлять уведомления при входе
- [ ] **SSH keys вместо пароля** - для дополнительной защиты
- [ ] **VPN/Proxy requirement** - требовать VPN для входа в админку

## Тестирование

### Тест 1: Нормальный логин
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"your-admin-secret\"}"
```
Должны получить cookie `admin_session`

### Тест 2: Неверный пароль
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"wrong-password\"}"
```
Должна вернуться ошибка 401

### Тест 3: Rate limiting
```bash
# Запустить 6 раз с неверным паролем
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/admin/login \
    -H "Content-Type: application/json" \
    -d "{\"password\": \"wrong\"}"
done
```
6-й запрос должен вернуть ошибку 429

### Тест 4: Logout
```bash
curl -X POST http://localhost:3000/api/admin/logout
```

## Мониторинг безопасности

Проверяйте попытки входа в БД:
```sql
SELECT * FROM "AdminLoginAttempt" 
ORDER BY "createdAt" DESC 
LIMIT 20;

-- Невалидные сессии
SELECT * FROM "AdminSession" 
WHERE "expiresAt" > NOW();
```

---

**Ваша админ-панель теперь намного безопаснее! 🎉**
