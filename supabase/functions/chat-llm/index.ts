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

// LLM Configuration
const LLM_CONFIGS = {
  primary: {
    name: 'Groq Llama',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    apiKeyEnv: 'GROQ_API_KEY'
  },
  fallback: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'mistralai/mistral-small-3.2-24b',
    apiKeyEnv: 'OPENROUTER_API_KEY'
  }
}

async function callLLM(config: any, messages: any[], attempt: number = 1): Promise<any> {
  const apiKey = Deno.env.get(config.apiKeyEnv);
  
  if (!apiKey) {
    throw new Error(`${config.name} API key not configured`);
  }

  console.log(`Attempt ${attempt}: Calling ${config.name} API...`);

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.95,
      stream: false,
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`${config.name} API error (${response.status}):`, errorData);
    throw new Error(`${config.name} API failed with status ${response.status}: ${errorData}`);
  }

  const result = await response.json();
  
  if (!result || !result.choices || !Array.isArray(result.choices) || !result.choices[0]) {
    console.error(`${config.name} API response missing choices:`, result);
    throw new Error(`${config.name} API response format invalid`);
  }

  const aiResponse = result.choices[0].message?.content?.trim();
  if (!aiResponse) {
    console.error(`${config.name} API response missing content:`, result);
    throw new Error(`${config.name} API response missing content`);
  }

  console.log(`✅ ${config.name} API call successful`);
  return aiResponse;
}

