/**
 * Скрипт для настройки Telegram в таблице Settings
 * Использование: node scripts/setup-telegram-settings.js
 */

const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setupTelegram() {
  console.log('\n📱 Настройка Telegram для администратора\n');

  try {
    const botToken = await question('Telegram Bot Token: ');
    const userId = await question('Telegram User ID администратора: ');

    console.log('\n⏳ Сохранение настроек...');

    // Сохранить Bot Token
    await prisma.settings.upsert({
      where: { key: 'ADMIN_TELEGRAM_BOT_TOKEN' },
      create: {
        key: 'ADMIN_TELEGRAM_BOT_TOKEN',
        value: botToken,
      },
      update: {
        value: botToken,
      },
    });

    // Сохранить User ID
    await prisma.settings.upsert({
      where: { key: 'ADMIN_TELEGRAM_USER_ID' },
      create: {
        key: 'ADMIN_TELEGRAM_USER_ID',
        value: userId,
      },
      update: {
        value: userId,
      },
    });

    console.log('\n✅ Настройки Telegram успешно сохранены!\n');
    console.log('Bot Token:', botToken);
    console.log('User ID:', userId);
    console.log('\n📝 Теперь вы можете войти в админ-панель через /admin/login\n');
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

setupTelegram();
