import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.error('Please create a .env file with these variables.');
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
  profile_image_url?: string;
  subscription_status?: 'active' | 'trialing' | 'canceled' | 'incomplete' | 'past_due';
  trial_ends_at?: string;
  daily_messages_used?: number;
  voice_notes_used?: boolean;
  country?: string;
  has_ever_trialed?: boolean;
  is_judge?: boolean;
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
  created_at: string;
  user_id?: string;
  device_id?: string;
  session_id?: string;
  sender: 'user' | 'amara';
  message_text?: string;
  voice_note_url?: string;
  message_type: 'text' | 'voice';
}

export interface JournalEntry {
  id: string;
  created_at: string;
  user_id?: string;
  device_id?: string;
  session_id?: string;
  entry_text: string;
}

export interface MoodLog {
  id: string;
  created_at: string;
  user_id?: string;
  device_id?: string;
  session_id?: string;
  mood: string;
}

export interface ChatMessage {
  id: string;
  session_id?: string;
  sender: 'user' | 'amara';
  message_text?: string;
  message_type: 'text' | 'voice';
  voice_note_url?: string;
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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
      try {
        const { data, error, status } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId);

        if (error && status !== 406) { // 406 is "Not Acceptable", happens when RLS fails but isn't a critical error
          console.error('Error fetching user profile:', error);
          throw error;
        }
        
        if (data && data.length > 1) {
          console.warn(`Multiple profiles found for user ID: ${userId}. Using the first one.`);
        }

