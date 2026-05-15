const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Бот для тебя (заказы + управление статусами)
const ADMIN_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!ADMIN_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN не задан')

const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID
if (!ADMIN_CHAT_ID) throw new Error('TELEGRAM_CHAT_ID не задан')

// Бот для клиентов (уведомления)
const CLIENT_TOKEN = process.env.TELEGRAM_CLIENT_BOT_TOKEN
if (!CLIENT_TOKEN) throw new Error('TELEGRAM_CLIENT_BOT_TOKEN не задан')

const ADMIN_API  = `https://api.telegram.org/bot${ADMIN_TOKEN}`
const CLIENT_API = `https://api.telegram.org/bot${CLIENT_TOKEN}`

const STATUS_LABELS = {
  confirmed: '✅ Подтверждён',
  shipped:   '🚚 В доставке',
  delivered: '📦 Доставлен',
  cancelled: '❌ Отменён',
}

let offset = 0

async function getUpdates() {
  const res = await fetch(`${CLIENT_API}/getUpdates?offset=${offset}&timeout=10`)
  if (!res.ok) throw new Error((await res.json()).description)
  return (await res.json()).result || []
}

async function sendToClient(chatId, text) {
  await fetch(`${CLIENT_API}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

async function sendToAdmin(text, keyboard) {
  await fetch(`${ADMIN_API}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:      ADMIN_CHAT_ID,
      text,
      parse_mode:   'Markdown',
      reply_markup: keyboard ? { inline_keyboard: keyboard } : undefined,
    }),
  })
}

async function answerCallback(id, text) {
  await fetch(`${CLIENT_API}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id: id, text }),
  })
}

async function editMessage(chatId, messageId, text) {
  await fetch(`${CLIENT_API}/editMessageText`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'Markdown' }),
  })
}

async function poll() {
  try {
    const updates = await getUpdates()

    for (const update of updates) {
      offset = update.update_id + 1

      // Обработка /start от клиента
      const msg = update.message
      if (msg && msg.text && msg.text.startsWith('/start')) {
        const parts   = msg.text.split(' ')
        const payload = parts[1]
        const chatId  = String(msg.chat.id)
        const userName = msg.chat.first_name || 'Клиент'

        if (payload && payload.startsWith('order_')) {
          const orderId = parseInt(payload.replace('order_', ''))

          try {
            const order = await prisma.order.findUnique({ where: { id: orderId } })

            if (order) {
              // Сохраняем telegramChatId клиента
              await prisma.order.update({
                where: { id: orderId },
                data:  { telegramChatId: chatId },
              })

              const currentStatus = STATUS_LABELS[order.status] || '🛒 Новый'

              await sendToClient(chatId,
                `✨ *Спасибо за заказ!*\n\n` +
                `━━━━━━━━━━━━━━━━━\n` +
                `📦 Заказ *#${orderId}*\n` +
                `━━━━━━━━━━━━━━━━━\n\n` +
                `👤 Клиент: ${order.name}\n` +
                `📞 Телефон: ${order.phone}\n` +
                `💰 Сумма: ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n` +
                `🔔 *Статус заказа:*\n` +
                `${currentStatus}\n\n` +
                `━━━━━━━━━━━━━━━━━\n\n` +
                `Вы будете получать уведомления об изменениях.\n` +
                `Спасибо за покупку! 🙏`
              )

              console.log(`📱 Клиент подписался на заказ #${orderId}`)
            } else {
              await sendToClient(chatId, '❌ Заказ не найден. Проверьте номер заказа.')
            }
          } catch (err) {
            console.error('Start error:', err.message)
          }
        } else {
          await sendToClient(chatId,
            `👋 *Добро пожаловать в RANO Komfort!*\n\n` +
            `Здесь вы получаете уведомления о статусе заказа.\n\n` +
            `Чтобы подписаться — откройте страницу вашего заказа и нажмите кнопку *"Подписаться на уведомления"* 👇`
          )
        }
      }

      // Обработка кнопок статуса (от тебя в админ боте)
      const cb = update.callback_query
      if (cb && cb.data && cb.data.startsWith('status_')) {
        const parts     = cb.data.split('_')
        const orderId   = parseInt(parts[1])
        const newStatus = parts[2]
        const queryId   = cb.id
        const messageId = cb.message.message_id
        const chatId    = cb.message.chat.id

        try {
          // Обновляем статус через API (который отправляет email)
          const apiUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const apiRes = await fetch(`${apiUrl}/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          })
          
          const order = await apiRes.json()

          const label = STATUS_LABELS[newStatus] || newStatus
          console.log(`✅ Заказ #${orderId} → ${label}`)

          await answerCallback(queryId, `Статус: ${label}`)
          await editMessage(chatId, messageId,
            `📋 *Заказ #${orderId}*\n👤 ${order.name}\n📞 ${order.phone}\n💰 ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n*Статус:* ${label}`
          )

          // Уведомляем клиента если подписан
          if (order.telegramChatId) {
            await sendToClient(order.telegramChatId,
              `🔔 *Статус вашего заказа #${orderId} изменился!*\n\n` +
              `${label}\n\n` +
              `👤 ${order.name}\n` +
              `💰 ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n` +
              (newStatus === 'shipped'
                ? '🚚 Курьер уже в пути! Будьте на связи.'
                : newStatus === 'delivered'
                ? '📦 Ваш заказ доставлен! Спасибо за покупку 🙏'
                : newStatus === 'confirmed'
                ? '✅ Ваш заказ подтверждён и готовится к отправке.'
                : newStatus === 'cancelled'
                ? '❌ К сожалению, ваш заказ отменён. Свяжитесь с нами для уточнений.'
                : '')
            )
            console.log(`📱 Клиент уведомлён о статусе заказа #${orderId}`)
          }
        } catch (err) {
          console.error('Status error:', err.message)
          await answerCallback(queryId, '❌ Ошибка')
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message)
  }

  setTimeout(poll, 1000)
}

console.log('🤖 Бот клиентских уведомлений запущен...')
poll()