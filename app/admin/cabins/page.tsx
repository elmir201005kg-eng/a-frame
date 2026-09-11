import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getCabins() {
  return await prisma.cabin.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { firstName: true, lastName: true } },
      location: { select: { city: true, region: { select: { name: true } } } },
      _count: {
        select: {
          bookings: true,
          reviews: true,
          images: true,
        },
      },
    },
  });
}

export default async function CabinsPage() {
  const cabins = await getCabins();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Все домики ({cabins.length})</h2>
        <div className="admin-table-actions">
          <input
            type="search"
            placeholder="Поиск по названию..."
            className="admin-search-input"
          />
          <Link href="/admin/cabins/add" className="admin-btn admin-btn-primary">
            + Добавить домик
          </Link>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Владелец</th>
            <th>Локация</th>
            <th>Цена/ночь</th>
            <th>Гостей</th>
            <th>Рейтинг</th>
            <th>Бронирований</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin) => (
            <tr key={cabin.id}>
              <td>
                <div style={{ fontWeight: 500 }}>{cabin.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {cabin._count.images} фото
                </div>
              </td>
              <td>
                {cabin.owner.firstName} {cabin.owner.lastName}
              </td>
              <td>
                <div>{cabin.location.city}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {cabin.location.region.name}
                </div>
              </td>
              <td>{Number(cabin.pricePerNight).toLocaleString()} с</td>
              <td>{cabin.maxGuests}</td>
              <td>
                <div>⭐ {cabin.rating.toString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  ({cabin.reviewsCount} отзывов)
                </div>
              </td>
              <td>{cabin._count.bookings}</td>
              <td>
                <span
                  className={`admin-badge ${
                    cabin.status === 'PUBLISHED'
                      ? 'admin-badge-success'
                      : cabin.status === 'DRAFT'
                      ? 'admin-badge-warning'
                      : cabin.status === 'PENDING'
                      ? 'admin-badge-info'
                      : 'admin-badge-danger'
                  }`}
                >
                  {cabin.status === 'PUBLISHED'
                    ? 'Опубликован'
                    : cabin.status === 'DRAFT'
                    ? 'Черновик'
                    : cabin.status === 'PENDING'
                    ? 'На модерации'
                    : cabin.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/cabins/edit/${cabin.id}`} className="admin-btn admin-btn-secondary">
                    Редактировать
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
