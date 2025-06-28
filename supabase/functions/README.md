# Amara AI Edge Functions

This directory contains the Supabase Edge Functions for the Amara AI application.

## Functions Overview

### 1. `chat-llm` - Main Chat Orchestrator
- **Purpose**: Central function for handling chat interactions
- **Features**:
  - Processes text and voice messages
  - Integrates with Gemini LLM API
  - Manages conversation history
  - Tracks usage limits
  - Stores messages in database
  - Generates voice responses when needed

### 2. `transcribe-audio` - Speech-to-Text
- **Purpose**: Converts user voice messages to text
- **Features**:
  - Downloads audio from Supabase Storage
  - Supports Google Speech-to-Text API
  - Fallback to OpenAI Whisper API
  - Returns transcribed text with confidence score

### 3. `generate-tts` - Text-to-Speech
- **Purpose**: Converts Amara's text responses to voice
- **Features**:
  - Uses ElevenLabs API for high-quality voice generation
  - Uploads generated audio to Supabase Storage
  - Returns public URL for audio playback

## Setup Instructions

### 1. Environment Variables

Add the following secrets to your Supabase project:

```bash
# Required
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# LLM API (at least one required)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Speech-to-Text API (optional, will fallback to OpenAI Whisper)
GOOGLE_SPEECH_API_KEY=your_google_speech_api_key

# Text-to-Speech API
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 2. Storage Bucket Setup

Create a storage bucket named `amara_voice_notes` in your Supabase project:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('amara_voice_notes', 'amara_voice_notes', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'amara_voice_notes');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'amara_voice_notes' AND auth.role() = 'authenticated');

CREATE POLICY "Service role can manage" ON storage.objects
FOR ALL USING (bucket_id = 'amara_voice_notes' AND auth.role() = 'service_role');
```

### 3. Deploy Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy all functions
supabase functions deploy

# Or deploy individual functions
supabase functions deploy chat-llm
supabase functions deploy transcribe-audio
supabase functions deploy generate-tts
```

### 4. Test Functions

You can test the functions using the Supabase Dashboard or curl:

```bash
# Test chat-llm function
curl -X POST 'https://your-project.supabase.co/functions/v1/chat-llm' \
  -H 'Authorization: Bearer your_anon_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello Amara",
    "userId": "user_id_here",
    "sessionId": "session_id_here",
    "messageType": "text"
  }'
```

## API Endpoints

### POST `/functions/v1/chat-llm`

**Request Body:**
```json
{
  "message": "User's message",
  "userId": "optional_user_id",
  "deviceId": "optional_device_id",
  "sessionId": "optional_session_id",
  "messageType": "text" | "voice",
  "isVoiceResponse": false
}
```

**Response:**
```json
{
  "messageId": "amara_msg_123",
  "response": "Amara's response text",
  "voiceNoteUrl": "optional_audio_url",
  "usage": {
    "messagesUsed": 5,
    "voiceNotesUsed": 1,
    "maxMessages": 50,
    "maxVoiceNotes": 5
  }
}
```

### POST `/functions/v1/transcribe-audio`

**Request Body:**
```json
{
  "audioUrl": "https://storage.url/audio.webm",
  "userId": "optional_user_id",
  "deviceId": "optional_device_id"
}
```

**Response:**
```json
{
  "transcription": "Transcribed text",
  "confidence": 0.95
}
```

### POST `/functions/v1/generate-tts`

**Request Body:**
```json
{
  "text": "Text to convert to speech",
  "messageId": "message_id_for_filename",
  "voiceId": "optional_voice_id"
}
```

**Response:**
```json
{
  "voiceNoteUrl": "https://storage.url/audio.mp3",
  "fileName": "amara_msg_123_1234567890.mp3",
  "filePath": "amara_voice_notes/amara_msg_123_1234567890.mp3"
}
```

## Error Handling

All functions return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing required fields)
- `429`: Rate limit exceeded (usage limits)
- `500`: Internal server error

Error responses include a descriptive message:

```json
{
  "error": "Error description"
}
```

## Usage Limits

The system enforces different limits based on user type:

- **Anonymous users**: 3 messages, 0 voice notes
- **Freemium users**: 5 messages, 1 voice note
- **Trial users**: 100 messages, 20 voice notes
- **Premium users**: 1000 messages, 100 voice notes

## Security

- All functions use Supabase service role key for database operations
- API keys are stored as environment variables
- CORS is configured for web application access
- Input validation is performed on all requests
- Usage limits are enforced server-side

## Monitoring

Monitor function performance and errors through:
- Supabase Dashboard > Edge Functions
- Function logs in the dashboard
- Error tracking in your application

## Triggering Deployment
A new push is often needed to trigger the first deployment after connecting a repository.
Re-triggering after reconnecting GitHub. 