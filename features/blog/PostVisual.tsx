'use client';

import Icon from '@/components/Icon';
import { type ApiPost } from '@/lib/api';
import { cn } from '@/lib/cn';

export default function PostVisual({ post, large = false }: { post: ApiPost; large?: boolean }) {
  const classes = cn('block shrink-0 border border-border bg-surface-2 object-cover', large ? 'h-[255px] w-full rounded-t-md border-x-0 border-t-0' : 'h-[92px] w-full rounded-sm');

  if (post.cover_image) {
    return <img src={post.cover_image} alt="" className={classes} />;
  }

  return (
    <div className={cn(classes, 'grid place-items-center gap-2 bg-gradient-to-br from-brand/20 to-surface-2 text-xs text-subtle')}>
      <Icon name="file" size={large ? 34 : 24} />
      {large && <span>{post.category_name || 'Artigo'}</span>}
    </div>
  );
}
