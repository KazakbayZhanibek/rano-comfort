import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminSession } from '@/lib/admin-auth'
import { notifyClient } from '@/lib/telegram'

// Функция для получения админ-сессии из cookies
function getAdminToken(request: NextRequest): string | null {
  return request.cookies.get('admin_session')?.value || null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const orderId = parseInt(params.id)

    // Обновляем заказ
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    // Отправляем уведомление клиенту в Telegram
    if (order.telegramChatId) {
      try {
        await notifyClient(order.telegramChatId, orderId, status)
      } catch (err) {
        console.error('Failed to send telegram notification:', err)
        // Не прерываем если уведомление не отправилось
      }
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
