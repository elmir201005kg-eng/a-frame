import prisma from '@/lib/prisma';

async function getRegions() {
  return await prisma.region.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          locations: true,
        },
      },
    },
  });
}

export default async function RegionsPage() {
  const regions = await getRegions();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Регионы Кыргызстана ({regions.length})</h2>
        <button className="admin-btn admin-btn-primary">+ Добавить регион</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Slug</th>
            <th>Локаций</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.id}>
              <td>{region.id}</td>
              <td style={{ fontWeight: 500 }}>{region.name}</td>
              <td>
                <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                  {region.slug}
                </code>
              </td>
              <td>{region._count.locations}</td>
              <td>
                <span
                  className={`admin-badge ${
                    region.isActive ? 'admin-badge-success' : 'admin-badge-danger'
                  }`}
                >
                  {region.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </td>
              <td>{new Date(region.createdAt).toLocaleDateString('ru-RU')}</td>
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
