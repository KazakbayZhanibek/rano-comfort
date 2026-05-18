import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, slug, icon } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Название и slug обязательны' }, { status: 400 })
    }

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Категория с таким slug уже существует' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, slug, icon: icon || null },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}