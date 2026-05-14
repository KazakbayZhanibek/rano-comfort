'use client'

import { useEffect, useRef } from 'react'

interface ChartData {
  date: string
  orders: number
  revenue: number
}

interface TopProduct {
  name: string
  count: number
  revenue: number
}

export default function AdminCharts({
  chartData,
  topProducts,
}: {
  chartData: ChartData[]
  topProducts: TopProduct[]
}) {
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const maxOrders  = Math.max(...chartData.map(d => d.orders), 1)
  const maxCount   = Math.max(...topProducts.map(p => p.count), 1)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    }}>

      {/* График выручки за 7 дней */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text)' }}>
          Выручка за 7 дней
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 120 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'center' }}>
                {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(0)}к` : ''}
              </div>
              <div
                title={`${d.revenue.toLocaleString('ru-KZ')} ₸`}
                style={{
                  width: '100%',
                  height: `${Math.max((d.revenue / maxRevenue) * 90, d.revenue > 0 ? 4 : 0)}%`,
                  background: 'linear-gradient(180deg, #4CAF50, #1B6B2F)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: d.revenue > 0 ? 4 : 0,
                  cursor: 'pointer',
                }}
              />
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {d.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График заказов за 7 дней */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text)' }}>
          Заказы за 7 дней
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 120 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                {d.orders > 0 ? d.orders : ''}
              </div>
              <div
                title={`${d.orders} заказов`}
                style={{
                  width: '100%',
                  height: `${Math.max((d.orders / maxOrders) * 90, d.orders > 0 ? 4 : 0)}%`,
                  background: 'linear-gradient(180deg, #60A5FA, #2563EB)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease',
                  minHeight: d.orders > 0 ? 4 : 0,
                  cursor: 'pointer',
                }}
              />
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {d.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Топ товаров */}
      {topProducts.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
          gridColumn: 'span 2',
        }} className="top-products-card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-text)' }}>
            Топ товаров
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topProducts.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--color-section-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: i < 3 ? '#fff' : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ height: 6, background: 'var(--color-section-bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(p.count / maxCount) * 100}%`,
                      background: 'linear-gradient(90deg, #1B6B2F, #4CAF50)',
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {p.count} шт.
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {p.revenue.toLocaleString('ru-KZ')} ₸
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .top-products-card { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  )
}