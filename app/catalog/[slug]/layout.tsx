import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })

    if (!product) {
      return { title: 'Товар не найден' }
    }

    const images = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : Array.isArray(product.images) ? product.images : []

    const imageUrl = images[0] ? `${images[0]}` : '/logo.png'

    return {
      title: `${product.name} — ${product.volume || ''} | RANO Comfort`,
      description: product.description
        ?? `Купить ${product.name} в Алматы. Цена ${Number(product.price).toLocaleString('ru-KZ')} ₸. Доставка по Алматы. Экологичная бытовая химия RANO Comfort Service.`,
      keywords: [
        product.name,
        product.category.name,
        'бытовая химия',
        'Алматы',
        'купить',
        'доставка',
        'эко',
      ],
      openGraph: {
        title: `${product.name} — ${product.volume || ''}`,
        description: product.description ?? `${product.name} в интернет-магазине RANO Comfort Service`,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: 'website',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return { title: 'Товар не найден' }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
