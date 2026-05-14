'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div style={{
      background: 'var(--color-section-bg)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'clamp(0.875rem, 2vw, 1.25rem) clamp(1rem, 3vw, 2rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          fontWeight: 800,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          RANO Admin
        </h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
          margin: '0.25rem 0 0 0',
        }}>
          Панель управления
        </p>
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{
          padding: '0.625rem 1.25rem',
          background: 'transparent',
          border: '1.5px solid #EF4444',
          borderRadius: 'var(--radius-sm)',
          color: '#FCA5A5',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          cursor: isLoggingOut ? 'default' : 'pointer',
          opacity: isLoggingOut ? 0.6 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {isLoggingOut ? 'Выход...' : 'Выход'}
      </button>
    </div>
  )
}
