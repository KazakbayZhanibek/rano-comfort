'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function EditCategoryForm({
  category,
}: {
  category: { id: number; name: string; slug: string; icon: string | null }
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
    icon: category.icon || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Категория обновлена!')
        router.push('/admin/categories')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Ошибка')
      }
    } catch {
      toast.error('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)', fontSize: '0.9375rem',
    fontFamily: 'var(--font-body)', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <form onSubmit={handleSubmit}>
      <Toaster position="top-right" />
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        padding: '2rem', boxShadow: 'var(--shadow-sm)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
            Название *
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
            Slug (URL) *
          </label>
          <input
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            required style={inputStyle}
          />
          <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.25rem' }}>
            Осторожно — изменение slug сломает ссылки на товары этой категории
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
            Иконка (emoji)
          </label>
          <input
            value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            placeholder="🍽️" style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
          <button
            type="submit" disabled={saving}
            style={{
              padding: '0.875rem 2rem',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: '9999px',
              fontWeight: 700, fontSize: '1rem',
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button" onClick={() => router.back()}
            style={{
              padding: '0.875rem 1.5rem', background: 'transparent',
              color: 'var(--color-text-muted)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '9999px', fontWeight: 600,
              fontSize: '1rem', cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </form>
  )
}