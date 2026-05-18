'use client'

import Link from 'next/link'

// Стандартные иконки для категорий
const defaultIcons: { [key: string]: React.ReactNode } = {
  dishwashing: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5z"/>
      <path d="M9 3v5h5M12 12v6M9 15h6"/>
    </svg>
  ),
  laundry: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <circle cx="12" cy="13" r="4"/>
      <path d="M6 6h.01M9 6h.01"/>
    </svg>
  ),
  floor: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V10l7-7 7 7v11"/>
      <path d="M9 21v-6h6v6"/>
    </svg>
  ),
  bathroom: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/>
      <path d="M4 12V6a2 2 0 012-2h1a2 2 0 012 2v1"/>
      <path d="M8 20v2M16 20v2"/>
    </svg>
  ),
  glass: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  'air-freshener': (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
}

// Generic icon for unknown categories
const genericIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7v10a10 10 0 0 0 10 10 10 10 0 0 0 10-10V7l-10-5z"/>
    <polyline points="12 12 16 16 8 16"/>
  </svg>
)

export default function CategoryCard({
  name,
  slug,
  count,
  index,
}: {
  name: string
  slug: string
  count: number
  index: number
}) {
  // Получаем иконку из стандартного набора или используем generic
  const icon = defaultIcons[slug] || genericIcon

  return (
    <Link
      href={`/catalog?category=${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.875rem',
        padding: '2rem 1rem',
        borderRadius: 'var(--radius-lg)',
        background: '#fff',
        border: '2px solid var(--color-border)',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        animation: `fadeInUp 0.5s ease ${index * 0.07}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = 'var(--color-secondary)'
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = 'var(--shadow-md)'
        const wrap = el.querySelector('.icon-wrap') as HTMLElement
        if (wrap) {
          wrap.style.background = 'var(--color-primary)'
        }
        const svg = el.querySelector('.icon-wrap svg') as SVGElement
        if (svg) svg.style.stroke = '#fff'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = 'var(--color-border)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        const wrap = el.querySelector('.icon-wrap') as HTMLElement
        if (wrap) {
          wrap.style.background = 'var(--color-section-bg)'
        }
        const svg = el.querySelector('.icon-wrap svg') as SVGElement
        if (svg) svg.style.stroke = 'var(--color-primary)'
      }}
    >
      {/* Иконка в зелёном кружке */}
      <div className="icon-wrap" style={{
        width: 64,
        height: 64,
        borderRadius: '16px',
        background: 'var(--color-section-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.25s ease',
        flexShrink: 0,
      }}>
        <div style={{
          width: 30,
          height: 30,
          stroke: 'var(--color-primary)',
          display: 'flex',
        }}>
          {icon}
        </div>
      </div>

      {/* Название */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '0.95rem',
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}>
          {name}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}>
          {count} товаров
        </div>
      </div>
    </Link>
  )
}
