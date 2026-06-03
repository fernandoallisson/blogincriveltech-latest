'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { type ApiCategory, type ApiMedia, type ApiTag, type ApiUser, type ImagePosition, type PostPayload } from '@/lib/api';
import { cn } from '@/lib/cn';
import { slugify } from '../shared/slugify';
import { type PostFormState } from './types';

type Props = {
  form: PostFormState;
  editing: boolean;
  message: string;
  media: ApiMedia[];
  categories: ApiCategory[];
  tags: ApiTag[];
  users: ApiUser[];
  canChooseAuthor: boolean;
  selectedMedia?: ApiMedia;
  isSaving: boolean;
  onCreateCategory: () => void;
  onCreateMedia: () => void;
  onCreateTag: () => void;
  onChange: (form: PostFormState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function PostForm({ form, editing, message, media, categories, tags, users, canChooseAuthor, selectedMedia, isSaving, onCreateCategory, onCreateMedia, onCreateTag, onChange, onSubmit }: Props) {
  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="font-extrabold text-text">{editing ? 'Editar post' : 'Novo post'}</div>
        <Input label="Título" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value, slug: slugify(e.target.value) })} />
        <Input label="Slug" value={form.slug} onChange={(e) => onChange({ ...form, slug: slugify(e.target.value) })} />
        <Textarea label="Resumo" rows={3} value={form.summary} onChange={(e) => onChange({ ...form, summary: e.target.value })} />
        <Textarea label="Conteúdo" rows={7} value={form.content} onChange={(e) => onChange({ ...form, content: e.target.value })} />
        <FieldWithAction label="Mídia do post" actionLabel="Nova mídia" onAction={onCreateMedia}>
          <Select value={form.media_id} onChange={(e) => onChange({ ...form, media_id: e.target.value })} options={[{ value: '', label: media.length ? 'Selecione uma mídia' : 'Nenhuma mídia disponível' }, ...media.map((item) => ({ value: String(item.id), label: item.filename }))]} />
        </FieldWithAction>
        {selectedMedia && <MediaPreview media={selectedMedia} />}
        <Select label="Posição da imagem" value={form.image_position} onChange={(e) => onChange({ ...form, image_position: e.target.value as ImagePosition })} options={imagePositionOptions} />
        <Select label="Status" value={form.status} onChange={(e) => {
          const status = e.target.value as PostPayload['status'];
          onChange({ ...form, status, scheduled_at: status === 'scheduled' ? form.scheduled_at : '' });
        }} options={[{ value: 'draft', label: 'Rascunho' }, { value: 'scheduled', label: 'Programado' }, { value: 'published', label: 'Publicado' }, { value: 'archived', label: 'Arquivado' }]} />
        <Input
          label="Programar publicação"
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) => onChange({ ...form, scheduled_at: e.target.value, status: e.target.value ? 'scheduled' : form.status })}
          hint="Quando preenchido, o post fica programado e publica automaticamente."
        />
        <FieldWithAction label="Categoria" actionLabel="Nova categoria" onAction={onCreateCategory}>
          <Select value={form.category_id} onChange={(e) => onChange({ ...form, category_id: e.target.value })} options={[{ value: '', label: categories.length ? 'Sem categoria' : 'Nenhuma categoria disponível' }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))]} />
        </FieldWithAction>
        <TagPicker tags={tags} selectedIds={form.tag_ids} onCreateTag={onCreateTag} onChange={(tagIds) => onChange({ ...form, tag_ids: tagIds })} />
        {canChooseAuthor && <Select label="Autor" value={String(form.author_id)} onChange={(e) => onChange({ ...form, author_id: Number(e.target.value) })} options={users.map((u) => ({ value: String(u.id), label: u.name }))} />}
        {message && <div className={`text-xs ${message.includes('Falha') || message.includes('Escolha') ? 'text-error' : 'text-success'}`}>{message}</div>}
        <Button type="submit" full disabled={isSaving || !form.title || !form.content || !form.media_id}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
      </form>
    </Card>
  );
}

const imagePositionOptions = [
  { value: 'side', label: 'Ao lado do título' },
  { value: 'wide', label: 'Wide acima do título' },
  { value: 'below_title', label: 'Abaixo do título' },
  { value: 'below_content', label: 'Abaixo do conteúdo' },
];

function FieldWithAction({ label, actionLabel, onAction, children }: { label: string; actionLabel: string; onAction: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-muted">{label}</span>
        <Button type="button" size="sm" variant="secondary" onClick={onAction}>{actionLabel}</Button>
      </div>
      {children}
    </div>
  );
}

function TagPicker({ tags, selectedIds, onCreateTag, onChange }: { tags: ApiTag[]; selectedIds: string[]; onCreateTag: () => void; onChange: (tagIds: string[]) => void }) {
  function toggle(tagId: string) {
    onChange(selectedIds.includes(tagId) ? selectedIds.filter((id) => id !== tagId) : [...selectedIds, tagId]);
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-xs font-semibold text-muted">Tags</legend>
        <Button type="button" size="sm" variant="secondary" onClick={onCreateTag}>Nova tag</Button>
      </div>
      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const tagId = String(tag.id);
            const selected = selectedIds.includes(tagId);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggle(tagId)}
                className={cn(
                  'h-8 rounded-full border px-3 text-xs font-semibold transition',
                  selected ? 'border-brand bg-brand/15 text-brand' : 'border-border bg-glass text-muted hover:text-text',
                )}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-border bg-glass px-3 py-2 text-xs text-subtle">Nenhuma tag cadastrada.</div>
      )}
    </fieldset>
  );
}

function MediaPreview({ media }: { media: ApiMedia }) {
  const isImage = media.type?.startsWith('image') || media.url.match(/\.(png|jpe?g|webp|gif|avif)$/i);
  return (
    <div className="overflow-hidden rounded-md border border-border bg-glass">
      {isImage ? <img src={media.url} alt="" className="h-[150px] w-full object-cover" /> : <div className="grid h-[150px] place-items-center bg-surface-2 text-subtle">{media.type || 'Mídia'}</div>}
      <span className="block truncate p-2.5 text-xs text-subtle">{media.url}</span>
    </div>
  );
}
