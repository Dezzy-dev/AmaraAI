import React, { createContext, useContext, useState, ReactNode } from 'react';
import { db, Message } from '../lib/supabase';

export interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  sendMessage: (text: string, type?: 'text' | 'voice', url?: string) => Promise<void>;
  startNewSession: (userId: string) => Promise<void>;
  currentSessionId: string | null;
  clearMessages: () => void;
  loadMessages: (userId: string) => Promise<void>;
  loadMessagesFromSession: (sessionId: string) => Promise<void>;
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
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const clearMessages = () => {
    setMessages([]);
  };

  const loadMessages = async (userId: string) => {
    setIsLoading(true);
    try {
      const userMessages = await db.messages.getByUser(userId);
      setMessages(userMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessagesFromSession = async (sessionId: string) => {
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
  };

  const sendMessage = async (text: string, type: 'text' | 'voice' = 'text', url?: string) => {
    if (!currentSessionId) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSessionId,
      sender: 'user',
      message_text: text,
      message_type: type,
      voice_note_url: url,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    await db.messages.create(newMessage);
    // Here you would add the logic to get a response from Amara
  };

  const startNewSession = async (userId: string) => {
    setIsLoading(true);
    setMessages([]);
    try {
      const session = await db.sessions.create(userId);
      setCurrentSessionId(session.id);
      
      const greeting: ChatMessage = {
        id: Date.now().toString(), // Temporary ID for UI
        session_id: session.id,
        sender: 'amara',
        message_text: 'Hello, I am Amara. How are you feeling today?',
        message_type: 'text',
        created_at: new Date().toISOString()
      };

      setMessages([greeting]);
      await db.messages.create(greeting); // db.messages.create should expect this shape
    } catch (error) {
      console.error("Error starting new session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    startNewSession,
    currentSessionId,
    clearMessages,
    loadMessages,
    loadMessagesFromSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};