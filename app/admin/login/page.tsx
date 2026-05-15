'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      const data = await res.json()
      setError(data.error || 'Неверный пароль')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        background: '#1E293B',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        width: '100%',
        maxWidth: 400,
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
      }}>
        {/* Логотип */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.5rem', fontWeight: 800,
            fontFamily: 'var(--font-heading)', margin: '0 auto 1rem',
          }}>R</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800,
            color: 'var(--color-text)', marginBottom: '0.25rem',
          }}>
            Админ-панель
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
            RANO Comfort Service
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <div>
            <label style={{
              display: 'block', fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
              fontWeight: 600, marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              style={{
                width: '100%', padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
                border: `1.5px solid ${error ? '#EF4444' : '#E5E7EB'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                fontFamily: 'var(--font-body)',
                background: '#FFFFFF',
                color: '#1F2937',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
            />
            {error && (
              <p style={{ color: '#FCA5A5', fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)', marginTop: '0.375rem' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 'clamp(0.75rem, 2vw, 0.875rem)',
              background: loading ? 'var(--color-secondary)' : 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-full)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              cursor: loading ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}