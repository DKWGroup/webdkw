-- Create user roles system with proper admin verification
-- This prevents recursive RLS issues by using a security definer function

-- Create an enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check admin role safely
-- This prevents recursive RLS issues when checking permissions
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  );
$$;

-- Create function to check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  );
$$;

-- RLS policies for user_roles table
-- Users can only see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can manage all roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin());

-- Drop the overly permissive policy on contact_submissions
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON public.contact_submissions;

-- Create admin-only policy for contact submissions
CREATE POLICY "Only admins can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Keep the public insert policy for contact forms
-- The existing "Public can submit contact forms" policy is fine

-- Drop the overly permissive policy on security_logs
DROP POLICY IF EXISTS "Authenticated users can read security logs" ON public.security_logs;

-- Create admin-only policy for security logs
CREATE POLICY "Only admins can read security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Keep the public insert policy for security logging
-- The existing "System can insert security logs" policy is fine

-- Fix function search path for existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;