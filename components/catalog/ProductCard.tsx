// components/catalog/ProductCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCartIcon, HeartIcon, CheckIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export interface Product {
  id:           number
  name:         string
  slug:         string
  price:        string | number
  oldPrice?:    string | number
  volume?:      string
  images:       string[]
  isBestseller: boolean
  isNew:        boolean
  isEco?:       boolean
  category:     { id: number; name: string; slug: string; icon: string }
  description?: string
  stock?:       number
  createdAt?:   string
  updatedAt?:   string
}

/* SVG-плейсхолдер флакона вместо 🧴 */
function BottlePlaceholder() {
  return (
    <svg
      width="64" height="64" viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-secondary)"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    >
      <rect x="7" y="8" width="10" height="13" rx="2"/>
      <rect x="9" y="5" width="6" height="4" rx="1"/>
      <rect x="10" y="3" width="4" height="3" rx="1"/>
      <line x1="9.5" y1="13" x2="14.5" y2="13"/>
      <line x1="9.5" y1="16" x2="13"   y2="16"/>
    </svg>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const { status } = useSession()
  const [wished,   setWished]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [adding,   setAdding]   = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  // Проверяем, в избранном ли товар
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/wishlist')
        .then(r => r.json())
        .then(data => {
          const isWished = Array.isArray(data) && data.some(w => w.product.id === product.id)
          setWished(isWished)
        })
        .catch(() => {})
    }
  }, [product.id, status])

  async function handleWishlist() {
    if (status === 'unauthenticated') {
      toast.error('Пожалуйста, авторизуйтесь', {
        style: {
          fontFamily: 'var(--font-body)',
          borderRadius: '12px',
          background: '#fff',
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow-md)',
        },
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      const data = await res.json()
      setWished(data.added)
      toast.success(data.added ? 'Добавлено в избранное!' : 'Удалено из избранного', {
        style: {
          fontFamily: 'var(--font-body)',
          borderRadius: '12px',
          background: '#fff',
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow-md)',
        },
      })
    } catch (error) {
      toast.error('Ошибка при добавлении в избранное', {
        style: {
          fontFamily: 'var(--font-body)',
          borderRadius: '12px',
          background: '#fff',
          color: 'var(--color-text)',
          boxShadow: 'var(--shadow-md)',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const priceNum = typeof product.price === 'string' ? parseInt(product.price) : product.price
  const oldPriceNum = product.oldPrice ? (typeof product.oldPrice === 'string' ? parseInt(product.oldPrice) : product.oldPrice) : undefined
  
  // Парсим images если это JSON строка
  let images: string[] = []
  try {
    if (typeof product.images === 'string') {
      images = JSON.parse(product.images)
    } else if (Array.isArray(product.images)) {
      images = product.images
    }
  } catch (e) {
    images = []
  }

  const discount = oldPriceNum
    ? Math.round((1 - priceNum / oldPriceNum) * 100)
    : null

  async function handleAddToCart() {
    setAdding(true)
    addItem({
      id:     product.id,
      name:   product.name,
      price:  priceNum,
      volume: product.volume,
      image:  images[0],
    })
    toast.success('Добавлено в корзину!', {
      style: {
        fontFamily: 'var(--font-body)',
        borderRadius: '12px',
        background: '#fff',
        color: 'var(--color-text)',
        boxShadow: 'var(--shadow-md)',
      },
    })
    await new Promise(r => setTimeout(r, 600))
    setAdding(false)
  }

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* ── Бейджи ── */}
      <div style={{
        position: 'absolute', top: '0.75rem', left: '0.75rem',
        display: 'flex', flexDirection: 'column', gap: '0.35rem',
        zIndex: 2,
      }}>
        {product.isBestseller && <span className="badge badge-hit">Хит</span>}
        {product.isNew        && <span className="badge badge-new">Новинка</span>}
        {product.isEco        && <span className="badge badge-eco">Эко</span>}
        {discount             && <span className="badge badge-sale">−{discount}%</span>}
      </div>

      {/* ── Кнопка вишлиста ── */}
      <button
        onClick={handleWishlist}
        disabled={loading}
        aria-label="В избранное"
        style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          zIndex: 2, width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.2s ease',
          border: 'none', cursor: loading ? 'loading' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.12)')}
        onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
      >
        {wished
          ? <HeartSolid  style={{ width: 17, height: 17, color: '#ef4444' }} />
          : <HeartIcon   style={{ width: 17, height: 17, color: '#6b7280' }} />
        }
      </button>

      {/* ── Фото ── */}
      <Link href={`/catalog/${product.slug}`} style={{ display: 'block' }}>
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          background: 'var(--color-section-bg)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {images[0] ? (
            (images[0].startsWith('http') || images[0].startsWith('/')) ? (
              /* URL изображения */
              <Image
                src={images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
            ) : (
              /* Эмодзи */
              <div style={{
                fontSize: '4rem',
                transition: 'transform 0.4s ease',
              }}
              className="emoji-image"
              >
                {images[0]}
              </div>
            )
          ) : (
            /* SVG плейсхолдер вместо 🧴 */
            <BottlePlaceholder />
          )}
        </div>
      </Link>

      {/* ── Контент ── */}
      <div style={{
        padding: '1rem', display: 'flex',
        flexDirection: 'column', gap: '0.5rem', flex: 1,
      }}>

        {/* Категория */}
        <span style={{
          fontSize: '0.72rem', fontWeight: 600,
          color: 'var(--color-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {product.category.name}
        </span>

        {/* Название */}
        <Link href={`/catalog/${product.slug}`}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem', fontWeight: 700,
            color: 'var(--color-text)', lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
          >
            {product.name}
          </h3>
        </Link>

        {/* Объём */}
        {product.volume && (
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}>
            {product.volume}
          </span>
        )}

        {/* Цена + кнопка */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto', paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border)',
        }}>
          {/* Цены */}
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem', fontWeight: 800,
              color: 'var(--color-primary)',
            }}>
              {priceNum.toLocaleString('ru-KZ')} ₸
            </div>
            {oldPriceNum && (
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'line-through',
              }}>
                {oldPriceNum.toLocaleString('ru-KZ')} ₸
              </div>
            )}
          </div>

          {/* Кнопка В корзину */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            aria-label="Добавить в корзину"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: adding ? 'var(--color-secondary)' : 'var(--color-primary)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: adding ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              transform: adding ? 'scale(0.9)' : 'scale(1)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!adding) e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={e => {
              if (!adding) e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {adding
              ? <CheckIcon style={{ width: 18, height: 18 }} />
              : <ShoppingCartIcon style={{ width: 18, height: 18 }} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}