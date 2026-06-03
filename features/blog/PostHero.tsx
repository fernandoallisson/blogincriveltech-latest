'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { estimateReadTime, formatDateLong, type ApiPost } from '@/lib/api';
import PostActions, { PostCover } from './PostActions';
import { PostTags } from './PostCards';

export default function PostHero({ post, onPostChange, shareStatus, onShare }: { post: ApiPost; onPostChange: (post: ApiPost) => void; shareStatus: string; onShare: () => void }) {
  const side = post.image_position === 'side';
  return (
    <div>
      {post.image_position === 'wide' && <div className="mb-7 overflow-hidden rounded-md border border-border"><PostCover post={post} className="h-[340px]" /></div>}
      <div className={side ? 'grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_360px]' : 'grid gap-7'}>
        <div>
          <Badge tone="brand">{post.category_name || 'Post'}</Badge>
          <h1 className="mt-4 max-w-[820px] text-[34px] font-bold leading-tight tracking-normal text-text md:text-[46px]">{post.title}</h1>
          <p className="mt-3 max-w-[720px] text-lg leading-8 text-muted">{post.summary}</p>
          <PostTags post={post} className="mt-4" />
          {post.image_position === 'below_title' && <div className="mt-6 overflow-hidden rounded-md border border-border"><PostCover post={post} className="h-[280px]" /></div>}
          <div className="mt-6 flex items-center gap-2.5 text-[13px] leading-5 text-subtle">
            <Avatar name={post.author_name} size={40} />
            <span>{post.author_name} | {formatDateLong(post.published_at || post.created_at)} | {estimateReadTime(post.content)}</span>
          </div>
        </div>
        <PostActions post={post} onPostChange={onPostChange} shareStatus={shareStatus} onShare={onShare} showMedia={side} />
      </div>
    </div>
  );
}
