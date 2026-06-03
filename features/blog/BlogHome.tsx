import { fetchCategories, fetchPosts, type ApiCategory, type ApiPost } from '@/lib/api';
import { isPostPublic } from '@/lib/publication';
import BlogHomeClient from './BlogHomeClient';

export default async function BlogHome() {
  let posts: ApiPost[] = [];
  let categories: ApiCategory[] = [];
  let error = '';

  try {
    const [postData, categoryData] = await Promise.all([fetchPosts(), fetchCategories()]);
    posts = postData.filter((post) => isPostPublic(post)).sort(byNewest);
    categories = categoryData;
  } catch {
    error = 'Não foi possível carregar os posts agora.';
  }

  return <BlogHomeClient initialPosts={posts} initialCategories={categories} initialError={error} />;
}

function byNewest(a: ApiPost, b: ApiPost) {
  return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
}
