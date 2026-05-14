'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/cart'
import PromoCode from '@/components/checkout/PromoCode'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promo, setPromo] = useState<any>(null)
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    delivery: 'home',
    payment: 'cash',
  })

  useEffect(() => {
    setMounted(true)
    if (items.length === 0 && !isSubmitting) {
      toast.error('Корзина пуста')
      router.push('/cart')
      return
    }
  }, [items, router, isSubmitting])

  // Загружаем данные профиля из localStorage или сессии
  useEffect(() => {
    // Сначала пытаемся загрузить из localStorage
    const saved = localStorage.getItem('rano-user-profile')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        setFormData(f => ({
          ...f,
          name:    p.name    || f.name,
          phone:   p.phone   || f.phone,
          address: p.address || f.address,
        }))
      } catch {}
    } else if (session?.user) {
      // Если нет в localStorage, но есть сессия - используем данные из сессии
      setFormData(f => ({
        ...f,
        name:  session.user?.name || f.name,
        phone: (session.user as any)?.phone || f.phone,
      }))
    }
  }, [session])

  if (!mounted) return null

  if (items.length === 0) return null

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 5000 ? 0 : 500
  const discount = promo?.discount ?? 0
  const finalTotal = subtotal + deliveryFee - discount
  const total = finalTotal

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (!formData.name.trim()) {
    toast.error('Укажите имя')
    return
  }
  if (!formData.phone.trim()) {
    toast.error('Укажите телефон')
    return
  }
  if (formData.delivery === 'home' && !formData.address.trim()) {
    toast.error('Укажите адрес доставки')
    return
  }

  setLoading(true)
  setIsSubmitting(true)

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        formData.name,
        phone:       formData.phone,
        address:     formData.address,
        delivery:    formData.delivery,
        payment:     formData.payment,
        items:       items.map(item => ({
          id:       item.id,
          name:     item.name,
          price:    item.price,
          volume:   item.volume,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee: deliveryFee,
        promoCode:   promo?.code || null,
        discount:    discount,
        total,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Ошибка сервера')
    }

    const order = await res.json()

    router.push(`/order-success?orderId=${order.id}`)
    clearCart()

  } catch (error) {
    console.error(error)
    toast.error('Ошибка при оформлении заказа. Попробуйте снова.')
    setLoading(false)
  }
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
          Оформление заказа
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '2rem',
        }} className="checkout-grid">

          {/* Форма */}
          <form onSubmit={handleSubmit}>
            {/* Личные данные */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}>
                Личные данные
              </h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Имя и фамилия *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'border-color var(--transition)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Номер телефона *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (777) 777-77-77"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'border-color var(--transition)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                />
              </div>
            </div>

            {/* Доставка */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}>
                Доставка
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                }}>
                  <input
                    type="radio"
                    name="delivery"
                    value="home"
                    checked={formData.delivery === 'home'}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}>
                      Доставка на дом
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                    }}>
                      1–3 дня по Алматы
                    </div>
                  </div>
                </label>

                {formData.delivery === 'home' && (
                  <div style={{
                    marginLeft: '1.75rem',
                    marginBottom: '1rem',
                  }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: 'var(--color-text)',
                    }}>
                      Адрес доставки *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="ул. Абая, 123, кв. 45"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-body)',
                        transition: 'border-color var(--transition)',
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                )}

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}>
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={formData.delivery === 'pickup'}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: 'var(--color-text)',
                    }}>
                      Самовывоз
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                    }}>
                      ул. Абая 123, офис 45
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Способ оплаты */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}>
                Способ оплаты
              </h2>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.payment === 'cash'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}>
                    Наличные при получении
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                marginBottom: '1rem',
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.payment === 'card'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}>
                    Банковская карта
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={formData.payment === 'transfer'}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}>
                    Перевод на счёт компании
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? 'Оформление...' : 'Оформить заказ →'}
            </button>
          </form>

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
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}>
                Ваш заказ
              </h3>

              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '0.85rem',
                  }}>
                    <span>
                      {item.name}
                      <br />
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {item.quantity}x
                      </span>
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {(item.price * item.quantity).toLocaleString('ru-KZ')} ₸
                    </span>
                  </div>
                ))}
              </div>

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
                  <span style={{ color: 'var(--color-text-muted)' }}>Товары</span>
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
                    color: deliveryFee === 0 ? 'var(--color-secondary)' : 'var(--color-text)',
                  }}>
                    {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₸`}
                  </span>
                </div>

                {discount > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: '#16A34A',
                    fontWeight: 600,
                  }}>
                    <span>Скидка</span>
                    <span>−{discount.toLocaleString('ru-KZ')} ₸</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Промокод</label>
                <PromoCode
                  orderTotal={subtotal}
                  applied={promo}
                  onApply={setPromo}
                  onRemove={() => setPromo(null)}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}>
                  К оплате:
                </span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                }}>
                  {total.toLocaleString('ru-KZ')} ₸
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
