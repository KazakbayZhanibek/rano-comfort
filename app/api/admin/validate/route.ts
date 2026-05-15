export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = body?.token

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const session = await validateAdminSession(token)
    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Admin validation error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
