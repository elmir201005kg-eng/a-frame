'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('admin');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получить данные текущего пользователя
    fetch('/api/admin/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error('Failed to fetch user:', err))
      .finally(() => setLoading(false));
  }, []);

  // Динамические заголовки страниц на основе переводов
  const getPageTitle = () => {
    if (pathname === '/admin') return t('dashboard.title');
    if (pathname === '/admin/users') return t('users.title');
    if (pathname === '/admin/owners') return t('owners.title');
    if (pathname === '/admin/cabins') return t('cabins.title');
    if (pathname === '/admin/bookings') return t('bookings.title');
    if (pathname === '/admin/reviews') return t('reviews.title');
    if (pathname === '/admin/regions') return t('regions.title');
    if (pathname === '/admin/amenities') return t('amenities.title');
    if (pathname === '/admin/statistics') return t('statistics.title');
    if (pathname === '/admin/settings') return t('settings.title');
    return 'Админ-панель';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{getPageTitle()}</h1>

      <div className="admin-header-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LanguageSwitcher />
        
        {!loading && user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="admin-user-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
              }}
            >
              <div
                className="admin-user-avatar"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {getInitials(user.name || user.email)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>
                  {user.name || 'Администратор'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {user.email}
                </div>
              </div>
              <svg
                className="w-4 h-4"
                style={{ width: '16px', height: '16px', color: '#6b7280' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                  }}
                  onClick={() => setShowDropdown(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '200px',
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    zIndex: 20,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#dc2626',
                      fontWeight: 500,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      style={{ width: '16px', height: '16px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {t('auth.logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
