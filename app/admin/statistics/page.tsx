import prisma from '@/lib/prisma';

async function getDetailedStats() {
  const [
    usersByRole,
    cabinsByStatus,
    bookingsByStatus,
    reviewsByStatus,
    topCabins,
    recentActivity,
  ] = await Promise.all([
    // Пользователи по ролям
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
    // Домики по статусам
    prisma.cabin.groupBy({
      by: ['status'],
      _count: true,
    }),
    // Бронирования по статусам
    prisma.booking.groupBy({
      by: ['status'],
      _count: true,
      _sum: {
        totalAmount: true,
      },
    }),
    // Отзывы по статусам
    prisma.review.groupBy({
      by: ['status'],
      _count: true,
    }),
    // Топ домиков
    prisma.cabin.findMany({
      take: 5,
      orderBy: { reviewsCount: 'desc' },
      select: {
        title: true,
        rating: true,
        reviewsCount: true,
        _count: {
          select: { bookings: true },
        },
      },
    }),
    // Последняя активность
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    usersByRole,
    cabinsByStatus,
    bookingsByStatus,
    reviewsByStatus,
    topCabins,
    recentActivity,
  };
}

export default async function StatisticsPage() {
  const stats = await getDetailedStats();

  return (
    <div>
      {/* Пользователи по ролям */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {stats.usersByRole.map((item) => (
          <div key={item.role} className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-title">
                {item.role === 'ADMIN'
                  ? 'Администраторы'
                  : item.role === 'OWNER'
                  ? 'Владельцы'
                  : 'Пользователи'}
              </span>
              <div className="admin-stat-icon blue">👥</div>
            </div>
            <div className="admin-stat-value">{item._count}</div>
          </div>
        ))}
      </div>

      {/* Домики по статусам */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Домики по статусам
        </h2>
        <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {stats.cabinsByStatus.map((item) => (
            <div key={item.status} className="admin-stat-card">
              <div className="admin-stat-title" style={{ marginBottom: '0.5rem' }}>
                {item.status === 'PUBLISHED'
                  ? 'Опубликовано'
                  : item.status === 'DRAFT'
                  ? 'Черновики'
                  : item.status === 'PENDING'
                  ? 'На модерации'
                  : item.status === 'BLOCKED'
                  ? 'Заблокировано'
                  : 'Архив'}
              </div>
              <div className="admin-stat-value">{item._count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Бронирования по статусам */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Бронирования по статусам
        </h2>
        <div className="admin-stats-grid">
          {stats.bookingsByStatus.map((item) => (
            <div key={item.status} className="admin-stat-card">
              <div className="admin-stat-title" style={{ marginBottom: '0.5rem' }}>
                {item.status === 'CONFIRMED'
                  ? 'Подтверждено'
                  : item.status === 'PENDING'
                  ? 'Ожидает'
                  : item.status === 'CANCELLED'
                  ? 'Отменено'
                  : item.status === 'COMPLETED'
                  ? 'Завершено'
                  : item.status}
              </div>
              <div className="admin-stat-value">{item._count}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                {item._sum.totalAmount
                  ? `${Number(item._sum.totalAmount).toLocaleString()} сом`
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Топ домиков */}
      <div style={{ marginTop: '2rem' }}>
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Топ-5 популярных домиков</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Рейтинг</th>
                <th>Отзывов</th>
                <th>Бронирований</th>
              </tr>
            </thead>
            <tbody>
              {stats.topCabins.map((cabin, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{cabin.title}</td>
                  <td>⭐ {cabin.rating.toString()}</td>
                  <td>{cabin.reviewsCount}</td>
                  <td>{cabin._count.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Последняя активность */}
      {stats.recentActivity.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">Последняя активность</h2>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Действие</th>
                  <th>Тип</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((log) => (
                  <tr key={log.id}>
                    <td>
                      {log.user.firstName} {log.user.lastName}
                    </td>
                    <td>{log.action}</td>
                    <td>{log.entityType}</td>
                    <td>{new Date(log.createdAt).toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
