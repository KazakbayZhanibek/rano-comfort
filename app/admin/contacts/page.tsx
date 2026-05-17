import { prisma } from '@/lib/prisma'
import ContactStatusButton from './ContactStatusButton'

export const revalidate = 0

export default async function AdminContacts() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const newCount = contacts.filter(c => c.status === 'new').length

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem', fontWeight: 800,
          color: 'var(--color-text)',
        }}>
          Сообщения {newCount > 0 && (
            <span style={{
              marginLeft: '0.5rem', padding: '0.2rem 0.6rem',
              background: '#DC2626', color: '#fff',
              borderRadius: '9999px', fontSize: '0.8rem',
            }}>
              {newCount} новых
            </span>
          )}
        </h1>
      </div>

      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        {contacts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Сообщений пока нет
          </div>
        ) : contacts.map((contact, i) => (
          <div key={contact.id} style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--color-border)',
            background: contact.status === 'new' ? '#FFFBEB' : '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{contact.name}</span>
                  <a href={`mailto:${contact.email}`} style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    {contact.email}
                  </a>
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {contact.phone}
                    </a>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(contact.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                  {contact.message}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <span style={{
                  padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 600,
                  background: contact.status === 'new' ? '#FEF3C7' : contact.status === 'read' ? '#DBEAFE' : '#DCFCE7',
                  color: contact.status === 'new' ? '#D97706' : contact.status === 'read' ? '#2563EB' : '#16A34A',
                }}>
                  {contact.status === 'new' ? 'Новое' : contact.status === 'read' ? 'Прочитано' : 'Отвечено'}
                </span>
                <ContactStatusButton id={contact.id} currentStatus={contact.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}