/*
  # Add Judge Accounts Support

  1. New Columns
    - `user_profiles`
      - `is_judge` (boolean, default false) - Identifies judge accounts with unlimited access

  2. Security
    - Judge accounts get unlimited access to all features
    - UI displays as premium for judge accounts
*/

-- Add is_judge column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_judge boolean DEFAULT false;

-- Create index for efficient judge account queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_judge ON user_profiles(is_judge) WHERE is_judge = true;

-- Add comment to document the column
COMMENT ON COLUMN user_profiles.is_judge IS 'Identifies judge accounts that get unlimited access to all premium features for free';