'use client'

import Link from 'next/link'
import {
  BeakerIcon,
  SparklesIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  return (
    <>
      {/* Героический заголовок */}
      <section className="about-hero" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: '#fff',
        padding: '4rem 0',
        marginBottom: '4rem',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            О нас
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '500px',
          }}>
            Как мы начали создавать средства для чистоты вашего дома
          </p>
        </div>
      </section>

      <div className="container">

        {/* ── История компании ── */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }} className="about-grid">
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                marginBottom: '1rem',
                color: 'var(--color-text)',
              }}>
                Наша история
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                RANO Comfort Service была основана в 2018 году с простой идеей: создавать эффективные, экологичные и доступные средства для чистоты дома.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Начиная с небольшой лаборатории в Алматы, мы постепенно развивались и сегодня производим более 50 наименований продукции, которая используется в сотнях семей.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                Мы верим, что качество не должно быть дорогим, поэтому продаём напрямую от производителя без ненужных наценок.
              </p>
            </div>

            <div style={{
              background: 'var(--color-section-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
            }}>
              <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                <BeakerIcon width={64} height={64} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
              }}>
                Своя лаборатория
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Всё разрабатываем и тестируем сами, в нашей лаборатории на ул. Абая. Контроль качества — в каждой партии.
              </p>
            </div>
          </div>
        </section>

        {/* ── Ценности ── */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '3rem',
            textAlign: 'center',
            color: 'var(--color-text)',
          }}>
            Наши ценности
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }} className="values-grid">
            {[
              {
                icon: SparklesIcon,
                title: 'Экологичность',
                text: 'Натуральные и биоразлагаемые компоненты. Безопасно для семьи и природы.',
              },
              {
                icon: CheckCircleIcon,
                title: 'Качество',
                text: 'Каждое средство проходит строгий контроль. Вся продукция сертифицирована РК.',
              },
              {
                icon: CurrencyDollarIcon,
                title: 'Честность',
                text: 'Прямые цены от производителя. Никакой переплаты на посредников.',
              },
            ].map((val, i) => {
              const IconComponent = val.icon
              return (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                }}>
                  <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    <IconComponent width={48} height={48} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    {val.text}
                  </p>
                </div>
              )
            })}
          </div>  {/* ← этот тег был внутри .map() — теперь снаружи */}
        </section>

        {/* ── Команда ── */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '3rem',
            textAlign: 'center',
            color: 'var(--color-text)',
          }}>
            Наша команда
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
          }} className="team-grid">
            {[
              { name: 'Алексей К.',  role: 'Основатель & Химик', initials: 'АК' },
              { name: 'Мария С.',    role: 'Технолог',            initials: 'МС' },
              { name: 'Азамат М.',   role: 'Логистика',           initials: 'АМ' },
              { name: 'Айгерим Т.', role: 'Менеджер',            initials: 'АТ' },
            ].map((person, i) => (
              <div key={i} style={{
                background: 'var(--color-section-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                {/* Инициалы вместо смайликов */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  margin: '0 auto 0.75rem',
                }}>
                  {person.initials}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  marginBottom: '0.25rem',
                }}>
                  {person.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          background: 'var(--color-section-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '1rem',
          }}>
            Готовы попробовать наши средства?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Перейдите в каталог и выберите подходящие для вас товары
          </p>
          <Link href="/catalog" className="btn btn-primary">
            Смотреть каталог →
          </Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .about-grid  { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .team-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .team-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}