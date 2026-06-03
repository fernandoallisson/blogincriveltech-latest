import { supabase } from './supabase';
import { type ApiMedia } from './apiTypes';

type MediaPayload = {
  filename: string;
  url: string;
  storage_path?: string | null;
  type?: string;
  size?: number | null;
  uploaded_by?: string | null;
  post_id?: string | null;
};

export async function fetchMedia(): Promise<ApiMedia[]> {
  const { data, error } = await supabase
    .from('media')
    .select(`
      *,
      uploader:uploaded_by(name),
      post:post_id(title, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Falha ao buscar midias');

  return (data ?? []).map((row) => ({
    id: row.id,
    filename: row.filename,
    url: row.url,
    storage_path: row.storage_path,
    type: row.type,
    size: row.size,
    uploaded_by: row.uploaded_by,
    uploaded_by_name: (row.uploader as { name?: string } | null)?.name ?? null,
    post_id: row.post_id,
    post_title: (row.post as { title?: string } | null)?.title ?? null,
    post_slug: (row.post as { slug?: string } | null)?.slug ?? null,
    created_at: row.created_at,
  }));
}

export async function createMedia(data: MediaPayload): Promise<ApiMedia> {
  const { data: row, error } = await supabase
    .from('media')
    .insert(data)
    .select()
    .single();
  if (error) throw new Error('Falha ao criar midia');
  return row;
}

export async function uploadMedia(
  file: File,
  options: { post_id?: string | null; media_id?: string | null } = {}
): Promise<ApiMedia> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const ext = file.name.split('.').pop() ?? 'jpg';
  const storagePath = `${session.user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(`Falha ao enviar midia: ${uploadError.message}`);

  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(storagePath);

  if (options.media_id) {
    // Updating existing media record
    const { data: existing } = await supabase
      .from('media')
      .select('storage_path')
      .eq('id', options.media_id)
      .maybeSingle();

    if (existing?.storage_path) {
      await supabase.storage.from('media').remove([existing.storage_path]);
    }

    const { data: row, error } = await supabase
      .from('media')
      .update({
        filename: file.name,
        url: publicUrl,
        storage_path: storagePath,
        type: file.type,
        size: file.size,
        post_id: options.post_id ?? null,
      })
      .eq('id', options.media_id)
      .select()
      .single();

    if (error) throw new Error('Falha ao atualizar midia');
    return row;
  }

  const { data: row, error } = await supabase
    .from('media')
    .insert({
      filename: file.name,
      url: publicUrl,
      storage_path: storagePath,
      type: file.type,
      size: file.size,
      uploaded_by: session.user.id,
      post_id: options.post_id ?? null,
    })
    .select()
    .single();

  if (error) throw new Error('Falha ao criar midia');
  return row;
}

export async function updateMedia(id: string, data: MediaPayload): Promise<{ message: string }> {
  const { error } = await supabase.from('media').update(data).eq('id', id);
  if (error) throw new Error('Falha ao atualizar midia');
  return { message: 'Midia atualizada.' };
}

export async function deleteMedia(id: string): Promise<{ message: string }> {
  const { data: row } = await supabase
    .from('media')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (row?.storage_path) {
    await supabase.storage.from('media').remove([row.storage_path]);
  }

  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar midia');
  return { message: 'Midia removida.' };
}
