// app/admin/products/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton'

export const revalidate = 0

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
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
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', fontWeight: 800,
          color: 'var(--color-text)',
        }}>
          Товары ({products.length})
        </h1>
        <Link href="/admin/products/new" style={{
          padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2vw, 1.5rem)',
          background: 'var(--color-primary)',
          color: '#fff', borderRadius: '9999px',
          fontWeight: 600, fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          + Добавить товар
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}>
          Товаров нет. Добавьте первый товар.
        </div>
      ) : (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  {['ID', 'Название', 'Категория', 'Цена', 'Остаток', 'Флаги', 'Действия'].map(h => (
                    <th key={h} style={{
                      padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', textAlign: 'left',
                      fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{
                    borderTop: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? '#fff' : '#F8FAFC',
                  }}>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--color-text-muted)' }}>
                      {p.id}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                      <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', fontWeight: 600, color: 'var(--color-text)' }}>{p.name}</div>
                      {p.volume && (
                        <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', color: 'var(--color-text-muted)' }}>{p.volume}</div>
                      )}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', color: 'var(--color-text-muted)' }}>
                      {p.category.name}
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {Number(p.price).toLocaleString('ru-KZ')} ₸
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)', fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)' }}>
                      <span style={{
                        color: p.stock > 0 ? 'var(--color-primary)' : '#EF4444',
                        fontWeight: 600,
                      }}>
                        {p.stock} шт.
                      </span>
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                      <div style={{ display: 'flex', gap: 'clamp(0.25rem, 1vw, 0.375rem)', flexWrap: 'wrap' }}>
                        {p.isBestseller && <span className="badge badge-hit">Хит</span>}
                        {p.isNew        && <span className="badge badge-new">Новинка</span>}
                        {p.isEco        && <span className="badge badge-eco">Эко</span>}
                      </div>
                    </td>
                    <td style={{ padding: 'clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                      <div style={{ display: 'flex', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          style={{
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)', color: 'var(--color-primary)',
                            fontWeight: 600, textDecoration: 'none',
                          }}
                        >
                          Изменить
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}