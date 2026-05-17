'use client'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', color: 'var(--primary)' }}>
        Политика конфиденциальности
      </h1>

      <div style={{ lineHeight: '1.8', color: '#555' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            1. Общие положения
          </h2>
          <p>
            RANO Comfort Service («Kомпания», «мы») уважает приватность посетителей нашего сайта и приложения.
            Настоящая Политика описывает, как мы собираем, используем и защищаем вашу личную информацию.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            2. Информация, которую мы собираем
          </h2>
          <p style={{ marginBottom: '10px' }}>Мы собираем следующие типы информации:</p>
          <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Контактная информация:</strong> имя, номер телефона, адрес электронной почты, адрес доставки
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Информация о заказах:</strong> выбранные товары, сумма заказа, способ оплаты и доставки
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Техническая информация:</strong> IP адрес, тип браузера, время посещения, просмотренные страницы
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Добровольная информация:</strong> комментарии, отзывы, вопросы в форме обратной связи
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            3. Как мы используем информацию
          </h2>
          <p style={{ marginBottom: '10px' }}>Мы используем собранную информацию для:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Обработки и доставки заказов</li>
            <li style={{ marginBottom: '8px' }}>Коммуникации с клиентами (подтверждение заказов, уведомления о доставке)</li>
            <li style={{ marginBottom: '8px' }}>Улучшения нашего сервиса и веб-сайта</li>
            <li style={{ marginBottom: '8px' }}>Анализа поведения пользователей для оптимизации</li>
            <li style={{ marginBottom: '8px' }}>Соответствия законодательству Казахстана</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            4. Защита информации
          </h2>
          <p>
            Мы применяем технические и организационные меры для защиты вашей личной информации от несанкционированного доступа,
            изменения, разглашения или уничтожения. Все платежные данные передаются через защищённые каналы.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            5. Файлы cookies
          </h2>
          <p>
            Наш сайт использует файлы cookies для улучшения пользовательского опыта. Вы можете отключить cookies в настройках
            браузера, но это может повлиять на функциональность сайта.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            6. Ваши права
          </h2>
          <p style={{ marginBottom: '10px' }}>Вы имеете право:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Получить доступ к своим личным данным</li>
            <li style={{ marginBottom: '8px' }}>Исправить неточные данные</li>
            <li style={{ marginBottom: '8px' }}>Запросить удаление данных (если это не противоречит законодательству)</li>
            <li style={{ marginBottom: '8px' }}>Отозвать согласие на обработку данных</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px', color: 'var(--primary)' }}>
            7. Контактная информация
          </h2>
          <p>
            Если у вас есть вопросы о нашей Политике конфиденциальности, пожалуйста, свяжитесь с нами:
          </p>
          <p style={{ marginTop: '10px' }}>
            Email: <strong>privacy@rano-komfort.kz</strong><br />
            Телефон: <strong>+7 (777) 123-45-67</strong><br />
            Адрес: <strong>Шымкент, Казахстан</strong>
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
