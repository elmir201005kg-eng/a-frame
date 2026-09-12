import { NextRequest, NextResponse } from 'next/server';
import bot from '@/lib/telegram-bot';
import { webhookCallback } from 'grammy';

// Создаём webhook handler для Next.js
const handler = webhookCallback(bot, 'std/http');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Передаём обновление боту
    const response = await handler(
      new Request(request.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    );

    return response;
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET для проверки работы webhook
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Telegram webhook is running',
  });
}
