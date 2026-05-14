import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000'

  // Статичные страницы
  const staticPages = [
    { url: baseUrl,              lastModified: new Date(), priority: 1.0    },
    { url: `${baseUrl}/catalog`, lastModified: new Date(), priority: 0.9    },
    { url: `${baseUrl}/about`,   lastModified: new Date(), priority: 0.7    },
    { url: `${baseUrl}/delivery`,lastModified: new Date(), priority: 0.7    },
    { url: `${baseUrl}/contacts`,lastModified: new Date(), priority: 0.7    },
  ]

  // Динамические страницы товаров
  const products = await prisma.product.findMany({
    select: { slug: true, createdAt: true },
  })

  const productPages = products.map(p => ({
    url:          `${baseUrl}/catalog/${p.slug}`,
    lastModified: p.createdAt,
    priority:     0.8,
  }))

  return [...staticPages, ...productPages]
}