import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Выполняем простой запрос — считаем количество пользователей.
    // Если таблицы ещё не созданы (до первой миграции) — вернём ошибку с подсказкой.
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: 'Подключение к базе данных успешно!',
      users_count: userCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    const isMigrationNeeded = message.includes('does not exist') || message.includes('relation');

    return NextResponse.json(
      {
        success: false,
        message: isMigrationNeeded
          ? 'БД подключена, но таблицы не созданы. Запусти: npm run db:push'
          : 'Ошибка подключения к базе данных',
        error: message,
      },
      { status: 500 }
    );
  }
}
