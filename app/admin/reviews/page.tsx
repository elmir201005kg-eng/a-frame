import prisma from '@/lib/prisma';

async function getReviews() {
  return await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true } },
      cabin: { select: { title: true } },
    },
  });
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Все отзывы ({reviews.length})</h2>
        <div className="admin-table-actions">
          <select className="admin-form-select" style={{ width: '200px' }}>
            <option value="">Все статусы</option>
            <option value="PENDING">На модерации</option>
            <option value="PUBLISHED">Опубликовано</option>
            <option value="HIDDEN">Скрыто</option>
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Домик</th>
            <th>Рейтинг</th>
            <th>Отзыв</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{`${review.user.firstName} ${review.user.lastName}`}</td>
              <td>{review.cabin.title}</td>
              <td>
                <div style={{ fontSize: '1.25rem' }}>{'⭐'.repeat(review.rating)}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {review.rating}/5
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '400px' }}>
                  {review.text ? review.text.slice(0, 150) + (review.text.length > 150 ? '...' : '') : '—'}
                </div>
              </td>
              <td>
                <span
                  className={`admin-badge ${
                    review.status === 'PUBLISHED'
                      ? 'admin-badge-success'
                      : review.status === 'PENDING'
                      ? 'admin-badge-warning'
                      : 'admin-badge-danger'
                  }`}
                >
                  {review.status === 'PUBLISHED'
                    ? 'Опубликован'
                    : review.status === 'PENDING'
                    ? 'На модерации'
                    : 'Скрыт'}
                </span>
              </td>
              <td>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {review.status === 'PENDING' && (
                    <>
                      <button className="admin-btn admin-btn-primary">Одобрить</button>
                      <button className="admin-btn admin-btn-danger">Скрыть</button>
                    </>
                  )}
                  {review.status === 'PUBLISHED' && (
                    <button className="admin-btn admin-btn-danger">Скрыть</button>
                  )}
                  {review.status === 'HIDDEN' && (
                    <button className="admin-btn admin-btn-primary">Показать</button>
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
