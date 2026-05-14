'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewPromoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code:      '',
    type:      'percent',
    value:     '',
    minOrder:  '',
    maxUses:   '',
    isActive:  true,
    expiresAt: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code || !form.value) {
      toast.error('Заполните обязательные поля')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/promos', {
        method:  'POST',
        credentials: 'include', // Отправляем cookies
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          code:      form.code.toUpperCase().trim(),
          type:      form.type,
          value:     parseFloat(form.value),
          minOrder:  form.minOrder  ? parseFloat(form.minOrder)  : 0,
          maxUses:   form.maxUses   ? parseInt(form.maxUses)     : null,
          isActive:  form.isActive,
          expiresAt: form.expiresAt ? new Date(form.expiresAt)   : null,
        }),
      })
      if (res.ok) {
        toast.success('Промокод создан!')
        router.push('/admin/promos')
      } else {
        const data = await res.json()
        if (res.status === 401) {
          toast.error('Сессия истекла. Пожалуйста, войдите заново.')
          router.push('/admin/login')
        } else {
          toast.error(data.error || 'Ошибка')
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9375rem', outline: 'none',
    background: '#fff', boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block', fontSize: '0.875rem',
    fontWeight: 600, marginBottom: '0.375rem',
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>
        Новый промокод
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '2rem', boxShadow: 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Код *</label>
              <input name="code" value={form.code} onChange={handleChange}
                placeholder="SUMMER20" required
                style={{ ...inputStyle, textTransform: 'uppercase' as const }} />
            </div>
            <div>
              <label style={labelStyle}>Тип скидки *</label>
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                <option value="percent">Процент (%)</option>
                <option value="fixed">Фиксированная (₸)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>
                Размер скидки * {form.type === 'percent' ? '(%)' : '(₸)'}
              </label>
              <input name="value" value={form.value} onChange={handleChange}
                type="number" placeholder={form.type === 'percent' ? '10' : '500'}
                required min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Мин. сумма заказа (₸)</label>
              <input name="minOrder" value={form.minOrder} onChange={handleChange}
                type="number" placeholder="0" min="0" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Макс. использований</label>
              <input name="maxUses" value={form.maxUses} onChange={handleChange}
                type="number" placeholder="Без ограничений" min="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Действует до</label>
              <input name="expiresAt" value={form.expiresAt} onChange={handleChange}
                type="datetime-local" style={inputStyle} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="isActive" checked={form.isActive}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Активен</span>
          </label>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} style={{
              padding: '0.875rem 2rem',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: '9999px',
              fontWeight: 700, cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Сохранение...' : 'Создать промокод'}
            </button>
            <button type="button" onClick={() => router.back()} style={{
              padding: '0.875rem 1.5rem',
              background: 'transparent', color: 'var(--color-text-muted)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '9999px', cursor: 'pointer',
            }}>
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
