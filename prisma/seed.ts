import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем seed базы данных...');

  // ─────────────────────────────────────────────
  // 1. РЕГИОНЫ КЫРГЫЗСТАНА
  // ─────────────────────────────────────────────
  console.log('📍 Создаём регионы...');

  const regions = await Promise.all([
    prisma.region.upsert({
      where: { slug: 'issyk-kul' },
      update: {},
      create: { name: 'Иссык-Куль', slug: 'issyk-kul', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'chui' },
      update: {},
      create: { name: 'Чуй', slug: 'chui', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'naryn' },
      update: {},
      create: { name: 'Нарын', slug: 'naryn', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'osh' },
      update: {},
      create: { name: 'Ош', slug: 'osh', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'jalal-abad' },
      update: {},
      create: { name: 'Джалал-Абад', slug: 'jalal-abad', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'talas' },
      update: {},
      create: { name: 'Талас', slug: 'talas', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'batken' },
      update: {},
      create: { name: 'Баткен', slug: 'batken', isActive: true },
    }),
    prisma.region.upsert({
      where: { slug: 'bishkek' },
      update: {},
      create: { name: 'Бишкек', slug: 'bishkek', isActive: true },
    }),
  ]);

  console.log(`✅ Создано регионов: ${regions.length}`);

  // ─────────────────────────────────────────────
  // 2. УДОБСТВА (AMENITIES)
  // ─────────────────────────────────────────────
  console.log('🏠 Создаём удобства...');

  const amenities = await Promise.all([
    prisma.amenity.upsert({
      where: { slug: 'wifi' },
      update: {},
      create: { name: 'Wi-Fi', slug: 'wifi', icon: 'wifi', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'kitchen' },
      update: {},
      create: { name: 'Кухня', slug: 'kitchen', icon: 'utensils', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'parking' },
      update: {},
      create: { name: 'Парковка', slug: 'parking', icon: 'car', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'pool' },
      update: {},
      create: { name: 'Бассейн', slug: 'pool', icon: 'water', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'heating' },
      update: {},
      create: { name: 'Отопление', slug: 'heating', icon: 'fire', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'tv' },
      update: {},
      create: { name: 'Телевизор', slug: 'tv', icon: 'tv', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'washing-machine' },
      update: {},
      create: { name: 'Стиральная машина', slug: 'washing-machine', icon: 'wind', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'air-conditioning' },
      update: {},
      create: { name: 'Кондиционер', slug: 'air-conditioning', icon: 'snowflake', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'fireplace' },
      update: {},
      create: { name: 'Камин', slug: 'fireplace', icon: 'fire', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'bbq' },
      update: {},
      create: { name: 'Барбекю', slug: 'bbq', icon: 'grill', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'mountain-view' },
      update: {},
      create: { name: 'Вид на горы', slug: 'mountain-view', icon: 'mountain', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'lake-view' },
      update: {},
      create: { name: 'Вид на озеро', slug: 'lake-view', icon: 'water', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'pet-friendly' },
      update: {},
      create: { name: 'Можно с питомцами', slug: 'pet-friendly', icon: 'paw', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'sauna' },
      update: {},
      create: { name: 'Сауна', slug: 'sauna', icon: 'droplet', isActive: true },
    }),
    prisma.amenity.upsert({
      where: { slug: 'terrace' },
      update: {},
      create: { name: 'Терраса', slug: 'terrace', icon: 'home', isActive: true },
    }),
  ]);

  console.log(`✅ Создано удобств: ${amenities.length}`);

  // ─────────────────────────────────────────────
  // 3. ТЕСТОВЫЙ ПОЛЬЗОВАТЕЛЬ-ВЛАДЕЛЕЦ
  // ─────────────────────────────────────────────
  console.log('👤 Создаём тестового владельца...');

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@aframe.kg' },
    update: {},
    create: {
      firstName: 'Азамат',
      lastName: 'Токтомушев',
      email: 'owner@aframe.kg',
      phone: '+996700123456',
      passwordHash: '$2a$10$dummyHashForTestingPurposes', // в реальности используй bcrypt
      role: 'OWNER',
      status: 'ACTIVE',
      isVerified: true,
      ownerProfile: {
        create: {
          businessName: 'A-Frame Paradise KG',
          description: 'Уютные домики в горах Кыргызстана с 2020 года',
          contactPhone: '+996700123456',
          verificationStatus: 'VERIFIED',
        },
      },
    },
  });

  console.log(`✅ Создан владелец: ${ownerUser.email}`);

  // ─────────────────────────────────────────────
  // 4. ТЕСТОВАЯ ЛОКАЦИЯ
  // ─────────────────────────────────────────────
  console.log('🗺️  Создаём тестовую локацию...');

  const issykKulRegion = regions.find((r) => r.slug === 'issyk-kul');
  if (!issykKulRegion) throw new Error('Регион Иссык-Куль не найден');

  const location = await prisma.location.create({
    data: {
      regionId: issykKulRegion.id,
      city: 'Чолпон-Ата',
      address: 'Ущелье Григорьевское, 15 км от города',
      latitude: 42.6483,
      longitude: 77.0842,
    },
  });

  console.log(`✅ Создана локация: ${location.city}`);

  // ─────────────────────────────────────────────
  // 5. ТЕСТОВЫЙ ДОМИК
  // ─────────────────────────────────────────────
  console.log('🏡 Создаём тестовый домик...');

  const cabin = await prisma.cabin.create({
    data: {
      ownerId: ownerUser.id,
      locationId: location.id,
      title: 'Mountain A-Frame на Иссык-Куле',
      slug: 'mountain-aframe-issyk-kul',
      description:
        'Уютный A-frame домик с потрясающим видом на горы и озеро Иссык-Куль. Идеально для романтического отдыха или семейного уикенда.',
      pricePerNight: 5000,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      rating: 4.9,
      reviewsCount: 12,
      status: 'PUBLISHED',
      images: {
        create: [
          {
            imageUrl: '/images/cabins/demo-1.jpg',
            altText: 'Вид снаружи',
            sortOrder: 1,
            isMain: true,
          },
          {
            imageUrl: '/images/cabins/demo-2.jpg',
            altText: 'Гостиная',
            sortOrder: 2,
            isMain: false,
          },
        ],
      },
      amenities: {
        create: amenities.slice(0, 5).map((amenity, index) => ({
          amenityId: amenity.id,
        })),
      },
      rules: {
        create: [
          {
            title: 'Заезд',
            description: 'После 14:00',
            isActive: true,
          },
          {
            title: 'Выезд',
            description: 'До 12:00',
            isActive: true,
          },
          {
            title: 'Курение',
            description: 'Запрещено внутри домика',
            isActive: true,
          },
        ],
      },
    },
  });

  console.log(`✅ Создан домик: ${cabin.title}`);

  console.log('\n🎉 Seed завершён успешно!\n');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
