    'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Review {
  id:         number
  name:       string
  rating:     number
  text:       string
  helpful:    number
  notHelpful: number
  createdAt:  string
  user?:      { name: string; avatar?: string }
}

export default function Reviews({ productId }: { productId: number }) {
  const { data: session } = useSession()
  const [reviews,     setReviews]     = useState<Review[]>([])
  const [loading,     setLoading]     = useState(true)
  const [showForm,    setShowForm]    = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [voted,       setVoted]       = useState<Set<number>>(new Set())
  const [form, setForm] = useState({ name: '', rating: 5, text: '' })

  useEffect(() => {
    if (session?.user?.name) {
      setForm(f => ({ ...f, name: session.user!.name! }))
    }
  }, [session])

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.text.trim()) {
      toast.error('Напишите текст отзыва')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          productId,
          name:   form.name || 'Аноним',
          rating: form.rating,
          text:   form.text,
          userId: (session?.user as any)?.id,
        }),
      })

      if (res.ok) {
        const newReview = await res.json()
        setReviews(prev => [newReview, ...prev])
        setForm(f => ({ ...f, text: '' }))
        setShowForm(false)
        toast.success('Отзыв добавлен!')
      }
    } catch {
      toast.error('Ошибка при добавлении отзыва')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleHelpful(reviewId: number, type: 'helpful' | 'notHelpful') {
    if (voted.has(reviewId)) return
    setVoted(prev => new Set([...prev, reviewId]))

    try {
      const res = await fetch('/api/reviews/helpful', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ reviewId, type }),
      })
      if (res.ok) {
        const updated = await res.json()
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: updated.helpful, notHelpful: updated.notHelpful } : r))
      }
    } catch {}
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct:   reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }))

  return (
    <section style={{ marginTop: '3rem' }}>
      <h2 style={{
        fontFamily: 'var(--font-heading)', fontSize: '1.5rem',
        fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-text)',
      }}>
        Отзывы покупателей
      </h2>

      {/* Сводка рейтинга */}
      {reviews.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr',
          gap: '2rem', marginBottom: '2rem',
          padding: '1.5rem', background: 'var(--color-section-bg)',
          borderRadius: 'var(--radius-lg)',
        }} className="rating-summary">
          {/* Средний рейтинг */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '4rem', fontWeight: 800,
              color: 'var(--color-primary)', lineHeight: 1,
            }}>
              {avgRating.toFixed(1)}
            </div>
            <Stars rating={avgRating} size={24} />
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              {reviews.length} отзывов
            </div>
          </div>

          {/* Распределение */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
            {ratingCounts.map(({ star, count, pct }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', width: 12 }}>{star}</span>
                <span style={{ fontSize: '0.9rem', color: '#F59E0B' }}>★</span>
                <div style={{
                  flex: 1, height: 8, background: 'var(--color-border)',
                  borderRadius: 4, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: 'var(--color-secondary)',
                    borderRadius: 4, transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', width: 20 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка написать отзыв */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '✕ Отмена' : '✏️ Написать отзыв'}
        </button>
      </div>

      {/* Форма отзыва */}
      {showForm && (
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '2px solid var(--color-secondary)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Ваш отзыв
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Имя */}
            <div>
              <label className="label">Имя</label>
              <input className="input" type="text" placeholder="Ваше имя"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            {/* Рейтинг */}
            <div>
              <label className="label">Оценка</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    style={{
                      fontSize: '2rem', background: 'none', border: 'none',
                      cursor: 'pointer', transition: 'transform 0.1s ease',
                      color: star <= form.rating ? '#F59E0B' : '#E5E7EB',
                      transform: star <= form.rating ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >★</button>
                ))}
              </div>
            </div>

            {/* Текст */}
            <div>
              <label className="label">Текст отзыва</label>
              <textarea className="input" rows={4}
                placeholder="Расскажите о вашем опыте использования товара..."
                value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
                style={{ resize: 'vertical' as const }}
              />
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary"
              style={{ alignSelf: 'flex-start', opacity: submitting ? 0.8 : 1 }}>
              {submitting ? 'Отправляем...' : 'Отправить отзыв'}
            </button>
          </div>
        </div>
      )}

      {/* Список отзывов */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'var(--color-section-bg)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text-muted)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
          <p>Пока нет отзывов. Будьте первым!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              background: '#fff', borderRadius: 'var(--radius-lg)',
              padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
            }}>
              {/* Шапка отзыва */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-section-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    color: 'var(--color-primary)', fontSize: '1rem',
                  }}>
                    {review.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                      {review.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <Stars rating={review.rating} size={16} />
              </div>

              {/* Текст */}
              <p style={{
                fontSize: '0.9rem', color: 'var(--color-text-muted)',
                lineHeight: 1.65, marginBottom: '1rem',
              }}>
                {review.text}
              </p>

              {/* Кнопки полезно/не полезно */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Помогло?
                </span>
                <button
                  onClick={() => handleHelpful(review.id, 'helpful')}
                  disabled={voted.has(review.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: voted.has(review.id) ? 'var(--color-section-bg)' : '#fff',
                    cursor: voted.has(review.id) ? 'default' : 'pointer',
                    fontSize: '0.8rem', color: 'var(--color-text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  👍 {review.helpful}
                </button>
                <button
                  onClick={() => handleHelpful(review.id, 'notHelpful')}
                  disabled={voted.has(review.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: voted.has(review.id) ? 'var(--color-section-bg)' : '#fff',
                    cursor: voted.has(review.id) ? 'default' : 'pointer',
                    fontSize: '0.8rem', color: 'var(--color-text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  👎 {review.notHelpful}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .rating-summary {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

function Stars({ rating, size }: { rating: number; size: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: size,
          color: i <= Math.round(rating) ? '#F59E0B' : '#E5E7EB',
        }}>★</span>
      ))}
    </div>
  )
}
