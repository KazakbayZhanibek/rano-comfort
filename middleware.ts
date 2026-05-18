import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Логин не защищаем
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value

    // Нет токена — редирект на логин
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Проверяем токен
    const validToken = process.env.ADMIN_SECRET
    if (!validToken || sessionToken !== validToken) {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.delete('admin_session')
      return res
    }

    // Добавляем security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
  }

  // Security headers для всего сайта
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}