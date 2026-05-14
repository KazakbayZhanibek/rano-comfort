'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function ContactForm() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Сообщение отправлено! Мы свяжемся с вами скоро.')
      ;(e.target as HTMLFormElement).reset()
    } catch {
      toast.error('Ошибка при отправке. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="contact-form"
      style={{
        background: 'var(--color-section-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '1.5rem 1rem' : '3rem 2rem',
        marginBottom: '5rem',
        maxWidth: '700px',
        margin: '0 auto 5rem',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          fontWeight: 800,
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        Напишите нам
      </h2>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
        onSubmit={handleSubmit}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            Имя
          </label>
          <input
            type="text"
            placeholder="Ваше имя"
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'border-color var(--transition)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="ваша@почта.com"
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'border-color var(--transition)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            Сообщение
          </label>
          <textarea
            placeholder="Ваше сообщение..."
            rows={isMobile ? 4 : 5}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.9rem' : '1rem',
              resize: 'none',
              transition: 'border-color var(--transition)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.875rem',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? '0.95rem' : '1rem',
            fontWeight: 700,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Отправляем...' : 'Отправить'}
        </button>
      </form>
    </section>
  )
}
