export const dynamic = 'force-dynamic'
export const revalidate = 0

// app/api/orders/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { sendTelegramNotification } from '@/lib/telegram'
import { sendOrderNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    const body = await request.json()
    const { name, phone, address, delivery, payment, items, subtotal, deliveryFee, promoCode, discount, total } = body

    if (!name || !phone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Получаем userId из сессии если есть
    let userId: number | null = null
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
      userId = user?.id ?? null
    }

    // Если использован промокод, увеличиваем счётчик его использований
    if (promoCode) {
      try {
        await prisma.promo.update({
          where: { code: promoCode.toUpperCase().trim() },
          data:  { usedCount: { increment: 1 } },
        })
      } catch (err) {
        console.error('Failed to increment promo usage:', err)
        // Не прерываем создание заказа если ошибка с промокодом
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        name,
        phone,
        address,
        delivery,
        payment,
        subtotal: parseFloat(subtotal),
        deliveryFee: parseFloat(deliveryFee),
        promoCode: promoCode || null,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total),
        status: 'new',
        items: JSON.stringify(items.map((item: any) => ({
          productId: item.id,
          name: item.name,
          price: parseFloat(item.price),
          volume: item.volume,
          quantity: item.quantity
        })))
      }
    })

    // Parse items back to JSON for response
    const orderWithItems = {
      ...order,
      items: JSON.parse(order.items)
    }

    // ← добавь эти строки после создания заказа
    sendTelegramNotification({
      id:      order.id,
      name:    order.name,
      phone:   order.phone,
      address: order.address,
      promoCode: order.promoCode,
      discount: Number(order.discount),
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total:   Number(order.total),
      items:   JSON.parse(order.items),
    }).catch(console.error)

    // Отправляем email уведомление если пользователь авторизован
    if (session?.user?.email) {
      sendOrderNotification({
        id:      order.id,
        name:    order.name,
        phone:   order.phone,
        email:   session.user.email,
        address: order.address,
        delivery: order.delivery,
        promoCode: order.promoCode,
        discount: Number(order.discount),
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        total:   Number(order.total),
        items:   JSON.parse(order.items),
      }).catch(console.error)
    }

    return NextResponse.json(orderWithItems, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    let where: any = {}

    // Приоритет 1: Если пользователь авторизован - загружаем его заказы
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, phone: true },
      })
      if (user) {
        where.userId = user.id
        
        // ВАЖНО: Связываем старые заказы (от гостей) с аккаунтом пользователя по телефону
        if (user.phone) {
          try {
            await prisma.order.updateMany({
              where: {
                phone: user.phone,
                userId: null // только заказы без userId
              },
              data: {
                userId: user.id
              }
            })
          } catch (e) {
            console.log('Could not link orders by phone:', e)
          }
        }
      }
    }
    // Приоритет 2: Если не авторизован, загружаем по телефону (для гостей)
    else if (phone) {
      where.phone = { contains: phone, mode: 'insensitive' }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Parse items for each order
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }))

    return NextResponse.json(ordersWithItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}