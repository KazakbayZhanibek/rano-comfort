import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAdminSession, logLoginAttempt, checkLoginRateLimit } from '@/lib/admin-auth'

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwardedFor?.split(',')[0].trim() || realIp || 'unknown'
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const clientIp = getClientIp(req)

    // Проверяем rate limit
    const isAllowed = await checkLoginRateLimit(clientIp)
    if (!isAllowed) {
      await logLoginAttempt(clientIp, false)
      return NextResponse.json(
        { error: 'Слишком много неудачных попыток. Попробуйте позже.' },
        { status: 429 }
      )
    }

    // Проверяем пароль
    if (password !== process.env.ADMIN_SECRET) {
      await logLoginAttempt(clientIp, false)
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      )
    }

    // Успешный вход - создаем сессию
    const session = await createAdminSession()
    await logLoginAttempt(clientIp, true)

    const res = NextResponse.json({ ok: true })

    // Устанавливаем secure http-only cookie с session token
    res.cookies.set('admin_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 дней в секундах
    })

    return res
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}