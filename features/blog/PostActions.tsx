'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { recordLike, trackPromoCardEvent, type ApiPost, type ApiPromoCard } from '@/lib/api';

export default function PostActions({
  post,
  onPostChange,
  shareStatus,
  onShare,
  showMedia = true,
}: {
  post: ApiPost;
  onPostChange: (post: ApiPost) => void;
  shareStatus: string;
  onShare: () => void;
  showMedia?: boolean;
}) {
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    onPostChange({ ...post, likes: (post.likes || 0) + 1 });

    try {
      await recordLike(post.id);
    } catch {
      setLiked(false);
      onPostChange(post);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface/35">
      {showMedia && <PostCover post={post} />}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4">
        <ActionButton onClick={handleLike} icon="heart" label={String(post.likes || 0)} active={liked} activeClassName="text-error" />
        <ActionButton icon="eye" label={`${post.views || 0}`} />
        <ActionButton onClick={onShare} icon="share" label="Compartilhar" />
      </div>
      {shareStatus && <div className="px-4 pb-4 text-xs text-subtle">{shareStatus}</div>}
    </div>
  );
}

export function PostCover({ post, className = 'h-[230px]' }: { post: ApiPost; className?: string }) {
  if (post.cover_image) return <img src={post.cover_image} alt="" className={`${className} w-full object-cover`} />;
  return <CoverFallback label={post.category_name || 'Artigo'} className={className} />;
}

export function ShareCard({ onShare, readTime }: { onShare: () => void; readTime: string }) {
  return (
    <Card className="p-4">
      <div className="inline-flex rounded-full border border-border-strong bg-glass px-2.5 py-1 text-xs font-semibold text-muted">Leitura</div>
      <div className="mt-3 text-[22px] font-extrabold text-text">{readTime}</div>
      <p className="my-4 leading-6 text-muted">Salve o link ou compartilhe com alguém que precisa desse contexto.</p>
      <Button variant="secondary" icon="share" full onClick={onShare}>Compartilhar</Button>
    </Card>
  );
}

export function PromoCardList({ cards, postId }: { cards: ApiPromoCard[]; postId: number }) {
  if (cards.length === 0) return null;
  return (
    <div className="space-y-4">
      {cards.map((card) => <PublicPromoCard key={card.id} card={card} postId={postId} />)}
    </div>
  );
}

function PublicPromoCard({ card, postId }: { card: ApiPromoCard; postId: number }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || trackedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || trackedRef.current) return;
        trackedRef.current = true;
        trackPromoCardEvent(card.id, 'impression', postId).catch(() => undefined);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [card.id, postId]);

  async function handleClick() {
    await trackPromoCardEvent(card.id, 'click', postId).catch(() => undefined);
    if (card.cta_url) window.open(card.cta_url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div ref={cardRef} className="overflow-hidden rounded-md border border-border shadow-lg" style={{ backgroundColor: card.background_color, color: card.text_color }}>
      {card.image_url && <img src={card.image_url} alt="" className="h-[150px] w-full object-cover" />}
      <div className="p-4">
        <div className="text-xl font-extrabold leading-tight">{card.title}</div>
        {card.description && <p className="mt-2 text-sm leading-6 opacity-80">{card.description}</p>}
        {card.cta_label && card.cta_url && (
          <button
            type="button"
            onClick={handleClick}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-extrabold transition hover:brightness-110"
            style={{ backgroundColor: card.cta_color, color: '#101828' }}
          >
            {card.cta_label}
          </button>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, active, activeClassName }: { icon: string; label: string; onClick?: () => void; active?: boolean; activeClassName?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex min-h-[34px] items-center justify-center gap-2 text-sm font-semibold text-muted transition hover:text-text',
        active && (activeClassName || 'text-brand'),
      )}
    >
      <Icon name={icon} size={17} />
      {label}
    </button>
  );
}

function CoverFallback({ label, className }: { label: string; className: string }) {
  return (
    <div className={`${className} grid w-full place-items-center gap-2 bg-gradient-to-br from-brand-2/20 to-surface-2 text-subtle`}>
      <Icon name="file" size={36} />
      <span>{label}</span>
    </div>
  );
}
