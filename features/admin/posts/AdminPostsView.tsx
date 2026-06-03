'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { createCategory, createPost, createTag, deletePost, fetchCategories, fetchMedia, fetchPosts, fetchTags, fetchUsers, updatePost, uploadMedia, type ApiCategory, type ApiMedia, type ApiPost, type ApiTag, type ApiUser, type PostPayload } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { compressUploadImage } from '@/lib/imageCompression';
import { AdminGrid } from '../shared/AdminGrid';
import { slugify } from '../shared/slugify';
import PostForm from './PostForm';
import PostLivePreview from './PostLivePreview';
import PostsTable from './PostsTable';
import { emptyPostForm, type PostFormState } from './types';

export default function AdminPostsView() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [media, setMedia] = useState<ApiMedia[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [form, setForm] = useState<PostFormState>(emptyPostForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState<'category' | 'media' | 'tag' | null>(null);
  const [modalMessage, setModalMessage] = useState('');
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });
  const [tagForm, setTagForm] = useState({ name: '', slug: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [isProcessingMediaFile, setIsProcessingMediaFile] = useState(false);
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  async function load() {
    const storedUser = getStoredUser();
    setCurrentUser(storedUser);
    const [p, c, t, m, u] = await Promise.all([fetchPosts(), fetchCategories(), fetchTags(), fetchMedia(), fetchUsers().catch(() => [])]);
    const authorId = storedUser?.role === 'admin' ? (u[0]?.id || storedUser?.id || 1) : (storedUser?.id || 1);
    setPosts(p);
    setCategories(c);
    setTags(t);
    setMedia(m);
    setUsers(u.length ? u : [{ id: authorId, name: `Usuário #${authorId}` } as ApiUser]);
    setForm((current) => ({ ...current, author_id: authorId }));
  }

  useEffect(() => { load(); }, []);

  const availableMedia = useMemo(() => media.filter((item) => !item.post_id || item.post_id === editingId), [editingId, media]);
  const selectedMedia = media.find((item) => String(item.id) === form.media_id);
  const selectedCategory = categories.find((item) => String(item.id) === form.category_id);
  const selectedTags = tags.filter((item) => form.tag_ids.includes(String(item.id)));
  const selectedAuthor = users.find((item) => item.id === Number(form.author_id));
  const isAdmin = currentUser?.role === 'admin';

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingPost) return;
    if (!form.media_id) return setMessage('Escolha uma mídia para vincular ao post.');
    if (form.status === 'scheduled' && !form.scheduled_at) return setMessage('Informe data e hora para programar o post.');
    if (form.status === 'scheduled' && new Date(form.scheduled_at).getTime() <= Date.now()) return setMessage('Escolha uma data futura para programar o post.');

    const payload: PostPayload = buildPayload(form, selectedMedia?.url || null);
    try {
      setIsSavingPost(true);
      if (editingId) await updatePost(editingId, payload); else await createPost(payload);
      setMessage(editingId ? 'Post atualizado.' : 'Post criado.');
      setEditingId(null);
      setForm({ ...emptyPostForm, author_id: isAdmin ? (users[0]?.id || currentUser?.id || 1) : (currentUser?.id || 1) });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao salvar.');
    } finally {
      setIsSavingPost(false);
    }
  }

  function editPost(post: ApiPost) {
    const linkedMedia = media.find((item) => item.id === post.media_id) || media.find((item) => item.url === post.cover_image);
    setEditingId(post.id);
    setMessage('');
    setForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary || '',
      content: post.content || '',
      status: post.status,
      scheduled_at: toDatetimeLocal(post.scheduled_at || ''),
      image_position: post.image_position || 'side',
      author_id: post.author_id,
      category_id: post.category_id ? String(post.category_id) : '',
      tag_ids: post.tags?.map((tag) => String(tag.id)) || [],
      media_id: linkedMedia ? String(linkedMedia.id) : '',
    });
  }

  async function removePost(post: ApiPost) {
    if (window.confirm('Excluir post?')) {
      await deletePost(post.id);
      await load();
    }
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModalMessage('');
    try {
      const item = await createCategory({
        name: categoryForm.name,
        slug: categoryForm.slug || slugify(categoryForm.name),
        description: categoryForm.description || undefined,
      });
      setCategories((current) => [item, ...current]);
      setForm((current) => ({ ...current, category_id: String(item.id) }));
      setCategoryForm({ name: '', slug: '', description: '' });
      closeModal();
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : 'Falha ao criar categoria.');
    }
  }

  async function saveTag(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModalMessage('');
    try {
      const item = await createTag({ name: tagForm.name, slug: tagForm.slug || slugify(tagForm.name) });
      setTags((current) => [item, ...current]);
      setForm((current) => ({ ...current, tag_ids: [...current.tag_ids, String(item.id)] }));
      setTagForm({ name: '', slug: '' });
      closeModal();
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : 'Falha ao criar tag.');
    }
  }

  async function saveMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessingMediaFile || isSavingMedia) return;
    if (!mediaFile) return setModalMessage('Selecione uma imagem.');
    setModalMessage('');
    try {
      setIsSavingMedia(true);
      const item = await uploadMedia(mediaFile);
      setMedia((current) => [item, ...current]);
      setForm((current) => ({ ...current, media_id: String(item.id) }));
      setMediaFile(null);
      closeModal();
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : 'Falha ao enviar midia.');
    } finally {
      setIsSavingMedia(false);
    }
  }
  async function handleMediaFileChange(file: File | null) {
    setModalMessage('');
    if (!file) {
      setMediaFile(null);
      return;
    }

    try {
      setIsProcessingMediaFile(true);
      setMediaFile(await compressUploadImage(file));
    } catch (error) {
      setMediaFile(null);
      setModalMessage(error instanceof Error ? error.message : 'Falha ao processar imagem.');
    } finally {
      setIsProcessingMediaFile(false);
    }
  }

  function openModal(type: 'category' | 'media' | 'tag') {
    setModalMessage('');
    setModal(type);
  }

  function closeModal() {
    setModal(null);
    setModalMessage('');
  }

  return (
    <AdminPageShell active="posts" title="Posts" eyebrow={`${posts.length} posts na API`}>
      <AdminGrid className="lg:grid-cols-[380px_minmax(0,1fr)]">
        <PostForm form={form} editing={Boolean(editingId)} message={message} media={availableMedia} categories={categories} tags={tags} users={users} canChooseAuthor={isAdmin} selectedMedia={selectedMedia} isSaving={isSavingPost} onCreateCategory={() => openModal('category')} onCreateMedia={() => openModal('media')} onCreateTag={() => openModal('tag')} onChange={setForm} onSubmit={save} />
        <PostLivePreview form={form} media={selectedMedia} categoryName={selectedCategory?.name} selectedTags={selectedTags} authorName={selectedAuthor?.name} />
      </AdminGrid>
      <div className="mt-4">
        <PostsTable posts={posts} user={currentUser} onEdit={editPost} onDelete={removePost} />
      </div>
      {modal === 'category' && (
        <InlineCreateModal title="Nova categoria" message={modalMessage} onClose={closeModal} onSubmit={saveCategory} submitLabel="Criar categoria" disabled={!categoryForm.name}>
          <Input label="Nome" value={categoryForm.name} onChange={(e) => setCategoryForm((current) => ({ ...current, name: e.target.value, slug: slugify(e.target.value) }))} />
          <Input label="Slug" value={categoryForm.slug} onChange={(e) => setCategoryForm((current) => ({ ...current, slug: slugify(e.target.value) }))} />
          <Textarea label="Descrição" rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm((current) => ({ ...current, description: e.target.value }))} />
        </InlineCreateModal>
      )}
      {modal === 'tag' && (
        <InlineCreateModal title="Nova tag" message={modalMessage} onClose={closeModal} onSubmit={saveTag} submitLabel="Criar tag" disabled={!tagForm.name}>
          <Input label="Nome" value={tagForm.name} onChange={(e) => setTagForm((current) => ({ ...current, name: e.target.value, slug: slugify(e.target.value) }))} />
          <Input label="Slug" value={tagForm.slug} onChange={(e) => setTagForm((current) => ({ ...current, slug: slugify(e.target.value) }))} />
        </InlineCreateModal>
      )}
      {modal === 'media' && (
        <InlineCreateModal title="Nova mídia" message={modalMessage} onClose={closeModal} onSubmit={saveMedia} submitLabel={isSavingMedia ? 'Enviando...' : 'Enviar midia'} disabled={!mediaFile || isProcessingMediaFile || isSavingMedia}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted">Imagem</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              disabled={isProcessingMediaFile || isSavingMedia}
              onChange={(event) => handleMediaFileChange(event.target.files?.[0] || null)}
              className="rounded-md border border-border-strong bg-glass px-3 py-2 text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-brand/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
            />
            {isProcessingMediaFile && <span className="text-xs text-subtle">Comprimindo e redimensionando...</span>}
            {mediaFile && <span className="text-xs text-subtle">{mediaFile.name}</span>}
          </div>
        </InlineCreateModal>
      )}
    </AdminPageShell>
  );
}

function InlineCreateModal({ title, message, submitLabel, disabled, onClose, onSubmit, children }: { title: string; message: string; submitLabel: string; disabled?: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[300] grid place-items-center bg-black/55 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-[460px] rounded-md border border-border bg-surface p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-extrabold text-text">{title}</h2>
          <Button type="button" size="sm" variant="ghost" onClick={onClose}>Fechar</Button>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
        {message && <div className="mt-3 text-xs text-error">{message}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={disabled}>{submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}

function buildPayload(form: PostFormState, coverImage: string | null): PostPayload {
  return {
    title: form.title,
    slug: form.slug || slugify(form.title),
    summary: form.summary,
    content: form.content,
    media_id: Number(form.media_id),
    cover_image: coverImage,
    image_position: form.image_position,
    status: form.status,
    author_id: Number(form.author_id),
    category_id: form.category_id ? Number(form.category_id) : null,
    tag_ids: form.tag_ids.map(Number),
    published_at: form.status === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
    scheduled_at: form.scheduled_at ? toUtcSqlDatetime(form.scheduled_at) : null,
  };
}

function toDatetimeLocal(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace(' ', 'T').slice(0, 16);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toUtcSqlDatetime(value: string) {
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ');
}
