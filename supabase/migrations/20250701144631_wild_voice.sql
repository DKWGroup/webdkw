/*
  # Create security logs table

  1. New Tables
    - `security_logs`
      - `id` (uuid, primary key)
      - `event_type` (text, not null) - typ zdarzenia bezpieczeństwa
      - `ip_address` (text, not null) - adres IP
      - `user_agent` (text) - user agent przeglądarki
      - `email` (text) - email użytkownika (opcjonalnie)
      - `timestamp` (timestamptz, not null) - czas zdarzenia
      - `details` (jsonb) - dodatkowe szczegóły

  2. Security
    - Enable RLS on `security_logs` table
    - Add policy for authenticated admin to read all logs
    - Add policy for system to insert logs
*/

CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('login_attempt', 'login_success', 'login_failure', 'logout', 'session_timeout', 'password_reset', 'blocked_ip', 'suspicious_activity')),
  ip_address text NOT NULL,
  user_agent text,
  email text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  details jsonb DEFAULT '{}'
);

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admin) to read all security logs
CREATE POLICY "Authenticated users can read security logs"
  ON security_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow system to insert security logs (for logging from client-side)
CREATE POLICY "System can insert security logs"
  ON security_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);