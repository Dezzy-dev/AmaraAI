import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TTSRequest {
  text: string;
  messageId: string;
  voiceId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, messageId, voiceId = '21m00Tcm4TlvDq8ikWAM' }: TTSRequest = await req.json()

    if (!text || !messageId) {
      return new Response(
        JSON.stringify({ error: 'Text and message ID are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (!elevenLabsApiKey) {
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate audio using ElevenLabs API
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    )

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.text()
      console.error('ElevenLabs API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate audio' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the audio data
    const audioBuffer = await ttsResponse.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate a unique filename
    const timestamp = Date.now()
    const fileName = `amara_${messageId}_${timestamp}.mp3`
    const filePath = `amara_voice_notes/${fileName}`

    // Upload the audio file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('amara_voice_notes')
      .upload(filePath, audioBlob, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading audio file:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload audio file' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('amara_voice_notes')
      .getPublicUrl(filePath)

    return new Response(
      JSON.stringify({ 
        voiceNoteUrl: urlData.publicUrl,
        fileName: fileName,
        filePath: filePath
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Generate TTS error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 