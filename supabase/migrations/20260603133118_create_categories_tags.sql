/*
  # Create categories and tags tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, unique)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Both tables: public read access (needed for blog frontend)
    - Write access only to authenticated users (admin/author)
    - Delete categories only by admin

  3. Notes
    - Slugs are unique identifiers for URL routing
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (true);
