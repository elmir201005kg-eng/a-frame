import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [
    totalUsers,
    totalOwners,
    totalCabins,
    totalBookings,
    pendingBookings,
    totalRevenue,
    pendingReviews,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'OWNER' } }),
    prisma.cabin.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
    }),
    prisma.review.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    totalUsers,
    totalOwners,
    totalCabins,
    totalBookings,
    pendingBookings,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    pendingReviews,
  };
}

async function getRecentBookings() {
  return await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true } },
      cabin: { select: { title: true } },
    },
  });
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentBookings = await getRecentBookings();

  return (
    <div>
      {/* Статистика */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Всего пользователей</span>
            <div className="admin-stat-icon blue">👥</div>
          </div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-change positive">+12% за месяц</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Владельцев</span>
            <div className="admin-stat-icon green">🏢</div>
          </div>
          <div className="admin-stat-value">{stats.totalOwners}</div>
          <div className="admin-stat-change positive">+5% за месяц</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Домиков</span>
            <div className="admin-stat-icon yellow">🏠</div>
          </div>
          <div className="admin-stat-value">{stats.totalCabins}</div>
          <div className="admin-stat-change positive">+8 за неделю</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Бронирований</span>
            <div className="admin-stat-icon blue">📅</div>
          </div>
          <div className="admin-stat-value">{stats.totalBookings}</div>
          <div className="admin-stat-change positive">+24% за месяц</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Ожидают подтверждения</span>
            <div className="admin-stat-icon yellow">⏳</div>
          </div>
          <div className="admin-stat-value">{stats.pendingBookings}</div>
          <Link href="/admin/bookings" className="admin-btn admin-btn-secondary" style={{ marginTop: '1rem' }}>
            Просмотреть
          </Link>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Общий доход</span>
            <div className="admin-stat-icon green">💰</div>
          </div>
          <div className="admin-stat-value">{Number(stats.totalRevenue).toLocaleString()} с</div>
          <div className="admin-stat-change positive">+18% за месяц</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Отзывы на модерации</span>
            <div className="admin-stat-icon red">⭐</div>
          </div>
          <div className="admin-stat-value">{stats.pendingReviews}</div>
          <Link href="/admin/reviews" className="admin-btn admin-btn-secondary" style={{ marginTop: '1rem' }}>
            Модерировать
          </Link>
        </div>
      </div>

      {/* Последние бронирования */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Последние бронирования</h2>
          <Link href="/admin/bookings" className="admin-btn admin-btn-primary">
            Все бронирования
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Пользователь</th>
              <th>Домик</th>
              <th>Даты</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.bookingNumber}</td>
                <td>{`${booking.user.firstName} ${booking.user.lastName}`}</td>
                <td>{booking.cabin.title}</td>
                <td>
                  {new Date(booking.checkIn).toLocaleDateString('ru-RU')} -{' '}
                  {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                </td>
                <td>{Number(booking.totalAmount).toLocaleString()} с</td>
                <td>
                  <span
                    className={`admin-badge ${
                      booking.status === 'CONFIRMED'
                        ? 'admin-badge-success'
                        : booking.status === 'PENDING'
                        ? 'admin-badge-warning'
                        : booking.status === 'CANCELLED'
                        ? 'admin-badge-danger'
                        : 'admin-badge-info'
                    }`}
                  >
                    {booking.status === 'CONFIRMED'
                      ? 'Подтверждено'
                      : booking.status === 'PENDING'
                      ? 'Ожидает'
                      : booking.status === 'CANCELLED'
                      ? 'Отменено'
                      : booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
