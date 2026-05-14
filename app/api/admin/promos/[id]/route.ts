import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminSession } from '@/lib/admin-auth'

// Функция для получения админ-сессии из cookies
function getAdminToken(request: NextRequest): string | null {
  return request.cookies.get('admin_session')?.value || null
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем админ-сессию
    const token = getAdminToken(request)
    if (!token || !(await validateAdminSession(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.promo.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Promo delete error:', error)
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 })
  }
}
