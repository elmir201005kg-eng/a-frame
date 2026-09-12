/**
 * Скрипт для создания администратора
 * Использование: node scripts/create-admin.js
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n🔐 Создание администратора A-Frame\n');

  try {
    // Получить данные от пользователя
    const name = await question('Имя администратора: ');
    const email = await question('Email: ');
    const password = await question('Пароль: ');
    const phone = await question('Телефон (например, +996700000000): ');

    // Проверить существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.log('\n❌ Пользователь с таким email уже существует!\n');
      rl.close();
      process.exit(1);
    }

    // Хэшировать пароль
    console.log('\n⏳ Хэширование пароля...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создать администратора
    console.log('⏳ Создание пользователя...');
    const admin = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Администратор успешно создан!\n');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Имя:', admin.name);
    console.log('Роль:', admin.role);
    console.log('\n📝 Не забудьте добавить настройки Telegram в таблицу Settings:');
    console.log('   - ADMIN_TELEGRAM_BOT_TOKEN');
    console.log('   - ADMIN_TELEGRAM_USER_ID');
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
