import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { answerCallbackQuery, editMessageText } from '@/lib/telegram'

const STATUS_LABELS: Record<string, string> = {
  confirmed: '✅ Подтверждён',
  shipped:   '🚚 В доставке',
  delivered: '📦 Доставлен',
  cancelled: '❌ Отменён',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const callbackQuery = body.callback_query
    if (!callbackQuery) return NextResponse.json({ ok: true })

    const data      = callbackQuery.data as string
    const messageId = callbackQuery.message.message_id
    const chatId    = String(callbackQuery.message.chat.id)
    const queryId   = callbackQuery.id

    // Формат: status_<orderId>_<newStatus>
    if (data.startsWith('status_')) {
      const parts     = data.split('_')
      const orderId   = parseInt(parts[1])
      const newStatus = parts[2]

      // Обновляем статус в БД
      const order = await prisma.order.update({
        where: { id: orderId },
        data:  { status: newStatus },
      })

      const label = STATUS_LABELS[newStatus] ?? newStatus

      // Отвечаем на callback
      await answerCallbackQuery(queryId, `Статус изменён: ${label}`)

      // Обновляем сообщение в Telegram
      await editMessageText(
        chatId,
        messageId,
        `📋 *Заказ #${orderId}*\n👤 ${order.name}\n📞 ${order.phone}\n💰 ${Number(order.total).toLocaleString('ru-KZ')} ₸\n\n*Статус:* ${label}`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: true })
  }
}