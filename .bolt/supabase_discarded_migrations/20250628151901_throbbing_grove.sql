/*
  # Add has_ever_trialed column to user_profiles

  1. Schema Changes
    - Add `has_ever_trialed` column to `user_profiles` table
    - Set default value to `false` for existing users
    - Update existing trial users to have `has_ever_trialed = true`

  2. Security
    - No RLS changes needed as this inherits existing policies
*/

-- Add the has_ever_trialed column
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS has_ever_trialed BOOLEAN DEFAULT FALSE;

-- Update existing users who have trial plans to mark them as having trialed
UPDATE public.user_profiles 
SET has_ever_trialed = TRUE 
WHERE current_plan IN ('monthly_trial', 'yearly_trial');

-- Update existing users who have trial end dates to mark them as having trialed
UPDATE public.user_profiles 
SET has_ever_trialed = TRUE 
WHERE trial_end_date IS NOT NULL;