import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalUsers,
      totalOwners,
      totalCabins,
      totalBookings,
      totalRevenue,
      pendingReviews,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.cabin.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      }),
      prisma.review.count({ where: { status: 'PENDING' } }),
      prisma.user.count({
        where: {
          status: 'ACTIVE',
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 дней
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalOwners,
      totalCabins,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingReviews,
      activeUsers,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения статистики' }, { status: 500 });
  }
}
