// components/home/Reviews.tsx
'use client'

import { useState } from 'react'

const reviews = [
  {
    id: 1, name: 'Айгерим С.', city: 'Алматы',
    initials: 'АС', color: 'var(--color-primary-dark)',
    rating: 5,
    text: 'Заказываю уже третий раз! Средство для посуды просто отличное — хорошо пенится, не сушит руки. Доставили быстро, всё упаковано аккуратно.',
    product: 'RANO Лимон для посуды',
  },
  {
    id: 2, name: 'Дмитрий К.', city: 'Алматы',
    initials: 'ДК', color: 'var(--color-primary)',
    rating: 5,
    text: 'Взял гель для стирки на пробу — теперь покупаю только его. Отстирывает всё идеально, запах приятный, расход экономный.',
    product: 'Гель для стирки цветного белья',
  },
  {
    id: 3, name: 'Жанна М.', city: 'Алматы',
    initials: 'ЖМ', color: 'var(--color-secondary)',
    rating: 5,
    text: 'Нравится что состав экологичный — у нас маленькие дети, это важно. Средство для ванной отлично справляется с известковым налётом.',
    product: 'RANO Fresh для ванной',
  },
  {
    id: 4, name: 'Серик А.', city: 'Алматы',
    initials: 'СА', color: 'var(--color-accent)',
    rating: 4,
    text: 'Хорошее качество за свои деньги. Заказал 5 литров средства для пола — хватит надолго. Доставка пришла на следующий день.',
    product: 'Антибактериальное для пола',
  },
  {
    id: 5, name: 'Мадина Т.', city: 'Алматы',
    initials: 'МТ', color: 'var(--color-primary-dark)',
    rating: 5,
    text: 'Очень довольна! Менеджер помогла подобрать подходящее средство под мои нужды. Чувствуется что люди работают с душой.',
    product: 'Средство для стёкол',
  },
]

export default function Reviews() {
  const [active, setActive] = useState(0)

  const prev = () => setActive(i => (i - 1 + reviews.length) % reviews.length)
  const next = () => setActive(i => (i + 1) % reviews.length)

  /* Показываем 3 карточки вокруг активной */
  const visible = [-1, 0, 1].map(
    offset => reviews[(active + offset + reviews.length) % reviews.length]
  )

  return (
    <section className="section section-alt">
      <div className="container">

        {/* Заголовок */}
        <p style={{
          textAlign: 'center', fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--color-secondary)', marginBottom: '0.5rem',
        }}>
          Отзывы
        </p>
        <h2 className="section-title">Что говорят покупатели</h2>
        <p className="section-subtitle">
          Реальные отзывы от наших клиентов из Алматы
        </p>

        {/* Карусель */}
        <div style={{ position: 'relative' }}>
          <div className="reviews-grid" suppressHydrationWarning>
            {visible.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                isCenter={i === 1}
              />
            ))}
          </div>

          {/* Навигация */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '1rem',
          }}>
            <NavBtn onClick={prev} label="‹" />

            {/* Точки */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === active
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <NavBtn onClick={next} label="›" />
          </div>
        </div>

        {/* Итоговая оценка */}
        <div style={{
          marginTop: '3rem', textAlign: 'center',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.5rem',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            4.9
          </div>
          <Stars count={5} size={22} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            На основе 120+ отзывов
          </p>
        </div>
      </div>
    </section>
  )
}

/* Карточка отзыва */
function ReviewCard({
  review, isCenter,
}: {
  review: typeof reviews[0]
  isCenter: boolean
}) {
  return (
    <div style={{
      padding: '1.75rem',
      borderRadius: 'var(--radius-lg)',
      background: '#fff',
      border: `2px solid ${isCenter ? 'var(--color-secondary)' : 'var(--color-border)'}`,
      boxShadow: isCenter ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: isCenter ? 'scale(1.02)' : 'scale(1)',
      transition: 'all 0.3s ease',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>

      {/* Шапка */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: review.color,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.03em',
        }}>
          {review.initials}
        </div>
        <div>
          <div style={{
            fontWeight: 700, fontSize: '0.95rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}>
            {review.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {review.city}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Stars count={review.rating} size={14} />
        </div>
      </div>

      {/* Текст */}
      <p style={{
        fontSize: '0.9rem', color: 'var(--color-text-muted)',
        lineHeight: 1.65, flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        "{review.text}"
      </p>

      {/* Продукт */}
      <div style={{
        fontSize: '0.75rem', fontWeight: 600,
        color: 'var(--color-secondary)',
        padding: '0.3rem 0.75rem',
        background: 'var(--color-section-bg)',
        borderRadius: 'var(--radius-full)',
        alignSelf: 'flex-start',
      }}>
        {review.product}
      </div>
    </div>
  )
}

/* Звёзды */
function Stars({ count, size }: { count: number; size: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          fontSize: size,
          color: i < count ? '#F59E0B' : '#E5E7EB',
        }}>★</span>
      ))}
    </div>
  )
}

/* Кнопка навигации */
function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%',
      background: '#fff', border: '1.5px solid var(--color-border)',
      fontSize: '1.25rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s ease', color: 'var(--color-text)',
      fontWeight: 700,
    }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = 'var(--color-primary)'
        el.style.color = '#fff'
        el.style.borderColor = 'var(--color-primary)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = '#fff'
        el.style.color = 'var(--color-text)'
        el.style.borderColor = 'var(--color-border)'
      }}
    >
      {label}
    </button>
  )
}