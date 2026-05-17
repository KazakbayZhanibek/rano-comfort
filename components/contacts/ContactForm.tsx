'use client'

import { useState, useEffect, type FormEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export function ContactForm() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Валидация ФИО
    if (!form.name.trim() || form.name.trim().split(' ').length < 2) {
      toast.error('Пожалуйста, введите полное ФИО (минимум имя и фамилия)')
      setIsSubmitting(false)
      return
    }

    // Валидация Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error('Пожалуйста, введите корректный email адрес')
      setIsSubmitting(false)
      return
    }

    // Валидация телефона (если введён)
    if (form.phone.trim()) {
      const phoneRegex = /^[\d\s+()\-]{10,}$/
      if (!phoneRegex.test(form.phone)) {
        toast.error('Пожалуйста, введите корректный номер телефона')
        setIsSubmitting(false)
        return
      }
    }

    try {
      const res = await fetch('/api/contacts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Сообщение отправлено! Мы свяжемся с вами скоро.')
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        toast.error('Ошибка при отправке. Попробуйте позже.')
      }
    } catch {
      toast.error('Ошибка при отправке. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="bottom-center" toastOptions={{
        success: {
          duration: 4000,
          style: {
            background: '#1B6B2F',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 600,
          },
        },
        error: {
          style: {
            background: '#DC2626',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            borderRadius: '12px',
          },
        },
      }} />
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
            ФИО
          </label>
          <input
            type="text"
            placeholder="Ваше полное ФИО"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
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
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
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
            Телефон
          </label>
          <input
            type="tel"
            placeholder="+7 (777) 777-77-77"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'border-color var(--transition)',
              boxSizing: 'border-box' as const,
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
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
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
    </>
  )
}
