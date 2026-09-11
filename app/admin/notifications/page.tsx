import prisma from '@/lib/prisma';

async function getNotifications() {
  return await prisma.notification.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Уведомления ({notifications.length})</h2>
        <button className="admin-btn admin-btn-primary">+ Создать уведомление</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Получатель</th>
            <th>Тип</th>
            <th>Заголовок</th>
            <th>Сообщение</th>
            <th>Статус</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{`${notification.user.firstName} ${notification.user.lastName}`}</td>
              <td>
                <span className="admin-badge admin-badge-info">{notification.type}</span>
              </td>
              <td style={{ fontWeight: 500 }}>{notification.title}</td>
              <td>{notification.message.slice(0, 80)}...</td>
              <td>
                <span
                  className={`admin-badge ${
                    notification.isRead ? 'admin-badge-success' : 'admin-badge-warning'
                  }`}
                >
                  {notification.isRead ? 'Прочитано' : 'Не прочитано'}
                </span>
              </td>
              <td>{new Date(notification.createdAt).toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
