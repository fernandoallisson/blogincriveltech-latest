'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicHeader from '@/components/layout/PublicHeader';
import { type ApiCategory, type ApiPost } from '@/lib/api';
import BlogHero from './BlogHero';
import PostsBrowser from './PostsBrowser';

type CategoryOption = ApiCategory & { count: number };

export default function BlogHomeClient({
  initialPosts,
  initialCategories,
  initialError = '',
}: {
  initialPosts: ApiPost[];
  initialCategories: ApiCategory[];
  initialError?: string;
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    function syncCategoryFromHash() {
      const hash = window.location.hash.replace('#category-', '');
      if (!hash || hash === window.location.hash) return;
      setActiveCategory(hash);
    }

    syncCategoryFromHash();
    window.addEventListener('hashchange', syncCategoryFromHash);
    return () => window.removeEventListener('hashchange', syncCategoryFromHash);
  }, []);

  const categoryOptions: CategoryOption[] = useMemo(() => initialCategories.map((category) => ({
    ...category,
    count: initialPosts.filter((post) => post.category_slug === category.slug).length,
  })).filter((category) => category.count > 0), [initialCategories, initialPosts]);

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return initialPosts.filter((post) => {
      const inCategory = activeCategory === 'all' || post.category_slug === activeCategory;
      const inQuery = !term || [post.title, post.summary, post.category_name, post.author_name].filter(Boolean).some((value) => value!.toLowerCase().includes(term));
      return inCategory && inQuery;
    });
  }, [activeCategory, initialPosts, query]);

  return (
    <main className="min-h-screen bg-app">
      <PublicHeader />
      <BlogHero />
      <PostsBrowser loading={false} error={initialError} posts={filteredPosts} categories={categoryOptions} query={query} activeCategory={activeCategory} onQuery={setQuery} onCategory={setActiveCategory} />
      <PublicFooter />
    </main>
  );
}
