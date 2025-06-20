/*
  # Add RLS policies for user_profiles table

  1. Security
    - Add policy for authenticated users to insert their own profile data
    - Add policy for authenticated users to read their own profile data
    - Add policy for authenticated users to update their own profile data
    - Add policy for authenticated users to delete their own profile data

  This migration resolves the RLS violation error that occurs during user sign-up
  when the system attempts to create a new user profile.
*/

-- Policy for INSERT: Allow authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for SELECT: Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for UPDATE: Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for DELETE: Allow authenticated users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);