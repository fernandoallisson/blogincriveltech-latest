import { type ApiPost } from './apiTypes';

export function isPostPublic(post: ApiPost, now = new Date()) {
  if (post.status === 'draft' || post.status === 'archived') return false;
  if (post.schedule_status === 'cancelled') return false;

  const scheduledAt = parsePostDate(post.scheduled_at);
  if (scheduledAt && scheduledAt.getTime() > now.getTime()) return false;

  if (post.status === 'published') return true;
  if (post.status === 'scheduled') return post.schedule_status === 'published' || Boolean(scheduledAt);

  return false;
}

function parsePostDate(value?: string | null) {
  if (!value) return null;
  const normalizedValue = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? null : date;
}
