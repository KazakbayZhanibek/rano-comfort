'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  EyeIcon, EyeSlashIcon,
  EnvelopeIcon, LockClosedIcon,
  UserIcon, PhoneIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '', confirm: '',
  })
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [agree,       setAgree]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.phone || !form.email || !form.password) {
      setError('Заполните все обязательные поля')
      return
    }
    if (form.password !== form.confirm) {
      setError('Пароли не совпадают')
      return
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }
    if (!agree) {
      setError('Примите условия использования')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          phone:    form.phone,
          email:    form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Ошибка регистрации')
        return
      }

      await signIn('credentials', {
        email:    form.email,
        password: form.password,
        redirect: false,
      })

      router.push('/profile')
    } catch {
      setError('Ошибка регистрации. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
    outline: 'none', background: '#fff',
    boxSizing: 'border-box' as const,
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f4a20 0%, #1B6B2F 50%, #2d8a45 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,195,74,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(76,175,80,0.08)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 480, background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        overflow: 'hidden', position: 'relative', zIndex: 1,
      }}>
        {/* Шапка */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          padding: '2rem', textAlign: 'center',
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
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Создать аккаунт
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
            Регистрация займёт меньше минуты
          </p>
        </div>

        {/* Форма */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem', background: '#FEE2E2', color: '#DC2626',
              borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500,
              marginBottom: '1.25rem', border: '1px solid #FECACA',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <ExclamationTriangleIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Имя */}
            <div>
              <label className="label">Имя</label>
              <div style={{ position: 'relative' }}>
                <UserIcon style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input style={inputStyle} type="text" placeholder="Иван Иванов"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>

            {/* Телефон */}
            <div>
              <label className="label">Телефон</label>
              <div style={{ position: 'relative' }}>
                <PhoneIcon style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input style={inputStyle} type="tel" placeholder="+7 (777) 777-77-77"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div style={{ position: 'relative' }}>
                <EnvelopeIcon style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input style={inputStyle} type="email" placeholder="example@mail.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="label">Пароль</label>
              <div style={{ position: 'relative' }}>
                <LockClosedIcon style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  type={showPass ? 'text' : 'password'} placeholder="Минимум 6 символов"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  {showPass ? <EyeSlashIcon style={{ width: 18, height: 18 }} /> : <EyeIcon style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label className="label">Подтвердите пароль</label>
              <div style={{ position: 'relative' }}>
                <LockClosedIcon style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input style={{
                  ...inputStyle, paddingRight: '2.75rem',
                  borderColor: form.confirm && form.confirm !== form.password ? '#DC2626' : undefined,
                }}
                  type={showConfirm ? 'text' : 'password'} placeholder="Повторите пароль"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeSlashIcon style={{ width: 18, height: 18 }} /> : <EyeIcon style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.3rem' }}>Пароли не совпадают</p>
              )}
            </div>

            {/* Согласие */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Я соглашаюсь с{' '}
                <Link href="/terms" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>условиями использования</Link>
              </span>
            </label>

            {/* Кнопка */}
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-lg"
              style={{ width: '100%', opacity: loading ? 0.8 : 1 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Регистрируем...
                </span>
              ) : 'Создать аккаунт'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Войти</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}