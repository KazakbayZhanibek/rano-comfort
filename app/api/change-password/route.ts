export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const limit = rateLimit(ip, 5, 15 * 60 * 1000) // 5 попыток за 15 минут

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте через 15 минут.' },
        { status: 429 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем текущий пароль
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Обновляем пароль
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
