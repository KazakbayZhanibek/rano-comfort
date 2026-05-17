'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { href: '/admin',           label: 'Дашборд'  },
  { href: '/admin/orders',    label: 'Заказы'   },
  { href: '/admin/products',  label: 'Товары'   },
  { href: '/admin/contacts',  label: 'Сообщения' },
  { href: '/admin/promos',    label: 'Промокоды' },
]

export default function ClientSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Мобильная кнопка меню ── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem', left: '1rem',
          zIndex: 100,
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* ── Сайдбар ── */}
      <aside style={{
        width: 'clamp(200px, 20vw, 280px)', flexShrink: 0,
        background: 'var(--color-section-bg)',
        display: 'flex', flexDirection: 'column',
        padding: 'clamp(1rem, 2vw, 1.5rem) 0',
        borderRight: '1px solid var(--color-border)',
        transition: 'transform 0.3s ease',
        position: 'relative',
      }} className="admin-sidebar">
        {/* Логотип */}
        <div style={{
          padding: '0 clamp(0.875rem, 2vw, 1.25rem) clamp(1rem, 2vw, 1.5rem)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'var(--color-primary)',
          }}>RANO</div>
          <div style={{
            fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Админ-панель</div>
        </div>

        {/* Навигация */}
        <nav style={{ flex: 1, padding: '0 clamp(0.5rem, 1.5vw, 0.75rem)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.625rem, 1.5vw, 0.875rem)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-muted)',
                fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Выход */}
        <div style={{ padding: '0 clamp(0.5rem, 1.5vw, 0.75rem)' }}>
          <Link
            href="/api/admin/logout"
            style={{
              display: 'block', padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.625rem, 1.5vw, 0.875rem)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'
            }}
          >
            Выйти →
          </Link>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 99;
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
            box-shadow: var(--shadow-md);
            width: 220px !important;
          }
        }
        
        @media (max-width: 500px) {
          .admin-sidebar {
            width: 70vw !important;
          }
        }
        
        @media (max-width: 400px) {
          .mobile-menu-btn {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.9rem !important;
            top: 0.75rem !important;
            left: 0.75rem !important;
          }
          .admin-sidebar {
            width: 85vw !important;
          }
        }
      `}</style>
    </>
  )
}
