import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Очищаем старые данные — убрали orderItem
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Создаём категории
  await prisma.category.createMany({
    data: [
      { name: 'Для посуды', slug: 'dishwashing', icon: '🍽️' },
      { name: 'Для стирки', slug: 'laundry', icon: '👕' },
      { name: 'Для пола', slug: 'floor', icon: '🧹' },
      { name: 'Для ванной', slug: 'bathroom', icon: '🛁' },
      { name: 'Для стёкол', slug: 'glass', icon: '🪟' },
      { name: 'Освежители', slug: 'air-freshener', icon: '💨' }
    ]
  })

  // Получаем категории для использования в товарах
  const [dishwashing, laundry, floor, bathroom, glass, airFreshener] = await Promise.all([
    prisma.category.findUnique({ where: { slug: 'dishwashing' } }),
    prisma.category.findUnique({ where: { slug: 'laundry' } }),
    prisma.category.findUnique({ where: { slug: 'floor' } }),
    prisma.category.findUnique({ where: { slug: 'bathroom' } }),
    prisma.category.findUnique({ where: { slug: 'glass' } }),
    prisma.category.findUnique({ where: { slug: 'air-freshener' } })
  ])

  // Создаём товары
  await prisma.product.createMany({
    data: [
      {
        name: 'Жидкое мыло для посуды Алоэ Вера',
        slug: 'zhidkoe-mylo-dlya-posudy-aloe-vera',
        description: 'Эффективное жидкое мыло для посуды с натуральным алоэ вера. Легко удаляет жир и грязь, не повреждает руки.',
        price: 1200,
        oldPrice: 1500,
        volume: '750мл',
        stock: 50,
        images: JSON.stringify(['🧼']),
        isBestseller: true,
        isNew: false,
        isEco: true,
        categoryId: dishwashing!.id
      },
      {
        name: 'Универсальный очиститель для стекла',
        slug: 'universalnyy-ochistitel-dlya-stekla',
        description: 'Без запаха, безопасно для всех типов стекла. Оставляет идеальный блеск.',
        price: 890,
        oldPrice: 1100,
        volume: '500мл',
        stock: 35,
        images: JSON.stringify(['🪟']),
        isBestseller: true,
        isNew: false,
        isEco: false,
        categoryId: glass!.id
      },
      {
        name: 'Гель для стирки универсальный',
        slug: 'gel-dlya-stirki-universalnyy',
        description: 'Мощное действие при низких температурах. Хорошо отстирывает пятна.',
        price: 2200,
        oldPrice: 2500,
        volume: '1000мл',
        stock: 40,
        images: JSON.stringify(['👕']),
        isBestseller: true,
        isNew: true,
        isEco: false,
        categoryId: laundry!.id
      },
      {
        name: 'Чистящее средство для пола "Чистота"',
        slug: 'chistyashchee-sredstvo-dlya-pola-chistota',
        description: 'Мощный очищающий эффект для всех типов полов. Освежающий аромат лимона.',
        price: 1500,
        oldPrice: 1800,
        volume: '1000мл',
        stock: 45,
        images: JSON.stringify(['🧹']),
        isBestseller: false,
        isNew: false,
        isEco: false,
        categoryId: floor!.id
      },
      {
        name: 'Средство для чистки ванной с отбеливающим эффектом',
        slug: 'sredstvo-dlya-chistki-vannoy-s-otbelivayushchim-effektom',
        description: 'Удаляет налёт, плесень и ржавчину. Дезинфицирует поверхность.',
        price: 1100,
        oldPrice: 1400,
        volume: '500мл',
        stock: 30,
        images: JSON.stringify(['🛁']),
        isBestseller: false,
        isNew: true,
        isEco: false,
        categoryId: bathroom!.id
      },
      {
        name: 'Освежитель воздуха "Лесной аромат"',
        slug: 'osvezhitel-vozdukha-lesnoy-aromat',
        description: 'Натуральный запах лесных цветов. Долговременное действие до 30 дней.',
        price: 450,
        oldPrice: 600,
        volume: '250мл',
        stock: 100,
        images: JSON.stringify(['💨']),
        isBestseller: false,
        isNew: false,
        isEco: true,
        categoryId: airFreshener!.id
      },

      {
        name: 'Концентрированный порошок для стирки',
        slug: 'kontsentrirovannyy-poroshok-dlya-stirki',
        description: 'Мощный концентрат. Хватает на 50+ стирок. Экономичен.',
        price: 3500,
        oldPrice: 4000,
        volume: '1500г',
        stock: 25,
        images: JSON.stringify(['👕']),
        isBestseller: false,
        isNew: true,
        isEco: true,
        categoryId: laundry!.id
      },
      {
        name: 'Салфетки микрофибра для стекла',
        slug: 'salfetki-mikrofibra-dlya-stekla',
        description: 'Многоразовые салфетки. Идеально подходят для стекла и зеркал.',
        price: 650,
        oldPrice: 800,
        volume: '3шт',
        stock: 60,
        images: JSON.stringify(['🪟']),
        isBestseller: false,
        isNew: false,
        isEco: true,
        categoryId: glass!.id
      },
      {
        name: 'Средство для мытья полов экологичное',
        slug: 'sredstvo-dlya-mytya-polov-ekologichno',
        description: 'На основе натуральных ингредиентов. Безопасно для детей и домашних животных.',
        price: 1800,
        oldPrice: 2100,
        volume: '1000мл',
        stock: 35,
        images: JSON.stringify(['🧹']),
        isBestseller: false,
        isNew: true,
        isEco: true,
        categoryId: floor!.id
      },
      {
        name: 'Пена для ванны успокаивающая',
        slug: 'pena-dlya-vanny-uspokavivayushchaya',
        description: 'Мягкая пена с запахом лаванды. Расслабляет и увлажняет кожу.',
        price: 980,
        oldPrice: 1200,
        volume: '300мл',
        stock: 28,
        images: JSON.stringify(['🛁']),
        isBestseller: false,
        isNew: false,
        isEco: true,
        categoryId: bathroom!.id
      },
      {
        name: 'Мыло кусковое для посуды "Экономия"',
        slug: 'mylo-kuskovoe-dlya-posudy-ekonomiya',
        description: 'Традиционное кусковое мыло. Экономично. Натуральный состав.',
        price: 380,
        oldPrice: 500,
        volume: '200г',
        stock: 70,
        images: JSON.stringify(['🧼']),
        isBestseller: false,
        isNew: false,
        isEco: true,
        categoryId: dishwashing!.id
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
