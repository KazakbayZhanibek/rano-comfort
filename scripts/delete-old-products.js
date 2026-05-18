const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteOldProducts() {
  try {
    const productsToDelete = [
      'Гель для стирки универсальный',
      'Мыло кусковое для посуды "Экономия"',
      'Пена для ванны успокаивающая',
      'Средство для мытья полов экологичное',
      'Салфетки микрофибра для стекла',
      'Концентрированный порошок для стирки',
      'Освежитель воздуха "Лесной аромат"',
      'Средство для чистки ванной с отбеливающим эффектом',
      'Чистящее средство для пола "Чистота"',
      'Универсальный очиститель для стекла',
    ];

    for (const productName of productsToDelete) {
      const product = await prisma.product.findFirst({
        where: {
          name: {
            contains: productName,
            mode: 'insensitive',
          },
        },
      });

      if (product) {
        await prisma.product.delete({
          where: { id: product.id },
        });
        console.log(`✓ Удален товар: ${product.name} (ID: ${product.id})`);
      } else {
        console.log(`- Товар не найден: ${productName}`);
      }
    }

    console.log('\n✓ Удаление завершено!');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldProducts();
