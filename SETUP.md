# Amara AI Setup Guide

## Environment Configuration

Amara requires Supabase environment variables to function properly. If welcome messages are not being sent, this is likely due to missing configuration.

### 1. Create Environment File

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the "Project URL" and "anon public" key
5. Paste them in your `.env` file

### 3. Deploy Edge Functions

The chat functionality requires Supabase Edge Functions to be deployed:

```bash
# Using PowerShell (Windows)
.\deploy-functions.ps1

# Using Bash (Mac/Linux)
./deploy-functions.sh
```

### 4. Configure Edge Function Secrets

In your Supabase Dashboard:
1. Go to Settings > Edge Functions > Secrets
2. Add the following secrets:
   - `GEMINI_API_KEY` (or `OPENAI_API_KEY`)
   - `ELEVENLABS_API_KEY`
   - `GOOGLE_SPEECH_API_KEY` (optional)

### 5. Run Database Migrations

```bash
supabase db push
```

### 6. Test the Setup

1. Start the development server: `npm run dev`
2. Open the browser console (F12)
3. Navigate to a therapy session
4. Check for any error messages in the console

## Troubleshooting

### Welcome Messages Not Sending

If Amara is not sending welcome messages, check:

1. **Environment Variables**: Ensure `.env` file exists and variables are set
2. **Edge Functions**: Verify functions are deployed and secrets are configured
3. **Database**: Check that migrations have been applied
4. **Console Logs**: Look for error messages in browser console

### Common Error Messages

- `"Missing Supabase configuration"`: Environment variables not set
- `"Failed to send message"`: Edge function not deployed or API keys missing
- `"User or device not found"`: Database permissions issue

### Debug Mode

The app now includes enhanced logging. Check the browser console for detailed information about:
- Session initialization
- API calls
- Error responses
- Environment variable status 