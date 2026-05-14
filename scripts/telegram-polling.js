const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN || '8275159016:AAFEuZr3RBJjoqyrpKZz-OrpapX9eqLQxRU'
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6295192258'
const API_URL = `https://api.telegram.org/bot${TOKEN}`

const STATUS_LABELS = {
  new:       '🛒 Новый',
  confirmed: '✅ Подтверждён',
  shipped:   '🚚 В доставке',
  delivered: '📦 Доставлен',
  cancelled: '❌ Отменён',
}

const NEXT_BUTTONS = {
  new: [[
    { text: '✅ Подтвердить', callback_data: 'status_{id}_confirmed' },
    { text: '❌ Отменить',    callback_data: 'status_{id}_cancelled' },
  ]],
  confirmed: [[
    { text: '🚚 Передать в доставку', callback_data: 'status_{id}_shipped' },
  ]],
  shipped: [[
    { text: '📦 Доставлен', callback_data: 'status_{id}_delivered' },
  ]],
  delivered: [],
  cancelled: [],
}

function buildKeyboard(orderId, status) {
  const buttons = NEXT_BUTTONS[status] || []
  if (buttons.length === 0) return undefined
  return {
    inline_keyboard: buttons.map(row =>
      row.map(btn => ({
        text:          btn.text,
        callback_data: btn.callback_data.replace('{id}', orderId),
      }))
    )
  }
}

async function sendMessage(chatId, text, keyboard) {
  await fetch(`${API_URL}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:      chatId,
      text,
      parse_mode:   'Markdown',
      reply_markup: keyboard,
    }),
  })
}

async function answerCallback(id, text) {
  await fetch(`${API_URL}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id: id, text }),
  })
}

async function editMessageWithKeyboard(chatId, messageId, text, keyboard) {
  await fetch(`${API_URL}/editMessageText`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:      chatId,
      message_id:   messageId,
      text,
      parse_mode:   'Markdown',
      reply_markup: keyboard || { inline_keyboard: [] },
    }),
  })
}

async function notifyClient(telegramChatId, orderId, status) {
  if (!telegramChatId) return

  // Используем клиентский бот токен
  const clientToken = process.env.TELEGRAM_CLIENT_BOT_TOKEN || '8684036663:AAFJpm-pOi5jkYl8EfQ5YjrDz_-CUjCAZmI'
  const clientApiUrl = `https://api.telegram.org/bot${clientToken}`

  const label = STATUS_LABELS[status] || status
  const messages = {
    confirmed: 'Ваш заказ подтверждён и готовится к отправке.',
    shipped:   'Курьер уже в пути! Будьте на связи.',
    delivered: 'Ваш заказ доставлен! Спасибо за покупку 🙏',
    cancelled: 'К сожалению, ваш заказ отменён. Свяжитесь с нами.',
  }
  const text = `🔔 *Статус заказа #${orderId}*\n\n${label}\n\n${messages[status] || ''}`

  await fetch(`${clientApiUrl}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: telegramChatId, text, parse_mode: 'Markdown' }),
  })
}

// ── Обработка /start order_ID от клиента ──────────────────
async function handleStartCommand(chatId, text, firstName) {
  const match = text.match(/\/start order_(\d+)/)

  if (!match) {
    // Просто /start без заказа
    await sendMessage(chatId,
      `Привет, ${firstName || 'покупатель'}! 👋\n\nЯ бот RANO Komfort Service.\n\nЧтобы отслеживать заказ, перейдите по ссылке со страницы заказа.`
    )
    return
  }

  const orderId = parseInt(match[1])

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } })

    if (!order) {
      await sendMessage(chatId, `❌ Заказ #${orderId} не найден.`)
      return
    }

    // Сохраняем chat_id клиента в заказ
    await prisma.order.update({
      where: { id: orderId },
      data:  { telegramChatId: String(chatId) },
    })

    const label = STATUS_LABELS[order.status] || order.status

    await sendMessage(chatId,
      `✅ *Вы подписались на уведомления!*\n\n` +
      `📦 *Заказ #${orderId}*\n` +
      `👤 ${order.name}\n` +
      `📞 ${order.phone}\n` +
      `💰 ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n` +
      `*Текущий статус:* ${label}\n\n` +
      `Я буду присылать уведомления при каждом изменении статуса.`
    )

    console.log(`📱 Клиент подписался на заказ #${orderId}, chat_id: ${chatId}`)

  } catch (err) {
    console.error('Ошибка при подписке:', err.message)
    await sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.')
  }
}

let offset  = 846359798
let running = false

async function getUpdates() {
  // Важно: слушаем и message и callback_query
  const res = await fetch(
    `${API_URL}/getUpdates?offset=${offset}&timeout=10&allowed_updates=["message","callback_query"]`
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.description)
  }
  return (await res.json()).result || []
}

async function poll() {
  if (running) return
  running = true

  try {
    const updates = await getUpdates()

    for (const update of updates) {
      offset = update.update_id + 1

      // ── Текстовые сообщения от клиентов ──
      if (update.message) {
        const msg       = update.message
        const chatId    = msg.chat.id
        const text      = msg.text || ''
        const firstName = msg.from?.first_name || ''

        if (text.startsWith('/start')) {
          await handleStartCommand(chatId, text, firstName)
        }
        continue
      }

      // ── Нажатия кнопок (для админа) ──
      const cb = update.callback_query
      if (!cb) continue

      const data      = cb.data
      const messageId = cb.message.message_id
      const chatId    = cb.message.chat.id
      const queryId   = cb.id

      if (data && data.startsWith('status_')) {
        const parts     = data.split('_')
        const orderId   = parseInt(parts[1])
        const newStatus = parts[2]

        try {
          const order = await prisma.order.update({
            where: { id: orderId },
            data:  { status: newStatus },
          })

          const label    = STATUS_LABELS[newStatus] || newStatus
          const keyboard = buildKeyboard(orderId, newStatus)

          console.log(`✅ Заказ #${orderId} → ${label}`)

          await answerCallback(queryId, `Статус: ${label}`)
          await editMessageWithKeyboard(
            chatId, messageId,
            `📋 *Заказ #${orderId}*\n` +
            `👤 ${order.name}\n` +
            `📞 ${order.phone}\n` +
            `💰 ${Number(order.total).toLocaleString('ru-RU')} ₸\n\n` +
            `*Статус:* ${label}`,
            keyboard
          )

          // Уведомляем клиента если подписан
          if (order.telegramChatId) {
            await notifyClient(order.telegramChatId, orderId, newStatus)
            console.log(`📱 Клиент уведомлён о заказе #${orderId}`)
          }

        } catch (err) {
          console.error('Ошибка обновления:', err.message)
          await answerCallback(queryId, '❌ Ошибка')
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message)
  }

  running = false
  setTimeout(poll, 1000)
}

async function init() {
  try {
    // Получаем последний update_id чтобы не обрабатывать старые сообщения
    const res = await fetch(`${API_URL}/getUpdates?offset=-1`)
    const data = await res.json()
    if (data.result && data.result.length > 0) {
      offset = data.result[data.result.length - 1].update_id + 1
    }
    console.log(`🤖 Бот запущен, offset: ${offset}`)
    poll()
  } catch (err) {
    console.log('🤖 Бот запущен...')
    poll()
  }
}

init()