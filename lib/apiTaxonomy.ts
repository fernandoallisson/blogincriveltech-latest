import { supabase } from './supabase';
import { type ApiCategory, type ApiTag } from './apiTypes';

export async function fetchCategories(): Promise<ApiCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw new Error('Falha ao buscar categorias');
  return data ?? [];
}

export async function fetchCategoryBySlug(slug: string): Promise<ApiCategory | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data ?? null;
}

export async function createCategory(data: { name: string; slug: string; description?: string }): Promise<ApiCategory> {
  const { data: row, error } = await supabase
    .from('categories')
    .insert(data)
    .select()
    .single();
  if (error) throw new Error('Falha ao criar categoria');
  return row;
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string | null }): Promise<{ message: string }> {
  const { error } = await supabase
    .from('categories')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Falha ao atualizar categoria');
  return { message: 'Categoria atualizada.' };
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar categoria');
  return { message: 'Categoria removida.' };
}

export async function fetchTags(): Promise<ApiTag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  if (error) throw new Error('Falha ao buscar tags');
  return data ?? [];
}

export async function createTag(data: { name: string; slug: string }): Promise<ApiTag> {
  const { data: row, error } = await supabase
    .from('tags')
    .insert(data)
    .select()
    .single();
  if (error) throw new Error('Falha ao criar tag');
  return row;
}

export async function updateTag(id: string, data: { name: string; slug: string }): Promise<{ message: string }> {
  const { error } = await supabase
    .from('tags')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Falha ao atualizar tag');
  return { message: 'Tag atualizada.' };
}

export async function deleteTag(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar tag');
  return { message: 'Tag removida.' };
}
