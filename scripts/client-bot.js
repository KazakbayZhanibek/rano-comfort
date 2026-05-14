const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TOKEN   = '8684036663:AAFJpm-pOi5jkYl8EfQ5YjrDz_-CUjCAZmI'
const API_URL = `https://api.telegram.org/bot${TOKEN}`

const STATUS_LABELS = {
  new:       'Новый — ожидает подтверждения',
  confirmed: 'Подтверждён',
  shipped:   'В доставке',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

async function sendMessage(chatId, text) {
  await fetch(`${API_URL}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

async function handleStart(chatId, text, firstName) {
  console.log(`Получено: "${text}" от ${firstName} (${chatId})`)

  const match = text.match(/\/start order_(\d+)/)

  if (!match) {
    await sendMessage(chatId,
      `Привет, ${firstName || 'покупатель'}!\n\n` +
      `Я бот RANO Komfort Service.\n` +
      `Перейдите по ссылке со страницы заказа чтобы подписаться на уведомления.`
    )
    return
  }

  const orderId = parseInt(match[1])
  console.log(`Ищем заказ #${orderId}...`)

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } })

    if (!order) {
      await sendMessage(chatId, `Заказ #${orderId} не найден.`)
      return
    }

    await prisma.order.update({
      where: { id: orderId },
      data:  { telegramChatId: String(chatId) },
    })

    const label = STATUS_LABELS[order.status] || order.status

    await sendMessage(chatId,
      `✨ *Спасибо за заказ!*\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `📦 Заказ *#${orderId}*\n` +
      `━━━━━━━━━━━━━━━━━\n\n` +
      `👤 Клиент: ${order.name}\n` +
      `📞 Телефон: ${order.phone}\n` +
      `💰 Сумма: ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n` +
      `🔔 *Статус заказа:*\n` +
      `${label}\n\n` +
      `━━━━━━━━━━━━━━━━━\n\n` +
      `Вы будете получать уведомления об изменениях.\n` +
      `Спасибо за покупку! 🙏`
    )

    console.log(`Клиент ${chatId} подписался на заказ #${orderId}`)

  } catch (err) {
    console.error('Ошибка:', err.message)
    await sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.')
  }
}

let offset = 0

async function init() {
  console.log('Клиентский бот запускается...')
  try {
    const res  = await fetch(`${API_URL}/getUpdates?offset=-1`)
    const data = await res.json()
    if (data.ok && data.result.length > 0) {
      offset = data.result[data.result.length - 1].update_id + 1
    }
    console.log(`Бот запущен! offset: ${offset}`)
  } catch (err) {
    console.error('Ошибка запуска:', err.message)
  }
  poll()
}

async function poll() {
  try {
    const res  = await fetch(`${API_URL}/getUpdates?offset=${offset}&timeout=30`)
    const data = await res.json()

    if (data.result) {
      for (const update of data.result) {
        offset = update.update_id + 1
        if (update.message?.text?.startsWith('/start')) {
          const msg = update.message
          await handleStart(msg.chat.id, msg.text, msg.from?.first_name)
        }
      }
    }
  } catch (err) {
    console.error('Ошибка:', err.message)
  }

  setTimeout(poll, 1000)
}

init()