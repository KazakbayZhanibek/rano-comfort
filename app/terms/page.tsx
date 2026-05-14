'use client'

import {
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', color: 'var(--primary)' }}>
        Условия использования
      </h1>

      <div style={{ lineHeight: '1.8', color: '#555' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            1. Общие условия
          </h2>
          <p>
            Используя веб-сайт и приложение RANO Comfort Service, вы согласны с настоящими Условиями использования.
            Если вы не согласны с любым пунктом, пожалуйста, не используйте наш сервис.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            2. Описание сервиса
          </h2>
          <p>
            RANO Comfort Service предоставляет платформу для покупки бытовой химии и хозяйственных товаров с доставкой
            на территории Алматы и Казахстана. Компания оставляет право изменять ассортимент, цены и условия обслуживания.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            3. Процесс покупки
          </h2>
          <p style={{ marginBottom: '10px' }}>Порядок оформления заказа:</p>
          <ol style={{ marginLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Выбрать товары и добавить их в корзину</li>
            <li style={{ marginBottom: '8px' }}>Перейти на страницу оформления заказа</li>
            <li style={{ marginBottom: '8px' }}>Указать контактные данные и адрес доставки</li>
            <li style={{ marginBottom: '8px' }}>Выбрать способ доставки и оплаты</li>
            <li style={{ marginBottom: '8px' }}>Подтвердить заказ</li>
          </ol>
          <p style={{ marginTop: '15px' }}>
            После подтверждения заказа вы получите уведомление по указанному номеру телефона или email.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            4. Цены и оплата
          </h2>
          <p style={{ marginBottom: '10px' }}>
            <strong>Цены указаны в тенге (₸) и включают все налоги.</strong>
          </p>
          <p style={{ marginBottom: '10px' }}>Способы оплаты:</p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCardIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Карта (Visa, MasterCard, Kaspi)
            </li>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BanknotesIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Наличный расчёт при получении
            </li>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BuildingLibraryIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Банковский перевод
            </li>
          </ul>
          <p>
            Мы бронируем право отказать в обслуживании, если цены показаны неправильно или есть техническая ошибка.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            5. Доставка
          </h2>
          <p style={{ marginBottom: '10px' }}>Варианты доставки:</p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Доставка на дом:</strong> 2-3 рабочих дня, бесплатно при заказе от 5 000 ₸
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Самовывоз:</strong> согласно рабочим часам (звоните для уточнения адреса)
            </li>
          </ul>
          <p>
            Сроки доставки указаны ориентировочно. В случае форс-мажора доставка может быть задержана.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            6. Гарантия и возврат
          </h2>
          <p style={{ marginBottom: '10px' }}>
            <strong>Возврат товара возможен в течение 14 дней со дня получения при соблюдении условий:</strong>
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Товар не был открыт или поврежден по вине покупателя</li>
            <li style={{ marginBottom: '8px' }}>Товар находится в оригинальной упаковке</li>
            <li style={{ marginBottom: '8px' }}>Чек или подтверждение заказа сохранены</li>
            <li style={{ marginBottom: '8px' }}>Товар не входит в список исключений (скоропортящиеся товары)</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Для инициирования возврата свяжитесь с нами по телефону или email.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            7. Ограничение ответственности
          </h2>
          <p>
            RANO Comfort Service не несет ответственность за убытки, причиненные неправильным использованием товаров.
            Все товары соответствуют стандартам качества и безопасности Казахстана.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            8. Запрещённые действия
          </h2>
          <p style={{ marginBottom: '10px' }}>При использовании сервиса вы не должны:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Нарушать законодательство Казахстана</li>
            <li style={{ marginBottom: '8px' }}>Размещать ложную информацию или фальшивые отзывы</li>
            <li style={{ marginBottom: '8px' }}>Использовать автоматизированные системы для доступа к сайту</li>
            <li style={{ marginBottom: '8px' }}>Вмешиваться в работу сервера или безопасность</li>
            <li style={{ marginBottom: '8px' }}>Совершать любые незаконные действия</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            9. Интеллектуальная собственность
          </h2>
          <p>
                        Все содержимое сайта (тексты, изображения, логотипы, дизайн) является собственностью RANO Comfort Service
            или её лицензиаров. Запрещено копировать, распространять или использовать это содержимое без разрешения.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            10. Изменение условий
          </h2>
          <p>
            Мы бронируем право изменять настоящие Условия в любое время. Существенные изменения будут опубликованы на сайте.
            Продолжение использования сервиса означает ваше согласие с обновлёнными условиями.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            11. Контактная информация
          </h2>
          <p>
            По вопросам, связанным с настоящими Условиями, свяжитесь с нами:
          </p>
          <p style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <EnvelopeIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Email: <strong>support@rano-komfort.kz</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <PhoneIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Телефон: <strong>+7 (777) 123-45-67</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ChatBubbleLeftIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              WhatsApp/Telegram: <strong>+7 (777) 123-45-67</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPinIcon width={18} height={18} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              Адрес: <strong>Алматы, Казахстан</strong>
            </div>
          </p>
        </section>

        <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Последнее обновление: май 2024 года
          </p>
        </section>
      </div>
    </div>
  )
}
