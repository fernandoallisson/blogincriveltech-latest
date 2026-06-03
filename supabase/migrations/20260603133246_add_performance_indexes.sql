/*
  # Add performance indexes

  1. Indexes
    - posts: slug, status, author_id, category_id, published_at
    - post_tags: tag_id
    - post_views: post_id, created_at
    - likes: post_id, created_at
    - comments: post_id, status
    - promo_card_events: promo_card_id, event_type, created_at
    - media: uploaded_by, post_id

  2. Notes
    - These indexes optimize the most common query patterns
*/

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_created_at ON post_views(created_at);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_promo_card_events_card_id ON promo_card_events(promo_card_id);
CREATE INDEX IF NOT EXISTS idx_promo_card_events_created_at ON promo_card_events(created_at);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_post_id ON media(post_id);
