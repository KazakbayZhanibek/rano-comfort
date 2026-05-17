import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.SMTP_FROM || 'onboarding@resend.dev'

export async function sendOrderNotification(order: {
  id: number
  name: string
  phone: string
  email?: string | null
  address?: string | null
  delivery?: string | null
  subtotal?: number
  deliveryFee?: number
  promoCode?: string | null
  discount?: number
  total: number
  items: unknown
}) {
  if (!order.email) {
    console.warn('Email не указана для заказа #' + order.id)
    return
  }

  let itemsHtml = ''
  try {
    const items = typeof order.items === 'string'
      ? JSON.parse(order.items)
      : order.items

    if (Array.isArray(items)) {
      itemsHtml = items
        .map((item: { name: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">× ${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString('ru-KZ')} ₸</td>
          </tr>`
        )
        .join('')
    }
  } catch {
    itemsHtml = '<tr><td colspan="3" style="padding: 10px; text-align: center; color: #999;">Не удалось загрузить товары</td></tr>'
  }

  // Строки для итогов
  const subtotal = order.subtotal || 0
  const deliveryFee = order.deliveryFee || 0
  const discount = order.discount || 0

  const summaryRows = 
    '<tr>' +
    '<td colspan="2" style="padding: 10px; text-align: right; color: #666;">Товары:</td>' +
    '<td style="padding: 10px; text-align: right; color: #666;">' + subtotal.toLocaleString('ru-KZ') + ' ₸</td>' +
    '</tr>' +
    '<tr>' +
    '<td colspan="2" style="padding: 10px; text-align: right; color: #666;">Доставка:</td>' +
    '<td style="padding: 10px; text-align: right; color: #666;">' + (deliveryFee === 0 ? 'Бесплатно' : deliveryFee.toLocaleString('ru-KZ') + ' ₸') + '</td>' +
    '</tr>' +
    (order.promoCode ? 
    '<tr>' +
    '<td colspan="2" style="padding: 10px; text-align: right; color: #16A34A; font-weight: bold;">Скидка (' + order.promoCode + '):</td>' +
    '<td style="padding: 10px; text-align: right; color: #16A34A; font-weight: bold;">−' + discount.toLocaleString('ru-KZ') + ' ₸</td>' +
    '</tr>'
    : '')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #0f4a20 0%, #1B6B2F 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
          .order-info { background: #f0f8f4; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #0f4a20; }
          .order-info p { margin: 8px 0; }
          .order-info strong { color: #0f4a20; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .total-row { background: #0f4a20; color: white; font-weight: bold; }
          .total-row td { padding: 12px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
          .button { display: inline-block; background: #0f4a20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Спасибо за заказ!</h1>
          </div>
          
          <div class="content">
            <p>Привет, <strong>${order.name}</strong>!</p>
            
            <p>Ваш заказ успешно принят. Вот детали:</p>

            <div class="order-info">
              <p><strong>📦 Номер заказа:</strong> #${order.id}</p>
              <p><strong>📞 Телефон:</strong> ${order.phone}</p>
              <p><strong>📍 Адрес доставки:</strong> ${order.address || 'Самовывоз'}</p>
              <p><strong>🚚 Способ доставки:</strong> ${order.delivery === 'home' ? 'Доставка на дом' : 'Самовывоз'}</p>
            </div>

            <h3>📦 Ваш заказ:</h3>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: left;">Товар</th>
                  <th style="padding: 10px; text-align: center;">Кол-во</th>
                  <th style="padding: 10px; text-align: right;">Сумма</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                ${summaryRows}
                <tr class="total-row">
                  <td colspan="2" style="text-align: right; padding: 12px;">ИТОГО К ОПЛАТЕ:</td>
                  <td style="text-align: right; padding: 12px;">${order.total.toLocaleString('ru-KZ')} ₸</td>
                </tr>
              </tbody>
            </table>

            <p>🔔 <strong>Статус вашего заказа: Новый — ожидает подтверждения</strong></p>
            
            <p>Мы обработаем ваш заказ и отправим уведомление об изменении статуса.</p>

            <center>
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order/${order.id}" class="button">Посмотреть заказ</a>
            </center>

            <p>Спасибо за покупку! 🙏</p>
          </div>

          <div class="footer">
            <p>RANO Komfort Service | Лаборатория бытовой химии</p>
            <p>Адрес: ул. Абая, 123, офис 45, Шымкент</p>
            <p>Телефон: +7 (747) 905-32-47</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `✨ Ваш заказ #${order.id} принят | RANO Comfort`,
      html: htmlContent,
    })

    console.log(`✅ Email отправлен на ${order.email}`)
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
  }
}

export async function sendStatusUpdateEmail(order: {
  id: number
  name: string
  email?: string | null
  status: string
}) {
  if (!order.email) {
    console.warn('Email не указана для заказа #' + order.id)
    return
  }

  const statusLabels: Record<string, { emoji: string; text: string }> = {
    confirmed: { emoji: '✅', text: 'Подтверждён' },
    shipped: { emoji: '🚚', text: 'В доставке' },
    delivered: { emoji: '📦', text: 'Доставлен' },
    cancelled: { emoji: '❌', text: 'Отменён' },
  }

  const status = statusLabels[order.status] || { emoji: '🔄', text: order.status }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #0f4a20 0%, #1B6B2F 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
          .status-box { background: #e8f5e9; border-left: 4px solid #0f4a20; padding: 20px; text-align: center; border-radius: 6px; margin: 20px 0; }
          .status-text { font-size: 24px; margin: 10px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
          .button { display: inline-block; background: #0f4a20; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Обновление статуса заказа</h1>
          </div>
          
          <div class="content">
            <p>Привет, <strong>${order.name}</strong>!</p>
            
            <p>Статус вашего заказа изменился:</p>

            <div class="status-box">
              <h2>${status.emoji} ${status.text}</h2>
              <p style="color: #666; margin: 10px 0;">Заказ #${order.id}</p>
            </div>

            <p>Мы отправим вам уведомление, когда будут дальнейшие обновления.</p>

            <center>
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order/${order.id}" class="button">Посмотреть заказ</a>
            </center>

            <p>Спасибо за терпение! 🙏</p>
          </div>

          <div class="footer">
            <p>RANO Comfort Service | Лаборатория бытовой химии</p>
            <p>Адрес: ул. Абая, 123, офис 45, Шымкент</p>
            <p>Телефон: +7 (747) 905-32-47</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `${status.emoji} Заказ #${order.id}: ${status.text}`,
      html: htmlContent,
    })

    console.log(`✅ Email о статусе отправлен на ${order.email}`)
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
  }
}
