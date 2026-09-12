'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/app/i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>('ru');

  useEffect(() => {
    // Читаем текущий язык из cookie при монтировании
    const locale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale;
    
    if (locale && locales.includes(locale)) {
      setCurrentLocale(locale);
    }
  }, []);

  const handleChange = (newLocale: Locale) => {
    // Устанавливаем cookie с названием папки языка (kg или ru)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    setCurrentLocale(newLocale);
    
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
