'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  name: string
  phone: string
  address: string | null
  delivery: string | null
  payment: string | null
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  createdAt: string
  items: string
}

const STATUSES = [
  { key: 'new',       label: 'Новый',        icon: '🛒', desc: 'Заказ получен'           },
  { key: 'confirmed', label: 'Подтверждён',  icon: '✅', desc: 'Заказ подтверждён'       },
  { key: 'shipped',   label: 'В пути',       icon: '🚚', desc: 'Курьер везёт заказ'      },
  { key: 'delivered', label: 'Доставлен',    icon: '📦', desc: 'Заказ доставлен'         },
]

const PAYMENT_LABELS: Record<string, string> = {
  cash:     'Наличными при получении',
  card:     'Банковская карта',
  transfer: 'Перевод на счёт',
}

const DELIVERY_LABELS: Record<string, string> = {
  home:   'Доставка на дом',
  pickup: 'Самовывоз',
}

export default function OrderTrackingPage() {
  const params   = useParams()
  const id       = params.id as string
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  async function loadOrder() {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) throw new Error('Заказ не найден')
      const data = await res.json()
      setOrder(data)
    } catch {
      setError('Заказ не найден')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
    // Автообновление каждые 30 секунд
    const interval = setInterval(loadOrder, 30000)
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          Загрузка...
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Заказ не найден
        </h1>
        <Link href="/" className="btn btn-primary">На главную</Link>
      </div>
    )
  }

  const currentStatusIndex = STATUSES.findIndex(s => s.key === order.status)
  const isCancelled = order.status === 'cancelled'

  let items: any[] = []
  try { items = JSON.parse(order.items) } catch {}

  return (
    <main style={{ background: 'var(--color-section-bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 700 }}>

        {/* Заголовок */}
        <div style={{
          background: isCancelled
            ? 'linear-gradient(135deg, #DC2626, #ef4444)'
            : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#fff',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
            {isCancelled ? '❌' : STATUSES[Math.max(0, currentStatusIndex)].icon}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Заказ #{order.id}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
            {isCancelled ? 'Заказ отменён' : STATUSES[Math.max(0, currentStatusIndex)].desc}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Обновляется автоматически каждые 30 сек
          </p>
        </div>

        {/* Прогресс статусов */}
        {!isCancelled && (
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: '2rem', marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Статус заказа
            </h2>
            <div style={{ position: 'relative' }}>

              {/* Линия прогресса */}
              <div style={{
                position: 'absolute',
                top: 20, left: '12.5%', right: '12.5%',
                height: 3,
                background: 'var(--color-border)',
                borderRadius: 2,
              }} />
              <div style={{
                position: 'absolute',
                top: 20, left: '12.5%',
                height: 3,
                width: `${(currentStatusIndex / (STATUSES.length - 1)) * 75}%`,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                borderRadius: 2,
                transition: 'width 0.5s ease',
              }} />

              {/* Шаги */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {STATUSES.map((status, i) => {
                  const done    = i <= currentStatusIndex
                  const current = i === currentStatusIndex
                  return (
                    <div key={status.key} style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.5rem',
                      flex: 1,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: done ? 'var(--color-primary)' : '#fff',
                        border: `3px solid ${done ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                        boxShadow: current ? '0 0 0 4px rgba(27,107,47,0.15)' : 'none',
                        transition: 'all 0.3s ease',
                        position: 'relative', zIndex: 1,
                      }}>
                        {done ? (i < currentStatusIndex ? '✓' : status.icon) : status.icon}
                      </div>
                      <div style={{
                        fontSize: '0.72rem', fontWeight: current ? 700 : 500,
                        color: done ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        textAlign: 'center',
                      }}>
                        {status.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Детали заказа */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '1.5rem', marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Детали заказа
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Получатель', value: order.name },
              { label: 'Телефон',    value: order.phone },
              { label: 'Доставка',   value: DELIVERY_LABELS[order.delivery ?? ''] ?? order.delivery ?? '—' },
              { label: 'Адрес',      value: order.address || 'Самовывоз' },
              { label: 'Оплата',     value: PAYMENT_LABELS[order.payment ?? ''] ?? order.payment ?? '—' },
              { label: 'Дата',       value: new Date(order.createdAt).toLocaleString('ru-RU') },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: '1rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', textAlign: 'right' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Товары */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '1.5rem', marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Товары
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item: any, i: number) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem',
                background: 'var(--color-section-bg)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                  background: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                }}>
                  🧴
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{item.name}</div>
                  {item.volume && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.volume}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {(item.price * item.quantity).toLocaleString('ru-KZ')} ₸
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {item.quantity} шт × {Number(item.price).toLocaleString('ru-KZ')} ₸
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--color-border)' }}>
            {[
              { label: 'Товары',   value: `${Number(order.subtotal).toLocaleString('ru-KZ')} ₸`    },
              { label: 'Доставка', value: Number(order.deliveryFee) === 0 ? 'Бесплатно' : `${Number(order.deliveryFee).toLocaleString('ru-KZ')} ₸` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{label}</span>
                <span style={{ fontSize: '0.875rem' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Итого</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                {Number(order.total).toLocaleString('ru-KZ')} ₸
              </span>
            </div>
          </div>
        </div>

        {/* Telegram подписка */}
        <div style={{
          background: 'linear-gradient(135deg, #0088cc, #00aaff)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#fff',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✈️</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Получайте уведомления в Telegram
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            Напишите боту и получайте статус заказа автоматически
          </p>
          <a
            href={`https://t.me/orderscmfshm_bot?start=order_${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#fff', color: '#0088cc',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Подписаться на уведомления
          </a>
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/catalog" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            Продолжить покупки
          </Link>
          <Link href="/profile" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            Мои заказы
          </Link>
        </div>
      </div>
    </main>
  )
}