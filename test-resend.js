require('dotenv').config({ path: '.env.local' })

const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmail() {
  console.log('🔍 Проверяем Resend API...')
  console.log(`API Key: ${process.env.RESEND_API_KEY ? '✅ найден' : '❌ не найден'}`)
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY не установлен в .env.local')
    process.exit(1)
  }

  try {
    console.log('\n📧 Отправляем тестовый email...')
    console.log(`From: ${process.env.SMTP_FROM}`)
    const response = await resend.emails.send({
      from: process.env.SMTP_FROM,
      to: 'janibekkaz3@gmail.com',
      subject: 'Test Email от RANO Komfort',
      html: '<h1>Привет!</h1><p>Это тестовый email от Resend API</p>',
    })

    console.log('✅ Email отправлен!')
    console.log(JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('❌ Ошибка отправки:', error.message)
    console.error(error)
  }
}

testEmail()
