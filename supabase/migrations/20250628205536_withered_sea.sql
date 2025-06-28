/*
  # Add profile_image_url column to user_profiles table

  1. Changes
    - Add `profile_image_url` column to `user_profiles` table
    - Column is nullable to allow existing users without profile images
    - Column type is TEXT to store image URLs

  2. Notes
    - This resolves the "Could not find the 'profile_image_url' column" error
    - Existing user profiles will have NULL values for this column initially
    - Users can then upload profile images through the Settings page
*/

-- Add the missing profile_image_url column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;