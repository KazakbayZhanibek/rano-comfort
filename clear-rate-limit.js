const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const result = await prisma.adminLoginAttempt.deleteMany({});
    console.log(`✅ Удалено ${result.count} логов попыток входа`);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
