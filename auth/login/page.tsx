// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Заполните все поля')
      return
    }

    setLoading(true)
    try {
      // TODO: заменить на реальный NextAuth signIn
      await new Promise(r => setTimeout(r, 1000))
      router.push('/profile')
    } catch {
      setError('Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f4a20 0%, #1B6B2F 50%, #2d8a45 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Декоративные круги */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,195,74,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(76,175,80,0.08)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease both',
        position: 'relative', zIndex: 1,
      }}>

        {/* Шапка карточки */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.1rem', fontWeight: 800,
              fontFamily: 'var(--font-heading)',
            }}>R</div>
            <span style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
              RANO Comfort
            </span>
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem', fontWeight: 800,
            color: '#fff', marginBottom: '0.25rem',
          }}>
            Добро пожаловать
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
            Войдите в свой аккаунт
          </p>
        </div>

        {/* Форма */}
        <div style={{ padding: '2rem' }}>

          {/* Ошибка */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: '#FEE2E2', color: '#DC2626',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem', fontWeight: 500,
              marginBottom: '1.25rem',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <ExclamationTriangleIcon width={18} height={18} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div style={{ position: 'relative' }}>
                <EnvelopeIcon style={{
                  position: 'absolute', left: '0.875rem',
                  top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }} />
                <input
                  className="input"
                  type="email"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="label" style={{ margin: 0 }}>Пароль</label>
                <Link href="/auth/forgot" style={{
                  fontSize: '0.8rem', color: 'var(--color-secondary)',
                  fontWeight: 500,
                }}>
                  Забыли пароль?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <LockClosedIcon style={{
                  position: 'absolute', left: '0.875rem',
                  top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }} />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.875rem',
                    top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass
                    ? <EyeSlashIcon style={{ width: 18, height: 18 }} />
                    : <EyeIcon      style={{ width: 18, height: 18 }} />
                  }
                </button>
              </div>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Входим...
                </span>
              ) : 'Войти'}
            </button>
          </div>

          {/* Разделитель */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '1.5rem 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>или</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Ссылка на регистрацию */}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Нет аккаунта?{' '}
            <Link href="/auth/register" style={{
              color: 'var(--color-primary)', fontWeight: 700,
              textDecoration: 'none',
            }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}