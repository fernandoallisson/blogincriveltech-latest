'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { AdminGrid, AdminRow } from '@/features/admin/shared/AdminGrid';
import { createPromoCard, deletePromoCard, fetchPosts, fetchPromoCardMetrics, fetchPromoCards, fetchUsers, updatePromoCard, uploadMedia, type ApiPost, type ApiPromoCard, type ApiUser, type DashboardPeriod, type PromoCardMetrics, type PromoCardPayload } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { compressUploadImage } from '@/lib/imageCompression';

type PromoForm = {
  title: string;
  description: string;
  image_url: string;
  cta_label: string;
  cta_url: string;
  status: 'active' | 'inactive';
  background_color: string;
  text_color: string;
  cta_color: string;
  author_id: number;
  post_ids: string[];
  file: File | null;
};

const emptyForm: PromoForm = {
  title: '',
  description: '',
  image_url: '',
  cta_label: '',
  cta_url: '',
  status: 'inactive',
  background_color: '#101828',
  text_color: '#FFFFFF',
  cta_color: '#5CE1E6',
  author_id: 1,
  post_ids: [],
  file: null,
};

const periodOptions: Array<{ value: DashboardPeriod; label: string }> = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '365d', label: '1a' },
  { value: 'all', label: 'Tudo' },
];

