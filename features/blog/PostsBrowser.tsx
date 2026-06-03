'use client';

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { type ApiCategory, type ApiPost } from '@/lib/api';
import { cn } from '@/lib/cn';
import { CompactPostCard, FeaturedPostCard } from './PostCards';

type CategoryOption = ApiCategory & { count: number };

export default function PostsBrowser({
  loading,
  error,
  posts,
  categories,
  query,
  activeCategory,
  onQuery,
  onCategory,
}: {
  loading: boolean;
  error: string;
  posts: ApiPost[];
  categories: CategoryOption[];
  query: string;
  activeCategory: string;
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
}) {
  const featured = posts[0];
  const remaining = posts.slice(1);
  const totalPosts = categories.reduce((total, item) => total + item.count, 0);

  function selectCategory(slug: string) {
    onCategory(slug);
    if (typeof window === 'undefined') return;
    const hash = slug === 'all' ? '#categorias' : `#category-${slug}`;
    window.history.replaceState(null, '', hash);
  }

  return (
    <section id="posts" className="mx-auto max-w-[1180px] px-4 pb-16 pt-5 md:px-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-normal text-text md:text-[34px]">Posts em destaque</h2>
        </div>
        <div className="w-full md:max-w-[380px]">
          <Input icon="search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar por título, tema ou autor" />
        </div>
      </div>

      <div id="categorias" className="mb-5 scroll-mt-24 border-b border-border">
        <div className="flex gap-5 overflow-x-auto">
          <CategoryChip active={activeCategory === 'all'} onClick={() => selectCategory('all')} label="Todos" count={totalPosts} />
          {categories.map((category) => (
            <CategoryChip key={category.id} id={`category-${category.slug}`} active={activeCategory === category.slug} onClick={() => selectCategory(category.slug)} label={category.name} count={category.count} />
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="p-6 text-muted">Carregando posts...</Card>
      ) : error ? (
        <Card className="p-6 text-error">{error}</Card>
      ) : !featured ? (
        <Card className="p-6">
          <div className="text-text">Nenhum post encontrado.</div>
          <div className="mt-2 text-muted">Tente limpar a busca ou selecionar outra categoria.</div>
        </Card>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <FeaturedPostCard post={featured} />
          <div className="grid gap-3">
            {remaining.map((post) => <CompactPostCard key={post.id} post={post} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function CategoryChip({ id, active, onClick, label, count }: { id?: string; active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={cn(
        'group relative inline-flex h-[46px] shrink-0 scroll-mt-28 items-center gap-2 whitespace-nowrap text-sm font-bold transition',
        active ? 'text-text' : 'text-muted hover:text-text',
      )}
    >
      <span>{label}</span>
      <span className={cn('text-xs font-semibold transition', active ? 'text-brand' : 'text-subtle group-hover:text-muted')}>{count}</span>
      <span className={cn('absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-brand transition', active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50')} />
    </button>
  );
}
