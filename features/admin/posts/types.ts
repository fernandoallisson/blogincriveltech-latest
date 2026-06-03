import { type ImagePosition, type PostPayload } from '@/lib/api';

export type PostFormState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: PostPayload['status'];
  scheduled_at: string;
  image_position: ImagePosition;
  author_id: number;
  category_id: string;
  tag_ids: string[];
  media_id: string;
};

export const emptyPostForm: PostFormState = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  status: 'draft',
  scheduled_at: '',
  image_position: 'side',
  author_id: 1,
  category_id: '',
  tag_ids: [],
  media_id: '',
};
