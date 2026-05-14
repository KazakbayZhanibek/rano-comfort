'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'

  return (
    <div style={{
      minHeight: '70vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: 'var(--color-section-bg)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 520, width: '100%' }}>

        {/* Иконка успеха */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B6B2F, #4CAF50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 32px rgba(27,107,47,0.3)',
        }}>
          <CheckCircleIcon style={{ width: 52, height: 52, color: '#fff' }} />
        </div>

        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '2rem', fontWeight: 800,
          color: '#1A1A1A', marginBottom: '0.5rem',
        }}>
          Заказ оформлен!
        </h1>

        <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '0.25rem' }}>
          Номер вашего заказа:
        </p>
        <p style={{
          fontSize: '1.75rem', fontWeight: 800,
          color: '#1B6B2F', marginBottom: '0.75rem',
          fontFamily: 'Montserrat, sans-serif',
        }}>
          #{orderId}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '2rem' }}>
          Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>

        {/* Основные действия */}
        {orderId !== 'N/A' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

            {/* Отследить заказ */}
            <Link href={`/order/${orderId}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #1B6B2F, #4CAF50)',
              color: '#fff', borderRadius: '9999px',
              textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(27,107,47,0.3)',
            }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Отследить заказ
            </Link>

            {/* Telegram уведомления */}
            <a
              href={`https://t.me/orderscmfshm_bot?start=order_${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                padding: '0.875rem 2rem',
                background: '#0088cc', color: '#fff',
                borderRadius: '9999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '1rem',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Получать уведомления в Telegram
            </a>
          </div>
        )}

        {/* Подсказка */}
        {orderId !== 'N/A' && (
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '1rem 1.25rem', marginBottom: '1.5rem',
            border: '1px solid #E5E7EB',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem', fontWeight: 600 }}>
              Как отслеживать заказ:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                '1. Нажмите "Отследить заказ" чтобы видеть статус на сайте',
                '2. Или подпишитесь в Telegram — бот пришлёт уведомление при каждом изменении',
              ].map((tip, i) => (
                <p key={i} style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>{tip}</p>
              ))}
            </div>
          </div>
        )}

        {/* Контакты */}
        <div style={{
          background: '#F1F8F2', borderRadius: '16px',
          padding: '1.25rem', marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            Есть вопросы? Свяжитесь с нами:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/77777777777" target="_blank" rel="noopener noreferrer"
              style={{ padding: '0.5rem 1.25rem', background: '#25D366', color: '#fff', borderRadius: '9999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
              WhatsApp
            </a>
            <a href="https://t.me/ranokomfort" target="_blank" rel="noopener noreferrer"
              style={{ padding: '0.5rem 1.25rem', background: '#0088cc', color: '#fff', borderRadius: '9999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
              Telegram
            </a>
          </div>
        </div>

        {/* Навигация */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/catalog" style={{
            padding: '0.75rem 1.75rem', background: '#1B6B2F',
            color: '#fff', borderRadius: '9999px',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
          }}>
            Продолжить покупки
          </Link>
          <Link href="/profile" style={{
            padding: '0.75rem 1.75rem',
            border: '2px solid #1B6B2F', color: '#1B6B2F',
            borderRadius: '9999px', textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            Мои заказы
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Загрузка...
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}