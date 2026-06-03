export interface ApiPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string | null;
  image_position: ImagePosition;
  status: PostStatus;
  author_id: number;
  author_name: string;
  category_id?: number | null;
  category_name: string | null;
  category_slug: string | null;
  media_id?: number | null;
  media_filename?: string | null;
  scheduled_at?: string | null;
  schedule_status?: 'pending' | 'published' | 'cancelled' | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views?: number;
  likes?: number;
  tags?: ApiTag[];
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ApiComment {
  id: number;
  post_id: number;
  user_id: number | null;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ApiSetting {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMedia {
  id: number;
  filename: string;
  url: string;
  type: string | null;
  size: number | null;
  uploaded_by: number | null;
  uploaded_by_name?: string | null;
  post_id?: number | null;
  post_title?: string | null;
  post_slug?: string | null;
  created_at: string;
}

export interface ApiAuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'user';
  created_at: string;
  updated_at: string;
}

export type DashboardPeriod = '7d' | '30d' | '90d' | '365d' | 'all';

export interface DashboardMetrics {
  period: DashboardPeriod;
  range: {
    start: string | null;
    end: string;
  };
  totals: {
    posts: number;
    published: number;
    drafts: number;
    scheduled: number;
    archived: number;
    periodPosts: number;
    views: number;
    likes: number;
    comments: number;
    subscribers: number;
    media: number;
    categories: number;
    tags: number;
    engagementRate: number;
  };
  postStatus: Array<{ status: PostStatus; total: number }>;
  activity: Array<{ date: string; views: number; likes: number; comments: number; posts: number }>;
  topPosts: Array<{ id: number; title: string; slug: string; status: PostStatus; author_id: number; author_name: string; views: number; likes: number }>;
  categoryBreakdown: Array<{ name: string; posts: number }>;
  recentPosts: Array<{ id: number; title: string; slug: string; status: PostStatus; category_name: string | null; created_at: string; published_at: string | null; views: number; likes: number }>;
}

export interface ApiPromoCard {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  status: 'active' | 'inactive';
  background_color: string;
  text_color: string;
  cta_color: string;
  author_id: number;
  author_name?: string | null;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  posts?: Array<{ id: number; title: string; slug: string }>;
  created_at: string;
  updated_at: string;
}

export type PromoCardPayload = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  status: 'active' | 'inactive';
  background_color?: string;
  text_color?: string;
  cta_color?: string;
  author_id?: number;
  post_ids?: number[];
};

export interface PromoCardMetrics {
  period: DashboardPeriod;
  totals: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  daily: Array<{ date: string; impressions: number; clicks: number }>;
  posts: Array<{ id: number | null; title: string; slug: string | null; impressions: number; clicks: number }>;
}

export type PostPayload = {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  media_id: number;
  cover_image?: string | null;
  image_position: ImagePosition;
  status: PostStatus;
  author_id: number;
  category_id?: number | null;
  tag_ids?: number[];
  published_at?: string | null;
  scheduled_at?: string | null;
};

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type ImagePosition = 'side' | 'wide' | 'below_title' | 'below_content';
