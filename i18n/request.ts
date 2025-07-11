export const locales = ['en', 'az', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'az';
