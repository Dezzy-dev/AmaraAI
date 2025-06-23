# Amara AI Edge Functions Deployment Script (PowerShell)

Write-Host "🚀 Deploying Amara AI Edge Functions..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in
try {
    $null = supabase status 2>$null
} catch {
    Write-Host "❌ Not logged in to Supabase. Please run:" -ForegroundColor Red
    Write-Host "supabase login" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Deploying Edge Functions..." -ForegroundColor Blue

# Deploy all functions
Write-Host "Deploying chat-llm function..." -ForegroundColor Cyan
supabase functions deploy chat-llm --no-verify-jwt

Write-Host "Deploying transcribe-audio function..." -ForegroundColor Cyan
supabase functions deploy transcribe-audio --no-verify-jwt

Write-Host "Deploying generate-tts function..." -ForegroundColor Cyan
supabase functions deploy generate-tts --no-verify-jwt

Write-Host "✅ All Edge Functions deployed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Add your API keys to Supabase Dashboard > Settings > Edge Functions > Secrets" -ForegroundColor White
Write-Host "2. Run the database migrations: supabase db push" -ForegroundColor White
Write-Host "3. Test the functions using the examples in supabase/functions/README.md" -ForegroundColor White
Write-Host ""
Write-Host "Required environment variables:" -ForegroundColor Yellow
Write-Host "- GEMINI_API_KEY (or OPENAI_API_KEY)" -ForegroundColor White
Write-Host "- ELEVENLABS_API_KEY" -ForegroundColor White
Write-Host "- GOOGLE_SPEECH_API_KEY (optional)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green 