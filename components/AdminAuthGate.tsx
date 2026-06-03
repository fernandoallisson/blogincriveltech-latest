'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { AdminAuthProvider, useAdminAuth } from '@/components/AdminAuthContext';

function LoadingState() {
  return (
    <div className="grid min-h-screen place-items-center bg-app p-6">
      <div className="flex flex-col items-center gap-3.5 text-muted">
        <Logo />
        <div className="font-mono text-[13px]">Validando acesso...</div>
      </div>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { user, loading } = useAdminAuth();

  useEffect(() => {
    if (loading || isLoginPage) return;

    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!canAccessAdminPath(user, pathname)) {
      router.replace('/admin/dashboard');
    }
  }, [loading, user, isLoginPage, pathname, router]);

  if (loading) return <LoadingState />;
  if (!isLoginPage && !user) return <LoadingState />;
  return <>{children}</>;
}

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AdminAuthProvider>
  );
}

function canAccessAdminPath(user: { role: string }, pathname: string) {
  if (user.role === 'admin') return true;
  return !['/admin/authors', '/admin/theming', '/admin/settings'].some((path) => pathname.startsWith(path));
}
