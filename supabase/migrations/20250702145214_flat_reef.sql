/*
  # Security logs table

  1. New Tables
    - `security_logs`
      - `id` (uuid, primary key)
      - `event_type` (text, not null)
      - `ip_address` (text, not null)
      - `user_agent` (text)
      - `email` (text)
      - `timestamp` (timestamptz, not null)
      - `details` (jsonb)
  2. Security
    - Enable RLS on `security_logs` table
    - Add policy for authenticated users to read logs
    - Add policy for public to insert logs
  3. Indexing
    - Add indexes for timestamp, event_type, and ip_address
*/

-- Check if table exists before creating
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'security_logs') THEN
    CREATE TABLE security_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type text NOT NULL CHECK (event_type IN ('login_attempt', 'login_success', 'login_failure', 'logout', 'session_timeout', 'password_reset', 'blocked_ip', 'suspicious_activity')),
      ip_address text NOT NULL,
      user_agent text,
      email text,
      timestamp timestamptz NOT NULL DEFAULT now(),
      details jsonb DEFAULT '{}'
    );

    -- Enable row level security
    ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

    -- Create policies if they don't exist
    DO $policy$
    BEGIN
      -- Check if policy exists before creating
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
    END
    $policy$;

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
    CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);
  END IF;
END
$$;