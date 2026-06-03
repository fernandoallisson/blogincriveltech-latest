/*
  # Create media table

  1. New Tables
    - `media`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `url` (text) - public URL from Supabase Storage
      - `storage_path` (text) - internal storage path for deletion
      - `type` (text, nullable) - MIME type
      - `size` (bigint, nullable) - file size in bytes
      - `uploaded_by` (uuid, nullable, references user_profiles)
      - `post_id` (uuid, nullable, references posts - set after post creation)
      - `created_at` (timestamptz)

  2. Security
    - Authenticated users can read all media
    - Authenticated users can insert media (upload)
    - Owner or admin can update/delete media

  3. Notes
    - post_id is nullable foreign key, set when media is linked to a post
    - storage_path is used internally to delete from Supabase Storage bucket
*/

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  storage_path text DEFAULT NULL,
  type text DEFAULT NULL,
  size bigint DEFAULT NULL,
  uploaded_by uuid DEFAULT NULL REFERENCES user_profiles(id) ON DELETE SET NULL,
  post_id uuid DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read media"
  ON media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Owner or admin can update media"
  ON media FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

CREATE POLICY "Owner or admin can delete media"
  ON media FOR DELETE
  TO authenticated
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );
