'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { createSetting, deleteSetting, fetchSettings, updateSetting, type ApiSetting } from '@/lib/api';
import { AdminGrid, AdminRow } from '@/features/admin/shared/AdminGrid';

export default function AdminSettingsPage() {
  const [items, setItems] = useState<ApiSetting[]>([]);
  const [form, setForm] = useState({ key: '', value: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  async function load() { setItems(await fetchSettings()); }
  useEffect(() => { load(); }, []);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editingId) await updateSetting(editingId, form); else await createSetting(form);
    setForm({ key: '', value: '' }); setEditingId(null); await load();
  }
  return (
    <AdminPageShell active="set" title="Configuracoes" eyebrow={`${items.length} chaves`}>
      <AdminGrid>
        <Card className="p-4"><form onSubmit={save} className="flex flex-col gap-3"><Input label="Chave" value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} /><Textarea label="Valor" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} /><Button type="submit" full>Salvar</Button></form></Card>
        <Card padding={0}>{items.map((item) => <AdminRow key={item.id} className="md:grid-cols-[180px_minmax(0,1fr)_140px]"><code className="text-brand">{item.key}</code><div className="truncate text-muted">{item.value}</div><div className="flex gap-1.5"><Button size="sm" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ key: item.key, value: item.value }); }}>Editar</Button><Button size="sm" variant="danger" onClick={async () => { await deleteSetting(item.id); await load(); }}>Excluir</Button></div></AdminRow>)}</Card>
      </AdminGrid>
    </AdminPageShell>
  );
}
