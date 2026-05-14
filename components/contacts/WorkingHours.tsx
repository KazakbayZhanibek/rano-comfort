'use client'

import { useState, useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'

export function WorkingHours() {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const workingHours = [
    { day: 'Понедельник', hours: '10:00 - 18:00' },
    { day: 'Вторник', hours: '10:00 - 18:00' },
    { day: 'Среда', hours: '10:00 - 18:00' },
    { day: 'Четверг', hours: '10:00 - 18:00' },
    { day: 'Пятница', hours: '10:00 - 18:00' },
    { day: 'Суббота', hours: '11:00 - 17:00' },
    { day: 'Воскресенье', hours: '11:00 - 17:00' },
  ]

  return (
    <section
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        marginBottom: '4rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <ClockIcon width={24} height={24} color="var(--color-primary)" />
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--color-text)',
          }}
        >
          Рабочие часы
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: isMobile ? '1rem' : '1.5rem',
        }}
      >
        {workingHours.map((item) => (
          <div
            key={item.day}
            style={{
              background: 'var(--color-section-bg)',
              padding: isMobile ? '1rem' : '1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-primary)',
            }}
          >
            <p
              style={{
                fontSize: isMobile ? '0.9rem' : '0.95rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 0.5rem 0',
              }}
            >
              {item.day}
            </p>
            <p
              style={{
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                color: 'var(--color-primary)',
                fontWeight: 700,
                margin: 0,
              }}
            >
              {item.hours}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
