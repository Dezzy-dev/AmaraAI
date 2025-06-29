import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { db, Message, supabase } from '../lib/supabase';
import useUser from './useUser';
import { logger } from '../utils/logger';

export interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  isTyping: boolean;
  sendMessage: (text: string, type?: 'text' | 'voice', url?: string) => Promise<void>;
  startNewSession: (userId?: string, deviceId?: string) => Promise<void>;
  currentSessionId: string | null;
  clearMessages: () => void;
  loadMessages: (userId: string) => Promise<void>;
  loadMessagesFromSession: (sessionId: string) => Promise<void>;
  sendVoiceMessage: (audioBlob: Blob, duration: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

// A message object that can be stored in state
export interface ChatMessage {
  id: string;
  session_id?: string;
  sender: 'user' | 'amara';
  message_text: string | null;
  message_type?: 'text' | 'voice';
  voice_note_url?: string | null;
  created_at: string; // Use created_at instead of timestamp
  isAnimating?: boolean;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { userData } = useUser();

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const loadMessages = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userMessages = await db.messages.getByUser(userId);
      setMessages(userMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessagesFromSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    try {
      const sessionMessages = await db.messages.getBySession(sessionId);
      setMessages(sessionMessages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error("Error loading session messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // New: sendMessageWithSessionId helper
  const sendMessageWithSessionId = useCallback(async (text: string, type: 'text' | 'voice' = 'text', url?: string, sessionIdOverride?: string) => {
    // Debug log
    logger.log('currentSessionId in sendMessageWithSessionId:', currentSessionId);
    const sessionIdToUse = sessionIdOverride || currentSessionId;
    if (!sessionIdToUse) {
      console.error('No session ID available');
      return;
    }
    setIsLoading(true);
    try {
      logger.log('Sending message:', { text, type, sessionId: sessionIdToUse });
      if (text.trim() !== '') {
        const userMessage: ChatMessage = {
          id: `user_${Date.now()}`,
          session_id: sessionIdToUse,
          sender: 'user',
          message_text: text,
          message_type: type,
          voice_note_url: url,
          created_at: new Date().toISOString(),
          isAnimating: true,
        };
        setMessages(prev => [...prev, userMessage]);
      }
      const userId = userData?.id;
      const deviceId = userData?.deviceId;
      logger.log('User data for API call:', { userId, deviceId });
      if (text.trim() !== '') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      }
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing environment variables:', { 
          hasSupabaseUrl: !!supabaseUrl, 
          hasSupabaseAnonKey: !!supabaseAnonKey 
        });
        throw new Error('Missing Supabase configuration');
      }
      const response = await fetch(`${supabaseUrl}/functions/v1/chat-llm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text || 'Hello',
          userId: userId || undefined,
          deviceId: deviceId || undefined,
          sessionId: sessionIdToUse,
          messageType: type,
          isVoiceResponse: type === 'voice'
        })
      });
      logger.log('API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to send message');
      }
      const result = await response.json();
      logger.log('API success response:', result);
      setIsTyping(false);
      const amaraMessage: ChatMessage = {
        id: result.messageId,
        session_id: sessionIdToUse,
        sender: 'amara',
        message_text: result.response,
        message_type: result.voiceNoteUrl ? 'voice' : 'text',
        voice_note_url: result.voiceNoteUrl,
        created_at: new Date().toISOString(),
        isAnimating: true,
      };
      setMessages(prev => [...prev, amaraMessage]);
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === amaraMessage.id ? { ...msg, isAnimating: false } : msg
        ));
      }, 600);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      if (text.trim() !== '') {
        setMessages(prev => prev.slice(0, -1));
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, userData]);

  // Patch: sendMessage now just calls sendMessageWithSessionId
  const sendMessage = useCallback((text: string, type: 'text' | 'voice' = 'text', url?: string) => {
    return sendMessageWithSessionId(text, type, url);
  }, [sendMessageWithSessionId]);

  const sendVoiceMessage = useCallback(async (audioBlob: Blob, duration: number) => {
    if (!currentSessionId) return;
    
    setIsLoading(true);
    
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const fileName = `voice_${timestamp}.webm`;
      
      // Upload the audio file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('amara_voice_notes')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error('Failed to upload audio file');
      }

      // Get the public URL for the user's message bubble
      const { data: urlData } = supabase.storage
        .from('amara_voice_notes')
        .getPublicUrl(uploadData.path);

      // Transcribe the audio using the transcribe-audio Edge Function
      const transcribeResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: uploadData.path, // Use the path from the upload data
          userId: userData?.id || undefined,
          deviceId: userData?.deviceId || undefined
        })
      });

      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }

      const transcribeResult = await transcribeResponse.json();
      
      // Send the transcribed text as a voice message
      await sendMessage(transcribeResult.transcription, 'voice', urlData.publicUrl);

    } catch (error) {
      console.error("Error sending voice message:", error);
      throw error; // Re-throw to let the calling component handle it
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, sendMessage, userData]);

  const startNewSession = useCallback(async (userId?: string, deviceId?: string) => {
    setIsLoading(true);
    setMessages([]);
    try {
      logger.log('Starting new session with:', { userId, deviceId });
      const session = await db.sessions.create(userId, deviceId);
      logger.log('Session created:', session);
      setCurrentSessionId(session.id);
      logger.log('Sending initial greeting message...');
      try {
        await sendMessageWithSessionId('', 'text', undefined, session.id); // Use session.id directly
        logger.log('Initial greeting sent successfully');
      } catch (greetingError) {
        console.error('Failed to send initial greeting via API:', greetingError);
        const fallbackMessage: ChatMessage = {
          id: `fallback_${Date.now()}`,
          session_id: session.id,
          sender: 'amara',
          message_text: `Hello! I'm Amara, your AI companion for mental wellness. I'm here to listen, support, and help you explore your thoughts and feelings in a safe, non-judgmental space. How are you feeling today?`,
          message_type: 'text',
          created_at: new Date().toISOString(),
          isAnimating: true,
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === fallbackMessage.id ? { ...msg, isAnimating: false } : msg
          ));
        }, 600);
      }
    } catch (error) {
      console.error("Error starting new session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userData, sendMessageWithSessionId]);

  const value = useMemo(() => ({
    messages,
    setMessages,
    isLoading,
    isTyping,
    sendMessage,
    sendVoiceMessage,
    startNewSession,
    currentSessionId,
    clearMessages,
    loadMessages,
    loadMessagesFromSession,
  }), [
    messages, 
    isLoading, 
    isTyping,
    sendMessage, 
    sendVoiceMessage, 
    startNewSession, 
    currentSessionId, 
    clearMessages, 
    loadMessages, 
    loadMessagesFromSession
  ]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};