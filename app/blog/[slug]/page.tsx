import BlogPostView from '@/features/blog/BlogPostView';

export const revalidate = 60;

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostView slug={params.slug} />;
}
