/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // На продакшене оптимизируем изображения
    unoptimized: false,
    // Форматы — WebP и AVIF быстрее загружаются
    formats: ['image/avif', 'image/webp'],
    // Размеры для разных экранов
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Кеш изображений на 30 дней
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // увеличили для загрузки фото товаров
    },
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  // Сжатие
  compress: true,

  // Кеширование статики
  headers: async () => {
    return [
      // Security headers
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff'                       },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN'                    },
          { key: 'X-XSS-Protection',         value: '1; mode=block'                 },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // API — не кешировать
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      // Статика — кешировать на год
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Шрифты и иконки
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  redirects: async () => [],
}

module.exports = nextConfig