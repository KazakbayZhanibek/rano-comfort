import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

/**
 * Генерирует новую сессию администратора
 */
export async function createAdminSession() {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const session = await prisma.adminSession.create({
    data: {
      token,
      expiresAt,
    },
  })

  return session
}

/**
 * Проверяет валидность сессии
 */
export async function validateAdminSession(token: string) {
  const session = await prisma.adminSession.findUnique({
    where: { token },
  })

  if (!session) {
    return null
  }

  // Проверяем, не истекла ли сессия
  if (new Date() > session.expiresAt) {
    await prisma.adminSession.delete({
      where: { token },
    })
    return null
  }

  // Обновляем время последней активности
  await prisma.adminSession.update({
    where: { token },
    data: { lastActivity: new Date() },
  })

  return session
}

/**
 * Удаляет сессию (logout)
 */
export async function deleteAdminSession(token: string) {
  await prisma.adminSession.delete({
    where: { token },
  }).catch(() => null)
}

/**
 * Очищает истекшие сессии
 */
export async function cleanupExpiredSessions() {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

/**
 * Логирует попытку входа
 */
export async function logLoginAttempt(ipAddress: string, success: boolean) {
  // Удаляем старые попытки входа (старше 1 часа)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  await prisma.adminLoginAttempt.deleteMany({
    where: {
      ipAddress,
      createdAt: {
        lt: oneHourAgo,
      },
    },
  })

  await prisma.adminLoginAttempt.create({
    data: {
      ipAddress,
      success,
    },
  })
}

/**
 * Проверяет rate limit для входа (максимум 5 неудачных попыток за час)
 */
export async function checkLoginRateLimit(ipAddress: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const recentAttempts = await prisma.adminLoginAttempt.count({
    where: {
      ipAddress,
      success: false,
      createdAt: {
        gt: oneHourAgo,
      },
    },
  })

  return recentAttempts < 5
}
