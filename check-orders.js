require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const orders = await prisma.order.findMany({
      select: { id: true, name: true, phone: true, status: true, createdAt: true },
      orderBy: { id: 'desc' },
      take: 20
    })
    
    console.log('📦 Заказы в базе:')
    console.log(JSON.stringify(orders, null, 2))
    console.log(`\nВсего заказов: ${orders.length}`)
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
