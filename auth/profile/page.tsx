// app/profile/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

/* Моковые данные — потом заменим на реальные из БД */
const MOCK_USER = {
  name:   'Айгерим Сейткали',
  email:  'comfortservicetovar@gmail.com',
  phone:  '+7 (777) 123-45-67',
  address: 'Шымкент, ул. Абая 123, кв. 45',
  avatar: 'АС',
  joinDate: 'Март 2024',
}

const MOCK_ORDERS = [
  {
    id: 1001, date: '12 апреля 2025', total: 3450,
    status: 'delivered', items: 3,
    statusLabel: 'Доставлен', statusColor: '#16A34A', statusBg: '#DCFCE7',
  },
  {
    id: 1002, date: '28 апреля 2025', total: 1890,
    status: 'shipping', items: 2,
    statusLabel: 'В пути', statusColor: '#2563EB', statusBg: '#DBEAFE',
  },
  {
    id: 1003, date: '5 мая 2025', total: 5200,
    status: 'new', items: 5,
    statusLabel: 'Новый', statusColor: '#D97706', statusBg: '#FEF3C7',
  },
]

const MOCK_WISHLIST = [
  { id: 1, name: 'RANO Лимон для посуды', price: 890,  volume: '1 л',   icon: '🍋' },
  { id: 2, name: 'Гель для стирки',       price: 1450, volume: '2 л',   icon: '👕' },
  { id: 3, name: 'RANO Fresh для ванной', price: 650,  volume: '500 мл', icon: '🚿' },
]

type Tab = 'overview' | 'orders' | 'wishlist' | 'settings'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [user, setUser] = useState(MOCK_USER)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main style={{ background: 'var(--color-section-bg)', minHeight: '100vh', padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }} className="profile-grid">

          {/* ── Левая панель ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Карточка пользователя */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* Зелёная шапка */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                padding: '1.75rem 1.5rem',
                textAlign: 'center',
              }}>
                {/* Аватар */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem', fontWeight: 800, color: '#fff',
                }}>
                  {user.avatar}
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem', fontWeight: 800,
                  color: '#fff', marginBottom: '0.25rem',
                }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                  С нами с {user.joinDate}
                </div>
              </div>

              {/* Контакты */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: EnvelopeIcon, value: user.email },
                  { icon: PhoneIcon,    value: user.phone },
                  { icon: MapPinIcon,   value: user.address },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <Icon style={{ width: 15, height: 15, color: 'var(--color-secondary)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Навигация */}
            <nav style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}>
              {([
                { id: 'overview',  label: 'Обзор',      icon: ShoppingBagIcon,            badge: null },
                { id: 'orders',    label: 'Мои заказы', icon: ShoppingBagIcon,            badge: MOCK_ORDERS.length },
                { id: 'wishlist',  label: 'Избранное',  icon: HeartIcon,                  badge: MOCK_WISHLIST.length },
                { id: 'settings',  label: 'Настройки',  icon: Cog6ToothIcon,              badge: null },
              ] as const).map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '0.75rem', padding: '0.875rem 1.25rem',
                    background: activeTab === id ? 'var(--color-section-bg)' : 'transparent',
                    borderLeft: activeTab === id ? '3px solid var(--color-primary)' : '3px solid transparent',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  <Icon style={{
                    width: 18, height: 18,
                    color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }} />
                  <span style={{
                    fontSize: '0.9rem', fontWeight: activeTab === id ? 700 : 500,
                    color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text)',
                    flex: 1,
                  }}>
                    {label}
                  </span>
                  {badge !== null && (
                    <span style={{
                      background: 'var(--color-primary)', color: '#fff',
                      borderRadius: '9999px', fontSize: '0.7rem',
                      fontWeight: 700, padding: '0.1rem 0.5rem',
                      minWidth: 20, textAlign: 'center',
                    }}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}

              {/* Выход */}
              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => alert('Выход')}
                  style={{
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

          {/* ── Правая часть ── */}
          <div>

            {/* ОБЗОР */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Статистика */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
                }}>
                  {[
                    { label: 'Заказов',    value: MOCK_ORDERS.length,   icon: '📦' },
                    { label: 'Избранных',  value: MOCK_WISHLIST.length,  icon: '❤️' },
                    { label: 'Потрачено',  value: '10 540 ₸',           icon: '💰' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{
                      background: '#fff', borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.5rem', fontWeight: 800,
                        color: 'var(--color-primary)',
                      }}>
                        {value}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Последние заказы */}
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                      Последние заказы
                    </h2>
                    <button onClick={() => setActiveTab('orders')} style={{
                      fontSize: '0.82rem', color: 'var(--color-secondary)',
                      fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
                    }}>
                      Все заказы →
                    </button>
                  </div>
                  {MOCK_ORDERS.slice(0, 2).map(order => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* ЗАКАЗЫ */}
            {activeTab === 'orders' && (
              <div style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                    Мои заказы
                  </h2>
                </div>
                {MOCK_ORDERS.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            )}

            {/* ИЗБРАННОЕ */}
            {activeTab === 'wishlist' && (
              <div style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                    Избранные товары
                  </h2>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {MOCK_WISHLIST.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem', borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      transition: 'border-color 0.2s ease',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                    >
                      <div style={{
                        width: 52, height: 52, borderRadius: 'var(--radius-md)',
                        background: 'var(--color-section-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', flexShrink: 0,
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {item.volume}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800, color: 'var(--color-primary)',
                      }}>
                        {item.price.toLocaleString('ru-KZ')} ₸
                      </div>
                      <Link href={`/catalog/${item.id}`} className="btn btn-primary btn-sm">
                        В корзину
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* НАСТРОЙКИ */}
            {activeTab === 'settings' && (
              <div style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                    Личные данные
                  </h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { key: 'name',    label: 'Имя',             type: 'text' },
                    { key: 'phone',   label: 'Телефон',         type: 'tel'  },
                    { key: 'email',   label: 'Email',           type: 'email' },
                    { key: 'address', label: 'Адрес доставки',  type: 'text' },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <input
                        className="input"
                        type={type}
                        value={user[key as keyof typeof user]}
                        onChange={e => setUser({ ...user, [key]: e.target.value })}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {saved ? '✓ Сохранено!' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}

/* Строка заказа */
function OrderRow({ order }: { order: typeof MOCK_ORDERS[0] }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid var(--color-border)',
      transition: 'background 0.2s ease',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-section-bg)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-md)',
        background: 'var(--color-section-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem', flexShrink: 0,
      }}>
        📦
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
          Заказ #{order.id}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          {order.date} · {order.items} товара
        </div>
      </div>
      <span style={{
        padding: '0.25rem 0.75rem', borderRadius: '9999px',
        fontSize: '0.75rem', fontWeight: 600,
        background: order.statusBg, color: order.statusColor,
      }}>
        {order.statusLabel}
      </span>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 800, color: 'var(--color-primary)',
        fontSize: '0.95rem',
      }}>
        {order.total.toLocaleString('ru-KZ')} ₸
      </div>
      <ChevronRightIcon style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} />
    </div>
  )
}