'use client';

import { API_URL, login, type ApiAuthResponse } from '@/lib/api';

const TOKEN_KEY = 'blog-incrivel-admin-token';
const USER_KEY = 'blog-incrivel-admin-user';

export type AuthUser = {
  id: number;
  email: string;
  role: string;
  name?: string;
};

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuthSession(auth: ApiAuthResponse) {
  window.localStorage.setItem(TOKEN_KEY, auth.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const auth = await login(email, password);
  saveAuthSession(auth);
  return auth.user;
}

export async function fetchCurrentUser(token = getStoredToken()): Promise<AuthUser> {
  if (!token) throw new Error('Sessão não encontrada');
  const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Sessão expirada');
  const data = (await res.json()) as { user: AuthUser };
  return data.user;
}

export async function validateStoredSession(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const user = await fetchCurrentUser(token);
    const storedUser = getStoredUser();
    const mergedUser = { ...user, name: storedUser?.name ?? user.name };
    window.localStorage.setItem(USER_KEY, JSON.stringify(mergedUser));
    return mergedUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
