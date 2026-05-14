import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT /api/profile/avatar - Обновить аватар
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, avatarUrl } = body

    if (!userId || !avatarUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { avatar: avatarUrl },
    })

    return NextResponse.json({
      success: true,
      avatar: user.avatar,
    })
  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}

// GET /api/profile/avatar - Получить аватар пользователя
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { avatar: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching avatar:', error)
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 })
  }
}
