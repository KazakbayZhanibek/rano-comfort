# 📧 Настройка Email Уведомлений

## ✨ Что было добавлено

Теперь при заказе и изменении статуса клиенты получают **красивые HTML письма** на почту с:
- ✅ Информацией о заказе (номер, товары, сумма)
- 📦 Актуальным статусом
- 🔗 Ссылкой на страницу заказа
- 🎨 Профессиональным оформлением

## 🚀 Быстрая настройка

### Вариант 1: Яндекс.Почта (рекомендуется)

1. **Создай Яндекс.Почту** (если нет):
   - https://mail.yandex.ru

2. **Создай пароль приложения**:
   - Войди в https://passport.yandex.ru/account/security/
   - Раздел "Пароли приложений"
   - Выбери "Почта" и "Windows"
   - Скопируй пароль

3. **Добавь в `.env.local`**:
   ```env
   SMTP_HOST=smtp.yandex.ru
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@yandex.ru
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx    # Пароль приложения
   SMTP_FROM=your-email@yandex.ru
   NEXTAUTH_URL=http://localhost:3000  # (или твой реальный URL в продакшене)
   ```

4. **Перезагрузи сервер**:
   ```bash
   npm run dev
   ```

---

### Вариант 2: Gmail

1. **Включи 2FA** в аккаунте Google:
   - https://accounts.google.com/security

2. **Создай пароль приложения**:
   - https://myaccount.google.com/apppasswords
   - Выбери "Почта" и "Windows"
   - Скопируй пароль

3. **Добавь в `.env.local`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx    # Пароль приложения
   SMTP_FROM=noreply@gmail.com
   NEXTAUTH_URL=http://localhost:3000
   ```

---

### Вариант 3: Mailgun (платно, но надежно)

1. **Зарегистрируйся на** https://mailgun.com
2. **Получи SMTP креденшалы** из панели управления
3. **Добавь в `.env.local`**:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-password
   SMTP_FROM=noreply@your-domain.mailgun.org
   NEXTAUTH_URL=http://localhost:3000
   ```

---

## 🧪 Проверка работы

1. **Создай тестовый заказ**:
   - Залогинься с аккаунта
   - Добавь товар в корзину
   - Перейди на оформление и заказы

2. **Проверь почту**:
   - На указанный email должно придти письмо с заказом
   - Если не пришло — проверь папку "Спам"

3. **Проверь логи**:
   ```bash
   # В консоли должно быть:
   ✅ Email отправлен на your-email@gmail.com
   ```

---

## 📊 Когда отправляются письма

| Событие | Кому | Статус |
|---------|------|--------|
| 📦 Новый заказ | Зарегистрированному пользователю | Новый |
| 🔄 Смена статуса | Пользователю заказа | Любой статус |
| 📱 Telegram | Админу + клиенту в боте | Всегда |

---

## 🔧 Troubleshooting

### Письма не приходят?

**1. Проверь переменные окружения**:
```bash
# В терминале выведи переменные (без паролей!)
echo $SMTP_HOST
echo $SMTP_USER
```

**2. Проверь логи сервера**:
```
npm run dev
# Ищи сообщение: "✅ Email отправлен" или "❌ Ошибка отправки"
```

**3. Проверь папку "Спам"** (gmail, yandex часто туда кидают)

**4. Попробуй другой сервис** (Gmail вместо Яндекса)

---

## 🛡️ Безопасность

- 🔐 **Пароль приложения** ≠ основной пароль (безопаснее)
- 🚫 **Никогда не публикуй `.env.local`** в GitHub
- ✅ **В продакшене** используй переменные окружения хостинга

---

## 📝 Файлы которые были обновлены

- ✅ `/lib/email.ts` — Функции отправки писем
- ✅ `/app/api/orders/route.ts` — Отправка письма при создании заказа
- ✅ `/app/admin/orders/[id]/route.ts` — Отправка при смене статуса
- ✅ `/app/scripts/telegram-polling.js` — Обновлено для использования API

---

## 🎉 Готово!

Теперь клиенты будут получать прекрасные письма об их заказах!
