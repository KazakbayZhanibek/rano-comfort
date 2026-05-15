import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminCharts from '@/components/admin/AdminCharts'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  try {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)

  const [
    ordersCount,
    productsCount,
    newOrders,
    totalRevenue,
    recentOrders,
    lowStockProducts,
    allOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'new' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'cancelled' } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    // Товары с остатком <= 5
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      include: { category: true },
      orderBy: { stock: 'asc' },
      take: 10,
    }),
    // Все заказы за 30 дней для графика
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, total: true, status: true },
    }),
    // Топ товары из заказов
    prisma.order.findMany({
      where: { status: { not: 'cancelled' } },
      select: { items: true },
      take: 100,
    }),
  ])

  // Считаем выручку за 7 дней
  const weekRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { not: 'cancelled' },
    },
  })

  // Группируем заказы по дням для графика
  const salesByDay: Record<string, { orders: number; revenue: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    salesByDay[key] = { orders: 0, revenue: 0 }
  }

  allOrders.forEach(order => {
    const d = new Date(order.createdAt)
    const key = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    if (salesByDay[key]) {
      salesByDay[key].orders++
      salesByDay[key].revenue += Number(order.total)
    }
  })

  const chartData = Object.entries(salesByDay).map(([date, data]) => ({
    date,
    orders: data.orders,
    revenue: data.revenue,
  }))

  // Топ товаров из items JSON
  const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}
  topProducts.forEach(order => {
    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          const key = item.name
          if (!productCounts[key]) productCounts[key] = { name: item.name, count: 0, revenue: 0 }
          productCounts[key].count += item.quantity || 1
          productCounts[key].revenue += (item.price || 0) * (item.quantity || 1)
        })
      }
    } catch {}
  })

  const topProductsList = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    new:       { label: 'Новый',       color: '#D97706', bg: '#FEF3C7' },
    confirmed: { label: 'Подтверждён', color: '#2563EB', bg: '#DBEAFE' },
    shipped:   { label: 'В пути',      color: '#7C3AED', bg: '#EDE9FE' },
    delivered: { label: 'Доставлен',   color: '#16A34A', bg: '#DCFCE7' },
    cancelled: { label: 'Отменён',     color: '#DC2626', bg: '#FEE2E2' },
  }

  return (
    <>
      <AdminHeader />
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', fontWeight: 800,
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-text)',
        }}>
          Дашборд
        </h1>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '1.5rem',
        }}>
          {[
            { label: 'Всего заказов',   value: ordersCount,  color: '#1B6B2F', icon: '📦' },
            { label: 'Новых заказов',   value: newOrders,    color: '#F59E0B', icon: '🔔' },
            { label: 'Товаров в базе',  value: productsCount, color: '#4CAF50', icon: '🛍️' },
            {
              label: 'Выручка (7 дней)',
              value: `${Number(weekRevenue._sum.total || 0).toLocaleString('ru-KZ')} ₸`,
              color: '#2563EB', icon: '💰',
            },
            {
              label: 'Общая выручка',
              value: `${Number(totalRevenue._sum.total || 0).toLocaleString('ru-KZ')} ₸`,
              color: '#7C3AED', icon: '📈',
            },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 'var(--radius-lg)',
              padding: '1.25rem', boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${s.color}`,
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800,
                fontFamily: 'var(--font-heading)', color: s.color, lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Графики */}
        <AdminCharts chartData={chartData} topProducts={topProductsList} />

        {/* Товары с низким остатком */}
        {lowStockProducts.length > 0 && (
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            marginBottom: '1.5rem',
            border: '2px solid #FEE2E2',
          }}>
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#FFF5F5',
            }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: '#DC2626', margin: 0 }}>
                ⚠️ Заканчиваются на складе
              </h2>
              <Link href="/admin/products" style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>
                Все товары →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FFF5F5' }}>
                    {['Товар', 'Категория', 'Остаток', ''].map(h => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem', textAlign: 'left',
                        fontSize: '0.75rem', fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? '#fff' : '#FFF5F5' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{p.category.name}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '9999px',
                          fontSize: '0.75rem', fontWeight: 700,
                          background: p.stock === 0 ? '#FEE2E2' : '#FEF3C7',
                          color: p.stock === 0 ? '#DC2626' : '#D97706',
                        }}>
                          {p.stock === 0 ? 'Нет в наличии' : `${p.stock} шт.`}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <Link href={`/admin/products/${p.id}/edit`} style={{
                          fontSize: '0.8rem', color: 'var(--color-primary)',
                          fontWeight: 600, textDecoration: 'none',
                        }}>
                          Пополнить
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Последние заказы */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Последние заказы
            </h2>
            <Link href="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Все заказы →
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-section-bg)' }}>
                  {['№', 'Клиент', 'Телефон', 'Сумма', 'Статус', 'Дата'].map(h => (
                    <th key={h} style={{
                      padding: '0.75rem 1rem', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => {
                  const s = statusMap[order.status] ?? { label: order.status, color: '#666', bg: '#f5f5f5' }
                  return (
                    <tr key={order.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? '#fff' : 'var(--color-section-bg)' }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>#{order.id}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 500 }}>{order.name}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{order.phone}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                        {Number(order.total).toLocaleString('ru-KZ')} ₸
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <>
        <AdminHeader />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Ошибка загрузки панели</h1>
          <p>{String(error)}</p>
        </div>
      </>
    )
  }
}