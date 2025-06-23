import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  userId?: string;
  deviceId?: string;
  sessionId?: string;
  messageType: 'text' | 'voice';
  isVoiceResponse?: boolean;
}

interface ChatResponse {
  messageId: string;
  response: string;
  voiceNoteUrl?: string;
  usage: {
    messagesUsed: number;
    voiceNotesUsed: number;
    maxMessages: number;
    maxVoiceNotes: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, userId, deviceId, sessionId, messageType, isVoiceResponse = false }: ChatRequest = await req.json()

    if (!message || (!userId && !deviceId)) {
      return new Response(
        JSON.stringify({ error: 'Message and user/device ID are required' }),
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

    // Check usage limits
    let userProfile = null
    let anonymousDevice = null
    let currentUsage = { messagesUsed: 0, voiceNotesUsed: 0, maxMessages: 50, maxVoiceNotes: 5 }

    if (userId) {
      // Get user profile and check limits
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch user profile' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      userProfile = profile
      currentUsage = {
        messagesUsed: profile.daily_messages_used || 0,
        voiceNotesUsed: profile.voice_notes_used ? 1 : 0,
        maxMessages: getMaxMessagesForPlan(profile.current_plan),
        maxVoiceNotes: getMaxVoiceNotesForPlan(profile.current_plan)
      }
    } else if (deviceId) {
      // Get anonymous device and check limits
      const { data: device, error: deviceError } = await supabase
        .from('anonymous_devices')
        .select('*')
        .eq('device_id', deviceId)
        .single()

      if (deviceError && deviceError.code !== 'PGRST116') {
        console.error('Error fetching anonymous device:', deviceError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch device data' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (device) {
        anonymousDevice = device
        currentUsage = {
          messagesUsed: device.messages_today || 0,
          voiceNotesUsed: device.voice_notes_used ? 1 : 0,
          maxMessages: 10, // Anonymous users get 10 messages
          maxVoiceNotes: 1  // Anonymous users get 1 voice note
        }
      }
    }

    // Check if user has exceeded limits
    if (currentUsage.messagesUsed >= currentUsage.maxMessages) {
      return new Response(
        JSON.stringify({ error: 'Daily message limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (messageType === 'voice' && currentUsage.voiceNotesUsed >= currentUsage.maxVoiceNotes) {
      return new Response(
        JSON.stringify({ error: 'Voice note limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get conversation history
    let conversationHistory: any[] = []
    
    if (sessionId) {
      const { data: history, error: historyError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(10) // Limit to last 10 messages for context

      if (!historyError && history) {
        conversationHistory = history
      }
    }

    // Prepare conversation context for LLM
    const conversationContext = conversationHistory
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Amara'}: ${msg.message_text}`)
      .join('\n')

    // Call LLM API (using Gemini as specified)
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const systemPrompt = `You are Amara, a compassionate AI therapist designed to provide emotional support and guidance. You should:

1. Be empathetic and understanding
2. Ask thoughtful questions to help users explore their feelings
3. Provide gentle guidance without being prescriptive
4. Maintain a warm, supportive tone
5. Keep responses conversational and not too long
6. Focus on emotional well-being and personal growth

Previous conversation context:
${conversationContext}

Current user message: ${message}

Please respond as Amara, maintaining the conversation flow and providing appropriate emotional support.`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()
      console.error('Gemini API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const geminiResult = await geminiResponse.json()
    const aiResponse = geminiResult.candidates[0].content.parts[0].text

    // Generate unique message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store user message
    const userMessage = {
      id: `user_${messageId}`,
      session_id: sessionId,
      user_id: userId,
      device_id: deviceId,
      sender: 'user',
      message_text: message,
      message_type: messageType,
      created_at: new Date().toISOString()
    }

    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert(userMessage)

    if (userMessageError) {
      console.error('Error storing user message:', userMessageError)
    }

    // Store AI response
    const aiMessage = {
      id: `amara_${messageId}`,
      session_id: sessionId,
      user_id: userId,
      device_id: deviceId,
      sender: 'amara',
      message_text: aiResponse,
      message_type: 'text',
      created_at: new Date().toISOString()
    }

    const { error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert(aiMessage)

    if (aiMessageError) {
      console.error('Error storing AI message:', aiMessageError)
    }

    // Update usage tracking
    if (userId) {
      const updates: any = {
        daily_messages_used: currentUsage.messagesUsed + 1,
        updated_at: new Date().toISOString()
      }
      
      if (messageType === 'voice') {
        updates.voice_notes_used = true
      }

      await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
    } else if (deviceId) {
      const updates: any = {
        messages_today: currentUsage.messagesUsed + 1,
        updated_at: new Date().toISOString()
      }
      
      if (messageType === 'voice') {
        updates.voice_notes_used = true
      }

      await supabase
        .from('anonymous_devices')
        .upsert({
          device_id: deviceId,
          ...updates,
          last_active_date: new Date().toISOString().split('T')[0],
          created_at: anonymousDevice?.created_at || new Date().toISOString()
        })
    }

    // Generate voice response if requested
    let voiceNoteUrl: string | undefined
    if (isVoiceResponse) {
      try {
        const ttsResponse = await fetch(`${supabaseUrl}/functions/v1/generate-tts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: aiResponse,
            messageId: `amara_${messageId}`
          })
        })

        if (ttsResponse.ok) {
          const ttsResult = await ttsResponse.json()
          voiceNoteUrl = ttsResult.voiceNoteUrl

          // Update AI message with voice note URL
          await supabase
            .from('chat_messages')
            .update({ 
              voice_note_url: voiceNoteUrl,
              message_type: 'voice'
            })
            .eq('id', `amara_${messageId}`)
        }
      } catch (error) {
        console.error('Error generating voice response:', error)
      }
    }

    return new Response(
      JSON.stringify({
        messageId: `amara_${messageId}`,
        response: aiResponse,
        voiceNoteUrl,
        usage: {
          messagesUsed: currentUsage.messagesUsed + 1,
          voiceNotesUsed: messageType === 'voice' ? 1 : currentUsage.voiceNotesUsed,
          maxMessages: currentUsage.maxMessages,
          maxVoiceNotes: currentUsage.maxVoiceNotes
        }
      } as ChatResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Chat LLM error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper functions for plan limits
function getMaxMessagesForPlan(plan: string): number {
  switch (plan) {
    case 'freemium':
      return 50
    case 'monthly_trial':
    case 'yearly_trial':
      return 100
    case 'monthly_premium':
    case 'yearly_premium':
      return 1000
    default:
      return 50
  }
}

function getMaxVoiceNotesForPlan(plan: string): number {
  switch (plan) {
    case 'freemium':
      return 5
    case 'monthly_trial':
    case 'yearly_trial':
      return 20
    case 'monthly_premium':
    case 'yearly_premium':
      return 100
    default:
      return 5
  }
} 