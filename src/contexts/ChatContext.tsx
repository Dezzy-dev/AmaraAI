import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { db, Message, supabase } from '../lib/supabase';

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

  const sendMessage = useCallback(async (text: string, type: 'text' | 'voice' = 'text', url?: string) => {
    if (!currentSessionId) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to UI immediately with slide-in animation
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        session_id: currentSessionId,
        sender: 'user',
        message_text: text,
        message_type: type,
        voice_note_url: url,
        created_at: new Date().toISOString(),
        isAnimating: true,
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Get user/device ID from localStorage or context
      const userId = localStorage.getItem('amara_user_id');
      const deviceId = localStorage.getItem('amara_device_id');

      // Step 1: Wait 1 second before showing typing indicator
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Show typing indicator for 2-3 seconds
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      // Call the chat-llm Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-llm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          userId: userId || undefined,
          deviceId: deviceId || undefined,
          sessionId: currentSessionId,
          messageType: type,
          isVoiceResponse: type === 'voice' // Generate voice response for voice messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add Amara's response to UI with animation
      const amaraMessage: ChatMessage = {
        id: result.messageId,
        session_id: currentSessionId,
        sender: 'amara',
        message_text: result.response,
        message_type: result.voiceNoteUrl ? 'voice' : 'text',
        voice_note_url: result.voiceNoteUrl,
        created_at: new Date().toISOString(),
        isAnimating: true,
      };
      
      setMessages(prev => [...prev, amaraMessage]);

      // Remove animation flag after animation completes
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === amaraMessage.id ? { ...msg, isAnimating: false } : msg
        ));
      }, 600);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId]);

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
          userId: localStorage.getItem('amara_user_id') || undefined,
          deviceId: localStorage.getItem('amara_device_id') || undefined
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
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, sendMessage]);

  const startNewSession = useCallback(async (userId?: string, deviceId?: string) => {
    setIsLoading(true);
    setMessages([]);
    try {
      const session = await db.sessions.create(userId, deviceId);
      setCurrentSessionId(session.id);
      
      const greeting: ChatMessage = {
        id: Date.now().toString(), // Temporary ID for UI
        session_id: session.id,
        sender: 'amara',
        message_text: 'Hello, I am Amara. How are you feeling today?',
        message_type: 'text',
        created_at: new Date().toISOString(),
        isAnimating: true,
      };

      setMessages([greeting]);
      await db.messages.create(greeting); // db.messages.create should expect this shape
      
      // Remove animation flag after animation completes
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === greeting.id ? { ...msg, isAnimating: false } : msg
        ));
      }, 600);
    } catch (error) {
      console.error("Error starting new session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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