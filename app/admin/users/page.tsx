import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          bookings: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Все пользователи ({users.length})</h2>
        <div className="admin-table-actions">
          <input
            type="search"
            placeholder="Поиск по имени или email..."
            className="admin-search-input"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Бронирований</th>
            <th>Отзывов</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id.slice(0, 8)}...</td>
              <td>
                <div style={{ fontWeight: 500 }}>
                  {user.firstName} {user.lastName}
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.phone || '—'}</td>
              <td>
                <span
                  className={`admin-badge ${
                    user.role === 'ADMIN'
                      ? 'admin-badge-danger'
                      : user.role === 'OWNER'
                      ? 'admin-badge-warning'
                      : 'admin-badge-info'
                  }`}
                >
                  {user.role === 'ADMIN'
                    ? 'Админ'
                    : user.role === 'OWNER'
                    ? 'Владелец'
                    : 'Пользователь'}
                </span>
              </td>
              <td>
                <span
                  className={`admin-badge ${
                    user.status === 'ACTIVE'
                      ? 'admin-badge-success'
                      : user.status === 'BLOCKED'
                      ? 'admin-badge-danger'
                      : 'admin-badge-warning'
                  }`}
                >
                  {user.status === 'ACTIVE'
                    ? 'Активен'
                    : user.status === 'BLOCKED'
                    ? 'Заблокирован'
                    : 'Неактивен'}
                </span>
              </td>
              <td>{user._count.bookings}</td>
              <td>{user._count.reviews}</td>
              <td>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
              <td>
                <Link href={`/admin/users/${user.id}`} className="admin-btn admin-btn-secondary">
                  Просмотр
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
