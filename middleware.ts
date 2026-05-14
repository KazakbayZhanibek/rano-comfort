// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateAdminSession } from '@/lib/admin-auth'

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

    // Проверяем валидность сессии
    const isValid = await validateAdminSession(sessionToken)
    if (!isValid) {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.delete('admin_session')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}