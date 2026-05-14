'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { slug: 'dishwashing',   name: 'Для посуды'  },
  { slug: 'laundry',       name: 'Для стирки'  },
  { slug: 'floor',         name: 'Для пола'    },
  { slug: 'bathroom',      name: 'Для ванной'  },
  { slug: 'glass',         name: 'Для стёкол'  },
  { slug: 'air-freshener', name: 'Освежители'  },
]

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
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
    isNew:        true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[а-яё]/g, c => ({ а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'j',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' } as Record<string,string>)[c] ?? c)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setForm(f => ({ ...f, name, slug }))
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
      let imagePath = ''

      // Загружаем фото
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const { path } = await uploadRes.json()
        imagePath = path
      }

      // Получаем ID категории
      const catRes = await fetch(`/api/categories?slug=${form.categorySlug}`)
      const catData = await catRes.json()
      const categoryId = catData.id

      // Создаём товар
      await fetch('/api/products', {
        method: 'POST',
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
          categoryId,
        }),
      })

      toast.success('Товар добавлен!')
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

  return (
    <div style={{ padding: '2rem', maxWidth: 800 }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.75rem', fontWeight: 800,
        marginBottom: '2rem', color: 'var(--color-text)',
      }}>
        Добавить товар
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
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{
                  maxHeight: 200, borderRadius: 8, margin: '0 auto',
                  display: 'block', objectFit: 'contain',
                }} />
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  Нажмите чтобы выбрать фото
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute', inset: 0,
                  opacity: 0, cursor: 'pointer', width: '100%',
                }}
              />
            </div>
          </div>

          {/* Название */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Название *</label>
              <input
                name="name" value={form.name}
                onChange={handleNameChange}
                placeholder="RANO Лимон для посуды"
                required style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>URL (slug) *</label>
              <input
                name="slug" value={form.slug}
                onChange={handleChange}
                placeholder="rano-limon-dlya-posudy"
                required style={inputStyle}
              />
            </div>
          </div>

          {/* Описание */}
          <div>
            <label style={labelStyle}>Описание</label>
            <textarea
              name="description" value={form.description}
              onChange={handleChange}
              placeholder="Мощное средство для мытья посуды..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
          </div>

          {/* Цены */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Цена (₸) *</label>
              <input
                name="price" value={form.price} type="number"
                onChange={handleChange} placeholder="890"
                required min="0" style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Старая цена (₸)</label>
              <input
                name="oldPrice" value={form.oldPrice} type="number"
                onChange={handleChange} placeholder="1100"
                min="0" style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Объём</label>
              <input
                name="volume" value={form.volume}
                onChange={handleChange} placeholder="1 л"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Категория и остаток */}
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
              <input
                name="stock" value={form.stock} type="number"
                onChange={handleChange} min="0" style={inputStyle}
              />
            </div>
          </div>

          {/* Флаги */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { name: 'isBestseller', label: 'Хит продаж' },
              { name: 'isNew',        label: 'Новинка'     },
            ].map(flag => (
              <label key={flag.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name={flag.name}
                  checked={form[flag.name as keyof typeof form] as boolean}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{flag.label}</span>
              </label>
            ))}
          </div>

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.875rem 2rem',
                background: 'var(--color-primary)', color: '#fff',
                border: 'none', borderRadius: '9999px',
                fontWeight: 700, fontSize: '1rem',
                fontFamily: 'var(--font-heading)',
                cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Сохранение...' : 'Сохранить товар'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '0.875rem 1.5rem',
                background: 'transparent', color: 'var(--color-text-muted)',
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