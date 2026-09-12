import { Bot, InlineKeyboard, Context } from 'grammy';
import prisma from '@/lib/prisma';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN не задан в .env.local');
}

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// ============================================================
// КОМАНДА /start
// ============================================================
bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('🔍 Поиск домиков', 'search')
    .row()
    .text('⭐ Популярные', 'popular')
    .text('📍 По регионам', 'regions')
    .row()
    .text('📅 Мои бронирования', 'mybookings')
    .text('❤️ Избранное', 'favorites');

  await ctx.reply(
    '🏠 <b>Добро пожаловать в A-Frame KG!</b>\n\n' +
      'Найдите уютный домик для отдыха в горах Кыргызстана.\n\n' +
      'Выберите действие:',
    {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    }
  );
});

// ============================================================
// КОМАНДА /search
// ============================================================
bot.command('search', async (ctx) => {
  const regions = await prisma.region.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  const keyboard = new InlineKeyboard();
  regions.forEach((region, index) => {
    keyboard.text(`📍 ${region.name}`, `region_${region.id}`);
    if ((index + 1) % 2 === 0) keyboard.row();
  });

  await ctx.reply('🗺️ <b>Выберите регион:</b>', {
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });
});

// ============================================================
// КОМАНДА /mybookings
// ============================================================
bot.command('mybookings', async (ctx) => {
  const telegramId = ctx.from?.id.toString();

  // Найти пользователя по Telegram ID (нужно добавить поле в модель User)
  const user = await prisma.user.findFirst({
    where: { phone: telegramId }, // Временно используем phone, потом добавим telegramId
  });

  if (!user) {
    await ctx.reply(
      '❌ Вы ещё не зарегистрированы.\n\n' +
        'Для регистрации посетите наш сайт:\n' +
        process.env.NEXT_PUBLIC_APP_URL
    );
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      cabin: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (bookings.length === 0) {
    await ctx.reply('📭 У вас пока нет бронирований.');
    return;
  }

  let message = '📅 <b>Ваши бронирования:</b>\n\n';

  bookings.forEach((booking, index) => {
    const status =
      booking.status === 'CONFIRMED'
        ? '✅'
        : booking.status === 'PENDING'
        ? '⏳'
        : booking.status === 'CANCELLED'
        ? '❌'
        : '✔️';

    message +=
      `${index + 1}. ${status} <b>${booking.cabin.title}</b>\n` +
      `   📆 ${new Date(booking.checkIn).toLocaleDateString('ru-RU')} - ` +
      `${new Date(booking.checkOut).toLocaleDateString('ru-RU')}\n` +
      `   💰 ${Number(booking.totalAmount).toLocaleString()} сом\n` +
      `   🔖 #${booking.bookingNumber}\n\n`;
  });

  await ctx.reply(message, { parse_mode: 'HTML' });
});

// ============================================================
// ОБРАБОТКА CALLBACK QUERIES
// ============================================================

// Поиск домиков — кнопка "Поиск"
bot.callbackQuery('search', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('🔍 Используйте команду /search для поиска домиков');
});

// Популярные домики
bot.callbackQuery('popular', async (ctx) => {
  await ctx.answerCallbackQuery();

  const cabins = await prisma.cabin.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { rating: 'desc' },
    take: 5,
    include: {
      location: {
        select: {
          city: true,
          region: { select: { name: true } },
        },
      },
    },
  });

  if (cabins.length === 0) {
    await ctx.reply('Домиков пока нет 😔');
    return;
  }

  let message = '⭐ <b>Популярные домики:</b>\n\n';

  cabins.forEach((cabin, index) => {
    message +=
      `${index + 1}. <b>${cabin.title}</b>\n` +
      `   📍 ${cabin.location.city}, ${cabin.location.region.name}\n` +
      `   ⭐ ${cabin.rating} (${cabin.reviewsCount} отзывов)\n` +
      `   💰 ${Number(cabin.pricePerNight).toLocaleString()} сом/ночь\n\n`;
  });

  message += `\n🌐 Посмотреть все домики:\n${process.env.NEXT_PUBLIC_APP_URL}/cabins`;

  await ctx.reply(message, { parse_mode: 'HTML' });
});

