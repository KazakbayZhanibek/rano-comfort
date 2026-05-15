import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Формируем CSV
  const header = ['ID', 'Клиент', 'Телефон', 'Адрес', 'Доставка', 'Оплата', 'Сумма', 'Статус', 'Дата']
  const rows = orders.map(o => [
    o.id,
    o.name,
    o.phone,
    o.address ?? '',
    o.delivery ?? '',
    o.payment ?? '',
    Number(o.total),
    o.status,
    new Date(o.createdAt).toLocaleDateString('ru-RU'),
  ])

  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const BOM = '\uFEFF' // для корректного отображения кириллицы в Excel

  return new NextResponse(BOM + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}