import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiPost, type PostPayload } from './apiTypes';

export async function fetchPosts(): Promise<ApiPost[]> {
  const res = await fetch(`${API_URL}/posts`);
  return readJsonOrThrow<ApiPost[]>(res, 'Falha ao buscar posts');
}

export async function fetchPostById(id: number | string): Promise<ApiPost> {
  const res = await fetch(`${API_URL}/posts/${id}`);
  return readJsonOrThrow<ApiPost>(res, 'Falha ao buscar post');
}

export async function fetchPostBySlug(slug: string): Promise<ApiPost> {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`);
  return readJsonOrThrow<ApiPost>(res, 'Falha ao buscar post');
}

export async function recordView(postId: number | string) {
  try {
    const res = await fetch(`${API_URL}/posts/${postId}/views`, { method: 'POST' });
    return res.json();
  } catch {
    return undefined;
  }
}

export async function recordLike(postId: number | string) {
  const res = await fetch(`${API_URL}/posts/${postId}/likes`, { method: 'POST' });
  return readJsonOrThrow(res, 'Falha ao registrar like');
}

export async function createPost(data: PostPayload): Promise<ApiPost> {
  const res = await fetch(`${API_URL}/posts`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<ApiPost>(res, 'Falha ao criar post');
}

export async function updatePost(id: number | string, data: Partial<PostPayload>) {
  const res = await fetch(`${API_URL}/posts/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar post');
}

export async function deletePost(id: number | string) {
  const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar post');
}
