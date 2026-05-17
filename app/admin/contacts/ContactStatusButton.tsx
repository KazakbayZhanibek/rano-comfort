'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactStatusButton({
  id, currentStatus,
}: {
  id: number
  currentStatus: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    const next = currentStatus === 'new' ? 'read' : currentStatus === 'read' ? 'replied' : 'new'
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    router.refresh()
    setLoading(false)
  }

  const labels: Record<string, string> = {
    new:     'Пометить прочитанным',
    read:    'Пометить отвеченным',
    replied: 'Сбросить статус',
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '0.375rem 0.875rem',
        background: 'transparent',
        border: '1.5px solid var(--color-border)',
        borderRadius: '9999px',
        fontSize: '0.75rem', fontWeight: 600,
        cursor: 'pointer', color: 'var(--color-text)',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : labels[currentStatus] ?? 'Изменить'}
    </button>
  )
}