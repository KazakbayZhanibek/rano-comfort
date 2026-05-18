'use client'

import { useState } from 'react'
import CategoryCard from './CategoryCard'

interface Category {
  id: number
  name: string
  slug: string
  count: number
}

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
  const [expanded, setExpanded] = useState(false)

  // На мобильных показываем 4, на десктопе все
  const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 769
  const displayCount = isLargeScreen ? categories.length : expanded ? categories.length : 4
  const displayedCategories = categories.slice(0, displayCount)
  const hasMore = categories.length > 4 && !isLargeScreen

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
      }} className="categories-grid">
        {displayedCategories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            slug={cat.slug}
            count={cat.count}
            index={i}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              background: 'transparent',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'var(--color-primary)'
              el.style.color = '#fff'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'transparent'
              el.style.color = 'var(--color-primary)'
            }}
          >
            {expanded ? 'Скрыть ▲' : `Показать еще (${categories.length - 4}) ▼`}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
        }
      `}</style>
    </>
  )
}
