const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setBestsellers() {
  try {
    // Получаем случайные 3 товара
    const allProducts = await prisma.product.findMany()
    
    if (allProducts.length < 3) {
      console.log('❌ В БД менее 3 товаров')
      return
    }

    // Сбрасываем все старые бестселлеры
    await prisma.product.updateMany({
      data: { isBestseller: false },
    })

    // Выбираем 3 случайных товара
    const shuffled = allProducts.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    // Устанавливаем им статус бестселлера
    for (const product of selected) {
      await prisma.product.update({
        where: { id: product.id },
        data: { isBestseller: true },
      })
      console.log(`✅ ${product.name} - отмечен как хит продаж`)
    }

    console.log(`\n✅ Выбрано 3 хита продаж из ${allProducts.length} товаров`)
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setBestsellers()
