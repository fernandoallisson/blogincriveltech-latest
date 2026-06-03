import { supabase } from './supabase';
import { type ApiAuthResponse, type ApiUser } from './apiTypes';

export async function login(email: string, password: string): Promise<ApiAuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Credenciais inválidas');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, role')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    token: data.session.access_token,
    user: {
      id: data.user.id,
      name: profile?.name ?? '',
      email: data.user.email!,
      role: profile?.role ?? 'user',
    },
  };
}

export async function fetchUsers(): Promise<ApiUser[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, name, role, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Falha ao buscar usuários');

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: '',
    role: row.role as ApiUser['role'],
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function createUser(payload: { name: string; email: string; password: string; role?: ApiUser['role'] }): Promise<ApiUser> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('Não autenticado');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const res = await fetch(`${supabaseUrl}/functions/v1/create-admin-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionData.session.access_token}`,
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role ?? 'author',
    }),
  });

  const result = await res.json();
  if (!res.ok || result.error) throw new Error(result.error ?? 'Falha ao criar autor');

  return {
    id: result.id,
    name: payload.name,
    email: payload.email,
    role: payload.role ?? 'author',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
