'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart'
import toast, { Toaster } from 'react-hot-toast'
import { SparklesIcon, FireIcon, ShieldCheckIcon, CheckIcon, ShoppingCartIcon, TruckIcon } from '@heroicons/react/24/outline'
import Reviews from '@/components/product/Reviews'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  oldPrice?: number
  volume: string
  images: string[]
  isBestseller: boolean
  isNew: boolean
  isEco: boolean
  category: { name: string }
  description: string
  features: string[]
  rating: number
  reviews: number
}

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Failed to load product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.slug])

  async function handleAddToCart() {
    if (!product) return
    setAdding(true)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        volume: product.volume,
        image: (() => {
          try {
            const imgs = typeof product.images === 'string'
              ? JSON.parse(product.images)
              : product.images
            return imgs[0] || ''
          } catch { return '' }
        })(),
      })
    }
    toast.success(`${quantity}x "${product.name}" добавлено в корзину!`, {
      style: {
        fontFamily: 'var(--font-body)',
        borderRadius: '12px',
        background: '#fff',
        color: 'var(--color-text)',
        boxShadow: 'var(--shadow-md)',
      },
    })
    await new Promise(r => setTimeout(r, 800))
    setAdding(false)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: '2rem', color: 'var(--color-text-muted)' }}>Загрузка...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          marginBottom: '1rem',
        }}>
          Товар не найден
        </h1>
        <Link href="/catalog" className="btn btn-primary">
          ← Вернуться в каталог
        </Link>
      </div>
    )
  }

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  return (
    <>
      <Toaster position="bottom-right" />

      {/* Хлебные крошки */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
        }}>
          <Link href="/" style={{ color: 'var(--color-primary)' }}>Главная</Link>
          <span>/</span>
          <Link href="/catalog" style={{ color: 'var(--color-primary)' }}>Каталог</Link>
          <span>/</span>
          <span>{product.category.name}</span>
          <span>/</span>
          <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }} className="product-grid">

          {/* Левая часть: фото */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '1',
              background: 'var(--color-section-bg)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {(() => {
                let imgs: string[] = []
                try {
                  imgs = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images
                } catch {}
                return imgs[0] ? (
                  <Image
                    src={imgs[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '6rem' }}>🧴</div>
                )
              })()}
            </div>

            {/* Бейджи */}
            {(product.isBestseller || product.isNew || product.isEco) && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.isBestseller && (
                  <span className="badge badge-hit" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FireIcon width={14} height={14} />
                    Хит
                  </span>
                )}
                {product.isNew && (
                  <span className="badge badge-new" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <SparklesIcon width={14} height={14} />
                    Новинка
                  </span>
                )}
                {product.isEco && (
                  <span className="badge badge-eco" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheckIcon width={14} height={14} />
                    Эко
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Правая часть: информация */}
          <div>
            {/* Категория */}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              letterSpacing: '0.08em',
            }}>
              {product.category.name}
            </span>

            {/* Название */}
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              marginTop: '0.5rem',
              marginBottom: '1rem',
              lineHeight: 1.2,
              color: 'var(--color-text)',
            }}>
              {product.name}
            </h1>

            {/* Рейтинг */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '1.2rem',
                      color: i < Math.round(product.rating) ? '#F59E0B' : '#E5E7EB',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text)',
              }}>
                {product.rating}
              </span>
              <span style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
              }}>
                ({product.reviews} отзывов)
              </span>
            </div>

            {/* Цена */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
              }}>
                {product.price.toLocaleString('ru-KZ')} ₸
              </div>
              {product.oldPrice && (
                <>
                  <div style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'line-through',
                  }}>
                    {product.oldPrice.toLocaleString('ru-KZ')} ₸
                  </div>
                  {discount && (
                    <div style={{
                      padding: '0.4rem 0.8rem',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}>
                      Экономия: −{discount}%
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Объём */}
            {product.volume && (
              <div style={{
                fontSize: '0.95rem',
                marginBottom: '2rem',
              }}>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  Объём:
                </span>
                <span style={{
                  marginLeft: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}>
                  {product.volume}
                </span>
              </div>
            )}

            {/* Описание */}
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}>
              {product.description}
            </p>

            {/* Особенности */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: 'var(--color-text)',
              }}>
                Особенности:
              </h3>
              <ul style={{ listStyle: 'none' }}>
                {(product.features ?? []).map((f, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{
                      color: 'var(--color-secondary)',
                      fontWeight: 'bold',
                    }}>
                      <CheckIcon style={{ width: 16, height: 16, display: 'inline' }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Количество и добавление в корзину */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '1.2rem',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 50,
                    height: 36,
                    border: 'none',
                    textAlign: 'center',
                    background: 'transparent',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '1.2rem',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                style={{
                  flex: 1,
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-full)',
                  background: adding ? 'var(--color-secondary)' : 'var(--color-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: adding ? 'default' : 'pointer',
                  transition: 'all var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {adding ? (
                  <>
                    <CheckIcon style={{ width: 18, height: 18 }} />
                    Добавлено!
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon style={{ width: 18, height: 18 }} />
                    В корзину
                  </>
                )}
              </button>
            </div>

            {/* Преимущества доставки */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-section-bg)',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  color: 'var(--color-secondary)',
                  flexShrink: 0,
                  marginTop: '0.2rem',
                }}>
                  <TruckIcon style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                  }}>
                    Быстрая доставка
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    Доставляем по Шымкенту за 1–3 дня
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  color: 'var(--color-secondary)',
                  flexShrink: 0,
                  marginTop: '0.2rem',
                  fontSize: '1.2rem',
                }}>
                  ✓
                </div>
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                  }}>
                    Качество гарантировано
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    Все товары проверены и сертифицированы
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Отзывы товара */}
      <div className="container">
        <Reviews productId={product.id} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  )
}
