import type { Metadata } from 'next'
import './globals.css'
import './mobile.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getServerSession } from 'next-auth'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'

export const metadata: Metadata = {
  title: {
    default: 'RANO Comfort Service — Бытовая химия в Шымкенте',
    template: '%s | RANO Comfort Service',
  },
  description: 'Профессиональная бытовая химия с доставкой по Шымкенту. Экологичные средства для уборки, стирки и ухода. Прямо от производителя.',
  keywords: ['бытовая химия', 'Шымкент', 'доставка', 'эко', 'RANO', 'средства уборки', 'стирка', 'посуда'],
  authors: [{ name: 'RANO Comfort Service' }],
  creator: 'RANO Comfort Service',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'RANO Comfort Service — Бытовая химия в Шымкенте',
    description: 'Профессиональная бытовая химия с доставкой по Шымкенту.',
    url: 'https://ranocomfort.kz',
    siteName: 'RANO Comfort Service',
    locale: 'ru_KZ',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'RANO Comfort Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RANO Comfort Service',
    description: 'Экологичная бытовая химия',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B6B2F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RANO Comfort" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SessionProviderWrapper session={session}>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}