'use client';

import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { estimateReadTime, formatDateLong, type ApiPost } from '@/lib/api';
import PostVisual from './PostVisual';

export function FeaturedPostCard({ post }: { post: ApiPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card hover className="min-h-full overflow-hidden border-border-strong bg-surface/60" padding={0}>
        <PostVisual post={post} large />
        <div className="p-5 md:p-6">
          <Badge tone="brand">{post.category_name || 'Post'}</Badge>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-normal text-text md:text-3xl">{post.title}</h3>
          <p className="mt-3 leading-7 text-muted">{post.summary}</p>
          <PostTags post={post} className="mt-4" />
          <div className="mt-5 flex items-center gap-2.5 text-xs leading-5 text-subtle">
            <Avatar name={post.author_name} size={32} />
            <span>{post.author_name} | {formatDateLong(post.published_at || post.created_at)} | {estimateReadTime(post.content)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CompactPostCard({ post }: { post: ApiPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <Card hover className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-3.5 border-border bg-surface/40 p-3.5 sm:grid-cols-[118px_minmax(0,1fr)]">
        <PostVisual post={post} />
        <div className="min-w-0">
          <div className="line-clamp-2 text-[15px] font-extrabold leading-snug text-text">{post.title}</div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{post.summary}</p>
          <PostTags post={post} compact className="mt-2" />
          <div className="mt-2 text-xs text-subtle">{post.category_name || 'Sem categoria'} | {estimateReadTime(post.content)}</div>
        </div>
      </Card>
    </Link>
  );
}

export function PostTags({ post, compact = false, className = '' }: { post: ApiPost; compact?: boolean; className?: string }) {
  if (!post.tags?.length) return null;

  const visibleTags = compact ? post.tags.slice(0, 2) : post.tags;
  const remaining = post.tags.length - visibleTags.length;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {visibleTags.map((tag) => (
        <span key={tag.id} className="inline-flex h-6 items-center rounded-full bg-brand/10 px-2.5 text-xs font-semibold text-brand">
          #{tag.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex h-6 items-center rounded-full bg-glass px-2.5 text-xs font-semibold text-subtle">
          +{remaining}
        </span>
      )}
    </div>
  );
}
