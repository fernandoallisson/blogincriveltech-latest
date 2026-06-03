import { fetchCommentsByPost, fetchPostBySlug, fetchPublicPromoCards, type ApiComment, type ApiPost, type ApiPromoCard } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';
import BlogPostClient from './BlogPostClient';

export default async function BlogPostView({ slug }: { slug: string }) {
  let post: ApiPost | null = null;
  let comments: ApiComment[] = [];
  let promoCards: ApiPromoCard[] = [];
  let error = '';

  try {
    const item = await fetchPostBySlug(slug);
    if (!isPostPublic(item)) {
      error = 'Post não encontrado.';
    } else {
      post = item;
      [comments, promoCards] = await Promise.all([
        fetchCommentsByPost(item.id).catch(() => []),
        fetchPublicPromoCards(item.id).catch(() => []),
      ]);
    }
  } catch {
    error = 'Não foi possível carregar este post.';
  }

  return <BlogPostClient initialPost={post} initialComments={comments} initialPromoCards={promoCards} initialError={error} />;
}
