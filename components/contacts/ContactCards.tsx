'use client'

import { useState, useEffect } from 'react'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

export function ContactCards() {
  const [isMobile, setIsMobile] = useState(false)
  const [hoverWhatsApp, setHoverWhatsApp] = useState(false)
  const [hoverTelegram, setHoverTelegram] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Основные контакты */}
      <section style={{ marginBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
          }}
          className="contact-cards"
        >
          {/* Телефон */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #eee',
              transition: 'all var(--transition)',
            }}
          >
            <div
              style={{
                fontSize: isMobile ? '2rem' : '3rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <PhoneIcon width={isMobile ? 32 : 48} height={isMobile ? 32 : 48} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
              }}
            >
              Телефон
            </h3>
            <p
              style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                color: 'var(--color-primary)',
                fontWeight: '600',
                wordBreak: 'break-word',
              }}
            >
              +77479053247
            </p>
          </div>

          {/* Email */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #eee',
              transition: 'all var(--transition)',
            }}
          >
            <div
              style={{
                fontSize: isMobile ? '2rem' : '3rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <EnvelopeIcon width={isMobile ? 32 : 48} height={isMobile ? 32 : 48} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
              }}
            >
              Email
            </h3>
            <p
              style={{
                fontSize: isMobile ? '0.8rem' : '1rem',
                color: 'var(--color-primary)',
                fontWeight: '600',
                wordBreak: 'break-word',
              }}
            >
              comfortservicetovar@gmail.com
            </p>
          </div>

          {/* Адрес */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #eee',
              transition: 'all var(--transition)',
            }}
          >
            <div
              style={{
                fontSize: isMobile ? '2rem' : '3rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <MapPinIcon width={isMobile ? 32 : 48} height={isMobile ? 32 : 48} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
              }}
            >
              Адрес
            </h3>
            <p
              style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                color: 'var(--color-primary)',
                fontWeight: '600',
              }}
            >
              Шымкент, ул. Абая, 123
            </p>
          </div>
        </div>
      </section>

      {/* Социальные сети */}
      <section style={{ marginBottom: '5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            fontWeight: 700,
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          Следите за нами в соцсетях
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '1rem' : '2rem',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* WhatsApp */}
          <a
            href="https://wa.me/77777777777"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '1.5rem 1rem' : '2rem',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'all var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '0.75rem' : '1rem',
              transform: hoverWhatsApp ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoverWhatsApp
                ? '0 8px 24px rgba(37,211,102,0.3)'
                : 'var(--shadow-sm)',
            }}
            onMouseEnter={() => setHoverWhatsApp(true)}
            onMouseLeave={() => setHoverWhatsApp(false)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <ChatBubbleLeftIcon
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
              />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontWeight: 700,
                margin: 0,
              }}
            >
              WhatsApp
            </h3>
            <p
              style={{
                fontSize: isMobile ? '0.85rem' : '0.95rem',
                opacity: 0.9,
                margin: 0,
              }}
            >
              Быстрые ответы на ваши вопросы
            </p>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/ranokomfort"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0088cc',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: isMobile ? '1.5rem 1rem' : '2rem',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'all var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? '0.75rem' : '1rem',
              transform: hoverTelegram ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoverTelegram
                ? '0 8px 24px rgba(0,136,204,0.3)'
                : 'var(--shadow-sm)',
            }}
            onMouseEnter={() => setHoverTelegram(true)}
            onMouseLeave={() => setHoverTelegram(false)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <PaperAirplaneIcon
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
              />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isMobile ? '1rem' : '1.25rem',
                fontWeight: 700,
                margin: 0,
              }}
            >
              Telegram
            </h3>
            <p
              style={{
                fontSize: isMobile ? '0.85rem' : '0.95rem',
                opacity: 0.9,
                margin: 0,
              }}
            >
              Актуальные новости и акции
            </p>
          </a>
        </div>
      </section>
    </>
  )
}
