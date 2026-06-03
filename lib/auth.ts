'use client';

import { supabase } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Credenciais inválidas');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, role')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    email: data.user.email!,
    role: profile?.role ?? 'user',
    name: profile?.name ?? '',
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function validateStoredSession(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, role')
    .eq('id', session.user.id)
    .maybeSingle();

  return {
    id: session.user.id,
    email: session.user.email!,
    role: profile?.role ?? 'user',
    name: profile?.name ?? '',
  };
}

// Legacy stubs kept for backwards compatibility with any remaining callers
export function getStoredToken(): string | null { return null; }
export function getStoredUser(): AuthUser | null { return null; }
export function saveAuthSession(_auth: unknown) {}
export function clearAuthSession() { supabase.auth.signOut(); }
export function getAuthHeaders(): HeadersInit { return {}; }

export async function fetchCurrentUser(): Promise<AuthUser> {
  const user = await validateStoredSession();
  if (!user) throw new Error('Sessão não encontrada');
  return user;
}
