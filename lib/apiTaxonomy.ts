import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiCategory, type ApiTag } from './apiTypes';

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_URL}/categories`);
  return readJsonOrThrow<ApiCategory[]>(res, 'Falha ao buscar categorias');
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const all = await fetchCategories();
  return all.find((category) => category.slug === slug) ?? null;
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  const res = await fetch(`${API_URL}/categories`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiCategory>(res, 'Falha ao criar categoria');
}

export async function updateCategory(id: number | string, data: { name: string; slug: string; description?: string | null }) {
  const res = await fetch(`${API_URL}/categories/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar categoria');
}

export async function deleteCategory(id: number | string) {
  const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar categoria');
}

export async function fetchTags(): Promise<ApiTag[]> {
  const res = await fetch(`${API_URL}/tags`);
  return readJsonOrThrow<ApiTag[]>(res, 'Falha ao buscar tags');
}

export async function createTag(data: { name: string; slug: string }) {
  const res = await fetch(`${API_URL}/tags`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiTag>(res, 'Falha ao criar tag');
}

export async function updateTag(id: number | string, data: { name: string; slug: string }) {
  const res = await fetch(`${API_URL}/tags/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar tag');
}

export async function deleteTag(id: number | string) {
  const res = await fetch(`${API_URL}/tags/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar tag');
}
