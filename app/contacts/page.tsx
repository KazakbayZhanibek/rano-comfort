import { ContactCards } from '@/components/contacts/ContactCards'
import { ContactForm } from '@/components/contacts/ContactForm'
import { WorkingHours } from '@/components/contacts/WorkingHours'

export const metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с RANO Comfort Service. Телефон, адрес, WhatsApp, Telegram.',,
}

export default function ContactsPage() {
  return (
    <>
      {/* Героический заголовок */}
      <section
        className="contacts-hero"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: '#fff',
          padding: 'clamp(2rem, 5vw, 4rem) 0',
          marginBottom: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Контакты
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '500px',
            }}
          >
            Мы всегда рады помочь вам
          </p>
        </div>
      </section>

      <div className="container">
        <ContactCards />
        <ContactForm />
        <WorkingHours />
      </div>
    </>
  )
}
