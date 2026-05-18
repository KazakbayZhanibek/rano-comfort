// components/home/Categories.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CategoriesGrid from './CategoriesGrid'

export default async function Categories() {
  // Загружаем категории с количеством товаров в каждой
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Преобразуем данные для CategoriesGrid
  const categoriesData = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat._count.products,
  }))

  return (
    <section className="section">
      <div className="container">
        <p style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-secondary)',
          marginBottom: '0.5rem',
        }}>
          Ассортимент
        </p>
        <h2 className="section-title">Категории товаров</h2>
        <p className="section-subtitle">
          Всё необходимое для чистоты вашего дома — в одном месте
        </p>

        <CategoriesGrid categories={categoriesData} />

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/catalog" className="btn btn-secondary">
            Весь каталог →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
        }
      `}</style>
    </section>
  )
}