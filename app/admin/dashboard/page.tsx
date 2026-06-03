'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminPageShell from '@/components/AdminPageShell';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { fetchDashboardMetrics, type DashboardMetrics, type DashboardPeriod } from '@/lib/api';

const periodOptions: Array<{ value: DashboardPeriod; label: string }> = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '365d', label: '1a' },
  { value: 'all', label: 'Tudo' },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        setMetrics(await fetchDashboardMetrics(period));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar dashboard.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [period]);

  const eyebrow = loading ? 'Carregando metricas' : metrics ? buildEyebrow(metrics) : 'Sem dados';

  return (
    <AdminPageShell
      active="dashboard"
      title="Dashboard"
      eyebrow={eyebrow}
      actions={<Link href="/admin/posts"><Button icon="plus">Novo post</Button></Link>}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <PeriodFilter value={period} onChange={setPeriod} />
        {error && <div className="text-sm text-error">{error}</div>}
      </div>

      {!metrics ? (
        <Card className="p-6 text-sm text-subtle">{loading ? 'Carregando...' : 'Nenhuma metrica disponivel.'}</Card>
      ) : (
        <div className="space-y-4">
          <StatsGrid metrics={metrics} />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
            <ActivityChart metrics={metrics} />
            <StatusChart metrics={metrics} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.2fr)]">
            <CategoryChart metrics={metrics} />
            <TopPostsTable metrics={metrics} />
          </div>

          <RecentPosts metrics={metrics} />
        </div>
      )}
    </AdminPageShell>
  );
}

function PeriodFilter({ value, onChange }: { value: DashboardPeriod; onChange: (period: DashboardPeriod) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Periodo</span>
      <div className="flex rounded-md border border-border bg-glass p-1">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-8 rounded px-3 text-xs font-bold transition ${value === option.value ? 'bg-brand text-inverse' : 'text-muted hover:text-text'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatsGrid({ metrics }: { metrics: DashboardMetrics }) {
  const stats = [
    { title: 'Views', value: metrics.totals.views, detail: 'no periodo', tone: 'brand' },
    { title: 'Likes', value: metrics.totals.likes, detail: `${metrics.totals.engagementRate}% engajamento`, tone: 'success' },
    { title: 'Comentarios', value: metrics.totals.comments, detail: 'interacoes recebidas', tone: 'info' },
    { title: 'Posts novos', value: metrics.totals.periodPosts, detail: `${metrics.totals.posts} no total`, tone: 'neutral' },
    { title: 'Programados', value: metrics.totals.scheduled, detail: `${metrics.totals.drafts} rascunhos`, tone: 'warning' },
    { title: 'Newsletter', value: metrics.totals.subscribers, detail: 'inscritos no periodo', tone: 'success' },
    { title: 'Midias', value: metrics.totals.media, detail: 'arquivos cadastrados', tone: 'info' },
    { title: 'Taxonomia', value: metrics.totals.categories + metrics.totals.tags, detail: `${metrics.totals.categories} categorias, ${metrics.totals.tags} tags`, tone: 'neutral' },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => <Stat key={stat.title} {...stat} />)}
    </div>
  );
}

function Stat({ title, value, detail, tone }: { title: string; value: number; detail: string; tone: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-subtle">{title}</div>
          <div className="mt-1 text-3xl font-extrabold text-text">{formatNumber(value)}</div>
          <div className="mt-1 text-xs text-muted">{detail}</div>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${toneDot(tone)}`} />
      </div>
    </Card>
  );
}

function ActivityChart({ metrics }: { metrics: DashboardMetrics }) {
  const visible = useMemo(() => sampleActivity(metrics.activity, 36), [metrics.activity]);
  const max = Math.max(1, ...visible.map((item) => Math.max(item.views, item.likes, item.comments, item.posts)));

  return (
    <Card className="p-4">
      <ChartHeader title="Atividade por dia" detail="Views, likes, comentarios e posts" />
      <div className="mt-5 flex h-[220px] items-end gap-1.5 overflow-hidden">
        {visible.map((item) => (
          <div key={item.date} className="flex min-w-[9px] flex-1 flex-col justify-end gap-0.5" title={`${formatDate(item.date)} | ${item.views} views | ${item.likes} likes | ${item.comments} comentarios | ${item.posts} posts`}>
            <div className="rounded-t bg-brand/75" style={{ height: `${barHeight(item.views, max)}%` }} />
            <div className="rounded-t bg-success/70" style={{ height: `${barHeight(item.likes, max)}%` }} />
            <div className="rounded-t bg-info/70" style={{ height: `${barHeight(item.comments, max)}%` }} />
            <div className="rounded-t bg-warning/70" style={{ height: `${barHeight(item.posts, max)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-subtle">
        <Legend color="bg-brand" label="Views" />
        <Legend color="bg-success" label="Likes" />
        <Legend color="bg-info" label="Comentarios" />
        <Legend color="bg-warning" label="Posts" />
      </div>
    </Card>
  );
}

function StatusChart({ metrics }: { metrics: DashboardMetrics }) {
  const rows = normalizeStatusRows(metrics);
  const max = Math.max(1, ...rows.map((row) => row.total));

  return (
    <Card className="p-4">
      <ChartHeader title="Status dos posts" detail={`${metrics.totals.posts} posts no total`} />
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <MetricBar key={row.label} label={row.label} value={row.total} max={max} badge={row.badge} />
        ))}
      </div>
    </Card>
  );
}

