import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiAuthResponse, type ApiUser } from './apiTypes';

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role?: ApiUser['role'];
};

export async function login(email: string, password: string): Promise<ApiAuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return readJsonOrThrow<ApiAuthResponse>(res, 'Credenciais inválidas');
}

export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await fetch(`${API_URL}/users`, { headers: adminHeaders() });
  return readJsonOrThrow<ApiUser[]>(res, 'Falha ao buscar usuários');
}

export async function createUser(payload: CreateUserPayload): Promise<ApiUser> {
  const res = await fetch(`${API_URL}/users`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(payload) });
  return readJsonOrThrow<ApiUser>(res, 'Falha ao criar autor');
}
