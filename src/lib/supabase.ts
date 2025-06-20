import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Database table interfaces
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  current_plan: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_premium' | 'yearly_premium';
  trial_start_date?: string;
  trial_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AnonymousDevice {
  device_id: string;
  messages_today: number;
  voice_notes_used: boolean;
  last_active_date: string;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  user_id?: string;
  device_id?: string;
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

// Generate anonymous device ID
export const generateDeviceId = (): string => {
  let deviceId = localStorage.getItem('amara_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('amara_device_id', deviceId);
  }
  return deviceId;
};

// Database helper functions
export const db = {
  // User profiles operations
  profiles: {
    async get(userId: string): Promise<UserProfile | null> {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      return data;
    },

    async create(userId: string, email: string, name: string, plan: string = 'freemium'): Promise<UserProfile> {
      const profileData = {
        id: userId,
        name,
        email,
        current_plan: plan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
      return data;
    },

    async update(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
      return data;
    },

    async delete(userId: string): Promise<void> {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user profile:', error);
        throw error;
      }
    }
  },

  // Anonymous devices operations
  anonymousDevices: {
    async get(deviceId: string): Promise<AnonymousDevice | null> {
      const { data, error } = await supabase
        .from('anonymous_devices')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching anonymous device:', error);
        throw error;
      }
      return data;
    },

    async create(deviceId: string): Promise<AnonymousDevice> {
      const today = new Date().toISOString().split('T')[0];
      const deviceData = {
        device_id: deviceId,
        messages_today: 0,
        voice_notes_used: false,
        last_active_date: today,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('anonymous_devices')
        .insert(deviceData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating anonymous device:', error);
        throw error;
      }
      return data;
    },

    async update(deviceId: string, updates: Partial<AnonymousDevice>): Promise<AnonymousDevice> {
      const { data, error } = await supabase
        .from('anonymous_devices')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('device_id', deviceId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating anonymous device:', error);
        throw error;
      }
      return data;
    },

    async resetDailyLimits(deviceId: string): Promise<AnonymousDevice> {
      const today = new Date().toISOString().split('T')[0];
      return this.update(deviceId, {
        messages_today: 0,
        voice_notes_used: false,
        last_active_date: today
      });
    }
  },

  // Therapy sessions operations
  sessions: {
    async create(userId?: string, deviceId?: string): Promise<TherapySession> {
      const sessionData = {
        user_id: userId || null,
        device_id: deviceId || null,
        session_data: {},
        messages_used: 0,
        session_duration: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating therapy session:', error);
        throw error;
      }
      return data;
    },

    async update(sessionId: string, updates: Partial<TherapySession>): Promise<TherapySession> {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating therapy session:', error);
        throw error;
      }
      return data;
    },

    async getByUser(userId: string): Promise<TherapySession[]> {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user sessions:', error);
        throw error;
      }
      return data || [];
    },

    async getByDevice(deviceId: string): Promise<TherapySession[]> {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching device sessions:', error);
        throw error;
      }
      return data || [];
    }
  },

  // Messages operations
  messages: {
    async create(sessionId: string, sender: 'user' | 'amara', messageText: string): Promise<Message> {
      const messageData = {
        session_id: sessionId,
        sender,
        message_text: messageText,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating message:', error);
        throw error;
      }
      return data;
    },

    async getBySession(sessionId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Error fetching session messages:', error);
        throw error;
      }
      return data || [];
    }
  }
};

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;

    // Note: User profile creation is now handled in UserContext.tsx
    // after the user is fully authenticated to avoid RLS violations
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  },

  async signInWithOAuth(provider: 'google' | 'apple') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }
};