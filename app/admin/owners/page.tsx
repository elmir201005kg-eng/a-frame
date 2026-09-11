import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getOwners() {
  return await prisma.user.findMany({
    where: { role: 'OWNER' },
    orderBy: { createdAt: 'desc' },
    include: {
      ownerProfile: true,
      cabins: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      _count: {
        select: {
          cabins: true,
        },
      },
    },
  });
}

export default async function OwnersPage() {
  const owners = await getOwners();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Владельцы домиков ({owners.length})</h2>
        <div className="admin-table-actions">
          <input
            type="search"
            placeholder="Поиск владельца..."
            className="admin-search-input"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Владелец</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Бизнес</th>
            <th>Домиков</th>
            <th>Статус проверки</th>
            <th>Статус</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>
                <div style={{ fontWeight: 500 }}>
                  {owner.firstName} {owner.lastName}
                </div>
              </td>
              <td>{owner.email}</td>
              <td>{owner.phone || '—'}</td>
              <td>{owner.ownerProfile?.businessName || '—'}</td>
              <td>
                <div style={{ fontWeight: 600 }}>{owner._count.cabins}</div>
                {owner.cabins.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {owner.cabins.filter((c) => c.status === 'PUBLISHED').length} опубликовано
                  </div>
                )}
              </td>
              <td>
                {owner.ownerProfile ? (
                  <span
                    className={`admin-badge ${
                      owner.ownerProfile.verificationStatus === 'VERIFIED'
                        ? 'admin-badge-success'
                        : owner.ownerProfile.verificationStatus === 'PENDING'
                        ? 'admin-badge-warning'
                        : 'admin-badge-danger'
                    }`}
                  >
                    {owner.ownerProfile.verificationStatus === 'VERIFIED'
                      ? 'Проверен'
                      : owner.ownerProfile.verificationStatus === 'PENDING'
                      ? 'На проверке'
                      : 'Отклонён'}
                  </span>
                ) : (
                  <span className="admin-badge admin-badge-warning">Нет профиля</span>
                )}
              </td>
              <td>
                <span
                  className={`admin-badge ${
                    owner.status === 'ACTIVE'
                      ? 'admin-badge-success'
                      : owner.status === 'BLOCKED'
                      ? 'admin-badge-danger'
                      : 'admin-badge-warning'
                  }`}
                >
                  {owner.status === 'ACTIVE'
                    ? 'Активен'
                    : owner.status === 'BLOCKED'
                    ? 'Заблокирован'
                    : 'Неактивен'}
                </span>
              </td>
              <td>{new Date(owner.createdAt).toLocaleDateString('ru-RU')}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/users/${owner.id}`} className="admin-btn admin-btn-secondary">
                    Просмотр
                  </Link>
                  {owner.ownerProfile?.verificationStatus === 'PENDING' && (
                    <button className="admin-btn admin-btn-primary">Проверить</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
