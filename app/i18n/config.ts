export const locales = ['kg', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  kg: 'Кыргызча',
  ru: 'Русский',
};
