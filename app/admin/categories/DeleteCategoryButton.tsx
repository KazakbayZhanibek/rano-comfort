'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteCategoryButton({
  id, name, count,
}: {
  id: number
  name: string
  count: number
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (count > 0) {
      alert(`Нельзя удалить категорию "${name}" — в ней ${count} товаров. Сначала удалите или перенесите товары.`)
      return
    }
    if (!confirm(`Удалить категорию "${name}"?`)) return

    setLoading(true)
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading || count > 0}
      style={{
        fontSize: '0.8rem', color: count > 0 ? '#ccc' : '#DC2626',
        fontWeight: 600, background: 'none',
        border: 'none', cursor: count > 0 ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
      title={count > 0 ? `Нельзя удалить — ${count} товаров` : 'Удалить'}
    >
      {loading ? '...' : 'Удалить'}
    </button>
  )
}