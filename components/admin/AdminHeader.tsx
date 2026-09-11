'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin': 'Дашборд',
  '/admin/users': 'Управление пользователями',
  '/admin/owners': 'Управление владельцами',
  '/admin/cabins': 'Управление домиками',
  '/admin/bookings': 'Управление бронированиями',
  '/admin/reviews': 'Управление отзывами',
  '/admin/regions': 'Регионы',
  '/admin/locations': 'Локации',
  '/admin/amenities': 'Удобства',
  '/admin/promotions': 'Акции и промо',
  '/admin/payments': 'Платежи',
  '/admin/payouts': 'Выплаты владельцам',
  '/admin/notifications': 'Уведомления',
  '/admin/statistics': 'Статистика',
  '/admin/audit-logs': 'Журнал действий',
  '/admin/settings': 'Настройки',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'Админ-панель';

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{title}</h1>

      <div className="admin-header-user">
        <div className="admin-user-avatar">А</div>
        <div>
          <div style={{ fontWeight: 600 }}>Администратор</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin@aframe.kg</div>
        </div>
      </div>
    </header>
  );
}