function CategoryChart({ metrics }: { metrics: DashboardMetrics }) {
  const max = Math.max(1, ...metrics.categoryBreakdown.map((item) => item.posts));

  return (
    <Card className="p-4">
      <ChartHeader title="Categorias" detail="Posts criados no periodo" />
      <div className="mt-5 space-y-3">
        {metrics.categoryBreakdown.length ? metrics.categoryBreakdown.map((item) => (
          <MetricBar key={item.name} label={item.name} value={item.posts} max={max} />
        )) : <EmptyState>Nenhum post no periodo.</EmptyState>}
      </div>
    </Card>
  );
}

function TopPostsTable({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Card padding={0} className="overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <ChartHeader title="Top posts" detail="Ordenado por views e likes" />
      </div>
      {metrics.topPosts.length ? metrics.topPosts.map((post) => (
        <div key={post.id} className="grid gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_80px_80px] md:items-center">
          <Link href={`/blog/${post.slug}`} className="min-w-0">
            <div className="truncate font-bold text-text">{post.title}</div>
            <div className="text-xs text-subtle">{post.author_name}</div>
          </Link>
          <div className="text-xs font-semibold text-muted">{formatNumber(post.views)} views</div>
          <div className="text-xs font-semibold text-muted">{formatNumber(post.likes)} likes</div>
        </div>
      )) : <EmptyState>Nenhum post ranqueado.</EmptyState>}
    </Card>
  );
}

function RecentPosts({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Card padding={0} className="overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <ChartHeader title="Posts recentes" detail="Ultimos conteudos cadastrados" />
      </div>
      {metrics.recentPosts.map((post) => (
        <div key={post.id} className="grid gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_90px_90px] md:items-center">
          <Link href={`/blog/${post.slug}`} className="min-w-0">
            <div className="truncate font-bold text-text">{post.title}</div>
            <div className="text-xs text-subtle">{post.category_name || 'Sem categoria'} | {formatDate(post.created_at)}</div>
          </Link>
          <Badge tone={post.status === 'published' ? 'success' : post.status === 'scheduled' ? 'info' : post.status === 'archived' ? 'error' : 'warning'} size="sm">{statusLabel(post.status)}</Badge>
          <div className="text-xs text-subtle">{formatNumber(post.views)} views</div>
          <div className="text-xs text-subtle">{formatNumber(post.likes)} likes</div>
        </div>
      ))}
    </Card>
  );
}

function MetricBar({ label, value, max, badge }: { label: string; value: number; max: number; badge?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="truncate text-sm font-semibold text-text">{label}</div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          {badge}
          {formatNumber(value)}
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function ChartHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <div className="font-extrabold text-text">{title}</div>
      <div className="text-xs text-subtle">{detail}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-6 text-sm text-subtle">{children}</div>;
}

function sampleActivity(activity: DashboardMetrics['activity'], limit: number) {
  if (activity.length <= limit) return activity;
  const step = Math.ceil(activity.length / limit);
  return activity.filter((_, index) => index % step === 0).slice(-limit);
}

function normalizeStatusRows(metrics: DashboardMetrics) {
  const byStatus = new Map(metrics.postStatus.map((item) => [item.status, item.total]));
  return [
    { label: 'Publicados', total: byStatus.get('published') || 0, badge: <Badge tone="success" size="sm">publicado</Badge> },
    { label: 'Programados', total: byStatus.get('scheduled') || 0, badge: <Badge tone="info" size="sm">programado</Badge> },
    { label: 'Rascunhos', total: byStatus.get('draft') || 0, badge: <Badge tone="warning" size="sm">rascunho</Badge> },
    { label: 'Arquivados', total: byStatus.get('archived') || 0, badge: <Badge tone="error" size="sm">arquivado</Badge> },
  ];
}

function barHeight(value: number, max: number) {
  if (!value) return 1;
  return Math.max(4, (value / max) * 100);
}

function toneDot(tone: string) {
  const tones: Record<string, string> = {
    brand: 'bg-brand',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
    neutral: 'bg-muted',
  };
  return tones[tone] || tones.neutral;
}

function buildEyebrow(metrics: DashboardMetrics) {
  if (!metrics.range.start) return 'Todo o historico';
  return `${formatDate(metrics.range.start)} a ${formatDate(metrics.range.end)}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    published: 'Publicado',
    scheduled: 'Programado',
    draft: 'Rascunho',
    archived: 'Arquivado',
  };
  return labels[status] || status;
}
