// Configuration for Supabase Edge Functions
export const config = {
  // API Keys
  GEMINI_API_KEY: Deno.env.get('GEMINI_API_KEY'),
  ELEVENLABS_API_KEY: Deno.env.get('ELEVENLABS_API_KEY'),
  OPENAI_API_KEY: Deno.env.get('OPENAI_API_KEY'),
  GOOGLE_SPEECH_API_KEY: Deno.env.get('GOOGLE_SPEECH_API_KEY'),
  
  // Supabase
  SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Voice settings
  DEFAULT_VOICE_ID: '21m00Tcm4TlvDq8ikWAM', // ElevenLabs voice ID for Amara
  
  // LLM settings
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  
  // Storage bucket names
  VOICE_NOTES_BUCKET: 'amara_voice_notes',
  
  // Usage limits
  ANONYMOUS_LIMITS: {
    maxMessages: 10,
    maxVoiceNotes: 1
  },
  
  PLAN_LIMITS: {
    freemium: { maxMessages: 50, maxVoiceNotes: 5 },
    monthly_trial: { maxMessages: 100, maxVoiceNotes: 20 },
    yearly_trial: { maxMessages: 100, maxVoiceNotes: 20 },
    monthly_premium: { maxMessages: 1000, maxVoiceNotes: 100 },
    yearly_premium: { maxMessages: 1000, maxVoiceNotes: 100 }
  }
};

// Helper function to get plan limits
export function getPlanLimits(plan: string) {
  return config.PLAN_LIMITS[plan as keyof typeof config.PLAN_LIMITS] || config.PLAN_LIMITS.freemium;
}

// Helper function to validate required environment variables
export function validateConfig() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !Deno.env.get(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // At least one LLM API key is required
  const hasLLMKey = config.GEMINI_API_KEY || config.OPENAI_API_KEY;
  if (!hasLLMKey) {
    throw new Error('At least one LLM API key (GEMINI_API_KEY or OPENAI_API_KEY) is required');
  }
} 