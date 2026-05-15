export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/wishlist - получить список избранных товаров пользователя
export async function GET(_: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST /api/wishlist - добавить товар в избранное
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем, есть ли уже такой товар в wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: user.id, productId: parseInt(productId) },
      },
    })

    if (existing) {
      // Если есть, удаляем
      await prisma.wishlist.delete({
        where: {
          userId_productId: { userId: user.id, productId: parseInt(productId) },
        },
      })
      return NextResponse.json({ added: false })
    }

    // Если нет, добавляем
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: parseInt(productId),
      },
    })

    return NextResponse.json({ added: true })
  } catch (error) {
    console.error('Error updating wishlist:', error)
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 })
  }
}
