import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, phone, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email уже используется' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        passwordHash: hash,
      },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 })
  }
}