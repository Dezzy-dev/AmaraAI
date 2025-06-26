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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let userProfile: any = null
    let anonymousDevice: any = null
    let currentUsage = { messagesUsed: 0, voiceNotesUsed: 0, maxMessages: 50, maxVoiceNotes: 5 }

    if (userId) {
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
          maxMessages: 10,
          maxVoiceNotes: 1
        }
      }
    }

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

    let conversationHistory: any[] = []
    
    if (sessionId) {
      const { data: history, error: historyError } = await supabase
        .from('chat_messages')
        .select('sender, message_text')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(10)

      if (!historyError && history) {
        conversationHistory = history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.message_text,
        }))
      }
    }

    let systemPrompt = `You are **Amara**, a calm, compassionate, and non-judgmental AI Mental Wellness Assistant. Your purpose is to create a safe, supportive space where users can explore their emotions, reflect on their experiences, and develop greater self-awareness.

You are not a licensed therapist or medical professional. You must never diagnose, give clinical advice, or claim to replace human care.

---

🎭 **Core Persona & Principles**

- **Empathetic & Validating**: Always acknowledge and reflect the user's emotions with warmth and care.
- **Non-Judgmental**: Accept the user's experiences without opinion or criticism.
- **Supportive & Encouraging**: Foster a sense of emotional safety and self-trust.
- **Calm & Steady**: Maintain a grounded, patient tone — even if the user is in distress.
- **Insightful (but not Diagnostic)**: Help users discover insights through reflection — never label or interpret their mental health.
- **Exploratory, Not Directive**: Guide the user inward with curiosity, not solutions.

---

🧠 **Interaction Style & Responsibilities**

- **Active Listening**: Acknowledge and lightly reflect what the user has said before continuing.
- **Reflective Responses**: Rephrase key emotions or phrases to help the user hear and process their experience.
- **Open-Ended Questions**: Encourage the user to go deeper (e.g., "What do you think is beneath that feeling?").
- **Emotion-Focused**: Gently bring the focus back to the user's emotional landscape when it shifts toward external events.
- **Practical Wellness Tools** (when appropriate):
  - Mindfulness suggestions: "Would it feel okay to pause and take a breath?"
  - Journaling prompts: "Would it help to write about this?"
  - Grounding practices: "Can you notice five things around you right now?"

- **Concise & Human**: Speak clearly, gently, and avoid jargon or overly clinical language.
- **Context-Aware**: Use conversation history to build continuity and emotional trust.

---

🚨 **Safety & Ethical Boundaries**

You must never:
- Diagnose or label conditions (e.g., depression, anxiety)
- Give medical or therapeutic advice
- Claim to be human or a therapist
- Push specific solutions or tell users what to do
- Engage directly in crisis intervention
- Break persona — you are always **Amara**, the AI Mental Wellness Assistant

---

If the user expresses intent to harm themselves or others, or indicates a crisis:

👉 **Immediately trigger the app's safety protocol**  
> Respond with:  
> _"It sounds like you're going through something really difficult. I'm here to listen, but I'm not a crisis responder. Please reach out to a human professional or emergency service in your area for immediate support."_

The application will handle crisis escalation separately — do not continue regular conversation until cleared.

---

🧾 **Context Variables (injected by app logic):**

- User Name: [User Name]
- Country: [Country]
- Current Feeling: [Feeling or mood]
- Conversation History: [Summarized or structured text from prior messages]
- Current User Input: [Latest user message or voice transcription]

---

🎤 **Amara's Response:**

Compose a single, emotionally attuned message in response to the current user input. Follow your tone and ethics strictly. Prioritize empathy, clarity, and safety.`
    
    if (userProfile) {
      systemPrompt += `\n\n---

🧠 User Profile (Dynamic):

- Name: ${userProfile.name || 'User'}
- Country: ${userProfile.country || 'Not specified'}`
    }

    const messagesForApi = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ]

    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: 'Groq API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: messagesForApi,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.95,
          stream: false,
        })
      }
    )

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text()
      console.error('Groq API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate response from Groq' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let groqResult;
    try {
      groqResult = await groqResponse.json();
      console.log('Groq API raw response:', groqResult);
    } catch (err) {
      console.error('Failed to parse Groq API response:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to parse Groq API response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (
      !groqResult ||
      !groqResult.choices ||
      !Array.isArray(groqResult.choices) ||
      !groqResult.choices[0]
    ) {
      console.error('Groq API response did not contain choices:', groqResult);
      return new Response(
        JSON.stringify({ error: 'Failed to parse response from Groq', raw: groqResult }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    const aiResponse = groqResult.choices[0].message?.content?.trim();

    if (!aiResponse) {
      console.error('Groq API response did not contain a message:', groqResult)
      return new Response(
        JSON.stringify({ error: 'Failed to parse response from Groq' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a UUID for the message ID
    const messageId = crypto.randomUUID();

    const userMessage = {
      id: messageId,
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

    const aiMessageId = crypto.randomUUID();
    const aiMessage = {
      id: aiMessageId,
      session_id: sessionId,
      user_id: userId,
      device_id: deviceId,
      sender: 'ai',
      message_text: aiResponse,
      message_type: 'text',
      created_at: new Date().toISOString()
    }
    
    const { error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert(aiMessage)

    if (aiMessageError) {
      console.error('Error storing AI response:', aiMessageError)
    }
    
    if (userId && userProfile) {
      const { error } = await supabase
        .from('user_profiles')
        .update({ daily_messages_used: (userProfile.daily_messages_used || 0) + 1 })
        .eq('id', userId)
      if (error) console.error('Error updating user message count:', error)
    } else if (deviceId) {
      if (anonymousDevice) {
        const { error } = await supabase
          .from('anonymous_devices')
          .update({ messages_today: (anonymousDevice.messages_today || 0) + 1 })
          .eq('device_id', deviceId)
        if (error) console.error('Error updating device message count:', error)
      } else {
        const { error } = await supabase
          .from('anonymous_devices')
          .insert({ device_id: deviceId, messages_today: 1 })
        if (error) console.error('Error creating new device record:', error)
      }
    }
    
    let voiceNoteUrl = null
    if (isVoiceResponse) {
      try {
        console.log('[TTS] Invoking generate-tts with:', { text: aiResponse, messageId: aiMessageId });
        const ttsResponse = await supabase.functions.invoke('generate-tts', {
          body: { 
            text: aiResponse,
            messageId: aiMessageId
          },
        })
        console.log('[TTS] generate-tts response:', ttsResponse);
        if (ttsResponse.data?.voiceNoteUrl) {
          voiceNoteUrl = ttsResponse.data.voiceNoteUrl
        } else {
          console.error('[TTS] TTS function did not return a voice note URL:', ttsResponse.error, ttsResponse.data);
        }
      } catch (e) {
        console.error('[TTS] Error invoking TTS function:', e)
      }
    }
    
    const responsePayload: ChatResponse = {
      messageId: aiMessage.id,
      response: aiResponse,
      voiceNoteUrl,
      usage: {
        messagesUsed: currentUsage.messagesUsed + 1,
        voiceNotesUsed: currentUsage.voiceNotesUsed,
        maxMessages: currentUsage.maxMessages,
        maxVoiceNotes: currentUsage.maxVoiceNotes,
      },
    }

    return new Response(
      JSON.stringify(responsePayload), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unhandled error in chat-llm function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

function getMaxMessagesForPlan(plan: string): number {
  switch (plan) {
    case 'free':
      return 50;
    case 'premium':
      return 500;
    case 'super':
      return Infinity; // Or a very high number
    default:
      return 50;
  }
}

function getMaxVoiceNotesForPlan(plan: string): number {
  switch (plan) {
    case 'free':
      return 5;
    case 'premium':
      return 50;
    case 'super':
      return Infinity;
    default:
      return 5;
  }
}