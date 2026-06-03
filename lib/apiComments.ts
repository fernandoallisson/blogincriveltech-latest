import { adminHeaders, API_URL, readJsonOrThrow } from './apiCore';
import { type ApiComment } from './apiTypes';

export async function fetchComments(): Promise<ApiComment[]> {
  const res = await fetch(`${API_URL}/comments`);
  return readJsonOrThrow<ApiComment[]>(res, 'Falha ao buscar comentários');
}

export async function fetchCommentsByPost(postId: number | string): Promise<ApiComment[]> {
  const all = await fetchComments();
  return all.filter((comment) => comment.post_id === Number(postId) && comment.status === 'approved');
}

export async function createComment(data: { post_id: number; name: string; email: string; content: string }) {
  const res = await fetch(`${API_URL}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return readJsonOrThrow(res, 'Falha ao enviar comentário');
}

export async function updateComment(id: number | string, data: Partial<ApiComment>) {
  const res = await fetch(`${API_URL}/comments/${id}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data) });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao atualizar comentário');
}

export async function deleteComment(id: number | string) {
  const res = await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE', headers: adminHeaders() });
  return readJsonOrThrow<{ message: string }>(res, 'Falha ao deletar comentário');
}
