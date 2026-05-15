# 🤖 Настройка Telegram интеграции

Система отслеживания заказов работает через **два отдельных Telegram-бота**:

## 1️⃣ Админ-бот (TELEGRAM_BOT_TOKEN)

Получает новые заказы и управляет их статусами.

### Создание админ-бота

1. Напишите [@BotFather](https://t.me/botfather) в Telegram
2. Команда: `/newbot`
3. Дайте имя боту, например: `RanoKomfort_Orders_Bot`
4. Получите токен, пример: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`

### Получение TELEGRAM_CHAT_ID

Чат ID нужен, чтобы отправлять админу уведомления о новых заказах.

1. Напишите боту команду: `/start`
2. Откройте ссылку в браузере:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
   где `<YOUR_TOKEN>` - ваш токен админ-бота

3. Найдите в ответе:
   ```json
   "chat": {
     "id": 123456789,
     ...
   }
   ```
   Это ваш TELEGRAM_CHAT_ID

## 2️⃣ Клиент-бот (TELEGRAM_CLIENT_BOT_TOKEN)

Отправляет клиентам уведомления об изменении статуса заказа.

### Создание клиент-бота

1. Повторите шаги с @BotFather
2. Дайте имя: `RanoKomfort_Notifications_Bot` (или `orderscmfshm_bot` если это уже использованное имя)
3. Скопируйте токен

## 📝 Настройка переменных окружения

Добавьте в ваш `.env.local`:

```env
# Админ-бот
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789

# Клиент-бот
TELEGRAM_CLIENT_BOT_TOKEN=987654:XYZ-UVW5678jklmnop-abc12D34efGH55
```

## 🚀 Запуск бота для клиентских уведомлений

Скрипт `app/scripts/telegram-polling.js` должен **постоянно работать** для обработки сообщений от клиентов и отправки уведомлений.

### Локальный запуск (для тестирования)

```bash
# Убедитесь, что npm зависимости установлены
npm install

# Запустите бот
node app/scripts/telegram-polling.js
```

Вы должны увидеть:
```
🤖 Бот клиентских уведомлений запущен...
```

### Production запуск

Используйте процесс-менеджер (PM2, systemd, Docker и т.д.):

#### С PM2:
```bash
npm install -g pm2
pm2 start app/scripts/telegram-polling.js --name "telegram-bot"
pm2 save
pm2 startup
```

#### С systemd (Linux):

Создайте файл `/etc/systemd/system/telegram-bot.service`:

```ini
[Unit]
Description=Telegram Bot for Order Notifications
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/rano-komfort
Environment="NODE_ENV=production"
Environment="DATABASE_URL=your_database_url"
Environment="TELEGRAM_BOT_TOKEN=your_token"
Environment="TELEGRAM_CHAT_ID=your_chat_id"
Environment="TELEGRAM_CLIENT_BOT_TOKEN=your_client_token"
ExecStart=/usr/bin/node app/scripts/telegram-polling.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
sudo systemctl status telegram-bot
```

## 🔄 Как это работает

1. **Клиент создает заказ** → получает уникальный номер заказа (#123)

2. **На странице заказа** видит кнопку "Подписаться на уведомления"
   - Ведет на: `https://t.me/orderscmfshm_bot?start=order_123`

3. **Клиент нажимает кнопку** → переходит в бот Telegram

4. **Бот обрабатывает `/start order_123`**:
   - Находит заказ в БД
   - Сохраняет `telegramChatId` клиента
   - Отправляет подтверждение с текущим статусом

5. **При изменении статуса** в админ-панели:
   - Админ нажимает кнопку (✅ Подтвердить, 🚚 В доставке и т.д.)
   - Клиент получает уведомление в Telegram

## 📊 Структура таблицы Order

```sql
-- Поле для сохранения Telegram ID клиента
ALTER TABLE "Order" ADD COLUMN "telegramChatId" TEXT;
```

Это поле заполняется автоматически когда клиент подписывается через бота.

## ✅ Проверка

### 1. Админ получает заказы?
- Создайте тестовый заказ
- Проверьте, что админ-бот получил сообщение в Telegram

### 2. Клиент может подписаться?
- Нажмите кнопку "Подписаться на уведомления" на странице заказа
- Должна открыться ссылка на Telegram-бота
- Бот должен приветствовать вас и запросить команду

### 3. Статусы обновляются?
- В админ-боте нажмите кнопку смены статуса
- Проверьте, что клиент получил уведомление

## 🐛 Troubleshooting

### Скрипт не запускается
```bash
node app/scripts/telegram-polling.js
# Должна быть ошибка вроде:
# Error: TELEGRAM_CLIENT_BOT_TOKEN не задан
```

Решение: проверьте, что в `.env.local` есть `TELEGRAM_CLIENT_BOT_TOKEN`

### Клиент не получает уведомления
1. Проверьте, что скрипт `telegram-polling.js` запущен
2. Проверьте логи: `tail -f /var/log/telegram-bot.log` (если используется systemd)
3. Убедитесь, что `telegramChatId` сохранен в БД:
   ```sql
   SELECT id, name, phone, telegramChatId, status FROM "Order" WHERE id = 123;
   ```

### "Бот не найден" при подписке
- Проверьте, что имя бота в ссылке правильное
- В коде: `href={https://t.me/orderscmfshm_bot?start=order_${order.id}}`
- Замените `orderscmfshm_bot` на имя вашего клиент-бота

## 📱 Пример взаимодействия

```
Клиент:
/start order_123

Бот:
✨ Спасибо за заказ!
━━━━━━━━━━━━━━━━━
📦 Заказ #123
━━━━━━━━━━━━━━━━━

👤 Клиент: Иван Петров
📞 Телефон: +7 (777) 123-45-67
💰 Сумма: 45,000 ₸

🔔 Статус заказа:
🛒 Новый

━━━━━━━━━━━━━━━━━

Вы будете получать уведомления об изменениях.
Спасибо за покупку! 🙏
```

Затем при изменении статуса:

```
Бот:
🔔 Статус вашего заказа #123 изменился!

✅ Подтверждён

👤 Иван Петров
💰 45,000 ₸

✅ Ваш заказ подтверждён и готовится к отправке.
```
