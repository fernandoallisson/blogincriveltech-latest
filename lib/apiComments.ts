import { supabase } from './supabase';
import { type ApiComment } from './apiTypes';

export async function fetchComments(): Promise<ApiComment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Falha ao buscar comentários');
  return data ?? [];
}

export async function fetchCommentsByPost(postId: string): Promise<ApiComment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });
  if (error) throw new Error('Falha ao buscar comentários');
  return data ?? [];
}

export async function createComment(data: { post_id: string; name: string; email: string; content: string }) {
  const { data: row, error } = await supabase
    .from('comments')
    .insert({ ...data, status: 'pending' })
    .select()
    .single();
  if (error) throw new Error('Falha ao enviar comentário');
  return row;
}

export async function updateComment(id: string, data: Partial<ApiComment>): Promise<{ message: string }> {
  const { error } = await supabase
    .from('comments')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Falha ao atualizar comentário');
  return { message: 'Comentário atualizado.' };
}

export async function deleteComment(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar comentário');
  return { message: 'Comentário removido.' };
}
