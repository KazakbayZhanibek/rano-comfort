import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteCategoryButton from './DeleteCategoryButton'

export const revalidate = 0

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { id: 'asc' },
  })

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem', fontWeight: 800,
          color: 'var(--color-text)',
        }}>
          Категории ({categories.length})
        </h1>
        <Link href="/admin/categories/new" style={{
          padding: '0.625rem 1.5rem',
          background: 'var(--color-primary)',
          color: '#fff', borderRadius: '9999px',
          fontWeight: 600, fontSize: '0.9rem',
          textDecoration: 'none',
        }}>
          + Добавить категорию
        </Link>
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-section-bg)' }}>
              {['ID', 'Иконка', 'Название', 'Slug', 'Товаров', 'Действия'].map(h => (
                <th key={h} style={{
                  padding: '0.875rem 1.25rem', textAlign: 'left',
                  fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} style={{
                borderTop: '1px solid var(--color-border)',
                background: i % 2 === 0 ? '#fff' : 'var(--color-section-bg)',
              }}>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {cat.id}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '1.5rem' }}>
                  {cat.icon || '📦'}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {cat.name}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {cat.slug}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {cat._count.products}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link href={`/admin/categories/${cat.id}/edit`} style={{
                      fontSize: '0.8rem', color: 'var(--color-primary)',
                      fontWeight: 600, textDecoration: 'none',
                    }}>
                      Изменить
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name} count={cat._count.products} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}