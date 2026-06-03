'use client';

import { type ApiPost, type ApiPromoCard } from '@/lib/api';
import { PostCover, PromoCardList } from './PostActions';

export default function PostContent({ post, promoCards }: { post: ApiPost; promoCards: ApiPromoCard[]; onShare: () => void }) {
  return (
    <div className="mt-9 grid items-start gap-7 md:grid-cols-[minmax(0,1fr)_280px]">
      <section>
        <div className="whitespace-pre-wrap text-[17px] leading-8 text-text">{post.content}</div>
        {post.image_position === 'below_content' && <div className="mt-7 overflow-hidden rounded-md border border-border"><PostCover post={post} className="h-[280px]" /></div>}
      </section>
      <aside className="space-y-4 md:sticky md:top-[88px]">
        <PromoCardList cards={promoCards} postId={post.id} />
      </aside>
    </div>
  );
}
