'use client'

import Link from 'next/link'
import {
  TruckIcon,
  HomeIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'

export default function DeliveryPage() {
  return (
    <>
      {/* Героический заголовок */}
      <section className="delivery-hero" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        color: '#fff',
        padding: '4rem 0',
        marginBottom: '4rem',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Доставка и оплата
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '500px' }}>
            Быстрая доставка и удобные способы оплаты
          </p>
        </div>
      </section>

      <div className="container">

        {/* ── Доставка ── */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem', fontWeight: 800,
            marginBottom: '2rem', color: 'var(--color-text)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <TruckIcon width={32} height={32} color="var(--color-primary)" />
            Доставка
          </h2>

          {/* Карточки доставки */}
          <div className="delivery-cards" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            {[
              {
                title: 'Доставка на дом',
                icon: HomeIcon,
                details: [
                  'По Шымкенту',
                  '1–3 дня',
                  'Курьер позвонит перед приездом',
                  'Бесплатно при сумме от 5 000 ₸',
                  'За меньшие суммы — 500 ₸',
                ],
              },
              {
                title: 'Самовывоз',
                icon: MapPinIcon,
                details: [
                  'ул. Абая 123, офис 45',
                  'Готово на следующий день',
                  'Пн–Пт: 10:00–18:00',
                  'Сб–Вс: 11:00–17:00',
                  'Парковка есть',
                ],
              },
            ].map((opt, i) => {
              const IconComponent = opt.icon
              return (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                }}>
                  <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    <IconComponent width={48} height={48} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem', fontWeight: 700,
                    marginBottom: '1.5rem',
                  }}>
                    {opt.title}
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {opt.details.map((detail, j) => (
                      <li key={j} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        fontSize: '0.9rem', color: 'var(--color-text-muted)',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--color-secondary)', flexShrink: 0,
                        }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div> {/* ← закрывает грид карточек доставки */}

          {/* Процесс доставки */}
          <div style={{
            background: 'var(--color-section-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem', fontWeight: 700,
              marginBottom: '1.5rem', textAlign: 'center',
            }}>
              Как это работает
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
            }} className="steps-grid">
              {[
                { num: '1', title: 'Сделайте заказ',  desc: 'На сайте или в WhatsApp' },
                { num: '2', title: 'Мы упакуем',       desc: 'Максимум за 24 часа'    },
                { num: '3', title: 'Доставим',         desc: '1–3 дня по Шымкенту'      },
                { num: '4', title: 'Наслаждайтесь',   desc: 'Свежие средства дома'   },
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center',
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: 'var(--color-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontSize: '1.5rem',
                    fontWeight: 800, marginBottom: '0.75rem',
                  }}>
                    {step.num}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Оплата ── */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem', fontWeight: 800,
            marginBottom: '2rem', color: 'var(--color-text)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CreditCardIcon width={32} height={32} color="var(--color-primary)" />
            Способы оплаты
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }} className="payment-grid">
            {[
              {
                icon: BanknotesIcon,
                title: 'Наличные',
                text: 'При получении товара. Наиболее популярный способ.',
              },
              {
                icon: CreditCardIcon,
                title: 'Банковская карта',
                text: 'Visa, Mastercard. Оплата при оформлении заказа.',
              },
              {
                icon: BuildingLibraryIcon,
                title: 'Перевод на счёт',
                text: 'Для юридических лиц и оптовых заказов.',
              },
            ].map((method, i) => {
              const IconComponent = method.icon
              return (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  textAlign: 'center',
                }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <IconComponent width={48} height={48} />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem', fontWeight: 700,
                    marginBottom: '0.75rem',
                  }}>
                    {method.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    {method.text}
                  </p>
                </div>
              )
            })}
          </div> {/* ← закрывает грид оплаты */}
        </section>

        {/* ── FAQ ── */}
        <section style={{
          background: 'var(--color-section-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          marginBottom: '5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem', fontWeight: 800,
            marginBottom: '2rem', textAlign: 'center',
          }}>
            Часто задаваемые вопросы
          </h2>
          <div style={{
            maxWidth: '700px', margin: '0 auto',
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}>
            {[
              { q: 'Как отследить мой заказ?',              a: 'Менеджер пришлёт вам номер заказа и ссылку для отслеживания. Также можно позвонить по телефону.' },
              { q: 'Что если товар повреждён при доставке?', a: 'Свяжитесь с нами в течение 24 часов. Мы заменим товар или вернём деньги.' },
              { q: 'Есть ли минимальный размер заказа?',    a: 'Нет. Можно заказать даже один товар. Доставка будет бесплатной при сумме от 5 000 ₸.' },
              { q: 'Доставляете ли вы за пределы Шымкента?',  a: 'Пока доставляем только по Шымкенту. Для оптовых заказов обращайтесь отдельно.' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem', fontWeight: 700,
                  marginBottom: '0.5rem', color: 'var(--color-text)',
                }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem',
          }}>
            Остались вопросы?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Свяжитесь с нами через WhatsApp, Telegram или позвоните
          </p>
          <Link href="/contacts" className="btn btn-primary">
            Контакты →
          </Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .steps-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .payment-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .steps-grid   { grid-template-columns: 1fr !important; }
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}