/*
  # Security logs table migration fix
  
  This migration creates the security_logs table if it doesn't exist
  and adds policies and indexes, checking for their existence first
  to avoid "already exists" errors.
*/

-- Create security_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('login_attempt', 'login_success', 'login_failure', 'logout', 'session_timeout', 'password_reset', 'blocked_ip', 'suspicious_activity')),
  ip_address text NOT NULL,
  user_agent text,
  email text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  details jsonb DEFAULT '{}'
);

-- Enable RLS if not already enabled
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Check if the authenticated users read policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'security_logs' 
    AND policyname = 'Authenticated users can read security logs'
  ) THEN
    CREATE POLICY "Authenticated users can read security logs"
      ON security_logs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Check if the public insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'security_logs' 
    AND policyname = 'System can insert security logs'
  ) THEN
    CREATE POLICY "System can insert security logs"
      ON security_logs
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);