'use client';

import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { type ApiPost } from '@/lib/api';
import { type AuthUser } from '@/lib/auth';
import { AdminRow } from '../shared/AdminGrid';

const STATUS_LABELS: Record<string, string> = {
  published: 'Publicado',
  draft: 'Rascunho',
  scheduled: 'Agendado',
  archived: 'Arquivado',
};

function formatScheduledDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostsTable({ posts, user, onEdit, onDelete }: { posts: ApiPost[]; user: AuthUser | null; onEdit: (post: ApiPost) => void; onDelete: (post: ApiPost) => void }) {
  return (
    <Card padding={0} className="overflow-hidden">
      {posts.map((post) => {
        const canManage = user?.role === 'admin' || post.author_id === user?.id;
        return (
        <AdminRow key={post.id} className="md:grid-cols-[minmax(0,1fr)_130px_150px]">
          <Link href={`/blog/${post.slug}`}>
            <div className="font-extrabold text-text">{post.title}</div>
            <div className="text-xs text-subtle">{post.media_filename || 'Sem mídia vinculada'} | {post.views || 0} views</div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => <Badge key={tag.id} tone="neutral" size="sm">{tag.name}</Badge>)}
              </div>
            )}
          </Link>
          <div className="flex flex-col gap-1">
            <Badge tone={post.status === 'published' ? 'success' : post.status === 'archived' ? 'error' : post.status === 'scheduled' ? 'info' : 'warning'} size="sm">
              {STATUS_LABELS[post.status] ?? post.status}
            </Badge>
            {post.status === 'scheduled' && post.scheduled_at && (
              <span className="text-[10px] leading-tight text-subtle">
                Vai ao ar: {formatScheduledDate(post.scheduled_at)}
              </span>
            )}
          </div>
          <div className="flex gap-1.5 md:justify-end">
            {canManage ? (
              <>
                <Button size="sm" variant="secondary" onClick={() => onEdit(post)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(post)}>Excluir</Button>
              </>
            ) : (
              <span className="text-xs text-subtle">Somente leitura</span>
            )}
          </div>
        </AdminRow>
      );})}
    </Card>
  );
}
