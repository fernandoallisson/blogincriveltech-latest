import { adminAuthHeaders, adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiMedia } from './apiTypes';

type MediaPayload = {
  filename: string;
  url: string;
  type?: string;
  size?: number | null;
  uploaded_by?: number | null;
  post_id?: number | null;
};

export async function fetchMedia(): Promise<ApiMedia[]> {
  const res = await fetch(`${API_URL}/media`, { headers: adminHeaders() });
  return readJsonOrThrow<ApiMedia[]>(res, 'Falha ao buscar midias');
}

export async function createMedia(data: MediaPayload) {
  const res = await fetch(`${API_URL}/media`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiMedia>(res, 'Falha ao criar midia');
}

export async function uploadMedia(file: File, data: { post_id?: number | null; media_id?: number | null } = {}) {
  const formData = new FormData();
  formData.append('image', file);
  if (data.post_id) formData.append('post_id', String(data.post_id));
  if (data.media_id) formData.append('media_id', String(data.media_id));

  const res = await fetch(`${API_URL}/media/upload`, { method: 'POST', headers: adminAuthHeaders(), body: formData });
  return readJsonOrThrow<ApiMedia>(res, 'Falha ao enviar midia');
}

export async function updateMedia(id: number | string, data: MediaPayload) {
  const res = await fetch(`${API_URL}/media/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar midia');
}

export async function deleteMedia(id: number | string) {
  const res = await fetch(`${API_URL}/media/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar midia');
}
