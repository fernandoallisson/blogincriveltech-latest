'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { createCategory, deleteCategory, fetchCategories, updateCategory, type ApiCategory } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { AdminGrid, AdminRow } from '@/features/admin/shared/AdminGrid';
import { slugify } from '@/features/admin/shared/slugify';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  async function load() { setItems(await fetchCategories()); }
  useEffect(() => { setIsAdmin(getStoredUser()?.role === 'admin'); load(); }, []);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description || null };
    if (editingId) await updateCategory(editingId, payload); else await createCategory({ ...payload, description: payload.description || undefined });
    setForm({ name: '', slug: '', description: '' }); setEditingId(null); await load();
  }
  return (
    <AdminPageShell active="cats" title="Categorias" eyebrow={`${items.length} categorias`}>
      <AdminGrid>
        <Card className="p-4"><form onSubmit={save} className="flex flex-col gap-3"><Input label="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} /><Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} /><Textarea label="Descrição" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /><Button type="submit" full>Salvar</Button></form></Card>
        <Card padding={0}>{items.map((item) => <AdminRow key={item.id} className="md:grid-cols-[minmax(0,1fr)_140px]"><div><b className="text-text">{item.name}</b><div className="text-xs text-subtle">{item.slug}</div></div><div className="flex gap-1.5"><Button size="sm" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ name: item.name, slug: item.slug, description: item.description || '' }); }}>Editar</Button>{isAdmin && <Button size="sm" variant="danger" onClick={async () => { await deleteCategory(item.id); await load(); }}>Excluir</Button>}</div></AdminRow>)}</Card>
      </AdminGrid>
    </AdminPageShell>
  );
}
