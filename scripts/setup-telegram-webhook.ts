// ============================================================
// Скрипт для установки Telegram Webhook
// ============================================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`;

async function setupWebhook() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN не задан в .env.local');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('❌ NEXT_PUBLIC_APP_URL не задан в .env.local');
    process.exit(1);
  }

  console.log('🔧 Настройка Telegram Webhook...\n');
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}\n`);

  try {
    // Устанавливаем webhook
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message', 'callback_query'],
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook установлен успешно!');
      console.log(`📩 Описание: ${data.description}`);
    } else {
      console.error('❌ Ошибка установки webhook:');
      console.error(data);
    }

    // Проверяем информацию о webhook
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`
    );
    const info = await infoResponse.json();

    console.log('\n📊 Информация о webhook:');
    console.log(`   URL: ${info.result.url}`);
    console.log(`   Pending updates: ${info.result.pending_update_count}`);
    if (info.result.last_error_message) {
      console.log(`   ⚠️ Последняя ошибка: ${info.result.last_error_message}`);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

setupWebhook();
