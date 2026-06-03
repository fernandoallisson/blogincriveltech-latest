'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicHeader from '@/components/layout/PublicHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { fetchCommentsByPost, recordView, type ApiComment, type ApiPost, type ApiPromoCard } from '@/lib/api';
import CommentsSection from './CommentsSection';
import PostContent from './PostContent';
import PostHero from './PostHero';

export default function BlogPostClient({
  initialPost,
  initialComments,
  initialPromoCards,
  initialError = '',
}: {
  initialPost: ApiPost | null;
  initialComments: ApiComment[];
  initialPromoCards: ApiPromoCard[];
  initialError?: string;
}) {
  const [post, setPost] = useState<ApiPost | null>(initialPost);
  const [comments, setComments] = useState<ApiComment[]>(initialComments);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    if (!initialPost) return;
    recordView(initialPost.id);
  }, [initialPost]);

  async function loadComments(postId = post?.id) {
    if (!postId) return;
    try {
      const commentData = await fetchCommentsByPost(postId);
      setComments(commentData);
    } catch {
      setComments([]);
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: post?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copiado.');
      }
    } catch {
      setShareStatus('Compartilhamento cancelado.');
    }
  }

  if (initialError || !post) {
    return (
      <main className="grid min-h-screen place-items-center bg-app p-6">
        <Card className="p-6">
          <div className="mb-3.5 text-error">{initialError || 'Post não encontrado.'}</div>
          <Link href="/"><Button variant="secondary" icon="chevleft">Voltar ao blog</Button></Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app">
      <PublicHeader backHref="/" />
      <article className="mx-auto max-w-[1180px] px-5 py-10 md:px-6">
        <PostHero post={post} onPostChange={setPost} shareStatus={shareStatus} onShare={share} />
        <PostContent post={post} promoCards={initialPromoCards} onShare={share} />
      </article>
      <CommentsSection post={post} comments={comments} onReload={() => loadComments(post.id)} />
      <PublicFooter />
    </main>
  );
}
