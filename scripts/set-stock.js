const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setStock() {
  try {
    const result = await prisma.product.updateMany({
      data: {
        stock: 10,
      },
    })

    console.log(`✅ Обновлено товаров: ${result.count}`)
    console.log('Каждому товару установлен остаток: 10 штук')
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setStock()
