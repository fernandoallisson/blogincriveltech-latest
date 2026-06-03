/*
  # Create posts and related tables

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `summary` (text)
      - `content` (text)
      - `cover_image` (text, nullable) - public URL
      - `image_position` (text, default 'side') - side | wide | below_title | below_content
      - `status` (text, default 'draft') - draft | scheduled | published | archived
      - `author_id` (uuid, references user_profiles)
      - `category_id` (uuid, nullable, references categories)
      - `media_id` (uuid, nullable, references media)
      - `scheduled_at` (timestamptz, nullable)
      - `published_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `post_tags`
      - `post_id` (uuid, references posts)
      - `tag_id` (uuid, references tags)
      - PRIMARY KEY (post_id, tag_id)
    - `post_views`
      - `id` (uuid)
      - `post_id` (uuid, references posts)
      - `ip_address` (text, nullable)
      - `user_agent` (text, nullable)
      - `created_at` (timestamptz)
    - `likes`
      - `id` (uuid)
      - `post_id` (uuid, references posts)
      - `ip_address` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - posts: public read for published, authenticated write with ownership checks
    - post_tags: follows post ownership
    - post_views/likes: public insert (anonymous tracking)

  3. Notes
    - Authors can only edit their own posts; admins can edit any
    - post_id FK on media table is added after this migration
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text DEFAULT NULL,
  image_position text NOT NULL DEFAULT 'side' CHECK (image_position IN ('side', 'wide', 'below_title', 'below_content')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  author_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id uuid DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
  media_id uuid DEFAULT NULL REFERENCES media(id) ON DELETE SET NULL,
  scheduled_at timestamptz DEFAULT NULL,
  published_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated can read all posts
CREATE POLICY "Authenticated can read all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Admin or author can create posts
CREATE POLICY "Admin or author can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
    AND author_id = auth.uid()
  );

-- Author can update own posts, admin can update any
CREATE POLICY "Author can update own posts or admin any"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Author can delete own posts, admin can delete any
CREATE POLICY "Author can delete own posts or admin any"
  ON posts FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Add FK on media for post_id now that posts table exists
ALTER TABLE media
  ADD CONSTRAINT media_post_id_fkey
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL;

-- Post tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read post_tags"
  ON post_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Author can manage own post tags or admin any"
  ON post_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_id
        AND (
          p.author_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Author can delete own post tags or admin any"
  ON post_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_id
        AND (
          p.author_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
          )
        )
    )
  );

-- Post views table (public insert for tracking)
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address text DEFAULT NULL,
  user_agent text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read post_views"
  ON post_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert post view"
  ON post_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Likes table (public insert for tracking)
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert like"
  ON likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
