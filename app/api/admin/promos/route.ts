export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminSession } from '@/lib/admin-auth'

// Функция для получения админ-сессии из cookies
function getAdminToken(request: NextRequest): string | null {
  return request.cookies.get('admin_session')?.value || null
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const promo = await prisma.promo.create({ data: body })
    return NextResponse.json(promo, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Такой промокод уже существует' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
