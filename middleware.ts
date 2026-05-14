// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Логин и логаут не защищаем — иначе цикл
  if (pathname === '/admin/login' || pathname === '/admin/logout') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Проверяем сессию на сервере (для этого нам нужна функция)
    // Пока просто проверяем наличие токена
    // TODO: Добавить проверку валидности сессии через API call
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}