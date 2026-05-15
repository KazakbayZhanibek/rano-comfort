export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { notifyClient } = await import('@/lib/telegram')

    // Проверяем токен
    const token = request.cookies.get('admin_session')?.value
    if (!token || token !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const orderId = parseInt(params.id)

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    if (order.telegramChatId) {
      try {
        await notifyClient(order.telegramChatId, orderId, status)
      } catch (err) {
        console.error('notifyClient error:', err)
      }
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}