'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('client' | 'admin' | 'superadmin')[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = ['client', 'admin', 'superadmin'],
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const fallbackRedirect = redirectTo || `/${locale}/auth/login`;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(fallbackRedirect);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      let destination = '/';

      switch (user.role) {
        case 'superadmin':
          destination = `/${locale}/admin/dashboard`;
          break;
        case 'admin':
          destination = `/${locale}/admin/dashboard`;
          break;
        case 'client':
          destination = `/${locale}/client/dashboard`;
          break;
      }

      router.push(destination);
    }
  }, [user, isLoading, allowedRoles, redirectTo, router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
