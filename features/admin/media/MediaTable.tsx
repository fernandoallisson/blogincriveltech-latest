'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { type ApiMedia } from '@/lib/api';
import { AdminRow } from '../shared/AdminGrid';

export default function MediaTable({ items, onEdit, onDelete }: { items: ApiMedia[]; onEdit: (item: ApiMedia) => void; onDelete: (item: ApiMedia) => void }) {
  return (
    <Card padding={0}>
      {items.map((item) => (
        <AdminRow key={item.id} className="md:grid-cols-[minmax(0,1fr)_150px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <b className="text-text">{item.filename}</b>
              {item.post_title ? <Badge tone="success" size="sm">{item.post_title}</Badge> : <Badge tone="warning" size="sm">Sem post</Badge>}
            </div>
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-1.5 block truncate text-xs text-subtle">{item.url}</a>
          </div>
          <div className="flex gap-1.5 md:justify-end">
            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>Editar</Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(item)}>Excluir</Button>
          </div>
        </AdminRow>
      ))}
    </Card>
  );
}