export default function AdminPromoCardsPage() {
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === 'admin';
  const [items, setItems] = useState<ApiPromoCard[]>([]);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [form, setForm] = useState<PromoForm>({ ...emptyForm, author_id: currentUser?.id || 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<PromoCardMetrics | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  const [message, setMessage] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  async function load() {
    const [cards, postRows, userRows] = await Promise.all([fetchPromoCards(), fetchPosts(), isAdmin ? fetchUsers().catch(() => []) : Promise.resolve([])]);
    setItems(cards);
    setPosts(postRows);
    setUsers(userRows);
    if (!selectedId && cards[0]) setSelectedId(cards[0].id);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!form.file) {
      setPreviewImageUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(form.file);
    setPreviewImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.file]);

  useEffect(() => {
    async function loadMetrics() {
      if (!selectedId) {
        setMetrics(null);
        return;
      }
      setMetrics(await fetchPromoCardMetrics(selectedId, period));
    }

    loadMetrics().catch((error) => setMessage(error instanceof Error ? error.message : 'Falha ao carregar métricas.'));
  }, [selectedId, period]);

  const selectedCard = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessingImage || isSaving) return;
    setMessage('');

    try {
      setIsSaving(true);
      let imageUrl = form.image_url;
      if (form.file) {
        const media = await uploadMedia(form.file);
        imageUrl = media.url;
      }

      const payload: PromoCardPayload = {
        title: form.title,
        description: form.description || null,
        image_url: imageUrl || null,
        cta_label: form.cta_label || null,
        cta_url: form.cta_url || null,
        status: form.status,
        background_color: form.background_color,
        text_color: form.text_color,
        cta_color: form.cta_color,
        author_id: form.author_id,
        post_ids: form.post_ids.map(Number),
      };

      if (editingId) await updatePromoCard(editingId, payload);
      else {
        const created = await createPromoCard(payload);
        setSelectedId(created.id);
      }

      setMessage(editingId ? 'Card atualizado.' : 'Card criado.');
      setEditingId(null);
      setForm({ ...emptyForm, author_id: currentUser?.id || 1 });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao salvar card.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageFileChange(file: File | null) {
    setMessage('');
    if (!file) {
      setForm((current) => ({ ...current, file: null }));
      return;
    }

    try {
      setIsProcessingImage(true);
      const compressedFile = await compressUploadImage(file);
      setForm((current) => ({ ...current, file: compressedFile }));
    } catch (error) {
      setForm((current) => ({ ...current, file: null }));
      setMessage(error instanceof Error ? error.message : 'Falha ao processar imagem.');
    } finally {
      setIsProcessingImage(false);
    }
  }

  function edit(item: ApiPromoCard) {
    setEditingId(item.id);
    setSelectedId(item.id);
    setMessage('');
    setForm({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      cta_label: item.cta_label || '',
      cta_url: item.cta_url || '',
      status: item.status,
      background_color: item.background_color || '#101828',
      text_color: item.text_color || '#FFFFFF',
      cta_color: item.cta_color || '#5CE1E6',
      author_id: item.author_id,
      post_ids: item.posts?.map((post) => String(post.id)) || [],
      file: null,
    });
  }

  async function toggleStatus(item: ApiPromoCard) {
    setMessage('');
    try {
      await updatePromoCard(item.id, buildPromoPayloadFromCard(item, item.status === 'active' ? 'inactive' : 'active'));
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao atualizar status do card.');
    }
  }

  async function remove(item: ApiPromoCard) {
    if (!window.confirm('Excluir card promocional?')) return;
    await deletePromoCard(item.id);
    if (selectedId === item.id) setSelectedId(null);
    await load();
  }

  function openDashboard(item: ApiPromoCard) {
    setSelectedId(item.id);
    window.setTimeout(() => metricsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  return (
    <AdminPageShell active="promos" title="Propagandas" eyebrow={`${items.length} cards`} actions={<Button icon="plus" onClick={() => { setEditingId(null); setForm({ ...emptyForm, author_id: currentUser?.id || 1 }); }}>Novo card</Button>}>
      <AdminGrid className="lg:grid-cols-[390px_minmax(0,1fr)]">
        <Card className="p-4">
          <form onSubmit={save} className="flex flex-col gap-3">
            <div className="font-extrabold text-text">{editingId ? 'Editar card' : 'Novo card'}</div>
            <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea label="Descrição" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <ImageField form={form} isProcessingImage={isProcessingImage} disabled={isProcessingImage || isSaving} onChange={setForm} onFileChange={handleImageFileChange} />
            <Input label="Texto do CTA" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
            <Input label="Link do CTA" value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} />
            <PostPicker posts={posts} selectedIds={form.post_ids} onChange={(postIds) => setForm({ ...form, post_ids: postIds })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PromoForm['status'] })} options={[{ value: 'inactive', label: 'Inativo' }, { value: 'active', label: 'Ativo' }]} />
            {isAdmin && <Select label="Autor" value={String(form.author_id)} onChange={(e) => setForm({ ...form, author_id: Number(e.target.value) })} options={(users.length ? users : currentUser ? [{ id: currentUser.id, name: currentUser.name || currentUser.email } as ApiUser] : []).map((user) => ({ value: String(user.id), label: user.name }))} />}
            <ColorFields form={form} onChange={setForm} />
            {message && <div className={`text-xs ${message.includes('Falha') ? 'text-error' : 'text-success'}`}>{message}</div>}
            <Button type="submit" full disabled={isProcessingImage || isSaving || !form.title}>{isSaving ? 'Salvando...' : editingId ? 'Atualizar card' : 'Criar card'}</Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="sticky top-6 p-4">
            <div className="mb-3">
              <div className="font-extrabold text-text">Preview ao vivo</div>
              <div className="text-xs text-subtle">A imagem selecionada aparece antes do upload.</div>
            </div>
            <PromoPreview card={form} previewImageUrl={previewImageUrl} />
          </Card>
          <CardsTable items={items} selectedId={selectedId} onSelect={setSelectedId} onDashboard={openDashboard} onEdit={edit} onToggle={toggleStatus} onDelete={remove} />
          <div ref={metricsRef}>
            <MetricsPanel card={selectedCard} metrics={metrics} period={period} onPeriod={setPeriod} />
          </div>
        </div>
      </AdminGrid>
    </AdminPageShell>
  );
}

