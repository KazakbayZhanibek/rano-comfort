// components/home/Hero.tsx
'use client'

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  const chips = [
    {
      text: 'Эко состав',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
    },
    {
      text: 'Качество',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      text: 'Доставка',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
  ]

  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--color-primary-shade) 0%, var(--color-primary-dark) 40%, var(--color-green-medium) 70%, var(--color-primary) 100%)',
      minHeight: 'calc(100vh - 4rem)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Декоративные круги фона ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(139,195,74,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '15%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'rgba(76,175,80,0.10)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '-5%',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
          padding: '5rem 0',
        }} className="hero-grid">

          {/* ── Левая часть: текст ── */}
          <div style={{ animation: 'fadeInUp 0.6s ease both' }}>

            {/* Бейдж */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <SparklesIcon style={{ width: 15, height: 15, color: 'var(--color-green-light)' }} />
              <span style={{
                fontSize: '0.8rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Лаборатория бытовой химии
              </span>
            </div>

            {/* Слоган */}
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 7vw, 4rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}>
              Чистота —{' '}
              <span style={{
                background: 'linear-gradient(90deg, var(--color-green-light), var(--color-green-lighter))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                это просто!
              </span>
            </h1>

            {/* Подзаголовок */}
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: '2.25rem',
              maxWidth: '480px',
            }}>
              Профессиональные средства для уборки, стирки и ухода.
              Экологично, эффективно, доступно — с доставкой по Шымкенту.
            </p>

            {/* Кнопки */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
              <Link href="/catalog" className="btn btn-lg" style={{
                background: '#fff',
                color: 'var(--color-primary)',
                fontWeight: 700,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                Смотреть каталог
                <ArrowRightIcon style={{ width: 18, height: 18 }} />
              </Link>

              <Link href="/about" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'
                }}
              >
                О нас
              </Link>
            </div>

            {/* Статистика */}
            <div style={{
              display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start',
            }}>
              {[
                { value: '500+', label: 'Клиентов' },
                { value: '50+',  label: 'Продуктов' },
                { value: '3 дня', label: 'Доставка' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem', fontWeight: 800,
                    color: '#fff', lineHeight: 1,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)',
                    marginTop: '0.25rem', fontWeight: 500,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Правая часть: визуальный блок ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            animation: 'fadeIn 0.8s ease 0.2s both',
          }} className="hero-visual">

            {/* Главный круг с продуктом */}
            <div style={{ position: 'relative', width: '340px', height: '340px' }}>

              {/* Внешний круг */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px dashed rgba(255,255,255,0.2)',
                animation: 'spin 20s linear infinite',
              }} />

              {/* Средний круг */}
              <div style={{
                position: 'absolute', inset: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }} />

              {/* Центральный блок */}
              <div style={{
                position: 'absolute', inset: '60px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem',
              }}>
                {/* SVG флакон */}
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Тело флакона */}
                  <rect x="7" y="8" width="10" height="13" rx="2"/>
                  {/* Горлышко */}
                  <rect x="9" y="5" width="6" height="4" rx="1"/>
                  {/* Крышка */}
                  <rect x="10" y="3" width="4" height="3" rx="1"/>
                  {/* Линия на этикетке */}
                  <line x1="9.5" y1="13" x2="14.5" y2="13"/>
                  <line x1="9.5" y1="16" x2="13"   y2="16"/>
                  {/* Капля — символ жидкости */}
                  <path d="M15 10.5 Q16.5 9 16.5 11 A1.5 1.5 0 0 1 13.5 11 Q13.5 9 15 10.5z"
                        fill="rgba(255,255,255,0.4)" stroke="none"/>
                </svg>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem', fontWeight: 700,
                  color: '#fff', textAlign: 'center',
                  letterSpacing: '0.05em',
                }}>
                  RANO
                </div>
              </div>

              {/* Плавающие карточки */}
              <FloatCard top="0%" left="-15%" icon={chips[0].icon} text={chips[0].text} delay="0s" />
              <FloatCard top="70%" left="-20%" icon={chips[2].icon} text={chips[2].text} delay="0.3s" />
              <FloatCard top="5%" left="75%" icon={chips[1].icon} text={chips[1].text} delay="0.6s" />
            </div>
          </div>
        </div>
      </div>

      {/* Волна снизу */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 2.5rem 0 4rem !important;
            text-align: center;
          }
          .hero-visual { display: none !important; }
        }
        @media (max-width: 480px) {
          .hero-grid {
            padding: 2rem 0 3.5rem !important;
          }
          .hero-grid h1 {
            font-size: 1.75rem !important;
          }
          .hero-grid div div {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  )
}

/* Вспомогательный компонент — плавающая мини-карточка */
function FloatCard({
  top, left, icon, text, delay,
}: {
  top: string; left: string; icon: React.ReactNode; text: string; delay: string
}) {
  return (
    <div style={{
      position: 'absolute', top, left,
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '12px',
      padding: '0.5rem 0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      whiteSpace: 'nowrap',
      animation: `fadeInUp 0.5s ease ${delay} both`,
      color: '#fff',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>{icon}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{text}</span>
    </div>
  )
}