/*
  # Add Paystack Integration Fields

  1. New Columns
    - `user_profiles`
      - `is_premium` (boolean, default false) - Identifies premium users
      - `subscription_started_at` (timestamp) - When premium subscription started
      - `payment_reference` (text) - Paystack payment reference

  2. Data Migration
    - Update existing premium users to have is_premium = true
    - Ensure proper defaults for new fields

  3. Security
    - Premium users get unlimited access to features
    - Trial users can upgrade to premium anytime
*/

-- Add is_premium column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Add subscription_started_at column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ;

-- Add payment_reference column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Update existing current_plan values to align with new logic
-- For users who were 'monthly_premium' or 'yearly_premium', set is_premium to true
UPDATE user_profiles
SET is_premium = TRUE
WHERE current_plan IN ('monthly_premium', 'yearly_premium');

-- For users who were 'monthly_trial' or 'yearly_trial', set is_premium to false (they are not premium yet)
UPDATE user_profiles
SET is_premium = FALSE
WHERE current_plan IN ('monthly_trial', 'yearly_trial');

-- Ensure default for current_plan is 'freemium' if not already set
ALTER TABLE user_profiles
ALTER COLUMN current_plan SET DEFAULT 'freemium';

-- Add comments to document the new columns
COMMENT ON COLUMN user_profiles.is_premium IS 'Identifies premium users with full access to all features';
COMMENT ON COLUMN user_profiles.subscription_started_at IS 'Timestamp when premium subscription was activated';
COMMENT ON COLUMN user_profiles.payment_reference IS 'Paystack payment reference for the subscription';