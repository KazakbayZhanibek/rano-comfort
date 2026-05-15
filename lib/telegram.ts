export async function sendTelegramNotification(order: {
  id: number
  name: string
  phone: string
  address?: string | null
  subtotal?: number
  deliveryFee?: number
  promoCode?: string | null
  discount?: number
  total: number
  items: unknown
}) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('Telegram не настроен')
    return
  }

  let itemsText = ''
  try {
    const items = typeof order.items === 'string'
      ? JSON.parse(order.items)
      : order.items
    if (Array.isArray(items)) {
      itemsText = items
        .map((item: { name: string; quantity: number; price: number }) =>
          `  • ${item.name} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString('ru-KZ')} ₸`
        )
        .join('\n')
    }
  } catch {
    itemsText = '  (не удалось распарсить)'
  }

  const subtotal    = order.subtotal    || 0
  const deliveryFee = order.deliveryFee || 0
  const discount    = order.discount    || 0

  let summaryText = `\n📦 *Товары:*\n${itemsText}\n💳 *Итоги:*\n  • Сумма: ${subtotal.toLocaleString('ru-KZ')} ₸\n  • Доставка: ${deliveryFee === 0 ? 'Бесплатно' : deliveryFee.toLocaleString('ru-KZ') + ' ₸'}`

  if (order.promoCode) {
    summaryText += `\n  • Промокод: ${order.promoCode} (−${discount.toLocaleString('ru-KZ')} ₸)`
  }
  summaryText += `\n  • *Итого: ${order.total.toLocaleString('ru-KZ')} ₸*`

  const message = `🛒 *Новый заказ #${order.id}*\n👤 *Клиент:* ${order.name}\n📞 *Телефон:* ${order.phone}\n📍 *Адрес:* ${order.address ?? 'Самовывоз'}${summaryText}\n🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`

  const inline_keyboard = [
    [
      { text: '✅ Подтвердить', callback_data: `status_${order.id}_confirmed` },
      { text: '🚚 В доставке',  callback_data: `status_${order.id}_shipped`   },
    ],
    [
      { text: '📦 Доставлен',   callback_data: `status_${order.id}_delivered` },
      { text: '❌ Отменить',    callback_data: `status_${order.id}_cancelled` },
    ],
  ]

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        chat_id:      chatId,
        text:         message,
        parse_mode:   'Markdown',
        reply_markup: { inline_keyboard },
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('Telegram ошибка:', err)
    }
  } catch (error) {
    console.error('Не удалось отправить в Telegram:', error)
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id: callbackQueryId, text }),
  })
}

export async function editMessageText(chatId: string, messageId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:    chatId,
      message_id: messageId,
      text,
      parse_mode: 'Markdown',
    }),
  })
}

export async function notifyClient(telegramChatId: string, orderId: number, status: string) {
  const clientToken = process.env.TELEGRAM_CLIENT_BOT_TOKEN
  if (!clientToken) {
    console.error('TELEGRAM_CLIENT_BOT_TOKEN not configured')
    return
  }

  const STATUS_LABELS: Record<string, string> = {
    new:       '🛒 Новый',
    confirmed: '✅ Подтверждён',
    shipped:   '🚚 В доставке',
    delivered: '📦 Доставлен',
    cancelled: '❌ Отменён',
  }

  const messages: Record<string, string> = {
    confirmed: 'Ваш заказ подтверждён и готовится к отправке.',
    shipped:   'Курьер уже в пути! Будьте на связи.',
    delivered: 'Ваш заказ доставлен! Спасибо за покупку 🙏',
    cancelled: 'К сожалению, ваш заказ отменён. Свяжитесь с нами.',
  }

  const label   = STATUS_LABELS[status] || status
  const message = `🔔 *Статус заказа #${orderId}*\n\n${label}\n\n${messages[status] || ''}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${clientToken}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        chat_id:    telegramChatId,
        text:       message,
        parse_mode: 'Markdown',
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('Telegram notification error:', err)
    }
  } catch (error) {
    console.error('Failed to send telegram notification:', error)
  }
}