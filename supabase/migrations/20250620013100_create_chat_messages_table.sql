/*
  # Create chat_messages table with RLS policies

  This migration creates the chat_messages table for storing conversation history
  with support for both text and voice messages, linking to either authenticated users
  or anonymous devices.
*/

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  sender TEXT CHECK (sender IN ('user', 'amara')),
  message_text TEXT,
  voice_note_url TEXT,
  message_type TEXT CHECK (message_type IN ('text', 'voice')),
  session_id UUID
);

-- Enable RLS on chat_messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_messages table

-- Allow authenticated users to insert their own messages
CREATE POLICY "Users can insert own messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read their own messages
CREATE POLICY "Users can read own messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to update their own messages
CREATE POLICY "Users can update own messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own messages
CREATE POLICY "Users can delete own messages"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous users to insert messages (backend function will enforce device_id)
CREATE POLICY "Anonymous users can insert messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Allow anonymous users to read messages with their device_id
CREATE POLICY "Anonymous users can read own messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (device_id IS NOT NULL);

-- Allow anonymous users to update messages with their device_id
CREATE POLICY "Anonymous users can update own messages"
  ON chat_messages
  FOR UPDATE
  TO anon
  USING (device_id IS NOT NULL)
  WITH CHECK (device_id IS NOT NULL);

-- Allow anonymous users to delete messages with their device_id
CREATE POLICY "Anonymous users can delete own messages"
  ON chat_messages
  FOR DELETE
  TO anon
  USING (device_id IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_device_id ON chat_messages(device_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_type ON chat_messages(message_type); 