// Регионы
bot.callbackQuery('regions', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply('📍 Используйте команду /search для выбора региона');
});

// Мои бронирования
bot.callbackQuery('mybookings', async (ctx) => {
  await ctx.answerCallbackQuery();
  await bot.api.sendMessage(ctx.from.id, '/mybookings');
});

// Избранное
bot.callbackQuery('favorites', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '❤️ Функция избранного доступна на сайте:\n' + process.env.NEXT_PUBLIC_APP_URL
  );
});

// Выбор региона
bot.callbackQuery(/^region_(\d+)$/, async (ctx) => {
  const regionId = parseInt(ctx.match[1]);
  await ctx.answerCallbackQuery();

  const region = await prisma.region.findUnique({
    where: { id: regionId },
  });

  if (!region) {
    await ctx.reply('❌ Регион не найден');
    return;
  }

  const cabins = await prisma.cabin.findMany({
    where: {
      status: 'PUBLISHED',
      location: { regionId: regionId },
    },
    take: 10,
    include: {
      location: { select: { city: true } },
    },
  });

  if (cabins.length === 0) {
    await ctx.reply(`В регионе ${region.name} пока нет доступных домиков 😔`);
    return;
  }

  let message = `🏠 <b>Домики в регионе ${region.name}:</b>\n\n`;

  cabins.forEach((cabin, index) => {
    message +=
      `${index + 1}. <b>${cabin.title}</b>\n` +
      `   📍 ${cabin.location.city}\n` +
      `   ⭐ ${cabin.rating} | 👥 до ${cabin.maxGuests} гостей\n` +
      `   💰 ${Number(cabin.pricePerNight).toLocaleString()} сом/ночь\n\n`;
  });

  message += `\n🌐 Забронировать:\n${process.env.NEXT_PUBLIC_APP_URL}/cabins`;

  await ctx.reply(message, { parse_mode: 'HTML' });
});

// ============================================================
// КОМАНДА /help
// ============================================================
bot.command('help', async (ctx) => {
  await ctx.reply(
    '📖 <b>Помощь - A-Frame KG Bot</b>\n\n' +
      '<b>Доступные команды:</b>\n' +
      '/start - Главное меню\n' +
      '/search - Поиск домиков по регионам\n' +
      '/mybookings - Мои бронирования\n' +
      '/help - Эта справка\n' +
      '/contact - Связаться с нами\n\n' +
      '🌐 <b>Сайт:</b> ' +
      process.env.NEXT_PUBLIC_APP_URL +
      '\n' +
      '📧 <b>Email:</b> info@aframe.kg\n' +
      '📞 <b>Телефон:</b> +996 700 123 456',
    { parse_mode: 'HTML' }
  );
});

// ============================================================
// КОМАНДА /contact
// ============================================================
bot.command('contact', async (ctx) => {
  await ctx.reply(
    '📞 <b>Связаться с нами:</b>\n\n' +
      '🌐 Сайт: ' +
      process.env.NEXT_PUBLIC_APP_URL +
      '\n' +
      '📧 Email: info@aframe.kg\n' +
      '📱 Телефон: +996 700 123 456\n' +
      '💬 Telegram: @aframe_support\n\n' +
      'Режим работы: Пн-Вс, 9:00-21:00',
    { parse_mode: 'HTML' }
  );
});

// ============================================================
// ОБРАБОТКА ТЕКСТОВЫХ СООБЩЕНИЙ
// ============================================================
bot.on('message:text', async (ctx) => {
  await ctx.reply(
    '👋 Используйте команды для навигации:\n\n' +
      '/start - Главное меню\n' +
      '/search - Поиск домиков\n' +
      '/mybookings - Мои бронирования\n' +
      '/help - Помощь'
  );
});

export default bot;
