console.log('transcribe-audio function file loaded');

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranscribeRequest {
  filePath: string;
  userId?: string;
  deviceId?: string;
}

serve(async (req) => {
  console.log('transcribe-audio function invoked');
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Parsing request body...');
    const { filePath, userId, deviceId }: TranscribeRequest = await req.json()
    console.log('Parsed request:', { filePath, userId, deviceId });

    if (!filePath) {
      console.error('File path is required');
      return new Response(
        JSON.stringify({ error: 'File path is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Downloading audio from Supabase Storage:', filePath);
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('amara_voice_notes')
      .download(filePath)

    if (downloadError || !audioData) {
      console.error('Error downloading audio file:', downloadError, 'using path:', filePath)
      return new Response(
        JSON.stringify({ error: 'Failed to download audio file' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const audioBlob = new Blob([await audioData.arrayBuffer()], { type: 'audio/webm' });
    console.log('Audio downloaded and blob created.');

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model_id', 'scribe_v1');

    console.log('Calling ElevenLabs transcription API...');
    const elevenResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey,
      },
      body: formData
    })
    console.log('ElevenLabs API response status:', elevenResponse.status);

    if (!elevenResponse.ok) {
      const errorData = await elevenResponse.text()
      console.error('ElevenLabs transcription API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to transcribe audio with ElevenLabs', details: errorData }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const elevenResult = await elevenResponse.json()
    console.log('ElevenLabs transcription result:', elevenResult);
    
    return new Response(
      JSON.stringify({ 
        transcription: elevenResult.text,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Transcribe audio error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})