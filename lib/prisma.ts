import { PrismaClient } from '@prisma/client';

// Singleton паттерн — один PrismaClient на всё приложение.
// В dev-режиме Next.js hot-reload создаёт новые модули,
// поэтому сохраняем инстанс в global чтобы не плодить соединения.

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global._prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

export default prisma;
