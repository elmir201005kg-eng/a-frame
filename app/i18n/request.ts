import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async () => {
  // Получаем язык из cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  // Проверяем, что значение cookie соответствует названию папки (kg или ru)
  let locale = localeCookie?.value as Locale;
  
  // Если cookie не установлен или содержит недопустимое значение, используем defaultLocale
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Импортируем все файлы переводов из папки с названием языка
  const commonMessages = (await import(`./locales/${locale}/common.json`)).default;
  const landingMessages = (await import(`./locales/${locale}/landing.json`)).default;
  const adminMessages = (await import(`./locales/${locale}/admin.json`)).default;

  return {
    locale,
    messages: {
      common: commonMessages,
      landing: landingMessages,
      admin: adminMessages,
    },
  };
});
