import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Define types for our database tables
export interface Profile {
  id: string;
  email: string;
  tier: 'anonymous' | 'registered';
  messages_limit: number;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  user_id: string;
  session_data: any;
  messages_used: number;
  session_duration: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  sender: 'user' | 'amara';
  message_text: string;
  timestamp: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    create: async (userId: string, email: string, tier: 'anonymous' | 'registered' = 'registered') => {
      const messagesLimit = tier === 'registered' ? 8 : 3;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          tier,
          messages_limit: messagesLimit
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (userId: string, updates: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  sessions: {
    create: async (userId: string) => {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: userId,
          session_data: {},
          messages_used: 0,
          session_duration: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (sessionId: string, updates: Partial<TherapySession>) => {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    getMessages: async (sessionId: string) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  },
  messages: {
    create: async (sessionId: string, sender: 'user' | 'amara', messageText: string) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          sender,
          message_text: messageText,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};