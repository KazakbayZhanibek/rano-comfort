'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

export default function NewCategoryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', icon: '' })

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[а-яё]/g, (c: string) => ({
        а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',
        и:'i',й:'j',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',
        с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',
        щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
      } as Record<string,string>)[c] ?? c)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setForm(f => ({ ...f, name, slug }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Категория добавлена!')
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
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <Toaster position="top-right" />
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.75rem', fontWeight: 800,
        marginBottom: '2rem', color: 'var(--color-text)',
      }}>
        Добавить категорию
      </h1>

      <form onSubmit={handleSubmit}>
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
              value={form.name} onChange={handleNameChange}
              placeholder="Для посуды" required style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Slug (URL) *
            </label>
            <input
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="dlya-posudy" required style={inputStyle}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Заполняется автоматически из названия
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
    </div>
  )
}