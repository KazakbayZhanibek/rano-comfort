export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where:   { productId: parseInt(productId) },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, name, rating, text, userId } = body

    if (!productId || !name || !rating || !text) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Рейтинг от 1 до 5' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        name,
        rating,
        text,
        userId: userId ? parseInt(userId) : null,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
