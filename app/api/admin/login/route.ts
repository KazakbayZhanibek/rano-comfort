export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Простой rate limiter в памяти
const attempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }

  if (record.count >= 5) return false

  record.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много попыток. Попробуйте через 15 минут.' },
        { status: 429 }
      )
    }

    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Пароль не указан' }, { status: 400 })
    }

    if (password !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}