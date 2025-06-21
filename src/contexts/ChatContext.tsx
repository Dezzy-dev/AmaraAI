import React, { createContext, useContext, useState, ReactNode } from 'react';
import { db, Message } from '../lib/supabase';

interface ChatContextType {
  messages: Message[];
  addMessage: (sender: 'user' | 'amara', text: string, messageType?: 'text' | 'voice', voiceNoteUrl?: string) => void;
  loadMessages: (messages: Message[]) => void;
  loadMessagesFromSession: (sessionId: string) => Promise<void>;
  clearMessages: () => void;
  isInSession: boolean;
  startSession: () => void;
  endSession: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInSession, setIsInSession] = useState(false);

  const addMessage = (sender: 'user' | 'amara', text: string, messageType: 'text' | 'voice' = 'text', voiceNoteUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      sender,
      message_text: text,
      voice_note_url: voiceNoteUrl,
      message_type: messageType
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const loadMessagesFromSession = async (sessionId: string) => {
    try {
      const dbMessages = await db.messages.getBySession(sessionId);
      setMessages(dbMessages);
    } catch (error) {
      console.error('Error loading messages from session:', error);
      setMessages([]);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const startSession = () => {
    setIsInSession(true);
  };

  const endSession = () => {
    setIsInSession(false);
    clearMessages();
  };

  const value: ChatContextType = {
    messages,
    addMessage,
    loadMessages,
    loadMessagesFromSession,
    clearMessages,
    isInSession,
    startSession,
    endSession
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};