import { supabase } from './supabase';
import { type DashboardMetrics, type DashboardPeriod } from './apiTypes';

function periodToDate(period: DashboardPeriod): string | null {
  if (period === 'all') return null;
  const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[period];
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function fetchDashboardMetrics(period: DashboardPeriod = '30d'): Promise<DashboardMetrics> {
  const since = periodToDate(period);
  const now = new Date().toISOString();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  // Base posts query
  let postsQuery = supabase.from('posts').select('id, status, author_id, created_at, published_at');
  if (!isAdmin) postsQuery = postsQuery.eq('author_id', session.user.id);

  const { data: allPosts } = await postsQuery;
  const posts = allPosts ?? [];

  const postIds = posts.map((p) => p.id);

  // Counts
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const archived = posts.filter((p) => p.status === 'archived').length;
  const periodPosts = since
    ? posts.filter((p) => p.created_at >= since).length
    : posts.length;

  // Views and likes for these posts
  const [viewsRes, likesRes, commentsRes] = await Promise.all([
    postIds.length
      ? supabase.from('post_views').select('post_id, created_at').in('post_id', postIds)
      : { data: [] },
    postIds.length
      ? supabase.from('likes').select('post_id, created_at').in('post_id', postIds)
      : { data: [] },
    postIds.length
      ? supabase.from('comments').select('post_id, created_at').in('post_id', postIds)
      : { data: [] },
  ]);

  const views = (viewsRes.data ?? []).length;
  const likesCount = (likesRes.data ?? []).length;
  const commentsCount = (commentsRes.data ?? []).length;

  // Engagement rate: (likes + comments) / views * 100
  const engagementRate = views > 0 ? Math.round(((likesCount + commentsCount) / views) * 10000) / 100 : 0;

  // Newsletter (admin only)
  let subscribers = 0;
  if (isAdmin) {
    const { count } = await supabase
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');
    subscribers = count ?? 0;
  }

  // Media count
  let mediaQuery = supabase.from('media').select('id', { count: 'exact', head: true });
  if (!isAdmin) mediaQuery = mediaQuery.eq('uploaded_by', session.user.id);
  const { count: mediaCount } = await mediaQuery;

  // Categories and tags
  const { count: categoriesCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true });
  const { count: tagsCount } = await supabase
    .from('tags')
    .select('id', { count: 'exact', head: true });

  // Post status breakdown
  const postStatus = [
    { status: 'published' as const, total: published },
    { status: 'draft' as const, total: drafts },
    { status: 'scheduled' as const, total: scheduled },
    { status: 'archived' as const, total: archived },
  ];

  // Activity: daily views/likes/comments/posts for period
  const activitySince = since ?? posts[posts.length - 1]?.created_at ?? now;
  const activityMap: Record<string, { views: number; likes: number; comments: number; posts: number }> = {};

  for (const v of (viewsRes.data ?? [])) {
    if (v.created_at >= activitySince) {
      const day = v.created_at.slice(0, 10);
      if (!activityMap[day]) activityMap[day] = { views: 0, likes: 0, comments: 0, posts: 0 };
      activityMap[day].views++;
    }
  }
  for (const l of (likesRes.data ?? [])) {
    if (l.created_at >= activitySince) {
      const day = l.created_at.slice(0, 10);
      if (!activityMap[day]) activityMap[day] = { views: 0, likes: 0, comments: 0, posts: 0 };
      activityMap[day].likes++;
    }
  }
  for (const c of (commentsRes.data ?? [])) {
    if (c.created_at >= activitySince) {
      const day = c.created_at.slice(0, 10);
      if (!activityMap[day]) activityMap[day] = { views: 0, likes: 0, comments: 0, posts: 0 };
      activityMap[day].comments++;
    }
  }
  for (const p of posts) {
    if (!since || p.created_at >= since) {
      const day = p.created_at.slice(0, 10);
      if (!activityMap[day]) activityMap[day] = { views: 0, likes: 0, comments: 0, posts: 0 };
      activityMap[day].posts++;
    }
  }

  const activity = Object.entries(activityMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // Top posts by views
  const viewsByPost: Record<string, number> = {};
  const likesByPost: Record<string, number> = {};
  for (const v of (viewsRes.data ?? [])) {
    viewsByPost[v.post_id] = (viewsByPost[v.post_id] ?? 0) + 1;
  }
  for (const l of (likesRes.data ?? [])) {
    likesByPost[l.post_id] = (likesByPost[l.post_id] ?? 0) + 1;
  }

  const postsWithCounts = posts.map((p) => ({
    ...p,
    views: viewsByPost[p.id] ?? 0,
    likes: likesByPost[p.id] ?? 0,
  }));

  const topPosts = postsWithCounts
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      title: '',
      slug: '',
      status: p.status as DashboardMetrics['topPosts'][0]['status'],
      author_id: p.author_id,
      author_name: '',
      views: p.views,
      likes: p.likes,
    }));

  // Enrich top posts with title/slug/author_name
  if (topPosts.length > 0) {
    const { data: enriched } = await supabase
      .from('posts')
      .select('id, title, slug, author_id, author:author_id(name)')
      .in('id', topPosts.map((p) => p.id));

    for (const tp of topPosts) {
      const match = (enriched ?? []).find((e) => e.id === tp.id);
      if (match) {
        tp.title = match.title;
        tp.slug = match.slug;
        tp.author_name = (match.author as { name?: string } | null)?.name ?? '';
      }
    }
  }

  // Category breakdown
  const { data: categoryPosts } = await supabase
    .from('posts')
    .select('category_id, categories(name)')
    .in('id', postIds);

  const catMap: Record<string, number> = {};
  for (const cp of (categoryPosts ?? [])) {
    const name = (cp.categories as { name?: string } | null)?.name ?? 'Sem categoria';
    catMap[name] = (catMap[name] ?? 0) + 1;
  }
  const categoryBreakdown = Object.entries(catMap)
    .map(([name, posts]) => ({ name, posts }))
    .sort((a, b) => b.posts - a.posts);

  // Recent posts
  const recentPostIds = posts
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 10)
    .map((p) => p.id);

  let recentPosts: DashboardMetrics['recentPosts'] = [];
  if (recentPostIds.length > 0) {
    const { data: recent } = await supabase
      .from('posts')
      .select('id, title, slug, status, category_id, categories(name), created_at, published_at')
      .in('id', recentPostIds)
      .order('created_at', { ascending: false });

    recentPosts = (recent ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.status as DashboardMetrics['recentPosts'][0]['status'],
      category_name: (p.categories as { name?: string } | null)?.name ?? null,
      created_at: p.created_at,
      published_at: p.published_at,
      views: viewsByPost[p.id] ?? 0,
      likes: likesByPost[p.id] ?? 0,
    }));
  }

  return {
    period,
    range: { start: since, end: now },
    totals: {
      posts: posts.length,
      published,
      drafts,
      scheduled,
      archived,
      periodPosts,
      views,
      likes: likesCount,
      comments: commentsCount,
      subscribers,
      media: mediaCount ?? 0,
      categories: categoriesCount ?? 0,
      tags: tagsCount ?? 0,
      engagementRate,
    },
    postStatus,
    activity,
    topPosts,
    categoryBreakdown,
    recentPosts,
  };
}
