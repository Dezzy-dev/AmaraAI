import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'amara';
  text: string;
  timestamp: Date;
  reactions?: string[];
}

interface ChatContextType {
  messages: Message[];
  addMessage: (sender: 'user' | 'amara', text: string) => void;
  loadMessages: (messages: Message[]) => void;
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

  const addMessage = (sender: 'user' | 'amara', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date(),
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
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