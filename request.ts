import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'az', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'az';

export default getRequestConfig(async (params) => {
  const locale = params.locale ?? defaultLocale;
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale: locale as Locale,
  };
});
