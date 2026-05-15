import { prisma } from '@/lib/prisma'
import OrderStatusSelect from '@/app/admin/orders/OrderStatusSelect'

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', fontWeight: 800,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Заказы
        </h1>
        
        <a
          href="/api/admin/export"
          download
          style={{
            padding: '0.625rem 1.25rem',
            background: '#16A34A', color: '#fff',
            borderRadius: '9999px', textDecoration: 'none',
            fontWeight: 600, fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}
        >
          📥 Экспорт в Excel
        </a>
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        <div style={{
          overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                {['№', 'Клиент', 'Телефон', 'Адрес', 'Сумма', 'Статус', 'Дата'].map(h => (
                  <th key={h} style={{
                    padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', textAlign: 'left',
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} style={{
                  borderTop: '1px solid var(--color-border)',
                  background: i % 2 === 0 ? '#fff' : '#F8FAFC',
                }}>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                    <a href={`/admin/orders/${order.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                      #{order.id}
                    </a>
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: 500, color: 'var(--color-text)' }}>
                    {order.name}
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-text-muted)' }}>
                    {order.phone}
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--color-text-muted)', maxWidth: 'clamp(100px, 15vw, 180px)', wordBreak: 'break-word' }}>
                    {order.address ?? '—'}
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontWeight: 700, fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: 'var(--color-primary)' }}>
                    {Number(order.total).toLocaleString('ru-KZ')} ₸
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td style={{ padding: 'clamp(0.625rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}