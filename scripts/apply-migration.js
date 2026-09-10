// ============================================================
// Применение миграции к Neon PostgreSQL
// ============================================================

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = "postgresql://neondb_owner:npg_NLA0zOVyDma6@ep-solitary-frost-ay3r2rhk-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function applyMigration() {
  console.log('🚀 Начинаем миграцию в Neon PostgreSQL...\n');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔗 Подключение к Neon...');
    await client.connect();
    console.log('✅ Подключено успешно!\n');

    console.log('📄 Создаём ENUM типы...');
    
    // Создаём ENUM типы по отдельности (игнорируем ошибки если уже существуют)
    const enums = [
      `CREATE TYPE "Role" AS ENUM ('USER', 'OWNER', 'ADMIN');`,
      `CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');`,
      `CREATE TYPE "CabinStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'BLOCKED', 'ARCHIVED');`,
      `CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED');`,
      `CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');`,
      `CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'HIDDEN');`,
      `CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');`,
      `CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');`,
      `CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');`,
      `CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');`,
    ];

    for (const enumSql of enums) {
      try {
        await client.query(enumSql);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          throw err;
        }
      }
    }

    console.log('✅ ENUM типы созданы\n');

    // Читаем SQL-скрипт
    const sqlPath = path.join(__dirname, '..', 'prisma', 'manual-migration.sql');
    let sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Убираем секцию с ENUM (уже создали)
    sql = sql.replace(/-- ENUMS[\s\S]*?CREATE TYPE "PayoutStatus"[^\n]+\n/m, '');

    console.log('📊 Создаём таблицы (21 шт.)...');
    await client.query(sql);

    console.log('✅ Таблицы созданы!\n');
    console.log('📋 Список таблиц:');
    console.log('   1.  users              11. bookings');
    console.log('   2.  owner_profiles     12. cabin_availability');
    console.log('   3.  regions            13. reviews');
    console.log('   4.  locations          14. review_images');
    console.log('   5.  cabins             15. notifications');
    console.log('   6.  cabin_images       16. search_history');
    console.log('   7.  amenities          17. promotions');
    console.log('   8.  cabin_amenities    18. payments');
    console.log('   9.  cabin_rules        19. cabin_views');
    console.log('   10. favorites          20. owner_payouts');
    console.log('                          21. audit_logs');
    
    console.log('\n🎉 Миграция завершена!\n');
    console.log('Следующие шаги:');
    console.log('  npm run db:seed   — заполнить тестовыми данными');
    console.log('  npm run db:studio — открыть редактор БД');

  } catch (error) {
    console.error('\n❌ Ошибка:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
