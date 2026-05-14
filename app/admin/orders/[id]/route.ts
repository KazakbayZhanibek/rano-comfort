// app/api/admin/orders/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendStatusUpdateEmail } from '@/lib/email'

const STATUS_LABELS: Record<string, string> = {
  new:       '🟡 Новый',
  confirmed: '🔵 Принят',
  shipping:  '🚚 В пути',
  delivered: '✅ Доставлен',
  cancelled: '❌ Отменён',
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data:  { status },
  })

  // Уведомление в Telegram при смене статуса
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (token && chatId) {
    const label = STATUS_LABELS[status] ?? status
    const msg = `📦 Заказ #${order.id} — статус изменён на *${label}*\n👤 ${order.name}\n📞 ${order.phone}`

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    chatId,
        text:       msg,
        parse_mode: 'Markdown',
      }),
    }).catch(console.error)
  }

  // Отправляем email уведомление при смене статуса
  if (order.userId) {
    const user = await prisma.user.findUnique({
      where: { id: order.userId },
      select: { email: true }
    })
    
    if (user?.email) {
      sendStatusUpdateEmail({
        id: order.id,
        name: order.name,
        email: user.email,
        status: status,
      }).catch(console.error)
    }
  }

  return NextResponse.json(order)
}