-- Fix remaining function search path issues for security functions
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  );
$$;