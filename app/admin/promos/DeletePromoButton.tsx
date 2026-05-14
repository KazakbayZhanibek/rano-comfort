'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeletePromoButton({ id, code }: { id: number; code: string }) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Удалить промокод "${code}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Отправляем cookies
      })

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите в админ-панель заново.')
          router.push('/admin/login')
          return
        }
        alert(`Ошибка: ${error.error || 'Не удалось удалить промокод'}`)
        return
      }

      alert('Промокод удалён')
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert(`Ошибка при удалении: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} style={{
      fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)', color: '#FCA5A5', fontWeight: 600,
      background: 'none', border: 'none', cursor: 'pointer',
      transition: 'color 0.2s ease',
      opacity: loading ? 0.6 : 1,
    }}
    onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.color = '#EF4444')}
    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#FCA5A5'}
    >
      {loading ? '...' : 'Удалить'}
    </button>
  )
}
