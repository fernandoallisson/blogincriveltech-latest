/*
  # Create comments, settings, newsletter, and promo cards tables

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, nullable, references user_profiles)
      - `name` (text) - commenter name
      - `email` (text) - commenter email
      - `content` (text) - comment body
      - `status` (text, default 'pending') - pending | approved | rejected
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text, nullable)
      - `status` (text, default 'active') - active | inactive | unsubscribed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `promo_cards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `image_url` (text, nullable)
      - `cta_label` (text, nullable)
      - `cta_url` (text, nullable)
      - `status` (text, default 'active') - active | inactive
      - `background_color` (text, default '#1a1a1a')
      - `text_color` (text, default '#ffffff')
      - `cta_color` (text, default '#3b82f6')
      - `author_id` (uuid, references user_profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `promo_card_posts`
      - `promo_card_id` (uuid, references promo_cards)
      - `post_id` (uuid, references posts)
    - `promo_card_events`
      - `id` (uuid, primary key)
      - `promo_card_id` (uuid, references promo_cards)
      - `event_type` (text) - impression | click
      - `post_id` (uuid, nullable, references posts)
      - `created_at` (timestamptz)

  2. Security
    - comments: public create/read approved; admin/author moderate
    - settings: admin only read/write
    - newsletter: public subscribe; authenticated manage
    - promo_cards: public read active; author owns own cards; admin all
*/

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid DEFAULT NULL REFERENCES user_profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved comments"
  ON comments FOR SELECT
  TO anon
  USING (status = 'approved');

CREATE POLICY "Authenticated can read all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create comment"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update comment status"
  ON comments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (true);

-- Settings (admin only)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Admin can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Admin can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update subscriber status"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete subscriber"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (true);

-- Promo cards
CREATE TABLE IF NOT EXISTS promo_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT NULL,
  image_url text DEFAULT NULL,
  cta_label text DEFAULT NULL,
  cta_url text DEFAULT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  background_color text NOT NULL DEFAULT '#1a1a1a',
  text_color text NOT NULL DEFAULT '#ffffff',
  cta_color text NOT NULL DEFAULT '#3b82f6',
  author_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promo_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active promo cards"
  ON promo_cards FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Authenticated can read all promo cards"
  ON promo_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin or author can create promo cards"
  ON promo_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Author can update own cards or admin any"
  ON promo_cards FOR UPDATE
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

CREATE POLICY "Author can delete own cards or admin any"
  ON promo_cards FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Promo card <-> post junction
CREATE TABLE IF NOT EXISTS promo_card_posts (
  promo_card_id uuid NOT NULL REFERENCES promo_cards(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  PRIMARY KEY (promo_card_id, post_id)
);

ALTER TABLE promo_card_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read promo_card_posts"
  ON promo_card_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Author can manage own card posts or admin any"
  ON promo_card_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM promo_cards pc
      WHERE pc.id = promo_card_id
        AND (
          pc.author_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Author can delete own card posts or admin any"
  ON promo_card_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM promo_cards pc
      WHERE pc.id = promo_card_id
        AND (
          pc.author_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
          )
        )
    )
  );

-- Promo card events (impression/click tracking)
CREATE TABLE IF NOT EXISTS promo_card_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_card_id uuid NOT NULL REFERENCES promo_cards(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('impression', 'click')),
  post_id uuid DEFAULT NULL REFERENCES posts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promo_card_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read promo card events"
  ON promo_card_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert promo card event"
  ON promo_card_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
