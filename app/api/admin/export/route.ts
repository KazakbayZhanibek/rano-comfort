export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const header = ['ID', 'Клиент', 'Телефон', 'Адрес', 'Доставка', 'Оплата', 'Сумма', 'Статус', 'Дата']
    const rows = orders.map((o: any) => [
      o.id, o.name, o.phone,
      o.address ?? '',
      o.delivery ?? '',
      o.payment ?? '',
      Number(o.total),
      o.status,
      new Date(o.createdAt).toLocaleDateString('ru-RU'),
    ])

    const csv = [header, ...rows]
      .map(row => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const BOM = '\uFEFF'

    return new NextResponse(BOM + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    return new NextResponse('Error', { status: 500 })
  }
}