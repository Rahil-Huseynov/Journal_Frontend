import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './request';

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  matcher: ['/', '/(az|en|ru)/:path*'],
};
