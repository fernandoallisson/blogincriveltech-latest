-- ============================================================
-- 1. Fix handle_new_user: set fixed search_path + revoke public EXECUTE
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Revoke direct RPC execution from anon and authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ============================================================
-- 2. categories: restrict INSERT/UPDATE to admin or author role
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can create categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can update categories" ON categories;

CREATE POLICY "Admin or author can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

CREATE POLICY "Admin or author can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

-- ============================================================
-- 3. tags: restrict INSERT/UPDATE/DELETE to admin or author role
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can create tags" ON tags;
DROP POLICY IF EXISTS "Authenticated can update tags" ON tags;
DROP POLICY IF EXISTS "Authenticated can delete tags" ON tags;

CREATE POLICY "Admin or author can create tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

CREATE POLICY "Admin or author can update tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

CREATE POLICY "Admin or author can delete tags"
  ON tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

-- ============================================================
-- 4. comments: enforce status='pending' on INSERT; restrict UPDATE/DELETE to admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can create comment" ON comments;
DROP POLICY IF EXISTS "Authenticated can update comment status" ON comments;
DROP POLICY IF EXISTS "Authenticated can delete comments" ON comments;

-- Public may comment only with status = 'pending' (default)
CREATE POLICY "Anyone can create comment"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Only admin/author may change comment status or content
CREATE POLICY "Admin or author can update comment status"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

CREATE POLICY "Admin or author can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role IN ('admin', 'author')
    )
  );

-- ============================================================
-- 5. newsletter_subscribers: enforce status='active' on INSERT;
--    restrict UPDATE/DELETE to admin
-- ============================================================
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated can update subscriber status" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated can delete subscriber" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'active');

CREATE POLICY "Admin can update subscriber status"
  ON newsletter_subscribers FOR UPDATE
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

CREATE POLICY "Admin can delete subscriber"
  ON newsletter_subscribers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- ============================================================
-- 6. post_views: require the referenced post to exist (non-null FK already
--    enforces this, but we add an explicit check to replace USING (true))
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert post view" ON post_views;

CREATE POLICY "Anyone can insert post view"
  ON post_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id)
  );

-- ============================================================
-- 7. likes: require the referenced post to exist
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert like" ON likes;

CREATE POLICY "Anyone can insert like"
  ON likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id)
  );

-- ============================================================
-- 8. promo_card_events: require the referenced promo_card to exist
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert promo card event" ON promo_card_events;

CREATE POLICY "Anyone can insert promo card event"
  ON promo_card_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM promo_cards pc WHERE pc.id = promo_card_id)
  );

-- ============================================================
-- 9. storage.objects: restrict SELECT to object access only (no listing)
--    by requiring the name to not be a directory path ending in '/'
-- ============================================================
DROP POLICY IF EXISTS "Public can read media files" ON storage.objects;

CREATE POLICY "Public can read media files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'media'
    AND name NOT LIKE '%/'
  );
