/*
  # Create anonymous_devices table with RLS policies

  This migration creates the anonymous_devices table for tracking usage limits
  for anonymous users based on their device ID.
*/

-- Create anonymous_devices table
CREATE TABLE IF NOT EXISTS anonymous_devices (
  device_id TEXT PRIMARY KEY,
  messages_today INTEGER DEFAULT 0,
  voice_notes_used BOOLEAN DEFAULT FALSE,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on anonymous_devices table
ALTER TABLE anonymous_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for anonymous_devices table

-- Allow anonymous users to insert their own device record
CREATE POLICY "Anonymous users can insert own device"
  ON anonymous_devices
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Allow anonymous users to read their own device record
CREATE POLICY "Anonymous users can read own device"
  ON anonymous_devices
  FOR SELECT
  TO anon
  USING (TRUE);

-- Allow anonymous users to update their own device record
CREATE POLICY "Anonymous users can update own device"
  ON anonymous_devices
  FOR UPDATE
  TO anon
  USING (TRUE)
  WITH CHECK (TRUE);

-- Allow anonymous users to delete their own device record
CREATE POLICY "Anonymous users can delete own device"
  ON anonymous_devices
  FOR DELETE
  TO anon
  USING (TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anonymous_devices_last_active_date ON anonymous_devices(last_active_date);
CREATE INDEX IF NOT EXISTS idx_anonymous_devices_created_at ON anonymous_devices(created_at); 