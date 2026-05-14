'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { slug: 'dishwashing',   name: 'Для посуды'  },
  { slug: 'laundry',       name: 'Для стирки'  },
  { slug: 'floor',         name: 'Для пола'    },
  { slug: 'bathroom',      name: 'Для ванной'  },
  { slug: 'glass',         name: 'Для стёкол'  },
  { slug: 'air-freshener', name: 'Освежители'  },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [saving,       setSaving]       = useState(false)
  const [loading,      setLoading]      = useState(true)
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    name:         '',
    slug:         '',
    description:  '',
    price:        '',
    oldPrice:     '',
    volume:       '',
    stock:        '0',
    categorySlug: 'dishwashing',
    isBestseller: false,
    isNew:        false,
    isEco:        false,
  })

  // Загружаем данные товара
  useEffect(() => {
    fetch(`/api/admin/products/${id}`, {
      credentials: 'include', // Отправляем cookies с админ-сессией
    })
      .then(r => {
        if (!r.ok) {
          if (r.status === 401) {
            toast.error('Сессия истекла. Пожалуйста, войдите заново.')
            router.push('/admin/login')
          } else {
            toast.error('Не удалось загрузить товар')
          }
          setLoading(false)
          return null
        }
        return r.json()
      })
      .then(p => {
        if (!p) return
        setForm({
          name:         p.name         ?? '',
          slug:         p.slug         ?? '',
          description:  p.description  ?? '',
          price:        String(p.price ?? ''),
          oldPrice:     p.oldPrice ? String(p.oldPrice) : '',
          volume:       p.volume       ?? '',
          stock:        String(p.stock ?? 0),
          categorySlug: p.category?.slug ?? 'dishwashing',
          isBestseller: p.isBestseller  ?? false,
          isNew:        p.isNew         ?? false,
          isEco:        p.isEco         ?? false,
        })
        // Показываем первое фото если есть
        try {
          const imgs = JSON.parse(p.images || '[]')
          if (imgs[0]) setImagePreview(imgs[0])
        } catch {}
        setLoading(false)
      })
      .catch(err => {
        console.error('Load product error:', err)
        toast.error('Ошибка при загрузке товара')
        setLoading(false)
      })
  }, [id, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      let imagePath = imagePreview ?? ''

      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const { path } = await uploadRes.json()
        imagePath = path
      }

      const catRes = await fetch(`/api/categories?slug=${form.categorySlug}`)
      const catData = await catRes.json()
      const categoryId = catData.id

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        credentials: 'include', // Отправляем cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         form.name,
          slug:         form.slug,
          description:  form.description,
          price:        Number(form.price),
          oldPrice:     form.oldPrice ? Number(form.oldPrice) : null,
          volume:       form.volume,
          stock:        Number(form.stock),
          images:       imagePath ? [imagePath] : [],
          isBestseller: form.isBestseller,
          isNew:        form.isNew,
          isEco:        form.isEco,
          categoryId,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Сессия истекла. Пожалуйста, войдите заново.')
          router.push('/admin/login')
          return
        }
        const error = await res.json()
        toast.error(error.error || 'Ошибка при сохранении')
        return
      }

      toast.success('Товар обновлён!')
      router.push('/admin/products')
    } catch {
      toast.error('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
    outline: 'none', boxSizing: 'border-box' as const,
    background: '#fff',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.875rem',
    fontWeight: 600, marginBottom: '0.375rem',
    color: 'var(--color-text)',
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Загрузка...
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800 }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.75rem', fontWeight: 800,
        marginBottom: '2rem', color: 'var(--color-text)',
      }}>
        Редактировать товар
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          padding: '2rem', boxShadow: 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}>

          {/* Фото */}
          <div>
            <label style={labelStyle}>Фото товара</label>
            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem', textAlign: 'center',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{
                  maxHeight: 200, borderRadius: 8,
                  margin: '0 auto', display: 'block', objectFit: 'contain',
                }} />
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Нажмите чтобы выбрать фото
                </div>
              )}
              <input
                type="file" accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
              />
            </div>
          </div>

          {/* Название + slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Название *</label>
              <input name="name" value={form.name} onChange={handleChange}
                required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>URL (slug) *</label>
              <input name="slug" value={form.slug} onChange={handleChange}
                required style={inputStyle} />
            </div>
          </div>

          {/* Описание */}
          <div>
            <label style={labelStyle}>Описание</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }} />
          </div>

          {/* Цены */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Цена (₸) *</label>
              <input name="price" value={form.price} type="number"
                onChange={handleChange} required min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Старая цена (₸)</label>
              <input name="oldPrice" value={form.oldPrice} type="number"
                onChange={handleChange} min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Объём</label>
              <input name="volume" value={form.volume}
                onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Категория + остаток */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Категория *</label>
              <select name="categorySlug" value={form.categorySlug}
                onChange={handleChange} style={inputStyle}>
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Остаток (шт.)</label>
              <input name="stock" value={form.stock} type="number"
                onChange={handleChange} min="0" style={inputStyle} />
            </div>
          </div>

          {/* Флаги */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { name: 'isBestseller', label: 'Хит продаж' },
              { name: 'isNew',        label: 'Новинка'     },
              { name: 'isEco',        label: 'Эко'         },
            ].map(flag => (
              <label key={flag.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox" name={flag.name}
                  checked={form[flag.name as keyof typeof form] as boolean}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{flag.label}</span>
              </label>
            ))}
          </div>

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <button type="submit" disabled={saving} style={{
              padding: '0.875rem 2rem',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: '9999px',
              fontWeight: 700, fontSize: '1rem',
              fontFamily: 'var(--font-heading)',
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? 'Сохранение...' : 'Сохранить товар'}
            </button>
            <button type="button" onClick={() => router.back()} style={{
              padding: '0.875rem 1.5rem',
              background: 'transparent', color: 'var(--color-text-muted)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '9999px', fontWeight: 600,
              fontSize: '1rem', cursor: 'pointer',
            }}>
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}