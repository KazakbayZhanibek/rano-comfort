// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  EyeIcon, EyeSlashIcon,
  EnvelopeIcon, LockClosedIcon,
  UserIcon, PhoneIcon,
  ExclamationTriangleIcon,
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
    if (form.password.length < 8) {
      setError('Пароль должен быть минимум 8 символов')
      return
    }
    if (!/[A-Z]/.test(form.password)) {
      setError('Пароль должен содержать заглавную букву')
      return
    }
    if (!/[a-z]/.test(form.password)) {
      setError('Пароль должен содержать строчную букву')
      return
    }
    if (!/[0-9]/.test(form.password)) {
      setError('Пароль должен содержать цифру')
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
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        setError(error.error || 'Ошибка регистрации')
        return
      }

      // После успешной регистрации попытаемся войти
      const signInResult = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      if (signInResult.ok) {
        router.push('/profile')
      } else {
        router.push('/auth/login')
      }
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    {
      key: 'name', label: 'Имя', type: 'text',
      placeholder: 'Ваше имя', icon: UserIcon,
    },
    {
      key: 'phone', label: 'Телефон', type: 'tel',
      placeholder: '+7 (777) 777-77-77', icon: PhoneIcon,
    },
    {
      key: 'email', label: 'Email', type: 'email',
      placeholder: 'example@mail.com', icon: EnvelopeIcon,
    },
  ]

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
        width: '100%', maxWidth: 480,
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease both',
        position: 'relative', zIndex: 1,
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
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem', fontWeight: 800,
            color: '#fff', marginBottom: '0.25rem',
          }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Обычные поля */}
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{
                    position: 'absolute', left: '0.875rem',
                    top: '50%', transform: 'translateY(-50%)',
                    width: 18, height: 18, color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }} />
                  <input
                    className="input"
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            ))}

            {/* Пароль */}
            <div>
              <label className="label">Пароль</label>
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
                  placeholder="Минимум 6 символов"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                />
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
                <LockClosedIcon style={{
                  position: 'absolute', left: '0.875rem',
                  top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }} />
                <input
                  className="input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Повторите пароль"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem',
                    borderColor: form.confirm && form.confirm !== form.password ? '#DC2626' : undefined,
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeSlashIcon style={{ width: 18, height: 18 }} /> : <EyeIcon style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.3rem' }}>
                  Пароли не совпадают
                </p>
              )}
            </div>

            {/* Согласие */}
            <label style={{
              display: 'flex', alignItems: 'flex-start',
              gap: '0.75rem', cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--color-primary)', width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Я соглашаюсь с{' '}
                <Link href="/terms" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  условиями использования
                </Link>{' '}
                и{' '}
                <Link href="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  политикой конфиденциальности
                </Link>
              </span>
            </label>

            {/* Кнопка */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.25rem', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Регистрируем...
                </span>
              ) : 'Создать аккаунт'}
            </button>
          </div>

          {/* Ссылка на вход */}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Войти
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}