'use client'

// components/home/WhyUs.tsx

const reasons = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <path d="M7 12l2 2 4-4"/>
        <path d="M12 2c-5 0-9 3-9 8 0 4 3 6 6 7v2c0 2 1 3 3 3s3-1 3-3v-2c3-1 6-3 6-7 0-5-4-8-9-8z"/>
        <path d="M12 18v3"/>
      </svg>
    ),
    title: 'Экологичный состав',
    text: 'Все средства производятся на основе биоразлагаемых компонентов — безопасно для семьи и природы.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <circle cx="7" cy="6" r="2"/>
        <circle cx="17" cy="6" r="2"/>
        <path d="M7 8v6c0 1.5 2.5 3 5 3s5-1.5 5-3V8"/>
        <line x1="7" y1="14" x2="17" y2="14"/>
        <line x1="9" y1="18" x2="9" y2="22"/>
        <line x1="15" y1="18" x2="15" y2="22"/>
      </svg>
    ),
    title: 'Собственная лаборатория',
    text: 'Разрабатываем и тестируем каждый продукт в нашей лаборатории в Алматы.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Честная цена',
    text: 'Продаём напрямую от производителя — без наценок посредников.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <path d="M5 12l2-2m2 2l-2 2m2-2l2-2m-2 2l-2-2"/>
        <rect x="3" y="9" width="6" height="6" rx="1"/>
        <path d="M15 12l-6-8v16l6-8m4 0h2v4h-2z"/>
      </svg>
    ),
    title: 'Быстрая доставка',
    text: 'Доставляем по Алматы за 1–3 дня. Бесплатно при заказе от 5 000 ₸.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: 'Сертифицировано',
    text: 'Вся продукция имеет санитарно-эпидемиологическое заключение РК.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" color="var(--color-primary-dark)">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <circle cx="9" cy="10" r="1"/>
        <circle cx="12" cy="10" r="1"/>
        <circle cx="15" cy="10" r="1"/>
      </svg>
    ),
    title: 'Поддержка 24/7',
    text: 'Отвечаем в WhatsApp и Telegram — быстро и по делу.',
  },
]

export default function WhyUs() {
  return (
    <section className="section">
      <div className="container">

        {/* Заголовок */}
        <p style={{
          textAlign: 'center', fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--color-secondary)', marginBottom: '0.5rem',
        }}>
          Наши преимущества
        </p>
        <h2 className="section-title">Почему выбирают нас</h2>
        <p className="section-subtitle">
          RANO Comfort Service — это качество, которому доверяют сотни семей в Алматы
        </p>

        {/* Сетка */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }} className="whyus-grid">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="whyus-card"
              style={{
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: '#fff',
                border: '1.5px solid var(--color-border)',
                transition: 'all 0.25s ease',
                animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
                cursor: 'default',
              }}
            >
              {/* Иконка */}
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-md)',
                background: 'var(--color-section-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                {r.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: '0.5rem',
              }}>
                {r.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
              }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .whyus-card:hover {
          border-color: var(--color-secondary);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 1024px) {
          .whyus-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .whyus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}