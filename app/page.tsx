import BlogHome from '@/features/blog/BlogHome';

export const revalidate = 60;

export default function HomePage() {
  return <BlogHome />;
}
