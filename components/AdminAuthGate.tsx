'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { validateStoredSession, type AuthUser } from '@/lib/auth';

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

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [checking, setChecking] = useState(!isLoginPage);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (isLoginPage) {
        setChecking(false);
        return;
      }

      setChecking(true);
      const currentUser = await validateStoredSession();
      if (!active) return;

      if (!currentUser) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!canAccessAdminPath(currentUser, pathname)) {
        router.replace('/admin/dashboard');
        return;
      }

      setUser(currentUser);
      setChecking(false);
    }

    checkSession();
    return () => { active = false; };
  }, [isLoginPage, pathname, router]);

  if (checking && !user) return <LoadingState />;
  return <>{children}</>;
}

function canAccessAdminPath(user: AuthUser, pathname: string) {
  if (user.role === 'admin') return true;
  return !['/admin/authors', '/admin/theming', '/admin/settings'].some((path) => pathname.startsWith(path));
}
