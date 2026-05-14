'use client'

import { useState } from 'react'
import { TagIcon } from '@heroicons/react/24/outline'

interface PromoResult {
  code:     string
  type:     string
  value:    number
  discount: number
  message:  string
}

interface PromoCodeProps {
  orderTotal:  number
  onApply:     (result: PromoResult) => void
  onRemove:    () => void
  applied?:    PromoResult | null
}

export default function PromoCode({ orderTotal, onApply, onRemove, applied }: PromoCodeProps) {
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleApply() {
    if (!code.trim()) {
      setError('Введите промокод')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/promo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code, orderTotal }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
      } else {
        onApply(data)
        setCode('')
      }
    } catch {
      setError('Ошибка проверки промокода')
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-darker) 100%)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid #047857',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)', flexWrap: 'wrap' }}>
          <TagIcon style={{ width: 18, height: 18, color: '#FFFFFF', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', fontWeight: 700, color: '#FFFFFF' }}>
              {applied.code}
            </div>
            <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.78rem)', color: '#D1FAE5' }}>
              {applied.message} — −{applied.discount.toLocaleString('ru-KZ')} ₸
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#FFFFFF', fontSize: '1.2rem', lineHeight: 1,
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none'
          }}
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1.5vw, 0.5rem)', flexDirection: 'column' }} className="promo-input-wrapper">
        <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <TagIcon style={{
              position: 'absolute', left: 'clamp(0.625rem, 2vw, 0.875rem)',
              top: '50%', transform: 'translateY(-50%)',
              width: 18, height: 18, color: '#9CA3AF',
              pointerEvents: 'none',
            }} />
            <input
              className="input promo-input"
              type="text"
              placeholder="Введите промокод"
              value={code}
              onChange={e => {
                setCode(e.target.value.toUpperCase())
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleApply()}
              style={{
                paddingLeft: 'clamp(2.25rem, 5vw, 2.75rem)',
                width: '100%',
              }}
            />
          </div>
          <button
            onClick={handleApply}
            disabled={loading}
            className="btn btn-primary promo-btn"
            style={{
              flexShrink: 0,
              opacity: loading ? 0.8 : 1,
              padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.75rem)',
              fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
            }}
          >
            {loading ? '...' : 'Применить'}
          </button>
        </div>
        {error && (
          <p style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)',
            color: '#EF4444',
            marginTop: '0.25rem',
            animation: 'slideIn 0.2s ease-out',
          }}>
            ⚠️ {error}
          </p>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .promo-input-wrapper {
            flex-direction: column;
          }
          .promo-btn {
            width: 100%;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
