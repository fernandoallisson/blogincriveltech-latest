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
  const { data: existing } = await supabase.auth.getSession();
  if (!existing.session) throw new Error('Não autenticado');

  const { data, error } = await supabase.auth.admin?.createUser({
    email: payload.email,
    password: payload.password,
    user_metadata: { name: payload.name, role: payload.role ?? 'author' },
    email_confirm: true,
  }) as { data: { user: { id: string; email: string; created_at: string } } | null; error: Error | null };

  if (error || !data?.user) throw new Error('Falha ao criar autor');

  await supabase.from('user_profiles').upsert({
    id: data.user.id,
    name: payload.name,
    role: payload.role ?? 'author',
  });

  return {
    id: data.user.id,
    name: payload.name,
    email: payload.email,
    role: payload.role ?? 'author',
    created_at: data.user.created_at,
    updated_at: data.user.created_at,
  };
}
