-- Additional security measures for contact_submissions table

-- Add constraint to ensure sensitive data handling
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create function to sanitize contact data for non-admin users (if needed)
CREATE OR REPLACE FUNCTION public.get_contact_submission_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.contact_submissions;
$$;

-- Update RLS policies to be more explicit
DROP POLICY IF EXISTS "Only admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Recreate policies with stricter controls
CREATE POLICY "admin_read_contact_submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "public_insert_contact_submissions" 
ON public.contact_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure no other operations are allowed
CREATE POLICY "admin_update_contact_submissions" 
ON public.contact_submissions 
FOR UPDATE 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_contact_submissions" 
ON public.contact_submissions 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Add comment for documentation
COMMENT ON TABLE public.contact_submissions IS 'Stores customer contact form submissions. Access restricted to admin users only via RLS policies.';