import prisma from '@/lib/prisma';

async function getAmenities() {
  return await prisma.amenity.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          cabins: true,
        },
      },
    },
  });
}

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Удобства ({amenities.length})</h2>
        <button className="admin-btn admin-btn-primary">+ Добавить удобство</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Slug</th>
            <th>Иконка</th>
            <th>Использований</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {amenities.map((amenity) => (
            <tr key={amenity.id}>
              <td>{amenity.id}</td>
              <td style={{ fontWeight: 500 }}>{amenity.name}</td>
              <td>
                <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                  {amenity.slug}
                </code>
              </td>
              <td>{amenity.icon || '—'}</td>
              <td>{amenity._count.cabins} домиков</td>
              <td>
                <span
                  className={`admin-badge ${
                    amenity.isActive ? 'admin-badge-success' : 'admin-badge-danger'
                  }`}
                >
                  {amenity.isActive ? 'Активно' : 'Неактивно'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="admin-btn admin-btn-secondary">Редактировать</button>
                  <button className="admin-btn admin-btn-danger">Удалить</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
