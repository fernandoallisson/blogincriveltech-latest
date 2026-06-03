'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateStoredSession, type AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type AdminAuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue>({ user: null, loading: true });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateStoredSession().then((u) => {
      setUser(u);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        validateStoredSession().then((u) => setUser(u));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
