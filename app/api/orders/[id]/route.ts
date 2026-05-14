import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Парсим items из строки в массив
    return NextResponse.json({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()
  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data:  { status },
  })
  return NextResponse.json(order)
}