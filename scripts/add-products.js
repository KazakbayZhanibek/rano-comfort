const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addProducts() {
  try {
    // Категории
    const categories = [
      { name: 'Готовая продукция', slug: 'gotovaya-produkciya' },
      { name: 'Косметическая продукция', slug: 'kosmeticheskaya-produkciya' },
      { name: 'Авто-Химия', slug: 'avto-himiya' },
      { name: 'Пластины Листовые', slug: 'plastiny-listovye' },
      { name: 'Ароматизаторы', slug: 'aromatizatory' },
    ];

    // Проверяем и создаем категории
    for (const cat of categories) {
      const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (!existing) {
        await prisma.category.create({ data: cat });
        console.log(`✓ Создана категория: ${cat.name}`);
      } else {
        console.log(`- Категория уже существует: ${cat.name}`);
      }
    }

    // Товары
    const products = [
      // Готовая продукция
      { name: 'Антижир "PROFESSIONAL" 5 л', slug: 'antizhi-professional-5l', price: 6800, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Антижир "Мультисила" 500 мл', slug: 'antizhi-multisila-500ml', price: 1350, categorySlug: 'gotovaya-produkciya', volume: '500 мл' },
      { name: 'Антизасор 1л', slug: 'antizasor-1l', price: 1200, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Антизасор 300 мг (Сухой)', slug: 'antizasor-300mg-suhoy', price: 550, categorySlug: 'gotovaya-produkciya', volume: '300 мг' },
      { name: 'Белизна 25% 1л', slug: 'belizna-25-1l', price: 550, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Гель "Эффективная стирка" 3л', slug: 'gel-effektivnaya-stirka-3l', price: 3200, categorySlug: 'gotovaya-produkciya', volume: '3 л' },
      { name: 'Гель "Эффективная стирка" Спорт 1,5 л', slug: 'gel-effektivnaya-stirka-sport-1-5l', price: 2600, categorySlug: 'gotovaya-produkciya', volume: '1,5 л' },
      { name: 'Гель для мытья посуды "Отбасы" 1000 гр', slug: 'gel-dlya-mytya-posudy-otbasy-1000gr', price: 2000, categorySlug: 'gotovaya-produkciya', volume: '1000 гр' },
      { name: 'Гель для мытья посуды "Отбасы" 500 мл', slug: 'gel-dlya-mytya-posudy-otbasy-500ml', price: 1000, categorySlug: 'gotovaya-produkciya', volume: '500 мл' },
      { name: 'Гель для Стирки Алтын Ара 4л', slug: 'gel-dlya-stirki-altyn-ara-4l', price: 5200, categorySlug: 'gotovaya-produkciya', volume: '4 л' },
      { name: 'Гель универсальный «Сила-Force» 1 л', slug: 'gel-universalnyy-sila-force-1l', price: 1300, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Гель универсальный «Сила-Force» 5 л', slug: 'gel-universalnyy-sila-force-5l', price: 4000, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Жидкое хозяйственное мыло 5 л', slug: 'zhidkoe-hozyaystvennoe-mylo-5l', price: 2600, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Кондиционер для белья PREMIUM Komfort 1,5 л', slug: 'konditsioner-dlya-belya-premium-komfort-1-5l', price: 1800, categorySlug: 'gotovaya-produkciya', volume: '1,5 л' },
      { name: 'Кондиционер для белья 5л', slug: 'konditsioner-dlya-belya-5l', price: 5200, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Многофункциональное средство «HOME» 5 л', slug: 'mnogofunktsionalnoe-sredstvo-home-5l', price: 2700, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Мыло Банное 150 гр', slug: 'mylo-bannoe-150gr', price: 400, categorySlug: 'gotovaya-produkciya', volume: '150 гр' },
      { name: 'Мыло Волшебное 250 гр', slug: 'mylo-volshebnoe-250gr', price: 350, categorySlug: 'gotovaya-produkciya', volume: '250 гр' },
      { name: 'Полироль пластика глянцевый 1л', slug: 'polirول-plastika-glyantsevyy-1l', price: 2200, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Порошок WHITE Power 600 гр', slug: 'poroshok-white-power-600gr', price: 3500, categorySlug: 'gotovaya-produkciya', volume: '600 гр' },
      { name: 'Паста Алтын Ара 500 гр', slug: 'pasta-altyn-ara-500gr', price: 2200, categorySlug: 'gotovaya-produkciya', volume: '500 гр' },
      { name: 'Пятновыводитель для белого белья 0,5 л', slug: 'pyatnovyvod-dlya-belogo-belya-0-5l', price: 2300, categorySlug: 'gotovaya-produkciya', volume: '0,5 л' },
      { name: 'Пятновыводитель для текстиля 0,5 л', slug: 'pyatnovyvod-dlya-tekstilya-0-5l', price: 2200, categorySlug: 'gotovaya-produkciya', volume: '0,5 л' },
      { name: 'Пятновыводитель для текстиля 5 л', slug: 'pyatnovyvod-dlya-tekstilya-5l', price: 18200, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Пятновыводитель универсальный 0,5 л', slug: 'pyatnovyvod-universalnyy-0-5l', price: 2000, categorySlug: 'gotovaya-produkciya', volume: '0,5 л' },
      { name: 'Средство для уборки после ремонта 5л', slug: 'sredstvo-dlya-uborki-posle-remonta-5l', price: 18800, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Средство для уборки после ремонта 0,5 л', slug: 'sredstvo-dlya-uborki-posle-remonta-0-5l', price: 2300, categorySlug: 'gotovaya-produkciya', volume: '0,5 л' },
      { name: 'Средство "Алтын Ара" с усиленным эффектом 1л', slug: 'sredstvo-altyn-ara-ussilenny-1l', price: 2500, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Средство "Алтын Ара" с усиленным эффектом 0,5л', slug: 'sredstvo-altyn-ara-ussilenny-0-5l', price: 1500, categorySlug: 'gotovaya-produkciya', volume: '0,5 л' },
      { name: 'Средство "Алтын Ара" с усиленным эффектом 5л', slug: 'sredstvo-altyn-ara-ussilenny-5l', price: 10000, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Средство "Боец против налёта" 1л', slug: 'sredstvo-boets-protiv-naleta-1l', price: 2200, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Средство для всех видов стекл поверхностей 500 мл', slug: 'sredstvo-dlya-vsekh-vidov-stekl-poverkhnostey-500ml', price: 750, categorySlug: 'gotovaya-produkciya', volume: '500 мл' },
      { name: 'Средство для люстр 500 мл', slug: 'sredstvo-dlya-lustr-500ml', price: 750, categorySlug: 'gotovaya-produkciya', volume: '500 мл' },
      { name: 'Средство для мытья посуды "Премиум Комфорт" 1л', slug: 'sredstvo-dlya-mytya-posudy-premium-komfort-1l', price: 1200, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Средство для мытья посуды 500 мл', slug: 'sredstvo-dlya-mytya-posudy-500ml', price: 450, categorySlug: 'gotovaya-produkciya', volume: '500 мл' },
      { name: 'Средство для мытья посуды 5л', slug: 'sredstvo-dlya-mytya-posudy-5l', price: 2000, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Средство для пола и твердых поверхностей 5 л', slug: 'sredstvo-dlya-pola-i-tverdykh-poverkhnostey-5l', price: 4000, categorySlug: 'gotovaya-produkciya', volume: '5 л' },
      { name: 'Средство для санузлов "Сила Титанов" 1000 мл', slug: 'sredstvo-dlya-sanuzlov-sila-titanov-1000ml', price: 2000, categorySlug: 'gotovaya-produkciya', volume: '1000 мл' },
      { name: 'Средство для санузлов Clean Frog 1000 мл', slug: 'sredstvo-dlya-sanuzlov-clean-frog-1000ml', price: 1700, categorySlug: 'gotovaya-produkciya', volume: '1000 мл' },
      { name: 'Универсальное моющее средство для пола 1л', slug: 'universalnoe-moyushhee-sredstvo-dlya-pola-1l', price: 900, categorySlug: 'gotovaya-produkciya', volume: '1 л' },
      { name: 'Чистящий порошок для ванны и раковины 500 гр', slug: 'chistyashhiy-poroshok-dlya-vanny-i-rakoviny-500gr', price: 450, categorySlug: 'gotovaya-produkciya', volume: '500 гр' },

      // Косметическая продукция
      { name: 'Спреи для Волос Lati & Sha', slug: 'sprei-dlya-volos-lati-sha', price: 2000, categorySlug: 'kosmeticheskaya-produkciya', volume: '' },
      { name: 'Шампунь Имбирь 300 мг', slug: 'shampun-imbirь-300mg', price: 5000, categorySlug: 'kosmeticheskaya-produkciya', volume: '300 мг' },
      { name: 'Кондиционер для волос 1000 мл', slug: 'konditsioner-dlya-volos-1000ml', price: 3500, categorySlug: 'kosmeticheskaya-produkciya', volume: '1000 мл' },
      { name: 'Маска для волос Latisha 200 мл', slug: 'maska-dlya-volos-latisha-200ml', price: 1500, categorySlug: 'kosmeticheskaya-produkciya', volume: '200 мл' },
      { name: 'Мыло ручной работы', slug: 'mylo-ruchnoy-raboty', price: 10800, categorySlug: 'kosmeticheskaya-produkciya', volume: '' },
      { name: 'Сыворотка для волос 90 мл', slug: 'syvorotka-dlya-volos-90ml', price: 7500, categorySlug: 'kosmeticheskaya-produkciya', volume: '90 мл' },
      { name: 'Шампунь Latisha безсульфатный с шелком 500 мл', slug: 'shampun-latisha-bezsulfatnyy-s-shelkom-500ml', price: 6000, categorySlug: 'kosmeticheskaya-produkciya', volume: '500 мл' },
      { name: 'Шампунь Latisha женский 1000 мл', slug: 'shampun-latisha-zhenskiy-1000ml', price: 3000, categorySlug: 'kosmeticheskaya-produkciya', volume: '1000 мл' },
      { name: 'Шампунь Latisha женский 5 л', slug: 'shampun-latisha-zhenskiy-5l', price: 8000, categorySlug: 'kosmeticheskaya-produkciya', volume: '5 л' },
      { name: 'Шампунь Latisha мужской 1000 мл', slug: 'shampun-latisha-muzhskoy-1000ml', price: 3000, categorySlug: 'kosmeticheskaya-produkciya', volume: '1000 мл' },

      // Авто-Химия
      { name: 'Мегаладон 1л', slug: 'megaladon-1l', price: 2500, categorySlug: 'avto-himiya', volume: '1 л' },
      { name: 'Чернитель 0.5 Силикон', slug: 'chernitel-0-5-silikon', price: 3900, categorySlug: 'avto-himiya', volume: '0,5' },
      { name: 'Полироль для Авто Смарт+', slug: 'polirول-dlya-avto-smart-plus', price: 13000, categorySlug: 'avto-himiya', volume: '' },
      { name: 'Полироль 0.5 Авто', slug: 'polirول-0-5-avto', price: 7500, categorySlug: 'avto-himiya', volume: '0,5' },

      // Пластины Листовые
      { name: 'Пластины для Белого Белья', slug: 'plastiny-dlya-belogo-belya', price: 2200, categorySlug: 'plastiny-listovye', volume: '' },
      { name: 'Пластины для Черного Белья', slug: 'plastiny-dlya-chernogo-belya', price: 2000, categorySlug: 'plastiny-listovye', volume: '' },
      { name: 'Пластины для Цветного Белья', slug: 'plastiny-dlya-tsvetnogo-belya', price: 4200, categorySlug: 'plastiny-listovye', volume: '' },
      { name: 'Пластины для Детского Белья', slug: 'plastiny-dlya-detskogo-belya', price: 2100, categorySlug: 'plastiny-listovye', volume: '' },
      { name: 'Пластины для Посудомоечной Машинки', slug: 'plastiny-dlya-posudomoechnoy-mashinki', price: 6000, categorySlug: 'plastiny-listovye', volume: '' },

      // Ароматизаторы
      { name: 'Парфюм Париж', slug: 'parfyum-parizh', price: 1500, categorySlug: 'aromatizatory', volume: '' },
      { name: 'Арабская Ночь', slug: 'arabskaya-noch', price: 1500, categorySlug: 'aromatizatory', volume: '' },
      { name: 'Ароматизатор Лотос & Орхидея', slug: 'aromatizator-lotos-orkhideya', price: 1000, categorySlug: 'aromatizatory', volume: '' },
      { name: 'Zam Zam', slug: 'zam-zam', price: 10000, categorySlug: 'aromatizatory', volume: '' },
      { name: 'Таза Уй Кондиционер 3л', slug: 'taza-uy-konditsioner-3l', price: 3400, categorySlug: 'aromatizatory', volume: '3 л' },
      { name: 'Таза Уй Стирка 3л', slug: 'taza-uy-stirka-3l', price: 2500, categorySlug: 'aromatizatory', volume: '3 л' },
      { name: 'Таза Уй Жидкое Мыло', slug: 'taza-uy-zhidkoe-mylo', price: 1500, categorySlug: 'aromatizatory', volume: '' },
      { name: 'Таза Уй Посуда 3л', slug: 'taza-uy-posuda-3l', price: 1500, categorySlug: 'aromatizatory', volume: '3 л' },
    ];

    // Получаем ID категорий
    const categoryMap = {};
    for (const cat of categories) {
      const found = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (found) {
        categoryMap[cat.slug] = found.id;
      }
    }

    // Добавляем товары
    for (const prod of products) {
      const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
      if (!existing) {
        await prisma.product.create({
          data: {
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            volume: prod.volume,
            stock: 0,
            categoryId: categoryMap[prod.categorySlug],
          },
        });
        console.log(`✓ Создан товар: ${prod.name}`);
      } else {
        console.log(`- Товар уже существует: ${prod.name}`);
      }
    }

    console.log('\n✓ Все товары добавлены успешно!');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addProducts();
