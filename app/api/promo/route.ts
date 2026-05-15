export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, orderTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Введите промокод' }, { status: 400 })
    }

    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!promo) {
      return NextResponse.json({ error: 'Промокод не найден' }, { status: 404 })
    }

    if (!promo.isActive) {
      return NextResponse.json({ error: 'Промокод неактивен' }, { status: 400 })
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json({ error: 'Срок действия промокода истёк' }, { status: 400 })
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: 'Промокод исчерпан' }, { status: 400 })
    }

    if (orderTotal < promo.minOrder) {
      return NextResponse.json({
        error: `Минимальная сумма заказа ${promo.minOrder.toLocaleString('ru-KZ')} ₸`,
      }, { status: 400 })
    }

    const discount = promo.type === 'percent'
      ? Math.round(orderTotal * promo.value / 100)
      : promo.value

    return NextResponse.json({
      code:     promo.code,
      type:     promo.type,
      value:    promo.value,
      discount: Math.min(discount, orderTotal),
      message:  promo.type === 'percent'
        ? `Скидка ${promo.value}%`
        : `Скидка ${promo.value.toLocaleString('ru-KZ')} ₸`,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
