import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranscribeRequest {
  audioUrl: string;
  userId?: string;
  deviceId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioUrl, userId, deviceId }: TranscribeRequest = await req.json()

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: 'Audio URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract file path from the audio URL
    const urlParts = audioUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `amara_voice_notes/${fileName}`

    // Download the audio file from Supabase Storage
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('amara_voice_notes')
      .download(filePath)

    if (downloadError || !audioData) {
      console.error('Error downloading audio file:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Failed to download audio file' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Convert audio data to base64 for API request
    const audioBuffer = await audioData.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    // Use Google Speech-to-Text API (you can replace with OpenAI Whisper or other services)
    const speechToTextApiKey = Deno.env.get('GOOGLE_SPEECH_API_KEY')
    
    if (!speechToTextApiKey) {
      // Fallback to OpenAI Whisper if Google Speech API key is not available
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
      
      if (!openaiApiKey) {
        return new Response(
          JSON.stringify({ error: 'No speech-to-text API key configured' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Use OpenAI Whisper API
      const formData = new FormData()
      formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm')
      formData.append('model', 'whisper-1')

      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData
      })

      if (!whisperResponse.ok) {
        const errorData = await whisperResponse.text()
        console.error('OpenAI Whisper API error:', errorData)
        return new Response(
          JSON.stringify({ error: 'Failed to transcribe audio' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const whisperResult = await whisperResponse.json()
      
      return new Response(
        JSON.stringify({ 
          transcription: whisperResult.text,
          confidence: 0.95 // OpenAI doesn't provide confidence scores
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Use Google Speech-to-Text API
      const speechRequest = {
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: base64Audio
        }
      }

      const speechResponse = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${speechToTextApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(speechRequest)
        }
      )

      if (!speechResponse.ok) {
        const errorData = await speechResponse.text()
        console.error('Google Speech API error:', errorData)
        return new Response(
          JSON.stringify({ error: 'Failed to transcribe audio' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const speechResult = await speechResponse.json()
      
      if (!speechResult.results || speechResult.results.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No speech detected in audio' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const transcription = speechResult.results
        .map((result: any) => result.alternatives[0].transcript)
        .join(' ')

      const confidence = speechResult.results[0].alternatives[0].confidence

      return new Response(
        JSON.stringify({ 
          transcription,
          confidence
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Transcribe audio error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 