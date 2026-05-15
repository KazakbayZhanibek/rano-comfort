import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  params: {
    id: string
  }
}

export default async function AdminOrderPage({ params }: PageProps) {
  const orderId = Number(params.id)

  if (!Number.isInteger(orderId)) {
    notFound()
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  if (!order) {
    notFound()
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: 800,
        color: 'var(--color-text)',
        marginBottom: '1rem',
      }}>
        Заказ #{order.id}
      </h1>

      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1.5rem',
      }}>
        <p><strong>Клиент:</strong> {order.name}</p>
        <p><strong>Телефон:</strong> {order.phone}</p>
        <p><strong>Адрес:</strong> {order.address ?? '—'}</p>
        <p><strong>Сумма:</strong> {Number(order.total).toLocaleString('ru-KZ')} ₸</p>
        <p><strong>Статус:</strong> {order.status}</p>
        <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString('ru-RU')}</p>
      </div>
    </div>
  )
}
