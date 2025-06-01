import React, { useState, useRef, useEffect } from 'react';
import { Send, Clock, X, ChevronDown, Smile, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'amara';
  timestamp: Date;
}

interface TherapySessionProps {
  userName: string;
  onEndSession: () => void;
}

const TherapySession: React.FC<TherapySessionProps> = ({ userName, onEndSession }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${userName}! I'm glad you're here. I noticed from your onboarding that you're dealing with anxiety and work stress. How are you feeling right now in this moment?`,
      sender: 'amara',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentMood, setCurrentMood] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "I'm feeling anxious",
    "Work is stressing me out",
    "I had a difficult day",
    "I need to talk through something"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate Amara's response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "I hear you. Can you tell me more about what's contributing to those feelings?",
        sender: 'amara',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-white text-lg font-medium">Session with Amara</h1>
              <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-slate-300" />
                <span className="text-slate-300 text-sm">{formatTime(sessionTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-sm">Active</span>
              </div>
            </div>
            <button
              onClick={onEndSession}
              className="bg-red-600/20 text-red-500 hover:bg-red-600/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>End Session</span>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-slate-700'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600'
                } rounded-2xl px-4 py-3 ${
                  message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                }`}
              >
                <p className="text-white">{message.text}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              <span className="text-sm">Amara is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-1">Press Enter to send, Shift + Enter for new line</p>
            </div>
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`w-80 bg-slate-800 border-l border-slate-700 transition-all duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-medium">Session Insights</h2>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Mood Tracker */}
          <div className="mb-6">
            <h3 className="text-slate-300 text-sm font-medium mb-3">How are you feeling?</h3>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-2 rounded-lg transition-colors ${
                    currentMood === mood ? 'bg-purple-600/20 text-purple-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smile className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div>
            <h3 className="text-slate-300 text-sm font-medium mb-3">Quick Topics</h3>
            <div className="space-y-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Support */}
          <div className="mt-6 p-4 bg-red-600/10 rounded-lg border border-red-600/20">
            <div className="flex items-center space-x-2 text-red-500 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Need immediate help?</span>
            </div>
            <p className="text-slate-300 text-sm">
              If you're in crisis, please call the 24/7 support line:
              <a href="tel:988" className="block text-red-400 hover:text-red-300 mt-1">988</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySession;