// components/home/BestSellers.tsx
'use client'

import { useEffect, useState } from 'react'
import ProductCard, { type Product } from '@/components/catalog/ProductCard'
import { Toaster } from 'react-hot-toast'

/* Моковые данные — потом заменим на fetch из БД */
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Средство для мытья посуды RANO Лимон',
    slug: 'rano-dishwash-lemon', price: 890, oldPrice: 1100,
    volume: '1 л', images: [], isBestseller: true, isNew: false, isEco: true,
    category: { id: 1, name: 'Для посуды', slug: 'dlya-posudy', icon: '🍽️' },
  },
  {
    id: 2, name: 'Гель для стирки цветного белья',
    slug: 'rano-gel-color', price: 1450, oldPrice: undefined,
    volume: '2 л', images: [], isBestseller: true, isNew: true, isEco: false,
    category: { id: 2, name: 'Для стирки', slug: 'dlya-stirki', icon: '👕' },
  },
  {
    id: 3, name: 'Чистящее средство для ванной RANO Fresh',
    slug: 'rano-bathroom-fresh', price: 650, oldPrice: 800,
    volume: '500 мл', images: [], isBestseller: false, isNew: true, isEco: true,
    category: { id: 3, name: 'Для ванной', slug: 'dlya-vannoj', icon: '🛁' },
  },
  {
    id: 4, name: 'Средство для мытья полов Антибактериальное',
    slug: 'rano-floor-antibac', price: 1200, oldPrice: undefined,
    volume: '5 л', images: [], isBestseller: true, isNew: false, isEco: false,
    category: { id: 4, name: 'Для пола', slug: 'dlya-pola', icon: '🧹' },
  },
]

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    /* TODO: заменить на реальный fetch('/api/products?bestseller=true') */
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="section section-alt">
      <Toaster position="bottom-right" />
      <div className="container">

        {/* Заголовок */}
        <p style={{
          textAlign: 'center', fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--color-secondary)', marginBottom: '0.5rem',
        }}>
          Популярное
        </p>
        <h2 className="section-title">Хиты продаж</h2>
        <p className="section-subtitle">
          Самые любимые средства наших покупателей
        </p>

        {/* Сетка товаров */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
        }} className="products-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <div key={p.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
                  <ProductCard product={p} />
                </div>
              ))
          }
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
        }
      `}</style>
    </section>
  )
}

/* Скелетон-карточка во время загрузки */
function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '4/3' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '90%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '30%', borderRadius: 6 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ height: 22, width: '35%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 40, width: 40, borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  )
}