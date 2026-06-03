'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { createTag, deleteTag, fetchTags, updateTag, type ApiTag } from '@/lib/api';
import { AdminGrid } from '@/features/admin/shared/AdminGrid';
import { slugify } from '@/features/admin/shared/slugify';

export default function AdminTagsPage() {
  const [items, setItems] = useState<ApiTag[]>([]);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  async function load() { setItems(await fetchTags()); }
  useEffect(() => { load(); }, []);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { name: form.name, slug: form.slug || slugify(form.name) };
    if (editingId) await updateTag(editingId, payload); else await createTag(payload);
    setForm({ name: '', slug: '' }); setEditingId(null); await load();
  }
  return (
    <AdminPageShell active="tags" title="Tags" eyebrow={`${items.length} tags`}>
      <AdminGrid className="lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-4"><form onSubmit={save} className="flex flex-col gap-3"><Input label="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} /><Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} /><Button type="submit" full>Salvar</Button></form></Card>
        <Card className="p-4"><div className="flex flex-wrap gap-2.5">{items.map((item) => <div key={item.id} className="rounded-md border border-border p-2.5"><b className="text-text">{item.name}</b><div className="text-xs text-subtle">{item.slug}</div><div className="mt-2 flex gap-1.5"><Button size="sm" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ name: item.name, slug: item.slug }); }}>Editar</Button><Button size="sm" variant="danger" onClick={async () => { await deleteTag(item.id); await load(); }}>Excluir</Button></div></div>)}</div></Card>
      </AdminGrid>
    </AdminPageShell>
  );
}
