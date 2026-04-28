DROP POLICY IF EXISTS "Portfolio assets are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own or published portfolios" ON public.portfolios;

UPDATE storage.buckets
SET public = false
WHERE id = 'portfolio-assets';

CREATE POLICY "Portfolio assets visible to owners and published portfolios"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'portfolio-assets'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1
      FROM public.portfolios p
      WHERE p.user_id::text = (storage.foldername(name))[1]
        AND p.is_published = true
    )
  )
);

CREATE POLICY "Users can view their own role assignments"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own or published portfolios"
ON public.portfolios
FOR SELECT
USING (auth.uid() = user_id OR is_published = true);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;