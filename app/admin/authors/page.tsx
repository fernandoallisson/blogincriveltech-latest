'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { createUser, fetchUsers, type ApiUser } from '@/lib/api';
import { AdminGrid, AdminRow } from '@/features/admin/shared/AdminGrid';

const emptyForm = { name: '', email: '', password: '' };

export default function AdminAuthorsPage() {
  const [items, setItems] = useState<ApiUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  async function load() {
    try {
      setItems(await fetchUsers());
    } catch {
      setItems([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    try {
      await createUser(form);
      setForm(emptyForm);
      setMessage('Autor criado.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Falha ao criar autor.');
    }
  }

  return (
    <AdminPageShell active="auth" title="Autores" eyebrow={`${items.length} usuários`}>
      <AdminGrid>
        <Card className="p-4">
          <form onSubmit={save} className="flex flex-col gap-3">
            <div className="font-extrabold text-text">Novo autor</div>
            <Input label="Nome" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
            <Input label="Senha" type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
            {message && <div className={`text-xs ${message.includes('Falha') ? 'text-error' : 'text-success'}`}>{message}</div>}
            <Button type="submit" full disabled={!form.name || !form.email || !form.password}>Criar autor</Button>
          </form>
        </Card>
        <Card padding={0}>
          {items.map((user) => (
            <AdminRow key={user.id} className="md:grid-cols-[minmax(0,1fr)_120px]">
              <div className="flex items-center gap-2.5"><Avatar name={user.name} /><div><b className="text-text">{user.name}</b><div className="text-xs text-subtle">{user.email}</div></div></div>
              <Badge tone={user.role === 'admin' ? 'brand' : 'info'} size="sm">{user.role}</Badge>
            </AdminRow>
          ))}
        </Card>
      </AdminGrid>
    </AdminPageShell>
  );
}
