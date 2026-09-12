// ============================================================
// Запуск Telegram бота в режиме polling (для локальной разработки)
// ============================================================

import bot from '../lib/telegram-bot';

console.log('🤖 Запуск Telegram бота...\n');

// Удаляем webhook если он установлен
bot.api.deleteWebhook().then(() => {
  console.log('✅ Webhook удалён (используем polling)\n');
  
  // Запускаем бота
  bot.start({
    onStart: (botInfo) => {
      console.log('✅ Бот запущен успешно!\n');
      console.log('📋 Информация о боте:');
      console.log(`   Имя: ${botInfo.first_name}`);
      console.log(`   Username: @${botInfo.username}`);
      console.log(`   Ссылка: https://t.me/${botInfo.username}`);
      console.log('\n💬 Бот ожидает сообщения...\n');
      console.log('Открой Telegram и напиши боту команду: /start\n');
    },
  });
});

// Обработка остановки
process.once('SIGINT', () => {
  console.log('\n🛑 Остановка бота...');
  bot.stop();
});
process.once('SIGTERM', () => {
  console.log('\n🛑 Остановка бота...');
  bot.stop();
});
