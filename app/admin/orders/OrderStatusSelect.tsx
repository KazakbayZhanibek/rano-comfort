'use client'

import { useState } from 'react'

const statuses = [
  { value: 'new',       label: 'Новый'     },
  { value: 'confirmed', label: 'Принят'    },
  { value: 'shipped',   label: 'В пути'    },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменён'   },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: number
  currentStatus: string
}) {
  const [status, setStatus]   = useState(currentStatus)
  const [saving, setSaving]   = useState(false)

  const colors: Record<string, { bg: string; text: string; border: string }> = {
    new:       { bg: 'rgba(245, 158, 11, 0.15)', text: '#FCD34D', border: '#F59E0B' },
    confirmed: { bg: 'rgba(37, 99, 235, 0.15)', text: '#93C5FD', border: '#2563EB' },
    shipping:  { bg: 'rgba(124, 58, 237, 0.15)', text: '#D8B4FE', border: '#7C3AED' },
    delivered: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: '#10B981' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#FCA5A5', border: '#EF4444' },
  }

  const currentColor = colors[status] || { bg: '#1E293B', text: '#94A3B8', border: '#334155' }

  async function handleChange(newStatus: string) {
    setSaving(true)
    console.log(`🔄 Изменение статуса с ${status} на ${newStatus} для заказа #${orderId}`)
    
    try {
      const url = `/api/admin/orders/${orderId}`
      console.log(`📤 Отправляем PATCH запрос на ${url}`)
      
      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include', // Отправляем cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      console.log(`📥 Ответ: ${res.status} ${res.statusText}`)
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('Unauthorized - session expired')
          // Перенаправляем на логин
          window.location.href = '/admin/login'
          return
        }
        console.error('Failed to update order status')
        return
      }

      setStatus(newStatus)
      console.log(`✅ Статус обновлён на ${newStatus}`)
    } catch (err) {
      console.error('Error updating order status:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={saving}
      style={{
        padding: 'clamp(0.3rem, 1vw, 0.375rem) clamp(0.5rem, 1vw, 0.75rem)',
        borderRadius: '9999px',
        border: `1.5px solid ${currentColor.border}`,
        color: currentColor.text,
        fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        background: currentColor.bg,
        cursor: 'pointer',
        outline: 'none',
        opacity: saving ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {statuses.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}