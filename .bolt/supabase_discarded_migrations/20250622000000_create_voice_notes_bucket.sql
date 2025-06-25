-- Create the voice notes storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'amara_voice_notes',
  'amara_voice_notes',
  true,
  10485760, -- 10MB limit
  ARRAY['audio/webm', 'audio/mpeg', 'audio/mp3', 'audio/wav']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the voice notes bucket

-- Allow public read access to voice notes
CREATE POLICY "Public Access to Voice Notes" ON storage.objects
FOR SELECT USING (bucket_id = 'amara_voice_notes');

-- Allow authenticated users to upload voice notes
CREATE POLICY "Authenticated users can upload voice notes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'amara_voice_notes' 
  AND auth.role() = 'authenticated'
);

-- Allow service role to manage all voice notes
CREATE POLICY "Service role can manage voice notes" ON storage.objects
FOR ALL USING (
  bucket_id = 'amara_voice_notes' 
  AND auth.role() = 'service_role'
);

-- Allow users to update their own voice notes
CREATE POLICY "Users can update their voice notes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'amara_voice_notes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own voice notes
CREATE POLICY "Users can delete their voice notes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'amara_voice_notes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
); 