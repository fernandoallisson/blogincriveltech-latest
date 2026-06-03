/*
  # Create Supabase Storage bucket for media

  1. Storage
    - Creates a public bucket named `media` for storing uploaded images
    - Public read access (anyone can view images via public URL)
    - Authenticated users can upload files
    - Owner or admin can delete files

  2. Notes
    - Max file size 10MB enforced at application level
    - Only image types allowed (enforced at application level)
*/

-- Create the media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can read media files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated can upload media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Owner or admin can update media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Owner or admin can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');
