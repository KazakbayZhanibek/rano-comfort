'use client'

import { useEffect, useState } from 'react'
import ProductCard, { type Product } from '@/components/catalog/ProductCard'
import { Toaster } from 'react-hot-toast'

interface ProductGridProps {
  category?: string
  search?: string
  sort?: string
}

export default function ProductGrid({
  category,
  search,
  sort = 'popular',
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        // Формируем параметры запроса
        const params = new URLSearchParams()
        if (category && category !== 'all') params.set('category', category)
        if (search) params.set('search', search)
        if (sort && sort !== 'popular') params.set('sort', sort)

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()
        
        // Убедимся что это массив
        const products = Array.isArray(data) ? data : []
        
        setProducts(products)
      } catch (error) {
        console.error('Failed to load products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [category, search, sort])

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
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

  let filtered: Product[] = Array.isArray(products) ? products : []

  return (
    <>
      <Toaster position="bottom-right" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
        gridAutoRows: '1fr',
      }} className="products-grid">
        {filtered.length > 0 ? (
          filtered.map((p, i) => (
            <div key={p.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.05}s both` }}>
              <ProductCard product={p} />
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--color-text-muted)',
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
              marginBottom: '0.5rem',
            }}>
              Товары не найдены
            </h3>
            <p>Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .products-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 0.625rem !important; 
          }
          /* Последний одинокий элемент не растягивается */
          .products-grid > div:last-child:nth-child(odd) {
            grid-column: span 1 !important;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  )
}
