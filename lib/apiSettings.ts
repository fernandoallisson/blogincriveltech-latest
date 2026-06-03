import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiSetting } from './apiTypes';

export async function subscribeNewsletter(data: { email: string; name?: string }) {
  const res = await fetch(`${API_URL}/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, status: 'active' }) });
  return readJsonOrThrow(res, 'Falha ao inscrever no newsletter');
}

export async function fetchSettings(): Promise<ApiSetting[]> {
  const res = await fetch(`${API_URL}/settings`, { headers: adminHeaders() });
  return readJsonOrThrow<ApiSetting[]>(res, 'Falha ao buscar configurações');
}

export async function createSetting(data: { key: string; value: string }) {
  const res = await fetch(`${API_URL}/settings`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiSetting>(res, 'Falha ao criar configuração');
}

export async function updateSetting(id: number | string, data: { key: string; value: string }) {
  const res = await fetch(`${API_URL}/settings/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar configuração');
}

export async function deleteSetting(id: number | string) {
  const res = await fetch(`${API_URL}/settings/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar configuração');
}

export function getSettingValue(settings: ApiSetting[], key: string): string | undefined {
  return settings.find((setting) => setting.key === key)?.value;
}
