// ============================================================
// Скрипт для проверки токена Telegram бота
// ============================================================

const fs = require('fs');
const path = require('path');

async function testTelegramBot() {
  console.log('🤖 Проверка Telegram бота...\n');

  // Читаем .env файл
  const envPath = path.join(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Ищем токен
  const tokenMatch = envContent.match(/TELEGRAM_BOT_TOKEN="?([^"\n]+)"?/);
  
  if (!tokenMatch || !tokenMatch[1] || tokenMatch[1] === 'YOUR_BOT_TOKEN_HERE') {
    console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env файле');
    console.log('\n💡 Добавь токен в .env:');
    console.log('TELEGRAM_BOT_TOKEN="твой_токен_от_BotFather"\n');
    process.exit(1);
  }

  const token = tokenMatch[1];
  console.log(`🔑 Токен найден: ${token.slice(0, 10)}...${token.slice(-10)}\n`);

  try {
    // Проверяем токен через Telegram API
    console.log('📡 Запрашиваем информацию о боте...\n');
    
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Ошибка токена:');
      console.error(data.description);
      process.exit(1);
    }

    // Бот работает!
    const bot = data.result;
    console.log('✅ Бот найден и активен!\n');
    console.log('📋 Информация о боте:');
    console.log(`   ID: ${bot.id}`);
    console.log(`   Имя: ${bot.first_name}`);
    console.log(`   Username: @${bot.username}`);
    console.log(`   Ссылка: https://t.me/${bot.username}`);

    // Проверяем webhook
    console.log('\n🔗 Проверка webhook...\n');
    
    const webhookResponse = await fetch(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    );
    const webhookData = await webhookResponse.json();

    if (webhookData.result.url) {
      console.log(`✅ Webhook установлен: ${webhookData.result.url}`);
      console.log(`   Pending updates: ${webhookData.result.pending_update_count}`);
      
      if (webhookData.result.last_error_message) {
        console.log(`   ⚠️  Последняя ошибка: ${webhookData.result.last_error_message}`);
        console.log(`   📅 Время ошибки: ${new Date(webhookData.result.last_error_date * 1000).toLocaleString()}`);
      }
    } else {
      console.log('⚠️  Webhook не установлен');
      console.log('\n💡 Для установки webhook:');
      console.log('1. Запусти приложение: npm run dev');
      console.log('2. Настрой ngrok: ngrok http 3000');
      console.log('3. Обнови NEXT_PUBLIC_APP_URL в .env');
      console.log('4. Запусти: npm run telegram:setup');
    }

    console.log('\n🎉 Всё готово! Открой бота в Telegram:');
    console.log(`   https://t.me/${bot.username}`);
    console.log('\nОтправь боту команду: /start\n');

  } catch (error) {
    console.error('❌ Ошибка при проверке:', error.message);
    process.exit(1);
  }
}

testTelegramBot();
