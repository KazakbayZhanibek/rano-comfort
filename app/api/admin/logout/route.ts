import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { deleteAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value

    if (token) {
      await deleteAdminSession(token)
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.delete('admin_session')
    return res
  } catch (error) {
    console.error('Admin logout error:', error)
    const res = NextResponse.json({ ok: true })
    res.cookies.delete('admin_session')
    return res
  }
}

export async function GET() {
  const res = NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'))
  res.cookies.delete('admin_session')
  return res
}