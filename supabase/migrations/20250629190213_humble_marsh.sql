/*
  # Fix RLS policies for therapy_sessions table

  1. Changes
    - Drop existing restrictive RLS policies on therapy_sessions
    - Add new policies that properly handle both authenticated and anonymous users
    - Ensure users can create, read, update, and delete their own sessions
    - Allow anonymous users to manage sessions by device_id

  2. Security
    - Authenticated users can only access sessions where user_id matches their auth.uid()
    - Anonymous users can only access sessions where device_id matches and user_id is NULL
    - Service role can manage all sessions for Edge Functions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow select for authenticated users" ON therapy_sessions;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON therapy_sessions;
DROP POLICY IF EXISTS "Anonymous users can delete own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Anonymous users can insert sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Anonymous users can read own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Anonymous users can update own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can read own sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON therapy_sessions;

-- Create new comprehensive policies for therapy_sessions

-- Policy for authenticated users to manage their own sessions
CREATE POLICY "Authenticated users can manage own sessions"
  ON therapy_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for anonymous users to manage sessions by device_id
CREATE POLICY "Anonymous users can manage own device sessions"
  ON therapy_sessions
  FOR ALL
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL)
  WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

-- Policy for service role (Edge Functions) to manage all sessions
CREATE POLICY "Service role can manage all sessions"
  ON therapy_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled on therapy_sessions
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;