function ImageField({ form, isProcessingImage, disabled, onChange, onFileChange }: { form: PromoForm; isProcessingImage: boolean; disabled: boolean; onChange: (form: PromoForm) => void; onFileChange: (file: File | null) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-muted">Imagem</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        disabled={disabled}
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        className="rounded-md border border-border-strong bg-glass px-3 py-2 text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-brand/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
      />
      {isProcessingImage && <span className="text-xs text-subtle">Comprimindo e redimensionando...</span>}
      {form.file && <span className="text-xs text-subtle">{form.file.name}</span>}
      <Input label="Ou URL da imagem" value={form.image_url} onChange={(e) => onChange({ ...form, image_url: e.target.value })} />
    </div>
  );
}

function ColorFields({ form, onChange }: { form: PromoForm; onChange: (form: PromoForm) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <ColorInput label="Fundo" value={form.background_color} onChange={(value) => onChange({ ...form, background_color: value })} />
      <ColorInput label="Texto" value={form.text_color} onChange={(value) => onChange({ ...form, text_color: value })} />
      <ColorInput label="CTA" value={form.cta_color} onChange={(value) => onChange({ ...form, cta_color: value })} />
    </div>
  );
}

function PostPicker({ posts, selectedIds, onChange }: { posts: ApiPost[]; selectedIds: string[]; onChange: (postIds: string[]) => void }) {
  function toggle(postId: string) {
    onChange(selectedIds.includes(postId) ? selectedIds.filter((id) => id !== postId) : [...selectedIds, postId]);
  }

  return (
    <fieldset className="min-w-0 max-w-full overflow-hidden rounded-md border border-border bg-glass p-3">
      <legend className="px-1 text-xs font-semibold text-muted">Posts vinculados</legend>
      <div className="mt-1 text-xs leading-5 text-subtle">Sem seleção, o card aparece como global. Selecione um ou mais posts para limitar a exibição.</div>
      <div className="max-h-[180px] space-y-1.5 overflow-auto pr-1">
        {posts.map((post) => {
          const postId = String(post.id);
          return (
            <label key={post.id} className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface/40 px-2.5 py-2 text-sm text-text">
              <input type="checkbox" checked={selectedIds.includes(postId)} onChange={() => toggle(postId)} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{post.title}</span>
              <span className="shrink-0 text-[11px] text-subtle">{post.status}</span>
            </label>
          );
        })}
      </div>
      {selectedIds.length > 0 && <Button type="button" size="sm" variant="secondary" onClick={() => onChange([])}>Tornar global</Button>}
    </fieldset>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
      {label}
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-md border border-border bg-glass" />
    </label>
  );
}

function PromoPreview({ card, previewImageUrl }: { card: PromoForm; previewImageUrl: string }) {
  const imageUrl = previewImageUrl || card.image_url;

  return (
    <div className="overflow-hidden rounded-md border border-border" style={{ backgroundColor: card.background_color, color: card.text_color }}>
      {imageUrl && <img src={imageUrl} alt="" className="h-[180px] w-full object-cover" />}
      <div className="p-3">
        <div className="text-sm font-extrabold">{card.title || 'Título do card'}</div>
        <p className="mt-1 text-xs leading-5 opacity-80">{card.description || 'Descrição curta da oferta, campanha ou chamada.'}</p>
        <div className="mt-3 inline-flex rounded-md px-3 py-1.5 text-xs font-bold" style={{ backgroundColor: card.cta_color, color: '#101828' }}>{card.cta_label || 'Saiba mais'}</div>
      </div>
    </div>
  );
}

