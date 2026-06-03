'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { estimateReadTime, type ApiMedia, type ApiTag } from '@/lib/api';
import { slugify } from '../shared/slugify';
import { type PostFormState } from './types';

type Props = {
  form: PostFormState;
  media?: ApiMedia;
  categoryName?: string;
  selectedTags: ApiTag[];
  authorName?: string;
};

export default function PostLivePreview({ form, media, categoryName, selectedTags, authorName }: Props) {
  const title = form.title.trim() || 'Título do post';
  const summary = form.summary.trim() || 'O resumo aparece aqui para mostrar a promessa principal do artigo.';
  const content = form.content.trim() || 'Comece a escrever o conteúdo para visualizar o corpo do post em tempo real.';
  const slug = form.slug || slugify(form.title) || 'slug-do-post';
  const author = authorName || 'Autor';

  return (
    <Card className="sticky top-6 overflow-hidden" padding={0}>
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-bold uppercase tracking-wider text-subtle">Preview ao vivo</div>
        <div className="mt-1 truncate text-xs text-muted">/blog/{slug}</div>
      </div>

      {form.image_position === 'wide' && <PreviewMedia media={media} />}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand" size="sm">{categoryName || 'Sem categoria'}</Badge>
          <Badge tone={form.status === 'published' ? 'success' : form.status === 'archived' ? 'error' : 'warning'} size="sm">{statusLabel[form.status]}</Badge>
          {form.scheduled_at && <Badge tone="info" size="sm">{formatSchedule(form.scheduled_at)}</Badge>}
        </div>
        <div className={form.image_position === 'side' ? 'mt-4 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_180px]' : ''}>
          <div>
            <h2 className="text-2xl font-extrabold leading-tight text-text">{title}</h2>
            {form.image_position === 'below_title' && <div className="mt-4"><PreviewMedia media={media} compact /></div>}
          </div>
          {form.image_position === 'side' && <PreviewMedia media={media} compact />}
        </div>
        <p className="mt-3 line-clamp-3 leading-7 text-muted">{summary}</p>
        {selectedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => <Badge key={tag.id} tone="neutral" size="sm">{tag.name}</Badge>)}
          </div>
        )}
        <div className="mt-5 flex items-center gap-2.5 text-xs text-subtle">
          <Avatar name={author} size={32} />
          <span>{author} | {estimateReadTime(content)}</span>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-7 text-text">{content}</p>
        </div>
        {form.image_position === 'below_content' && <div className="mt-4"><PreviewMedia media={media} compact /></div>}
      </div>
    </Card>
  );
}

const statusLabel: Record<PostFormState['status'], string> = {
  draft: 'Rascunho',
  scheduled: 'Programado',
  published: 'Publicado',
  archived: 'Arquivado',
};

function PreviewMedia({ media, compact }: { media?: ApiMedia; compact?: boolean }) {
  const isImage = media?.type?.startsWith('image') || media?.url.match(/\.(png|jpe?g|webp|gif|avif)$/i);
  const className = compact ? 'h-[150px] rounded-md' : 'h-[220px]';
  if (media && isImage) return <img src={media.url} alt="" className={`${className} w-full object-cover`} />;
  return <div className={`${className} grid w-full place-items-center bg-gradient-to-br from-brand/20 to-surface-2 text-sm text-subtle`}>{media?.type || 'Mídia do post'}</div>;
}

function formatSchedule(value: string) {
  return new Date(value).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
