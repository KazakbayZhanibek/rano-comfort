'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/cart'

const navLinks = [
  { href: '/',         label: 'Главная'  },
  { href: '/catalog',  label: 'Каталог'  },
  { href: '/about',    label: 'О нас'    },
  { href: '/delivery', label: 'Доставка' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())

  // Скрыть header в админке
  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <div className="container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', height: '4rem',
          }}>

            {/* Логотип */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, textDecoration: 'none' }}>
              <Image
                src="/logo.png"
                alt="RANO Logo"
                width={56}
                height={56}
                style={{ borderRadius: '50%', flexShrink: 0 }}
                priority
              />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>RANO</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-text-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Comfort Service</div>
              </div>
            </Link>

            {/* Навигация десктоп */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  padding: '0.4rem 0.875rem', borderRadius: '9999px',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--color-text-secondary)', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = 'var(--color-hover-light)'
                    el.style.color = 'var(--color-primary-dark)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.backgroundColor = 'transparent'
                    el.style.color = 'var(--color-text-secondary)'
                  }}
                >{label}</Link>
              ))}
            </nav>

            {/* Правая часть */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>

              {/* Корзина */}
              <Link href="/cart" aria-label="Корзина" style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                justifyContent: 'center', width: 40, height: 40,
                borderRadius: '50%', color: 'var(--color-text-secondary)', textDecoration: 'none', flexShrink: 0,
              }}>
                <ShoppingCartIcon style={{ width: 22, height: 22 }} />
                {mounted && totalItems > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    minWidth: 18, height: 18, borderRadius: '9999px',
                    backgroundColor: 'var(--color-primary-dark)', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', padding: '0 4px',
                  }}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Профиль — скрыт на мобилке через CSS */}
              <Link href="/profile" aria-label="Профиль" className="desktop-only" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: '50%',
                color: 'var(--color-text-secondary)', textDecoration: 'none', flexShrink: 0,
              }}>
                <UserCircleIcon style={{ width: 22, height: 22 }} />
              </Link>

              {/* Бургер — показан на мобилке через CSS */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Меню"
                className="burger-btn"
                style={{
                  display: 'none', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: '50%',
                  backgroundColor: menuOpen ? 'var(--color-hover-light)' : 'transparent',
                  border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', flexShrink: 0,
                }}
              >
                {menuOpen ? <XMarkIcon style={{ width: 22, height: 22 }} /> : <Bars3Icon style={{ width: 22, height: 22 }} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 40,
          backgroundColor: 'rgba(0,0,0,0.35)',
        }} />
      )}

      {/* Мобильное меню */}
      <div style={{
        position: 'fixed', top: '4rem', left: 0, right: 0, zIndex: 45,
        backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '0.75rem',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.3s ease',
        pointerEvents: menuOpen ? 'auto' : 'none',
        maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto',
      }}>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
            display: 'block', padding: '0.875rem 1rem',
            fontSize: '1rem', fontWeight: 500,
            color: 'var(--color-text-secondary)', textDecoration: 'none',
            borderBottom: '1px solid var(--color-border)', borderRadius: '8px',
          }}>{label}</Link>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <Link href="/cart" onClick={() => setMenuOpen(false)} style={{
            flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '0.5rem',
            padding: '0.75rem', borderRadius: '9999px',
            backgroundColor: 'var(--color-primary-dark)', color: '#fff',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
          }}>
            <ShoppingCartIcon style={{ width: 18, height: 18 }} />
            Корзина{mounted && totalItems > 0 ? ` (${totalItems})` : ''}
          </Link>
          <Link href="/profile" onClick={() => setMenuOpen(false)} style={{
            flex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '0.5rem',
            padding: '0.75rem', borderRadius: '9999px',
            border: '2px solid var(--color-primary-dark)', color: 'var(--color-primary-dark)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
          }}>
            <UserCircleIcon style={{ width: 18, height: 18 }} />
            Профиль
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav  { display: none !important; }
          .desktop-only { display: none !important; }
          .burger-btn   { display: flex !important; }
        }
      `}</style>
    </>
  )
}