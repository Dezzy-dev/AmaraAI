/*
  # Create therapy_sessions and messages tables with RLS policies

  This migration creates the necessary tables for storing therapy sessions and messages
  with proper Row Level Security (RLS) policies for data protection.
*/

-- Create therapy_sessions table
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  session_data JSONB DEFAULT '{}',
  messages_used INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES therapy_sessions(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'amara')),
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapy_sessions table

-- Allow authenticated users to insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON therapy_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read their own sessions
CREATE POLICY "Users can read own sessions"
  ON therapy_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to update their own sessions
CREATE POLICY "Users can update own sessions"
  ON therapy_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON therapy_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous users to insert sessions with device_id
CREATE POLICY "Anonymous users can insert sessions"
  ON therapy_sessions
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

-- Allow anonymous users to read sessions with their device_id
CREATE POLICY "Anonymous users can read own sessions"
  ON therapy_sessions
  FOR SELECT
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL);

-- Allow anonymous users to update sessions with their device_id
CREATE POLICY "Anonymous users can update own sessions"
  ON therapy_sessions
  FOR UPDATE
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL)
  WITH CHECK (user_id IS NULL AND device_id IS NOT NULL);

-- Allow anonymous users to delete sessions with their device_id
CREATE POLICY "Anonymous users can delete own sessions"
  ON therapy_sessions
  FOR DELETE
  TO anon
  USING (user_id IS NULL AND device_id IS NOT NULL);

-- RLS Policies for messages table

-- Allow authenticated users to insert messages for their sessions
CREATE POLICY "Users can insert messages for own sessions"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Allow authenticated users to read messages from their sessions
CREATE POLICY "Users can read messages from own sessions"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Allow authenticated users to update messages from their sessions
CREATE POLICY "Users can update messages from own sessions"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Allow authenticated users to delete messages from their sessions
CREATE POLICY "Users can delete messages from own sessions"
  ON messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Allow anonymous users to insert messages for their sessions
CREATE POLICY "Anonymous users can insert messages for own sessions"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id IS NULL AND device_id IS NOT NULL
    )
  );

-- Allow anonymous users to read messages from their sessions
CREATE POLICY "Anonymous users can read messages from own sessions"
  ON messages
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id IS NULL AND device_id IS NOT NULL
    )
  );

-- Allow anonymous users to update messages from their sessions
CREATE POLICY "Anonymous users can update messages from own sessions"
  ON messages
  FOR UPDATE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id IS NULL AND device_id IS NOT NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id IS NULL AND device_id IS NOT NULL
    )
  );

-- Allow anonymous users to delete messages from their sessions
CREATE POLICY "Anonymous users can delete messages from own sessions"
  ON messages
  FOR DELETE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions 
      WHERE id = session_id AND user_id IS NULL AND device_id IS NOT NULL
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_user_id ON therapy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_device_id ON therapy_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_therapy_sessions_created_at ON therapy_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp); 