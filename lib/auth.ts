import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import { headers } from 'next/headers'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',  type: 'email'    },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        // Rate limiting
        const headersList = headers()
        const ip = headersList.get('x-forwarded-for') || 'unknown'
        const limit = rateLimit(ip, 5, 15 * 60 * 1000) // 5 попыток за 15 минут

        if (!limit.success) {
          throw new Error('Слишком много попыток. Попробуйте через 15 минут.')
        }

        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return {
          id:    String(user.id),
          name:  user.name,
          email: user.email,
          image: user.phone ?? '',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).phone = token.picture
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}