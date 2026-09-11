import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      ownerProfile: true,
      bookings: {
        include: { cabin: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      reviews: {
        include: { cabin: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      favorites: {
        include: { cabin: { select: { title: true } } },
        take: 10,
      },
    },
  });
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/users" className="admin-btn admin-btn-secondary">
          ← Назад к списку
        </Link>
      </div>

      {/* Информация о пользователе */}
      <div className="admin-form">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
          Информация о пользователе
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div>
            <div className="admin-form-label">ID</div>
            <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.375rem' }}>
              {user.id}
            </div>
          </div>

          <div>
            <div className="admin-form-label">Роль</div>
            <span
              className={`admin-badge ${
                user.role === 'ADMIN'
                  ? 'admin-badge-danger'
                  : user.role === 'OWNER'
                  ? 'admin-badge-warning'
                  : 'admin-badge-info'
              }`}
            >
              {user.role}
            </span>
          </div>

          <div>
            <div className="admin-form-label">Имя</div>
            <div>{user.firstName}</div>
          </div>

          <div>
            <div className="admin-form-label">Фамилия</div>
            <div>{user.lastName}</div>
          </div>

          <div>
            <div className="admin-form-label">Email</div>
            <div>{user.email}</div>
          </div>

          <div>
            <div className="admin-form-label">Телефон</div>
            <div>{user.phone || '—'}</div>
          </div>

          <div>
            <div className="admin-form-label">Статус</div>
            <span
              className={`admin-badge ${
                user.status === 'ACTIVE'
                  ? 'admin-badge-success'
                  : user.status === 'BLOCKED'
                  ? 'admin-badge-danger'
                  : 'admin-badge-warning'
              }`}
            >
              {user.status}
            </span>
          </div>

          <div>
            <div className="admin-form-label">Подтверждён</div>
            <div>{user.isVerified ? '✅ Да' : '❌ Нет'}</div>
          </div>

          <div>
            <div className="admin-form-label">Дата регистрации</div>
            <div>{new Date(user.createdAt).toLocaleString('ru-RU')}</div>
          </div>

          <div>
            <div className="admin-form-label">Последнее обновление</div>
            <div>{new Date(user.updatedAt).toLocaleString('ru-RU')}</div>
          </div>
        </div>

        {user.ownerProfile && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Профиль владельца</h3>
            <div><strong>Бизнес:</strong> {user.ownerProfile.businessName || '—'}</div>
            <div><strong>Описание:</strong> {user.ownerProfile.description || '—'}</div>
            <div><strong>Контактный телефон:</strong> {user.ownerProfile.contactPhone || '—'}</div>
            <div>
              <strong>Статус проверки:</strong>{' '}
              <span className="admin-badge admin-badge-warning">
                {user.ownerProfile.verificationStatus}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Бронирования */}
      <div className="admin-table-container" style={{ marginTop: '2rem' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Бронирования ({user.bookings.length})</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Домик</th>
              <th>Даты</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {user.bookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.bookingNumber}</td>
                <td>{booking.cabin.title}</td>
                <td>
                  {new Date(booking.checkIn).toLocaleDateString('ru-RU')} -{' '}
                  {new Date(booking.checkOut).toLocaleDateString('ru-RU')}
                </td>
                <td>{Number(booking.totalAmount).toLocaleString()} с</td>
                <td>
                  <span className="admin-badge admin-badge-success">{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Отзывы */}
      <div className="admin-table-container" style={{ marginTop: '2rem' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Отзывы ({user.reviews.length})</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Домик</th>
              <th>Рейтинг</th>
              <th>Текст</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {user.reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.cabin.title}</td>
                <td>{'⭐'.repeat(review.rating)}</td>
                <td>{review.text?.slice(0, 100)}...</td>
                <td>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
