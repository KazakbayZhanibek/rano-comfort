import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, slug, icon } = await req.json()
    const category = await prisma.category.update({
      where: { id: Number(params.id) },
      data:  { name, slug, icon: icon || null },
    })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const count = await prisma.product.count({
      where: { categoryId: Number(params.id) },
    })

    if (count > 0) {
      return NextResponse.json(
        { error: `Нельзя удалить — в категории ${count} товаров` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}