'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const categories = [
  { slug: 'all',           name: 'Все товары'  },
  { slug: 'dishwashing',   name: 'Для посуды'  },
  { slug: 'laundry',       name: 'Для стирки'  },
  { slug: 'floor',         name: 'Для пола'    },
  { slug: 'bathroom',      name: 'Для ванной'  },
  { slug: 'glass',         name: 'Для стёкол'  },
  { slug: 'air-freshener', name: 'Освежители'  },
]

const sortOptions = [
  { value: 'popular',    label: 'По популярности'              },
  { value: 'newest',     label: 'Новинки'                      },
  { value: 'price-asc',  label: 'Цена: от меньшей к большей'  },
  { value: 'price-desc', label: 'Цена: от большей к меньшей'  },
]

export default function FilterBar() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [showCategories, setShowCategories] = useState(false)

  const currentCategory = searchParams.get('category') || 'all'
  const currentSort     = searchParams.get('sort')     || 'popular'
  const currentSearch   = searchParams.get('search')   || ''
  const categoryName = categories.find(c => c.slug === currentCategory)?.name || 'Все товары'

  function handleCategoryChange(slug: string) {
    const params = new URLSearchParams(searchParams)
    slug === 'all' ? params.delete('category') : params.set('category', slug)
    router.push(`/catalog?${params.toString()}`)
  }

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    router.push(`/catalog?${params.toString()}`)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams)
    e.target.value ? params.set('search', e.target.value) : params.delete('search')
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid var(--color-border)',
      padding: '1.25rem 0',
      marginBottom: '2rem',
      position: 'sticky',
      top: '4rem',
      zIndex: 10,
    }}>
      <div className="container">

        {/* ── Поисковая строка ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.625rem 1rem',
          borderRadius: '9999px',
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-section-bg)',
          marginBottom: '1.25rem',
          transition: 'border-color 0.2s ease',
        }}
          onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
          onBlurCapture={e  => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <MagnifyingGlassIcon style={{
            width: 18, height: 18,
            color: 'var(--color-text-muted)', flexShrink: 0,
          }} />
          <input
            type="text"
            placeholder="Искать товары..."
            defaultValue={currentSearch}
            onChange={handleSearchChange}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              outline: 'none', fontSize: '0.9rem',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>

        {/* ── Категории + сортировка ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>

          {/* ДЕСКТОП: Категории — горизонтальный скролл */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            flex: 1,
            minWidth: 0,
            paddingBottom: '2px',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }} className="categories-desktop">
            {categories.map(cat => {
              const isActive = currentCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    padding: '0.5rem 1.125rem',
                    borderRadius: '9999px',
                    border: isActive
                      ? '2px solid var(--color-primary)'
                      : '1.5px solid var(--color-border)',
                    background: isActive ? 'var(--color-primary)' : '#fff',
                    color: isActive ? '#fff' : 'var(--color-text)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--color-primary)'
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                      e.currentTarget.style.color = 'var(--color-text)'
                    }
                  }}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* МОБАЙЛ: Категории — выпадающий список */}
          <div style={{ position: 'relative' }} className="categories-mobile">
            <button
              onClick={() => setShowCategories(!showCategories)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1.5px solid var(--color-border)',
                background: '#fff',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {categoryName} ▼
            </button>
            
            {showCategories && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                minWidth: '160px',
                marginTop: '0.5rem',
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      handleCategoryChange(cat.slug)
                      setShowCategories(false)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      border: 'none',
                      background: currentCategory === cat.slug ? 'var(--color-section-bg)' : 'transparent',
                      color: 'var(--color-text)',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section-bg)')}
                    onMouseLeave={e => {
                      if (currentCategory !== cat.slug) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Сортировка — не сжимается */}
          <select
            value={currentSort}
            onChange={e => handleSortChange(e.target.value)}
            style={{
              flexShrink: 0,
              padding: '0.5rem 0.875rem',
              borderRadius: '9999px',
              border: '1.5px solid var(--color-border)',
              background: '#fff',
              color: 'var(--color-text)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Скрываем полосу прокрутки */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
        
        @media (max-width: 768px) {
          .categories-desktop { display: none !important; }
        }
        
        @media (min-width: 769px) {
          .categories-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}