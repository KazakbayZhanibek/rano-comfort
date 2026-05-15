export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    console.log(`[PATCH /api/admin/orders/${params.id}] Запрос получен`)
    
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      console.error(`[PATCH /api/admin/orders/${params.id}] ❌ Unauthorized`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body
    console.log(`[PATCH /api/admin/orders/${params.id}] Новый статус: ${status}`)

    if (!status) {
      console.error(`[PATCH /api/admin/orders/${params.id}] ❌ Status не задан`)
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const orderId = parseInt(params.id)

    // Обновляем заказ
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    
    console.log(`[PATCH /api/admin/orders/${params.id}] ✓ Заказ обновлён в БД`)
    console.log(`[PATCH /api/admin/orders/${params.id}] telegramChatId = ${order.telegramChatId}`)

    // Отправляем уведомление клиенту в Telegram
    if (order.telegramChatId) {
      console.log(`[PATCH /api/admin/orders/${params.id}] 📱 Вызываем notifyClient...`)
      try {
        await notifyClient(order.telegramChatId, orderId, status)
      } catch (err) {
        console.error(`[PATCH /api/admin/orders/${params.id}] ❌ notifyClient error:`, err)
      }
    } else {
      console.warn(`[PATCH /api/admin/orders/${params.id}] ⚠️ telegramChatId отсутствует`)
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error(`[PATCH /api/admin/orders/${params.id}] Order update error:`, error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
