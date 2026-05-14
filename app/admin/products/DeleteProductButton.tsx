'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Удалить товар "${name}"?`)) return

    setLoading(true)
    console.log(`🗑️ Удаляем товар ID: ${id}`)
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      console.log(`📊 Статус ответа: ${res.status}`)
      
      const data = await res.json()
      console.log(`📦 Ответ сервера:`, data)

      if (!res.ok) {
        if (res.status === 401) {
          alert('❌ Сессия истекла. Войдите в админ-панель заново.')
          router.push('/admin/login')
          return
        }
        alert(`❌ Ошибка: ${data.error || `Статус ${res.status}`}`)
        return
      }

      console.log(`✅ Товар удалён успешно`)
      alert('✅ Товар удалён!')
      
      // Добавляем задержку перед обновлением
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (err) {
      console.error('❌ Критическая ошибка:', err)
      alert(`❌ Ошибка: ${err instanceof Error ? err.message : 'Неизвестная'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        fontSize: 'clamp(0.75rem, 1.5vw, 0.8rem)', color: '#FCA5A5',
        fontWeight: 600, background: 'none',
        border: 'none', cursor: loading ? 'default' : 'pointer',
        opacity: loading ? 0.6 : 1, padding: 0,
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.color = '#EF4444')}
      onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#FCA5A5'}
    >
      {loading ? '⏳' : 'Удалить'}
    </button>
  )
}