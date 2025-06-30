import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as crypto from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const headers = req.headers;

    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecret) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Validate Paystack signature
    const signature = headers.get('x-paystack-signature');
    if (!signature) {
      console.error('No Paystack signature found');
      return new Response(JSON.stringify({ error: 'Unauthorized: No signature' }), { status: 401 });
    }

    const hash = crypto.createHmac('sha512', paystackSecret).update(JSON.stringify(payload)).digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid signature' }), { status: 401 });
    }

    // Process the event
    if (payload.event === 'charge.success') {
      const eventData = payload.data;
      const customerEmail = eventData.customer.email;
      const amount = eventData.amount; // in kobo
      const reference = eventData.reference;
      const status = eventData.status;

      console.log(`Charge success event received: ${customerEmail}, Amount: ${amount}, Ref: ${reference}, Status: ${status}`);

      if (status === 'success') {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Find user by email and update their profile
        const { data: userProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
        }

        if (userProfile) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              current_plan: 'premium',
              is_premium: true,
              subscription_started_at: new Date().toISOString(),
              payment_reference: reference,
              trial_end_date: null, // Clear trial end date if upgrading
            })
            .eq('id', userProfile.id);

          if (updateError) {
            console.error('Error updating user profile after successful payment:', updateError);
            return new Response(JSON.stringify({ error: 'Database update failed' }), { status: 500 });
          }
          console.log(`User ${customerEmail} successfully upgraded to premium.`);
        } else {
          console.warn(`User with email ${customerEmail} not found in user_profiles.`);
        }
      }
    }

    return new Response('Webhook received', { status: 200 });

  } catch (error) {
    console.error('Paystack webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
});