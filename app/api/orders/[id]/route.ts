export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyClient } from '@/lib/telegram'

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Парсим items из строки в массив
    return NextResponse.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
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

  // Отправляем уведомление клиенту в Telegram если у него есть chat_id
  if (order.telegramChatId) {
    notifyClient(order.telegramChatId, order.id, status).catch(err => {
      console.error('Failed to notify client:', err.message)
    })
  }

  return NextResponse.json(order)
}