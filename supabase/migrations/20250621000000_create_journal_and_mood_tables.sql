/*
  # Create journal_entries and mood_logs tables with RLS policies

  This migration creates tables for storing journal entries and mood logs for both authenticated and anonymous users.
*/

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  entry_text TEXT NOT NULL,
  session_id UUID
);

-- Create mood_logs table
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  mood TEXT NOT NULL,
  session_id UUID
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- RLS for journal_entries
CREATE POLICY "Users can insert own journal entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own journal entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can insert journal entries"
  ON journal_entries
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Anonymous can read own journal entries"
  ON journal_entries
  FOR SELECT
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL);

-- RLS for mood_logs
CREATE POLICY "Users can insert own mood logs"
  ON mood_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own mood logs"
  ON mood_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can insert mood logs"
  ON mood_logs
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

CREATE POLICY "Anonymous can read own mood logs"
  ON mood_logs
  FOR SELECT
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_device_id ON journal_entries(device_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_device_id ON mood_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_created_at ON mood_logs(created_at); 