#!/bin/bash

# Amara AI Edge Functions Deployment Script

echo "🚀 Deploying Amara AI Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

echo "📦 Deploying Edge Functions..."

# Deploy all functions
echo "Deploying chat-llm function..."
supabase functions deploy chat-llm --no-verify-jwt

echo "Deploying transcribe-audio function..."
supabase functions deploy transcribe-audio --no-verify-jwt

echo "Deploying generate-tts function..."
supabase functions deploy generate-tts --no-verify-jwt

echo "✅ All Edge Functions deployed successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Add your API keys to Supabase Dashboard > Settings > Edge Functions > Secrets"
echo "2. Run the database migrations: supabase db push"
echo "3. Test the functions using the examples in supabase/functions/README.md"
echo ""
echo "Required environment variables:"
echo "- GEMINI_API_KEY (or OPENAI_API_KEY)"
echo "- ELEVENLABS_API_KEY"
echo "- GOOGLE_SPEECH_API_KEY (optional)"
echo ""
echo "�� Setup complete!" 