async function generateAIResponse(messages: any[]): Promise<string> {
  let lastError: Error | null = null;

  // Try primary LLM (Groq)
  try {
    return await callLLM(LLM_CONFIGS.primary, messages, 1);
  } catch (error) {
    console.error(`Primary LLM (${LLM_CONFIGS.primary.name}) failed:`, error);
    lastError = error as Error;
  }

  // Try fallback LLM (OpenRouter)
  try {
    console.log('🔄 Falling back to secondary LLM...');
    return await callLLM(LLM_CONFIGS.fallback, messages, 2);
  } catch (error) {
    console.error(`Fallback LLM (${LLM_CONFIGS.fallback.name}) failed:`, error);
    lastError = error as Error;
  }

  // If both fail, provide a graceful fallback response
  console.error('🚨 All LLM services failed, using emergency response');
  
  // Return a compassionate fallback message
  return "I'm experiencing some technical difficulties right now, but I'm still here for you. Sometimes it helps just to know that someone is listening. Would you like to try sharing what's on your mind again in a moment? In the meantime, remember that whatever you're going through, you're not alone.";
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
    let planToUse = 'freemium';
    let isAuthenticated = false;
    let isJudge = false;

    // First, try to get user profile if userId is provided
    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching user profile:', profileError)
        // Don't return error here, fall back to anonymous device
      } else if (profile) {
        userProfile = profile
        isAuthenticated = true
        isJudge = profile.is_judge || false

        // --- TRIAL EXPIRY LOGIC ---
        planToUse = profile.current_plan;
        if ((planToUse === 'monthly_trial' || planToUse === 'yearly_trial') && profile.trial_end_date) {
          const now = new Date();
          const trialEnd = new Date(profile.trial_end_date);
          if (now > trialEnd) {
            // Trial expired, revert to freemium in DB and for this request
            planToUse = 'freemium';
            await supabase
              .from('user_profiles')
              .update({ current_plan: 'freemium', trial_start_date: null, trial_end_date: null })
              .eq('id', userId);
          }
        }
        // --- END TRIAL EXPIRY LOGIC ---

        currentUsage = {
          messagesUsed: profile.daily_messages_used || 0,
          voiceNotesUsed: profile.voice_notes_used ? 1 : 0, // Convert boolean to number
          maxMessages: getMaxMessagesForPlan(planToUse, isJudge),
          maxVoiceNotes: getMaxVoiceNotesForPlan(planToUse, isJudge)
        }
      }
    }

    // If no authenticated user profile found, try to get anonymous device
    if (!isAuthenticated && deviceId) {
      const { data: device, error: deviceError } = await supabase
        .from('anonymous_devices')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle()

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

      if (!device) {
        // Create a new anonymous device record
        try {
          const today = new Date().toISOString().split('T')[0];
          const { data: newDevice, error: createError } = await supabase
            .from('anonymous_devices')
            .insert({
              device_id: deviceId,
              messages_today: 0,
              voice_notes_used: false,
              last_active_date: today,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            console.error('Failed to create anonymous device:', createError);
            return new Response(
              JSON.stringify({ error: 'Failed to create device record' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          anonymousDevice = newDevice;
        } catch (createError) {
          console.error('Exception creating anonymous device:', createError);
          return new Response(
            JSON.stringify({ error: 'Failed to create device record' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      } else {
        anonymousDevice = device;
      }

      if (anonymousDevice) {
        currentUsage = {
          messagesUsed: anonymousDevice.messages_today || 0,
          voiceNotesUsed: anonymousDevice.voice_notes_used ? 1 : 0, // Convert boolean to number
          maxMessages: 3,
          maxVoiceNotes: 0
        }
      }
    }

    // If neither authenticated user nor anonymous device found, return error
    if (!isAuthenticated && !anonymousDevice) {
      console.error('No user profile or device found');
      return new Response(
        JSON.stringify({ error: 'User or device not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if this is an initial session greeting (empty message)
    const isInitialGreeting = !message || message.trim() === '' || message === 'Hello';

    // Only check limits for actual user messages, not initial greetings
    // Judge accounts bypass all limits
    if (!isInitialGreeting && !isJudge && currentUsage.messagesUsed >= currentUsage.maxMessages) {
      return new Response(
        JSON.stringify({ error: 'Daily message limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!isInitialGreeting && !isJudge && messageType === 'voice' && currentUsage.voiceNotesUsed >= currentUsage.maxVoiceNotes) {
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
      } else if (historyError) {
        console.error('Failed to load conversation history:', historyError);
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
      
      if (isJudge) {
        systemPrompt += `
- Account Type: Judge (Premium Access)`
      }
    }

    // Use appropriate message for AI processing
    const messageForAI = isInitialGreeting ? 'Hello, I am starting a new therapy session. Please greet me warmly.' : message;

    const messagesForApi = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: messageForAI },
    ]

    // Generate AI response with fallback system
    let aiResponse: string;
    try {
      aiResponse = await generateAIResponse(messagesForApi);
    } catch (error) {
      console.error('All LLM attempts failed:', error);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable. Please try again in a moment.' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a UUID for the message ID
    const messageId = crypto.randomUUID();

    // Only store user message if it's not an initial greeting
    if (!isInitialGreeting) {
      const userMessage = {
        id: messageId,
        session_id: sessionId,
        user_id: isAuthenticated ? userId : null,
        device_id: !isAuthenticated ? deviceId : null,
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
    }

    const aiMessageId = crypto.randomUUID();
    const aiMessage = {
      id: aiMessageId,
      session_id: sessionId,
      user_id: isAuthenticated ? userId : null,
      device_id: !isAuthenticated ? deviceId : null,
      sender: 'amara',
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
    
    // Update usage counts only for actual user messages, not initial greetings
    // Judge accounts don't have their usage tracked
    if (!isInitialGreeting && !isJudge) {
      if (isAuthenticated && userProfile) {
        const updates = { daily_messages_used: (userProfile.daily_messages_used || 0) + 1 };
        if (messageType === 'voice') {
          updates['voice_notes_used'] = (userProfile.voice_notes_used ? 1 : 0) + 1 > 0; // Convert to boolean
        }
        const { error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', userId)
        if (error) {
          console.error('Error updating user message/voice note count:', error)
        }
      } else if (!isAuthenticated && deviceId) {
        if (anonymousDevice) {
          const updates = { messages_today: (anonymousDevice.messages_today || 0) + 1 };
          if (messageType === 'voice') {
            updates['voice_notes_used'] = (anonymousDevice.voice_notes_used ? 1 : 0) + 1 > 0; // Convert to boolean
          }
          const { error } = await supabase
            .from('anonymous_devices')
            .update(updates)
            .eq('device_id', deviceId)
          if (error) {
            console.error('Error updating device message/voice note count:', error)
          }
        } else {
          const { error } = await supabase
            .from('anonymous_devices')
            .insert({ device_id: deviceId, messages_today: 1, voice_notes_used: messageType === 'voice' })
          if (error) {
            console.error('Error creating new device record:', error)
          }
        }
      }
    }
    
    let voiceNoteUrl = null
    if (isVoiceResponse) {
      try {
        const ttsResponse = await supabase.functions.invoke('generate-tts', {
          body: { 
            text: aiResponse,
            messageId: aiMessageId
          },
        })
        if (ttsResponse.data?.voiceNoteUrl) {
          voiceNoteUrl = ttsResponse.data.voiceNoteUrl
        } else {
          console.error('TTS function did not return a voice note URL:', ttsResponse.error, ttsResponse.data);
        }
      } catch (e) {
        console.error('Error invoking TTS function:', e)
      }
    }
    
    const responsePayload: ChatResponse = {
      messageId: aiMessage.id,
      response: aiResponse,
      voiceNoteUrl,
      usage: {
        messagesUsed: isInitialGreeting || isJudge ? currentUsage.messagesUsed : currentUsage.messagesUsed + 1,
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

function getMaxMessagesForPlan(plan: string, isJudge: boolean = false): number {
  if (isJudge) return Infinity; // Judge accounts have unlimited messages
  
  switch (plan) {
    case 'freemium':
      return 5;
    case 'monthly_trial':
    case 'yearly_trial':
      return 100;
    case 'monthly_premium':
    case 'yearly_premium':
      return 1000;
    default:
      return 5;
  }
}

function getMaxVoiceNotesForPlan(plan: string, isJudge: boolean = false): number {
  if (isJudge) return Infinity; // Judge accounts have unlimited voice notes
  
  switch (plan) {
    case 'freemium':
      return 1;
    case 'monthly_trial':
    case 'yearly_trial':
      return 20;
    case 'monthly_premium':
    case 'yearly_premium':
      return 100;
    default:
      return 1;
  }
}