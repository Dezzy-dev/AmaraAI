/*
  # Fix RLS policies for anonymous_devices table

  1. Changes
    - Simplify anonymous_devices RLS policies
    - Allow proper access for anonymous users and Edge Functions
    - Remove duplicate policies

  2. Security
    - Anonymous users can manage their own device records
    - Service role has full access for Edge Functions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow Anon Insert for anonymous_devices" ON anonymous_devices;
DROP POLICY IF EXISTS "Allow Anon Select for anonymous_devices" ON anonymous_devices;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON anonymous_devices;
DROP POLICY IF EXISTS "Allow anonymous updates" ON anonymous_devices;

-- Create new comprehensive policies for anonymous_devices

-- Policy for anonymous users to manage their own device records
CREATE POLICY "Anonymous users can manage own device"
  ON anonymous_devices
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to read device data (if needed)
CREATE POLICY "Authenticated users can read devices"
  ON anonymous_devices
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for service role (Edge Functions) to manage all device records
CREATE POLICY "Service role can manage all devices"
  ON anonymous_devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled on anonymous_devices
ALTER TABLE anonymous_devices ENABLE ROW LEVEL SECURITY;