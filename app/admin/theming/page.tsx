'use client';

import React, { useEffect, useState } from 'react';
import AdminPageShell from '@/components/AdminPageShell';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createSetting, fetchSettings, updateSetting, type ApiSetting } from '@/lib/api';
import { AdminGrid } from '@/features/admin/shared/AdminGrid';

const presets = ['#5CE1E6', '#00A7F9', '#A78BFA', '#22C55E', '#FACC15', '#EF4444'];

export default function AdminThemingPage() {
  const [settings, setSettings] = useState<ApiSetting[]>([]);
  const [color, setColor] = useState('#5CE1E6');
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetchSettings().then((items) => { setSettings(items); setColor(items.find((item) => item.key === 'brand_color')?.value || '#5CE1E6'); }); }, []);
  async function save() {
    const existing = settings.find((item) => item.key === 'brand_color');
    if (existing) await updateSetting(existing.id, { key: 'brand_color', value: color }); else await createSetting({ key: 'brand_color', value: color });
    setSettings(await fetchSettings());
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }
  return (
    <AdminPageShell active="theme" title="Aparência" eyebrow="Tema do blog" actions={<Button icon="check" onClick={save}>{saved ? 'Salvo' : 'Salvar'}</Button>}>
      <AdminGrid className="lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-4">
          <div className="mb-3 text-xs font-extrabold text-subtle">Cor principal</div>
          <div className="flex flex-wrap gap-2">{presets.map((preset) => <button key={preset} onClick={() => setColor(preset)} className="h-[38px] w-[38px] rounded-md border" style={{ background: preset, borderColor: color === preset ? 'var(--text)' : 'var(--border)' }} />)}</div>
          <code className="mt-3.5 block text-muted">{color}</code>
        </Card>
        <Card className="p-4">
          <div className="text-4xl font-extrabold text-text">Preview com <span style={{ color }}>cor de destaque</span></div>
          <p className="my-4 leading-7 text-muted">Essa configuração salva a chave <code>brand_color</code> em `/api/settings`.</p>
          <button className="h-10 rounded-md px-4 font-extrabold text-inverse" style={{ background: color }}>Botão preview</button>
        </Card>
      </AdminGrid>
    </AdminPageShell>
  );
}
