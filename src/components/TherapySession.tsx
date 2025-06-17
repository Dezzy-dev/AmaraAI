import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, MessageSquare, Mic, Send, Heart, ThumbsUp, Smile, Lightbulb } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import TypingIndicator from './TypingIndicator';
import TypewriterText from './TypewriterText';
import SignUpNudge from './SignUpNudge';
import TrialLimitModal from './TrialLimitModal';

interface Message {
  id: string;
  sender: 'user' | 'amara';
  text: string;
  timestamp: Date;
  reactions?: string[];
}

interface TherapySessionProps {
  userName: string;
  userCountry?: string;
  userFeeling?: string;
  onEndSession: () => void;
  onSignUp: (path?: 'trial_path' | 'freemium_path') => void;
  onSignIn: () => void;
}

const TherapySession: React.FC<TherapySessionProps> = ({ 
  userName, 
  userCountry, 
  userFeeling, 
  onEndSession,
  onSignUp,
  onSignIn
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [voiceNoteCount, setVoiceNoteCount] = useState(0);
  const [isTrialLimited, setIsTrialLimited] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  // Trial limits
  const MAX_TEXT_MESSAGES = 3;
  const MAX_VOICE_NOTES = 1;

  // Quick reply suggestions
  const quickReplies = [
    "Tell me more",
    "How does that make you feel?",
    "I need help with anxiety",
    "Let's change topics",
    "Can you help me reflect?"
  ];

  // Initialize session with Amara's greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Add initial greeting from Amara
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const greeting = getPersonalizedGreeting();
          addMessage('amara', greeting);
          setIsTyping(false);
        }, 1500);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check trial limits
  useEffect(() => {
    if (messageCount >= MAX_TEXT_MESSAGES || voiceNoteCount >= MAX_VOICE_NOTES) {
      setIsTrialLimited(true);
      setShowTrialModal(true);
    }
  }, [messageCount, voiceNoteCount]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPersonalizedGreeting = () => {
    let greeting = `Hello ${userName}! I'm Amara, and I'm here to listen and support you. `;
    
    if (userCountry) {
      greeting += `It's wonderful to connect with someone from ${userCountry}. `;
    }
    
    if (userFeeling) {
      const feelingResponses = {
        happy: "I can sense you're feeling happy today - that's beautiful! ",
        sad: "I notice you're feeling sad right now. I'm here to listen and support you through this. ",
        anxious: "I can feel that you're experiencing some anxiety. Let's take this one step at a time together. ",
        neutral: "I appreciate you taking the time to check in with yourself today. ",
        excited: "I love your excited energy! Tell me what's bringing you joy. "
      };
      greeting += feelingResponses[userFeeling as keyof typeof feelingResponses] || "";
    }
    
    greeting += "What's on your mind today? Feel free to share anything - I'm here to listen without judgment.";
    
    return greeting;
  };

  const addMessage = (sender: 'user' | 'amara', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date(),
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'user') {
      setMessageCount(prev => prev + 1);
      // Simulate Amara's response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const response = generateAmaraResponse(text);
          addMessage('amara', response);
          setIsTyping(false);
        }, 1500 + Math.random() * 1000);
      }, 500);
    }
  };

  const generateAmaraResponse = (userMessage: string) => {
    const responses = [
      "I hear you, and what you're sharing is really important. Can you tell me more about how that makes you feel?",
      "Thank you for trusting me with that. It sounds like you're going through something significant. What would feel most helpful right now?",
      "I can sense the emotion in your words. You're being really brave by opening up about this. What's the hardest part for you?",
      "That sounds really challenging. I want you to know that your feelings are completely valid. How long have you been carrying this?",
      "I'm glad you felt comfortable sharing that with me. Sometimes just putting our thoughts into words can be healing. What comes up for you when you think about this?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && !isTrialLimited) {
      addMessage('user', currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!isTrialLimited) {
      addMessage('user', reply);
    }
  };

  const handleVoiceNote = () => {
    if (!isTrialLimited && voiceNoteCount < MAX_VOICE_NOTES) {
      setIsRecording(!isRecording);
      if (!isRecording) {
        // Simulate voice note
        setTimeout(() => {
          setIsRecording(false);
          setVoiceNoteCount(prev => prev + 1);
          addMessage('user', '[Voice message: "I just wanted to talk about how I\'ve been feeling lately..."]');
        }, 3000);
      }
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const hasReaction = reactions.includes(emoji);
        return {
          ...msg,
          reactions: hasReaction 
            ? reactions.filter(r => r !== emoji)
            : [...reactions, emoji]
        };
      }
      return msg;
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Chat with Amara</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(sessionDuration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{messageCount}/{MAX_TEXT_MESSAGES} messages</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mic className="w-4 h-4" />
                  <span>{voiceNoteCount}/{MAX_VOICE_NOTES} voice notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onEndSession}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Amara's Avatar */}
              {message.sender === 'amara' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-serif">𝒜</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Amara</span>
                </div>
              )}
              
              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-md' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-tl-md shadow-sm'
              }`}>
                {message.sender === 'amara' ? (
                  <TypewriterText 
                    text={message.text} 
                    speed={30}
                    className="leading-relaxed"
                  />
                ) : (
                  <p className="leading-relaxed">{message.text}</p>
                )}
              </div>
              
              {/* Message Reactions */}
              {message.sender === 'amara' && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex space-x-1">
                    {['❤️', '👍', '🤔'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(message.id, emoji)}
                        className={`p-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          message.reactions?.includes(emoji) ? 'bg-purple-100 dark:bg-purple-900/30' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex space-x-1">
                      {message.reactions.map((reaction, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Timestamp */}
              <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        <TypingIndicator isVisible={isTyping} />
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              disabled={isTrialLimited}
              className={`px-3 py-2 text-sm rounded-full border transition-all duration-200 ${
                isTrialLimited
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-4">
        {isTrialLimited && (
          <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Trial limit reached. Sign up to continue your conversation with Amara.
            </p>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isTrialLimited ? "Sign up to continue..." : "Share what's on your mind..."}
              disabled={isTrialLimited}
              className={`w-full px-4 py-3 rounded-2xl border resize-none transition-all duration-200 ${
                isTrialLimited
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
              }`}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          
          {/* Voice Button */}
          <button
            onClick={handleVoiceNote}
            disabled={isTrialLimited}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : isTrialLimited
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTrialLimited}
            className={`p-3 rounded-full transition-all duration-200 ${
              !currentMessage.trim() || isTrialLimited
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Persistent Sign-Up Nudge */}
      <SignUpNudge 
        onSignUp={() => onSignUp('trial_path')} 
        onSignIn={onSignIn}
        onChooseFreemium={() => onSignUp('freemium_path')}
      />

      {/* Trial Limit Modal */}
      <TrialLimitModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        onStartTrial={() => {
          setShowTrialModal(false);
          onSignUp('trial_path');
        }}
        onChooseFreemium={() => {
          setShowTrialModal(false);
          onSignUp('freemium_path');
        }}
        onSignIn={() => {
          setShowTrialModal(false);
          onSignIn();
        }}
      />
    </div>
  );
};

export default TherapySession;