"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl mb-2">Səhifə tapılmadı</h2>
      <p className="mb-6 max-w-md text-center">
        Axtardığınız səhifə mövcud deyil və ya keçərsiz linkdir.
      </p>
      <Link href={`/${locale}/auth/login`} className="text-blue-600 hover:underline">
        Giriş səhifəsinə qayıt
      </Link>
    </div>
  );
}
