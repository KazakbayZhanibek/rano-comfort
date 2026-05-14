import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeletePromoButton from './DeletePromoButton'

export const revalidate = 0

export default async function PromosPage() {
  const promos = await prisma.promo.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        flexWrap: 'wrap',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', fontWeight: 800, color: 'var(--color-text)' }}>
          Промокоды
        </h1>
        <Link href="/admin/promos/new" style={{
          padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2vw, 1.5rem)',
          background: 'var(--color-primary)', color: '#fff',
          borderRadius: '9999px', fontWeight: 600,
          fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          + Добавить промокод
        </Link>
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        {promos.length === 0 ? (
          <div style={{ padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Промокодов нет
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  {['Код', 'Тип', 'Скидка', 'Мин. заказ', 'Использований', 'Статус', ''].map(h => (
                    <th key={h} style={{
                      padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', textAlign: 'left',
                      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((p, i) => (
                  <tr key={p.id} style={{
                    borderTop: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? '#fff' : '#F8FAFC',
                  }}>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                      {p.code}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.8rem, 1.5vw, 0.85rem)', color: 'var(--color-text)' }}>
                      {p.type === 'percent' ? 'Процент' : 'Фиксированная'}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {p.type === 'percent' ? `${p.value}%` : `${p.value.toLocaleString('ru-KZ')} ₸`}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.8rem, 1.5vw, 0.85rem)', color: 'var(--color-text)' }}>
                      {p.minOrder > 0 ? `${p.minOrder.toLocaleString('ru-KZ')} ₸` : '—'}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.8rem, 1.5vw, 0.85rem)', color: 'var(--color-text)' }}>
                      {p.usedCount} {p.maxUses ? `/ ${p.maxUses}` : ''}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem', borderRadius: '9999px',
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 600,
                        background: p.isActive ? '#DCFCE7' : '#FEE2E2',
                        color:      p.isActive ? '#16A34A' : '#DC2626',
                      }}>
                        {p.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                      <DeletePromoButton id={p.id} code={p.code} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
