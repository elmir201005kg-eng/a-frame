'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    title: 'Главное',
    items: [
      { name: 'Дашборд', href: '/admin', icon: '📊' },
      { name: 'Статистика', href: '/admin/statistics', icon: '📈' },
    ],
  },
  {
    title: 'Управление',
    items: [
      { name: 'Пользователи', href: '/admin/users', icon: '👥' },
      { name: 'Владельцы', href: '/admin/owners', icon: '🏢' },
      { name: 'Домики', href: '/admin/cabins', icon: '🏠' },
      { name: 'Бронирования', href: '/admin/bookings', icon: '📅' },
      { name: 'Отзывы', href: '/admin/reviews', icon: '⭐' },
    ],
  },
  {
    title: 'Справочники',
    items: [
      { name: 'Регионы', href: '/admin/regions', icon: '🗺️' },
      { name: 'Локации', href: '/admin/locations', icon: '📍' },
      { name: 'Удобства', href: '/admin/amenities', icon: '🛋️' },
    ],
  },
  {
    title: 'Финансы',
    items: [
      { name: 'Акции', href: '/admin/promotions', icon: '🎁' },
      { name: 'Платежи', href: '/admin/payments', icon: '💳' },
      { name: 'Выплаты', href: '/admin/payouts', icon: '💰' },
    ],
  },
  {
    title: 'Система',
    items: [
      { name: 'Уведомления', href: '/admin/notifications', icon: '🔔' },
      { name: 'Журнал действий', href: '/admin/audit-logs', icon: '📋' },
      { name: 'Настройки', href: '/admin/settings', icon: '⚙️' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <h1>A-FRAME Admin</h1>
      </div>

      <nav className="admin-sidebar-nav">
        {navigation.map((section) => (
          <div key={section.title} className="admin-nav-section">
            <div className="admin-nav-title">{section.title}</div>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
