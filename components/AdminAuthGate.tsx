'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { validateStoredSession, type AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (isLoginPage) {
        setChecking(false);
        return;
      }

      try {
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
      } catch {
        if (!active) return;
        router.replace('/admin/login');
      } finally {
        if (active) setChecking(false);
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isLoginPage) {
        router.replace('/admin/login');
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage, pathname, router]);

  if (checking) return <LoadingState />;
  if (!isLoginPage && !user) return <LoadingState />;
  return <>{children}</>;
}

function canAccessAdminPath(user: AuthUser, pathname: string) {
  if (user.role === 'admin') return true;
  return !['/admin/authors', '/admin/theming', '/admin/settings'].some((path) => pathname.startsWith(path));
}
