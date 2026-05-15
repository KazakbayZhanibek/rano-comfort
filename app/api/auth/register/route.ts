import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Simple in-memory rate limiting for registration
const registrationAttempts = new Map<string, { count: number; timestamp: number }>()

function getClientIp(request: Request): string {
  const headersList = new Headers(request.headers)
  return (headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown').split(',')[0].trim()
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempt = registrationAttempts.get(ip)
  
  if (!attempt || now - attempt.timestamp > 3600000) {
    // More than 1 hour passed, reset
    registrationAttempts.set(ip, { count: 1, timestamp: now })
    return true
  }
  
  if (attempt.count >= 5) {
    return false
  }
  
  attempt.count++
  return true
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) return { valid: false, error: 'Пароль должен быть минимум 8 символов' }
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Пароль должен содержать заглавную букву' }
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Пароль должен содержать строчную букву' }
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Пароль должен содержать цифру' }
  return { valid: true }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Слишком много попыток регистрации. Попробуйте позже.' },
        { status: 429 }
      )
    }

    const { name, phone, email, password } = await request.json()

    // Validation
    if (!name || !phone || !email || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Неверный формат email' }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 })
    }

    if (!/^\+?[\d\s\-()]{10,}$/.test(phone)) {
      return NextResponse.json({ error: 'Неверный номер телефона' }, { status: 400 })
    }

    // Check if email exists
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        passwordHash: hash,
      },
    })

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 })
  }
}