function CardsTable({ items, selectedId, onSelect, onDashboard, onEdit, onToggle, onDelete }: { items: ApiPromoCard[]; selectedId: number | null; onSelect: (id: number) => void; onDashboard: (item: ApiPromoCard) => void; onEdit: (item: ApiPromoCard) => void; onToggle: (item: ApiPromoCard) => void; onDelete: (item: ApiPromoCard) => void }) {
  return (
    <Card padding={0} className="overflow-hidden">
      {items.map((item) => (
        <AdminRow key={item.id} className={`md:grid-cols-[minmax(0,1fr)_95px_300px] ${selectedId === item.id ? 'bg-brand/5' : ''}`}>
          <button type="button" className="min-w-0 text-left" onClick={() => onSelect(item.id)}>
            <div className="truncate font-extrabold text-text">{item.title}</div>
            <div className="text-xs text-subtle">{item.impressions || 0} impressões | {item.clicks || 0} cliques | CTR {item.ctr || 0}%</div>
            <div className="mt-1 text-xs text-subtle">{item.posts?.length ? `${item.posts.length} post(s) vinculado(s)` : 'Global'}</div>
          </button>
          <Badge tone={item.status === 'active' ? 'success' : 'warning'} size="sm">{item.status === 'active' ? 'Ativo' : 'Inativo'}</Badge>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            <Button size="sm" variant="outline" onClick={() => onDashboard(item)}>Dashboard</Button>
            <Button size="sm" variant="secondary" onClick={() => onToggle(item)}>{item.status === 'active' ? 'Desativar' : 'Ativar'}</Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>Editar</Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(item)}>Excluir</Button>
          </div>
        </AdminRow>
      ))}
      {items.length === 0 && <div className="p-6 text-sm text-subtle">Nenhum card cadastrado.</div>}
    </Card>
  );
}

function MetricsPanel({ card, metrics, period, onPeriod }: { card: ApiPromoCard | null; metrics: PromoCardMetrics | null; period: DashboardPeriod; onPeriod: (period: DashboardPeriod) => void }) {
  if (!card) return <Card className="p-6 text-sm text-subtle">Selecione um card para ver o dashboard.</Card>;
  const max = Math.max(1, ...(metrics?.daily || []).map((item) => Math.max(item.impressions, item.clicks)));

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-extrabold text-text">Dashboard do card</div>
          <div className="text-xs text-subtle">{card.title}</div>
        </div>
        <div className="flex rounded-md border border-border bg-glass p-1">
          {periodOptions.map((option) => <button key={option.value} type="button" onClick={() => onPeriod(option.value)} className={`h-8 rounded px-3 text-xs font-bold ${period === option.value ? 'bg-brand text-inverse' : 'text-muted'}`}>{option.label}</button>)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric title="Impressões" value={metrics?.totals.impressions || 0} />
        <Metric title="Cliques" value={metrics?.totals.clicks || 0} />
        <Metric title="CTR" value={`${metrics?.totals.ctr || 0}%`} />
      </div>

      <div className="mt-5 flex h-[170px] items-end gap-2">
        {(metrics?.daily || []).map((item) => (
          <div key={item.date} className="flex flex-1 flex-col justify-end gap-1" title={`${item.date}: ${item.impressions} impressões, ${item.clicks} cliques`}>
            <div className="rounded-t bg-brand/70" style={{ height: `${Math.max(2, (item.impressions / max) * 100)}%` }} />
            <div className="rounded-t bg-success/70" style={{ height: `${Math.max(2, (item.clicks / max) * 100)}%` }} />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {(metrics?.posts || []).map((post) => (
          <div key={post.id || post.title} className="flex items-center justify-between gap-3 rounded-md border border-border bg-glass px-3 py-2">
            <span className="truncate text-sm font-semibold text-text">{post.title}</span>
            <span className="shrink-0 text-xs text-subtle">{post.impressions} imp. | {post.clicks} cliques</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-glass p-3">
      <div className="text-xs text-subtle">{title}</div>
      <div className="text-2xl font-extrabold text-text">{value}</div>
    </div>
  );
}

function buildPromoPayloadFromCard(card: ApiPromoCard, status: ApiPromoCard['status']): PromoCardPayload {
  return {
    title: card.title,
    description: card.description || null,
    image_url: card.image_url || null,
    cta_label: card.cta_label || null,
    cta_url: card.cta_url || null,
    status,
    background_color: card.background_color || '#101828',
    text_color: card.text_color || '#FFFFFF',
    cta_color: card.cta_color || '#5CE1E6',
    author_id: card.author_id,
    post_ids: card.posts?.map((post) => post.id) || [],
  };
}
