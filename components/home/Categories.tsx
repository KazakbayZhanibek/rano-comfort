// components/home/Categories.tsx
'use client'

import Link from 'next/link'

// SVG-пути для каждой категории (Heroicons-стиль, stroke)
const categories = [
  {
    slug: 'dishwashing',
    name: 'Для посуды',
    count: 12,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5z"/>
        <path d="M9 3v5h5M12 12v6M9 15h6"/>
      </svg>
    ),
  },
  {
    slug: 'laundry',
    name: 'Для стирки',
    count: 8,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <circle cx="12" cy="13" r="4"/>
        <path d="M6 6h.01M9 6h.01"/>
      </svg>
    ),
  },
  {
    slug: 'floor',
    name: 'Для пола',
    count: 10,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V10l7-7 7 7v11"/>
        <path d="M9 21v-6h6v6"/>
      </svg>
    ),
  },
  {
    slug: 'bathroom',
    name: 'Для ванной',
    count: 9,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/>
        <path d="M4 12V6a2 2 0 012-2h1a2 2 0 012 2v1"/>
        <path d="M8 20v2M16 20v2"/>
      </svg>
    ),
  },
  {
    slug: 'glass',
    name: 'Для стёкол',
    count: 6,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
      </svg>
    ),
  },
  {
    slug: 'air-freshener',
    name: 'Освежители',
    count: 7,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
]

export default function Categories() {
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }} className="categories-grid">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>

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

function CategoryCard({
  cat,
  index,
}: {
  cat: { slug: string; icon: React.ReactNode; name: string; count: number }
  index: number
}) {
  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
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
          {cat.icon}
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
          {cat.name}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}>
          {cat.count} товаров
        </div>
      </div>
    </Link>
  )
}