import { Suspense } from 'react'
import type { Metadata } from 'next'
import FilterBar from '@/components/catalog/FilterBar'
import ProductGrid from '@/components/catalog/ProductGrid'

export const metadata: Metadata = {
  title: 'Каталог товаров',
  description: 'Весь ассортимент бытовой химии RANO Comfort Service. Средства для посуды, стирки, пола, ванной. Доставка по Шымкенту.',
  keywords: ['каталог', 'бытовая химия', 'Шымкент', 'купить онлайн', 'средства уборки'],
  openGraph: {
    title: 'Каталог товаров — RANO Comfort Service',
    description: 'Весь ассортимент бытовой химии RANO Comfort Service. Доставка по Шымкенту.',
    type: 'website',
  },
}

interface CatalogPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
  }
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <>
      {/* Заголовок */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: '#fff',
        padding: 'clamp(1.5rem, 4vw, 3rem) 0',
        marginBottom: '1.5rem',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Каталог товаров
          </h1>
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.05rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
          }}>
            Всё необходимое для чистоты вашего дома в одном месте
          </p>
        </div>
      </section>

      {/* Фильтры */}
      <FilterBar />

      {/* Товары */}
      <div className="container">
        <Suspense fallback={<LoadingGrid />}>
          <ProductGrid
            category={searchParams.category}
            search={searchParams.search}
            sort={searchParams.sort}
          />
        </Suspense>
      </div>

      {/* Отступ снизу */}
      <div style={{ height: '2rem' }} />
    </>
  )
}

function LoadingGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '1rem',
    }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: 'hidden' }}>
          <div className="skeleton" style={{ aspectRatio: '4/3' }} />
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: '90%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div className="skeleton" style={{ height: 22, width: '35%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 40, width: 40, borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
