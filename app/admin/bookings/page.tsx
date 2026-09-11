import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      cabin: { select: { title: true } },
    },
  });
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Все бронирования ({bookings.length})</h2>
        <div className="admin-table-actions">
          <input
            type="search"
            placeholder="Поиск по номеру или имени..."
            className="admin-search-input"
          />
          <select className="admin-form-select" style={{ width: '200px' }}>
            <option value="">Все статусы</option>
            <option value="PENDING">Ожидает</option>
            <option value="CONFIRMED">Подтверждено</option>
            <option value="COMPLETED">Завершено</option>
            <option value="CANCELLED">Отменено</option>
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Пользователь</th>
            <th>Домик</th>
            <th>Заезд</th>
            <th>Выезд</th>
            <th>Ночей</th>
            <th>Гостей</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <div style={{ fontWeight: 600 }}>#{booking.bookingNumber}</div>
              </td>
              <td>
                <div>{`${booking.user.firstName} ${booking.user.lastName}`}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {booking.user.email}
                </div>
              </td>
              <td>{booking.cabin.title}</td>
              <td>{new Date(booking.checkIn).toLocaleDateString('ru-RU')}</td>
              <td>{new Date(booking.checkOut).toLocaleDateString('ru-RU')}</td>
              <td>{booking.nights}</td>
              <td>{booking.guestsCount}</td>
              <td>
                <div style={{ fontWeight: 600 }}>
                  {Number(booking.totalAmount).toLocaleString()} с
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {Number(booking.pricePerNight).toLocaleString()} с/ночь
                </div>
              </td>
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
                    : booking.status === 'COMPLETED'
                    ? 'Завершено'
                    : booking.status}
                </span>
              </td>
              <td>{new Date(booking.createdAt).toLocaleDateString('ru-RU')}</td>
              <td>
                <Link href={`/admin/bookings/${booking.id}`} className="admin-btn admin-btn-secondary">
                  Детали
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
