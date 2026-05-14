'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import {
  ShoppingBagIcon, HeartIcon, Cog6ToothIcon,
  ArrowRightOnRectangleIcon, UserCircleIcon,
  PhoneIcon, MapPinIcon, CurrencyDollarIcon,
  EnvelopeIcon, CheckIcon, EyeIcon, EyeSlashIcon,
} from '@heroicons/react/24/outline'

type Tab = 'overview' | 'orders' | 'wishlist' | 'password' | 'settings'

interface Order {
  id: number
  createdAt: string
  total: number
  status: string
  items: string
}

interface WishlistItem {
  id: number
  product: {
    id: number
    name: string
    price: number
    slug: string
    images: string
    category: { name: string }
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [orders,    setOrders]    = useState<Order[]>([])
  const [wishlist,  setWishlist]  = useState<WishlistItem[]>([])
  const [form,      setForm]      = useState({ name: '', phone: '', address: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '' })
  const [saving,    setSaving]    = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [changingEmail, setChangingEmail] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [emailError, setEmailError] = useState('')

  // Редирект если не авторизован
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Загружаем данные пользователя и сохраняем их в localStorage для синхронизации с другими страницами
  useEffect(() => {
    if (session?.user) {
      const profileData = {
        name:    session.user.name    || '',
        phone:   (session.user as any).phone || '',
        address: '',
      }
      
      const saved = localStorage.getItem('rano-user-profile')
      if (saved) {
        try {
          const p = JSON.parse(saved)
          profileData.address = p.address || ''
          setForm({
            name:    p.name    || profileData.name,
            phone:   p.phone   || profileData.phone,
            address: p.address || '',
          })
        } catch {
          setForm(profileData)
        }
      } else {
        // Если первый раз - сохраняем данные из сессии в localStorage
        localStorage.setItem('rano-user-profile', JSON.stringify(profileData))
        setForm(profileData)
      }
    }
  }, [session])

  // Загружаем заказы (по userId из сессии)
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then(r => r.json())
        .then(data => {
          console.log('Orders loaded:', data)
          if (Array.isArray(data)) setOrders(data)
          else console.warn('Orders response is not an array:', data)
        })
        .catch((err) => {
          console.error('Failed to load orders:', err)
        })
    }
  }, [status])

  // Загружаем wishlist
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/wishlist')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setWishlist(data)
        })
        .catch(() => {})
    }
  }, [status])

  function handleSave() {
    setSaving(true)
    localStorage.setItem('rano-user-profile', JSON.stringify(form))
    
    // Сохраняем в БД
    fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
      }),
    })
      .then(r => r.json())
      .then(() => {
        setSaving(false)
        toast.success('Данные сохранены!')
      })
      .catch((err) => {
        setSaving(false)
        console.error('Error saving profile:', err)
        toast.error('Ошибка при сохранении')
      })
  }

  async function handlePasswordChange() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Заполните все поля!')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Пароли не совпадают!')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов!')
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Ошибка при смене пароля')
        return
      }

      toast.success('Пароль успешно изменён!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Ошибка при смене пароля')
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleEmailChange() {
    if (!emailForm.newEmail) {
      setEmailError('Введи новый email')
      return
    }

    if (emailForm.newEmail === session?.user?.email) {
      setEmailError('Это твой текущий email')
      return
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailForm.newEmail)) {
      setEmailError('Некорректный email')
      return
    }

    setChangingEmail(true)
    setEmailError('')
    try {
      const res = await fetch('/api/profile/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: emailForm.newEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEmailError(data.error || 'Ошибка при смене email')
        return
      }

      toast.success('Email успешно изменён! Перезагрузи страницу.')
      setEmailForm({ newEmail: '' })
      // Перезагружаем сессию
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setEmailError('Ошибка при смене email')
    } finally {
      setChangingEmail(false)
    }
  }

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)' }}>Загрузка...</div>
      </div>
    )
  }

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    new:       { label: 'Новый',     color: '#D97706', bg: '#FEF3C7' },
    confirmed: { label: 'Подтверждён', color: '#2563EB', bg: '#DBEAFE' },
    shipped:   { label: 'В пути',    color: '#7C3AED', bg: '#EDE9FE' },
    delivered: { label: 'Доставлен', color: '#16A34A', bg: '#DCFCE7' },
    cancelled: { label: 'Отменён',   color: '#DC2626', bg: '#FEE2E2' },
  }

  const tabs = [
    { id: 'overview' as const, label: 'Обзор',    icon: UserCircleIcon  },
    { id: 'orders'   as const, label: 'Заказы',   icon: ShoppingBagIcon },
    { id: 'wishlist' as const, label: 'Избранное', icon: HeartIcon },
    { id: 'password' as const, label: 'Пароль',   icon: Cog6ToothIcon  },
    { id: 'settings' as const, label: 'Настройки', icon: Cog6ToothIcon  },
  ]

  return (
    <main style={{ background: 'var(--color-section-bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <Toaster position="bottom-right" />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}
          className="profile-grid">

          {/* Левая панель */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Карточка пользователя */}
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                padding: '2rem 1.5rem', textAlign: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem', fontWeight: 800, color: '#fff',
                }}>
                  {form.name ? form.name[0].toUpperCase() : '?'}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                  {form.name || 'Имя не указано'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
                  {session?.user?.email}
                </div>
              </div>

              {/* Контакты */}
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {form.phone && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <PhoneIcon style={{ width: 16, height: 16 }} />
                    {form.phone}
                  </div>
                )}
                {form.address && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPinIcon style={{ width: 16, height: 16 }} />
                    {form.address}
                  </div>
                )}
              </div>
            </div>

            {/* Навигация */}
            <nav style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '0.75rem', padding: '0.875rem 1.25rem',
                  background: activeTab === id ? 'var(--color-section-bg)' : 'transparent',
                  borderLeft: activeTab === id ? '3px solid var(--color-primary)' : '3px solid transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}>
                  <Icon style={{ width: 18, height: 18, color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: activeTab === id ? 700 : 500, color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {label}
                  </span>
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => signOut({ callbackUrl: '/' })} style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '0.75rem', padding: '0.875rem 1.25rem',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: '#DC2626',
                  transition: 'background 0.2s ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <ArrowRightOnRectangleIcon style={{ width: 18, height: 18 }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Выйти</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Правая часть */}
          <div>

            {/* ОБЗОР */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Статистика */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { label: 'Заказов',   value: orders.length, icon: ShoppingBagIcon },
                    { label: 'Избранных', value: wishlist.length, icon: HeartIcon },
                    { label: 'Потрачено', value: orders.reduce((s, o) => s + Number(o.total), 0).toLocaleString('ru-KZ') + ' ₸', icon: CurrencyDollarIcon },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{
                      background: '#fff', borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        <Icon style={{ width: 32, height: 32, color: 'var(--color-primary)' }} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {value}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Последние заказы */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Последние заказы</h2>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.82rem', color: 'var(--color-secondary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Все →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      Заказов пока нет
                    </div>
                  ) : orders.slice(0, 3).map(order => (
                    <OrderRow key={order.id} order={order} statusMap={statusMap} />
                  ))}
                </div>
              </div>
            )}

            {/* ЗАКАЗЫ */}
            {activeTab === 'orders' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Мои заказы</h2>
                </div>
                {orders.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Заказов пока нет
                  </div>
                ) : orders.map(order => (
                  <OrderRow key={order.id} order={order} statusMap={statusMap} />
                ))}
              </div>
            )}

            {/* ИЗБРАННОЕ */}
            {activeTab === 'wishlist' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Избранные товары ({wishlist.length})</h2>
                </div>
                {wishlist.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <HeartIcon style={{ width: 48, height: 48, margin: '0 auto 1rem', opacity: 0.5 }} />
                    Избранные товары пока не добавлены
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
                    {wishlist.map(item => (
                      <div
                        key={item.id}
                        style={{
                          background: 'var(--color-section-bg)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          position: 'relative',
                        }}
                      >
                        <button
                          onClick={async () => {
                            await fetch('/api/wishlist', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ productId: item.product.id }),
                            })
                            setWishlist(wishlist.filter(w => w.id !== item.id))
                            toast.success('Удалено из избранного')
                          }}
                          style={{
                            position: 'absolute',
                            top: '0.5rem', right: '0.5rem',
                            width: 28, height: 28,
                            borderRadius: '50%',
                            background: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        >
                          ✕
                        </button>

                        <a
                          href={`/catalog/${item.product.slug}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                            {item.product.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                            {item.product.category.name}
                          </div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem' }}>
                            {Number(item.product.price).toLocaleString('ru-KZ')} ₸
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* СМЕНА ПАРОЛЯ */}
            {activeTab === 'password' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Изменить пароль</h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="label">Текущий пароль</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        className="input"
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Введите текущий пароль"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        style={{
                          position: 'absolute', right: '0.75rem',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.5rem',
                        }}
                      >
                        {showPasswords.current ? (
                          <EyeSlashIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        ) : (
                          <EyeIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Новый пароль</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        className="input"
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="Введите новый пароль (минимум 6 символов)"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        style={{
                          position: 'absolute', right: '0.75rem',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.5rem',
                        }}
                      >
                        {showPasswords.new ? (
                          <EyeSlashIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        ) : (
                          <EyeIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Подтвердите пароль</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        className="input"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Повторите новый пароль"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        style={{
                          position: 'absolute', right: '0.75rem',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.5rem',
                        }}
                      >
                        {showPasswords.confirm ? (
                          <EyeSlashIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        ) : (
                          <EyeIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button onClick={handlePasswordChange} disabled={changingPassword} className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckIcon style={{ width: 18, height: 18 }} />
                    {changingPassword ? 'Изменение...' : 'Изменить пароль'}
                  </button>
                </div>
              </div>
            )}

            {/* НАСТРОЙКИ */}
            {activeTab === 'settings' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Личные данные</h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { key: 'name',    label: 'Имя',            type: 'text',  placeholder: 'Иван Иванов'             },
                    { key: 'phone',   label: 'Телефон',        type: 'tel',   placeholder: '+7 (777) 777-77-77'       },
                    { key: 'address', label: 'Адрес доставки', type: 'text',  placeholder: 'ул. Абая 123, кв. 45'     },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <input
                        className="input" type={type}
                        placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                      />
                    </div>
                  ))}

                  <div style={{ padding: '1rem', background: 'var(--color-section-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <EnvelopeIcon style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Email: <strong style={{ color: 'var(--color-text)' }}>{session?.user?.email}</strong>
                    </span>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                    <input
                      type="email"
                      placeholder="Новый email"
                      value={emailForm.newEmail}
                      onChange={e => {
                        setEmailForm({ newEmail: e.target.value })
                        setEmailError('')
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        border: emailError ? '1px solid #DC2626' : '1px solid var(--color-border)',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        boxSizing: 'border-box' as const,
                      }}
                    />
                    <button
                      onClick={handleEmailChange}
                      disabled={changingEmail}
                      style={{
                        width: '100%',
                        padding: '0.625rem 1rem',
                        background: changingEmail ? '#ccc' : 'var(--color-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: changingEmail ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {changingEmail ? 'Сохранение...' : 'Изменить email'}
                    </button>
                  </div>
                  {emailError && (
                    <div style={{ fontSize: '0.85rem', color: '#DC2626', paddingLeft: '0.5rem' }}>
                      ⚠️ {emailError}
                    </div>
                  )}

                  <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckIcon style={{ width: 18, height: 18 }} />
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .order-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
            padding: 0.875rem 1rem !important;
          }
          .order-row-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </main>
  )
}

function OrderRow({ order, statusMap }: {
  order: Order
  statusMap: Record<string, { label: string; color: string; bg: string }>
}) {
  const s = statusMap[order.status] ?? { label: order.status, color: '#666', bg: '#f5f5f5' }
  let itemCount = 0
  try { itemCount = JSON.parse(order.items).length } catch {}

  return (
    <div
      className="order-row"
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        transition: 'background 0.2s ease',
        flexWrap: 'wrap',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section-bg)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-section-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <ShoppingBagIcon style={{ width: 22, height: 22, color: 'var(--color-primary)' }} />
      </div>

      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Заказ #{order.id}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          {new Date(order.createdAt).toLocaleDateString('ru-RU')} · {itemCount} товара
        </div>
      </div>

      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color }}>
        {s.label}
      </span>

      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
        {Number(order.total).toLocaleString('ru-KZ')} ₸
      </div>

      {/* Кнопка отслеживания */}
      <a
        href={`/order/${order.id}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.4rem 0.875rem',
          background: 'var(--color-primary)', color: '#fff',
          borderRadius: '9999px', textDecoration: 'none',
          fontSize: '0.78rem', fontWeight: 600,
          flexShrink: 0,
        }}
      >
        Отследить
      </a>
    </div>
  )
}