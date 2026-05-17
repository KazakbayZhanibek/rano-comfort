import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    // Сохраняем в БД
    const contact = await prisma.contact.create({
      data: { name, email, phone, message },
    })

    // Отправляем в Telegram
    const token  = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    chatId,
          parse_mode: 'Markdown',
          text: `📩 *Новое сообщение с сайта*\n\n👤 *Имя:* ${name}\n📧 *Email:* ${email}\n📞 *Телефон:* ${phone || 'не указан'}\n\n💬 *Сообщение:*\n${message}`,
        }),
      })
    }

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(contacts)
}