import { supabase } from './supabase';
import { type ApiPost, type ApiTag, type PostPayload } from './apiTypes';

function extractCount(value: unknown): number {
  if (typeof value === 'number') return value;
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0] as Record<string, unknown>;
    return typeof first?.count === 'number' ? first.count : 0;
  }
  return 0;
}

function mapPost(row: Record<string, unknown>): ApiPost {
  const author = row.author as { name?: string } | null;
  const category = row.category as { name?: string; slug?: string } | null;
  const media = row.media as { filename?: string } | null;
  const tags = (row.post_tags as Array<{ tags: ApiTag }> | null) ?? [];

  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    summary: row.summary as string,
    content: row.content as string,
    cover_image: row.cover_image as string | null,
    image_position: row.image_position as ApiPost['image_position'],
    status: row.status as ApiPost['status'],
    author_id: row.author_id as string,
    author_name: author?.name ?? '',
    category_id: row.category_id as string | null,
    category_name: category?.name ?? null,
    category_slug: category?.slug ?? null,
    media_id: row.media_id as string | null,
    media_filename: media?.filename ?? null,
    scheduled_at: row.scheduled_at as string | null,
    published_at: row.published_at as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    views: extractCount(row.views_count),
    likes: extractCount(row.likes_count),
    tags: tags.map((t) => t.tags),
  };
}

const POST_SELECT = `
  *,
  author:author_id(name),
  category:category_id(name, slug),
  media:media_id(filename),
  post_tags(tags(*)),
  views_count:post_views(count),
  likes_count:likes(count)
`;

export async function fetchPosts(): Promise<ApiPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Falha ao buscar posts');
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}

export async function fetchPostById(id: string): Promise<ApiPost> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', id)
    .single();

  if (error) throw new Error('Falha ao buscar post');
  return mapPost(data as Record<string, unknown>);
}

export async function fetchPostBySlug(slug: string): Promise<ApiPost> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .single();

  if (error) throw new Error('Falha ao buscar post');
  return mapPost(data as Record<string, unknown>);
}

export async function recordView(postId: string) {
  try {
    await supabase.from('post_views').insert({ post_id: postId });
  } catch {
    // silently ignore
  }
}

export async function recordLike(postId: string) {
  const { error } = await supabase.from('likes').insert({ post_id: postId });
  if (error) throw new Error('Falha ao registrar like');
  return { message: 'Like registrado.' };
}

export async function createPost(data: PostPayload): Promise<ApiPost> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { tag_ids, ...postData } = data;

  const { data: row, error } = await supabase
    .from('posts')
    .insert({
      ...postData,
      author_id: session.user.id,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Falha ao criar post: ${error.message}`);

  if (tag_ids && tag_ids.length > 0) {
    await supabase.from('post_tags').insert(
      tag_ids.map((tag_id) => ({ post_id: row.id, tag_id }))
    );
  }

  return fetchPostById(row.id);
}

export async function updatePost(id: string, data: Partial<PostPayload>): Promise<{ message: string }> {
  const { tag_ids, ...postData } = data;

  const { error } = await supabase
    .from('posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Falha ao atualizar post: ${error.message}`);

  if (tag_ids !== undefined) {
    await supabase.from('post_tags').delete().eq('post_id', id);
    if (tag_ids.length > 0) {
      await supabase.from('post_tags').insert(
        tag_ids.map((tag_id) => ({ post_id: id, tag_id }))
      );
    }
  }

  return { message: 'Post atualizado.' };
}

export async function deletePost(id: string): Promise<{ message: string }> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error('Falha ao deletar post');
  return { message: 'Post removido.' };
}
