// ============================================================
// Скрипт для выполнения SQL-миграции напрямую в PostgreSQL
// ============================================================

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Читаем DATABASE_URL из .env.local
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/DATABASE_URL="(.+)"/);
  
  if (!match) {
    console.error('❌ DATABASE_URL не найден в .env.local');
    process.exit(1);
  }

  const databaseUrl = match[1];
  console.log('🔗 Подключение к базе данных...');

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('✅ Подключено к PostgreSQL');

    // Читаем SQL-скрипт
    const sqlPath = path.join(__dirname, '..', 'prisma', 'manual-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📄 Выполняем миграцию...');
    await client.query(sql);

    console.log('✅ Миграция выполнена успешно!');
    console.log('📊 Создано 21 таблица:');
    console.log('   - users');
    console.log('   - owner_profiles');
    console.log('   - regions');
    console.log('   - locations');
    console.log('   - cabins');
    console.log('   - cabin_images');
    console.log('   - amenities');
    console.log('   - cabin_amenities');
    console.log('   - cabin_rules');
    console.log('   - favorites');
    console.log('   - bookings');
    console.log('   - cabin_availability');
    console.log('   - reviews');
    console.log('   - review_images');
    console.log('   - notifications');
    console.log('   - search_history');
    console.log('   - promotions');
    console.log('   - payments');
    console.log('   - cabin_views');
    console.log('   - owner_payouts');
    console.log('   - audit_logs');
    console.log('\n🎉 Готово! Теперь запусти: npm run db:seed');

  } catch (error) {
    console.error('❌ Ошибка при миграции:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
