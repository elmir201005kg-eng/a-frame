import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'EMAIL_AND_PASSWORD_REQUIRED' },
        { status: 400 }
      );
    }

    // Найти пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Проверить роль администратора
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'NOT_ADMIN' },
        { status: 403 }
      );
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // Получить настройки Telegram из БД
    const [botTokenSetting, adminTelegramIdSetting] = await Promise.all([
      prisma.settings.findUnique({
        where: { key: 'ADMIN_TELEGRAM_BOT_TOKEN' },
      }),
      prisma.settings.findUnique({
        where: { key: 'ADMIN_TELEGRAM_USER_ID' },
      }),
    ]);

    if (!botTokenSetting?.value || !adminTelegramIdSetting?.value) {
      return NextResponse.json(
        { error: 'TELEGRAM_NOT_CONFIGURED' },
        { status: 500 }
      );
    }

    // Генерировать 6-значный код
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут

    // Сохранить код в БД (добавим в settings временно)
    await prisma.settings.upsert({
      where: { key: `ADMIN_2FA_${user.id}` },
      create: {
        key: `ADMIN_2FA_${user.id}`,
        value: JSON.stringify({
          code: verificationCode,
          expiresAt: expiresAt.toISOString(),
        }),
      },
      update: {
        value: JSON.stringify({
          code: verificationCode,
          expiresAt: expiresAt.toISOString(),
        }),
      },
    });

    // Отправить код через Telegram Bot
    try {
      const telegramApiUrl = `https://api.telegram.org/bot${botTokenSetting.value}/sendMessage`;
      
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: adminTelegramIdSetting.value,
          text: `🔐 <b>Код подтверждения входа</b>\n\n` +
                `Ваш код: <code>${verificationCode}</code>\n\n` +
                `Код действителен 5 минут.\n` +
                `Если это были не вы, проигнорируйте это сообщение.`,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram message');
      }
    } catch (error) {
      console.error('Telegram send error:', error);
      return NextResponse.json(
        { error: 'TELEGRAM_SEND_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      requiresTwoFactor: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
