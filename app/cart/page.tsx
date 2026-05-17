'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, type CartItem } from '@/lib/cart'
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal > 5000 ? 0 : 500
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <>
        <Toaster position="bottom-right" />
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '3rem',
          }}>
            Корзина
          </h1>

          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--color-section-bg)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
              <ShoppingCartIcon style={{ width: 80, height: 80, color: 'var(--color-primary)', margin: '0 auto' }} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}>
              Ваша корзина пуста
            </h2>
            <p style={{
              color: 'var(--color-text-muted)',
              marginBottom: '2rem',
            }}>
              Добавьте товары из каталога и они появятся здесь
            </p>
            <Link href="/catalog" className="btn btn-primary">
              Перейти в каталог →
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: '2rem',
        }}>
          Корзина ({items.length})
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '2rem',
        }} className="cart-grid">

          {/* Список товаров */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}>
              {items.map((item, idx) => (
                <CartItem
                  key={`${item.id}-${idx}`}
                  item={item}
                  onRemove={() => {
                    removeItem(item.id)
                    toast.success('Товар удалён из корзины')
                  }}
                  onQuantityChange={(qty) => updateQty(item.id, qty)}
                />
              ))}
            </div>
          </div>

          {/* Боковая панель: итого */}
          <div style={{
            position: 'sticky',
            top: '6rem',
            height: 'fit-content',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}>
                Итого
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Сумма товаров</span>
                  <span style={{ fontWeight: 600 }}>{subtotal.toLocaleString('ru-KZ')} ₸</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Доставка</span>
                  <span style={{
                    fontWeight: 600,
                    color: delivery === 0 ? 'var(--color-secondary)' : 'var(--color-text)',
                  }}>
                    {delivery === 0 ? 'Бесплатно' : `${delivery.toLocaleString('ru-KZ')} ₸`}
                  </span>
                </div>

                {subtotal <= 5000 && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                  }}>
                    До бесплатной доставки осталось: {(5000 - subtotal).toLocaleString('ru-KZ')} ₸
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '2rem',
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}>
                  К оплате:
                </span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                }}>
                  {total.toLocaleString('ru-KZ')} ₸
                </span>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{
                width: '100%',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}>
                Оформить заказ →
              </Link>

              <Link href="/catalog" className="btn btn-secondary" style={{
                width: '100%',
                justifyContent: 'center',
              }}>
                Продолжить покупки
              </Link>

              <button
                onClick={() => {
                  clearCart()
                  toast.success('Корзина очищена')
                }}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC2626'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#DC2626'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'
                }}
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .cart-item {
            padding: 0.875rem !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </>
  )
}

interface CartItemProps {
  item: CartItem
  onRemove: () => void
  onQuantityChange: (qty: number) => void
}

function CartItem({
  item,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr',
      gap: '1rem',
      padding: '1rem',
      borderBottom: '1px solid var(--color-border)',
      alignItems: 'start',
    }}
      className="cart-item"
    >
      {/* Фото */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        background: 'var(--color-section-bg)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="100px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ fontSize: '2rem' }}>🧴</div>
        )}
      </div>

      {/* Информация */}
      <div>
        <Link href={`/catalog/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.25rem',
            color: 'var(--color-text)',
          }}>
            {item.name}
          </h3>
        </Link>

        {item.volume && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            {item.volume}
          </p>
        )}

        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          {item.price.toLocaleString('ru-KZ')} ₸
        </div>

        {/* Управление количеством */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}>
            <button onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
              −
            </button>
            <input type="number" min={1} value={item.quantity}
              onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: 36, height: 30, border: 'none', textAlign: 'center', background: 'transparent', fontSize: '0.875rem', fontWeight: 600 }}
            />
            <button onClick={() => onQuantityChange(item.quantity + 1)}
              style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
              +
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {(item.price * item.quantity).toLocaleString('ru-KZ')} ₸
          </div>

          <button onClick={onRemove} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'transparent', border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--color-text-muted)',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = '#FEE2E2'; el.style.color = '#DC2626' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'transparent'; el.style.color = 'var(--color-text-muted)' }}
          >
            <TrashIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
