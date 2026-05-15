export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { newEmail } = body

    if (!newEmail || typeof newEmail !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Проверяем, что новый email не используется
    const existing = await prisma.user.findUnique({
      where: { email: newEmail }
    })

    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    // Обновляем email
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { email: newEmail }
    })

    return NextResponse.json({ 
      message: 'Email updated successfully',
      email: user.email 
    })

  } catch (error) {
    console.error('Error updating email:', error)
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 })
  }
}