        return data && data.length > 0 ? data[0] : null;
      } catch (e: any) {
        console.error(`A critical error occurred during profile fetch:`, e);
        return null;
      }
    },

    async create(userId: string, email: string, name: string, plan: string = 'freemium'): Promise<UserProfile> {
      const profileData = {
        id: userId,
        name,
        email,
        current_plan: plan,
        has_ever_trialed: false,
        is_judge: false,
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
      // Ensure voice_notes_used is properly converted to boolean
      const processedUpdates = { ...updates };
      if ('voice_notes_used' in processedUpdates && typeof processedUpdates.voice_notes_used === 'number') {
        processedUpdates.voice_notes_used = processedUpdates.voice_notes_used > 0;
      }

      const { data, error } = await supabase
        .from('anonymous_devices')
        .update({ ...processedUpdates, updated_at: new Date().toISOString() })
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
      // Only include user_id or device_id if they are provided
      const sessionData: any = {
        session_data: {},
        messages_used: 0,
        session_duration: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (userId) sessionData.user_id = userId;
      if (deviceId) sessionData.device_id = deviceId;

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
    async create(message: ChatMessage): Promise<ChatMessage> {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: message.session_id,
          sender: message.sender,
          message_text: message.message_text,
          message_type: message.message_type,
          voice_note_url: message.voice_note_url
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        throw error;
      }
      return data as ChatMessage;
    },

    async getBySession(sessionId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching session messages:', error);
        throw error;
      }
      return data || [];
    },

    async getByUser(userId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching user messages:', error);
        throw error;
      }
      return data || [];
    },

    async getByDevice(deviceId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching device messages:', error);
        throw error;
      }
      return data || [];
    }
  },

  // Journal entries operations
  journalEntries: {
    async create(entryText: string, userId?: string, deviceId?: string, sessionId?: string): Promise<JournalEntry> {
      const entryData = {
        entry_text: entryText,
        user_id: userId,
        device_id: deviceId,
        session_id: sessionId
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating journal entry:', error);
        throw error;
      }
      return data;
    },

    async getByUser(userId: string, limit: number = 10): Promise<JournalEntry[]> {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching user journal entries:', error);
        throw error;
      }
      return data || [];
    },

    async getByDevice(deviceId: string, limit: number = 10): Promise<JournalEntry[]> {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching device journal entries:', error);
        throw error;
      }
      return data || [];
    }
  },

  // Mood logs operations
  moodLogs: {
    async create(mood: string, userId?: string, deviceId?: string, sessionId?: string): Promise<MoodLog> {
      const moodData = {
        mood,
        user_id: userId,
        device_id: deviceId,
        session_id: sessionId
      };

      const { data, error } = await supabase
        .from('mood_logs')
        .insert(moodData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating mood log:', error);
        throw error;
      }
      return data;
    },

    async getByUser(userId: string, limit: number = 10): Promise<MoodLog[]> {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching user mood logs:', error);
        throw error;
      }
      return data || [];
    },

    async getByDevice(deviceId: string, limit: number = 10): Promise<MoodLog[]> {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching device mood logs:', error);
        throw error;
      }
      return data || [];
    }
  },

  // Voice notes storage operations
  voiceNotes: {
    async uploadUserVoiceNote(audioBlob: Blob, userId?: string, deviceId?: string): Promise<string> {
      const timestamp = Date.now();
      const fileName = `voice_${timestamp}.webm`;
      
      // Determine the file path based on user type
      let filePath: string;
      if (userId) {
        filePath = `user_voice_notes/${userId}/${fileName}`;
      } else if (deviceId) {
        filePath = `anon_voice_notes/${deviceId}/${fileName}`;
      } else {
        throw new Error('Either userId or deviceId must be provided');
      }

      const { data, error } = await supabase.storage
        .from('amara-voice-notes')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600'
        });

      if (error) {
        console.error('Error uploading voice note:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('amara-voice-notes')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },

    async uploadAmaraVoiceNote(audioBlob: Blob, messageId: string): Promise<string> {
      const fileName = `amara_response_${messageId}.webm`;
      const filePath = `amara_voice_notes/${messageId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('amara-voice-notes')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600'
        });

      if (error) {
        console.error('Error uploading Amara voice note:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('amara-voice-notes')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },

    async deleteVoiceNote(filePath: string): Promise<void> {
      const { error } = await supabase.storage
        .from('amara-voice-notes')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting voice note:', error);
        throw error;
      }
    },

    async getUserVoiceNotes(userId?: string, deviceId?: string): Promise<string[]> {
      let folderPath: string;
      if (userId) {
        folderPath = `user_voice_notes/${userId}`;
      } else if (deviceId) {
        folderPath = `anon_voice_notes/${deviceId}`;
      } else {
        throw new Error('Either userId or deviceId must be provided');
      }

      const { data, error } = await supabase.storage
        .from('amara-voice-notes')
        .list(folderPath);

      if (error) {
        console.error('Error listing user voice notes:', error);
        throw error;
      }

      return data?.map(file => `${folderPath}/${file.name}`) || [];
    },

    async getAmaraVoiceNote(messageId: string): Promise<string | null> {
      const folderPath = `amara_voice_notes/${messageId}`;
      
      const { data, error } = await supabase.storage
        .from('amara-voice-notes')
        .list(folderPath);

      if (error) {
        console.error('Error listing Amara voice notes:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from('amara-voice-notes')
          .getPublicUrl(`${folderPath}/${data[0].name}`);
        
        return urlData.publicUrl;
      }

      return null;
    }
  },

  // Chat messages operations (new methods for Edge Functions integration)
  chatMessages: {
    async create(message: ChatMessage): Promise<ChatMessage> {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: message.session_id,
          user_id: message.user_id,
          device_id: message.device_id,
          sender: message.sender,
          message_text: message.message_text,
          message_type: message.message_type,
          voice_note_url: message.voice_note_url
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat message:', error);
        throw error;
      }
      return data as ChatMessage;
    },

    async getBySession(sessionId: string): Promise<Message[]> {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching session messages:', error);
        throw error;
      }
      return data || [];
    }
  }
};

// Storage operations for voice notes
export const storage = {
  voiceNotes: {
    async upload(audioBlob: Blob, fileName: string): Promise<string> {
      const filePath = `amara_voice_notes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('amara_voice_notes')
        .upload(filePath, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading voice note:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('amara_voice_notes')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },

    async getPublicUrl(filePath: string): Promise<string> {
      const { data } = supabase.storage
        .from('amara_voice_notes')
        .getPublicUrl(filePath);

      return data.publicUrl;
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
        redirectTo: `${window.location.origin}`
      }
    });

    if (error) throw error;
    return data;
  }
};