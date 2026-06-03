'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { deleteComment, fetchComments, fetchPosts, updateComment, type ApiComment, type ApiPost } from '@/lib/api';
import { AdminRow } from '@/features/admin/shared/AdminGrid';

export default function AdminCommentsPage() {
  const [items, setItems] = useState<ApiComment[]>([]);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [postFilter, setPostFilter] = useState('all');

  async function load() {
    const [commentData, postData] = await Promise.all([fetchComments(), fetchPosts()]);
    setItems(commentData);
    setPosts(postData);
  }

  useEffect(() => { load(); }, []);

  const postById = useMemo(() => new Map(posts.map((post) => [post.id, post])), [posts]);
  const postOptions = useMemo(() => {
    const linkedPostIds = Array.from(new Set(items.map((item) => item.post_id))).sort((a, b) => a - b);
    return [
      { value: 'all', label: 'Todos os blogs' },
      ...linkedPostIds.map((postId) => {
        const post = postById.get(postId);
        return { value: String(postId), label: post?.title || `Post #${postId}` };
      }),
    ];
  }, [items, postById]);
  const filteredItems = useMemo(() => (
    postFilter === 'all' ? items : items.filter((item) => String(item.post_id) === postFilter)
  ), [items, postFilter]);

  return (
    <AdminPageShell active="comments" title="Comentários" eyebrow={`${filteredItems.length} de ${items.length} comentários`}>
      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-end">
          <Select
            label="Blog vinculado"
            value={postFilter}
            onChange={(event) => setPostFilter(event.target.value)}
            options={postOptions}
          />
          <p className="text-sm leading-6 text-muted">
            Filtre os comentários pelo post em que eles foram enviados.
          </p>
        </div>
      </Card>
      <Card padding={0}>
        {filteredItems.length === 0 ? (
          <div className="p-5 text-sm text-muted">Nenhum comentário encontrado para este filtro.</div>
        ) : (
          filteredItems.map((item) => {
            const linkedPost = postById.get(item.post_id);
            return (
              <AdminRow key={item.id} className="md:grid-cols-[minmax(0,1fr)_240px_150px_90px]">
                <div>
                  <Badge tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'} size="sm">{item.status}</Badge>
                  <div className="mt-2 text-text">{item.content}</div>
                  <div className="text-xs text-subtle">{item.name} | {item.email}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-normal text-subtle">Blog vinculado</div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold text-text">{linkedPost?.title || `Post #${item.post_id}`}</div>
                  {linkedPost?.slug && <div className="mt-1 text-xs text-subtle">/{linkedPost.slug}</div>}
                </div>
                <Select size="sm" value={item.status} onChange={async (e) => { await updateComment(item.id, { status: e.target.value as ApiComment['status'] }); await load(); }} options={[{ value: 'pending', label: 'Pendente' }, { value: 'approved', label: 'Aprovado' }, { value: 'rejected', label: 'Rejeitado' }]} />
                <Button size="sm" variant="danger" onClick={async () => { await deleteComment(item.id); await load(); }}>Excluir</Button>
              </AdminRow>
            );
          })
        )}
      </Card>
    </AdminPageShell>
  );
}
