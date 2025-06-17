import React, { useState, useRef, useEffect } from 'react';
import { Send, Clock, X, ChevronDown, Smile, AlertCircle, Lock, Mail, Eye, EyeOff, LayoutDashboard, Mic, MicOff } from 'lucide-react';
import { supabase, db } from '../lib/supabase';
import LoadingScreen from './LoadingScreen';
import TypingIndicator from './TypingIndicator';
import TypewriterText from './TypewriterText';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'amara';
  timestamp: Date;
  type: 'text' | 'voice';
  isTyping?: boolean;
}

interface TherapySessionProps {
  userName: string;
  userCountry?: string;
  userFeeling?: string;
  onEndSession: () => void;
  onNavigateToDashboard?: (userData: UserAccount) => void;
}

interface UserAccount {
  tier: 'anonymous' | 'registered';
  messagesUsed: number;
  messagesLimit: number;
  voiceNotesUsed: number;
  voiceNotesLimit: number;
  email: string | null;
  isAuthenticated: boolean;
}

// Anonymous trial limits
const ANONYMOUS_CHAT_LIMIT = 3;
const ANONYMOUS_VOICE_LIMIT = 1;
const REGISTERED_CHAT_LIMIT = 50;
const REGISTERED_VOICE_LIMIT = 20;

const TherapySession: React.FC<TherapySessionProps> = ({ 
  userName, 
  userCountry, 
  userFeeling, 
  onEndSession, 
  onNavigateToDashboard 
}) => {
  const [showLoading, setShowLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [showTrialLimitModal, setShowTrialLimitModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // User account state with anonymous trial tracking
  const [userAccount, setUserAccount] = useState<UserAccount>({
    tier: 'anonymous',
    messagesUsed: 0,
    messagesLimit: ANONYMOUS_CHAT_LIMIT,
    voiceNotesUsed: 0,
    voiceNotesLimit: ANONYMOUS_VOICE_LIMIT,
    email: null,
    isAuthenticated: false
  });

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationErrors, setRegistrationErrors] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "I'm feeling anxious about work",
    "I had a difficult day today",
    "I need help processing my emotions",
    "Can you help me feel calmer?"
  ];

  // Handle loading screen completion
  const handleLoadingComplete = () => {
    setShowLoading(false);
    initializeSession();
  };

  // Initialize session and add welcome message
  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated
        let profile = await db.profiles.get(user.id);
        
        if (!profile) {
          profile = await db.profiles.create(user.id, user.email || '', 'registered');
        }
        
        const session = await db.sessions.create(user.id);
        setCurrentSessionId(session.id);
        
        setUserAccount({
          tier: 'registered',
          messagesUsed: 0,
          messagesLimit: REGISTERED_CHAT_LIMIT,
          voiceNotesUsed: 0,
          voiceNotesLimit: REGISTERED_VOICE_LIMIT,
          email: profile.email,
          isAuthenticated: true
        });
      } else {
        // Anonymous user - load from localStorage if available
        const savedUsage = localStorage.getItem('amara_anonymous_usage');
        if (savedUsage) {
          const usage = JSON.parse(savedUsage);
          setUserAccount(prev => ({
            ...prev,
            messagesUsed: usage.messagesUsed || 0,
            voiceNotesUsed: usage.voiceNotesUsed || 0
          }));
        }
      }

      // Add personalized welcome message with typing animation
      const welcomeText = getWelcomeMessage();
      const welcomeMessage: Message = {
        id: '1',
        text: welcomeText,
        sender: 'amara',
        timestamp: new Date(),
        type: 'text',
        isTyping: true
      };
      
      // Show typing indicator first
      setIsTyping(true);
      
      // After a brief pause, add the message with typing animation
      setTimeout(() => {
        setIsTyping(false);
        setMessages([welcomeMessage]);
        
        // Save welcome message to database if session exists
        if (currentSessionId) {
          db.messages.create(currentSessionId, 'amara', welcomeText).catch(console.error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      
      // Fallback welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: getWelcomeMessage(),
        sender: 'amara',
        timestamp: new Date(),
        type: 'text',
        isTyping: true
      };
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages([welcomeMessage]);
      }, 1000);
    }
  };

  // Session timer
  useEffect(() => {
    if (!showLoading) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Save anonymous usage to localStorage
  useEffect(() => {
    if (userAccount.tier === 'anonymous') {
      localStorage.setItem('amara_anonymous_usage', JSON.stringify({
        messagesUsed: userAccount.messagesUsed,
        voiceNotesUsed: userAccount.voiceNotesUsed
      }));
    }
  }, [userAccount.messagesUsed, userAccount.voiceNotesUsed, userAccount.tier]);

  const getWelcomeMessage = () => {
    let message = `Hi ${userName}! I'm Amara, and I'm so glad you're here. `;
    
    if (userCountry) {
      message += `It's wonderful to meet someone from ${userCountry}. `;
    }
    
    if (userFeeling) {
      const feelingResponses = {
        happy: "I can sense you're feeling happy right now - that's beautiful! I'd love to hear what's bringing you joy.",
        neutral: "I notice you're feeling neutral today. Sometimes that's exactly where we need to start - in a calm, centered space.",
        sad: "I can feel that you're going through something difficult right now. I'm here to listen and support you through this.",
        anxious: "I sense you're feeling anxious. That takes courage to acknowledge. Let's work through this together, one breath at a time.",
        excited: "I can feel your excitement! That energy is wonderful. What's got you feeling so energized today?"
      };
      
      message += feelingResponses[userFeeling as keyof typeof feelingResponses] || "I'm here to listen to whatever you're feeling right now.";
    } else {
      message += "I'm here to listen, support, and help you work through whatever is on your mind. How are you feeling in this moment?";
    }

    return message;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRegistration = () => {
    const errors: string[] = [];

    if (!registrationData.email) {
      errors.push('Email is required');
    } else if (!validateEmail(registrationData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!registrationData.password) {
      errors.push('Password is required');
    } else if (registrationData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    setRegistrationErrors(errors);
    return errors.length === 0;
  };

  const handleRegistration = async () => {
    if (!validateRegistration()) return;

    setIsRegistering(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password
      });

      if (error) throw error;

      if (data.user) {
        const profile = await db.profiles.create(
          data.user.id,
          registrationData.email,
          'registered'
        );
        
        const newUserAccount: UserAccount = {
          tier: 'registered',
          messagesUsed: userAccount.messagesUsed,
          messagesLimit: REGISTERED_CHAT_LIMIT,
          voiceNotesUsed: userAccount.voiceNotesUsed,
          voiceNotesLimit: REGISTERED_VOICE_LIMIT,
          email: data.user.email,
          isAuthenticated: true
        };

        setUserAccount(newUserAccount);
        setShowTrialLimitModal(false);
        
        // Create new therapy session
        const session = await db.sessions.create(data.user.id);
        setCurrentSessionId(session.id);

        // Clear localStorage
        localStorage.removeItem('amara_anonymous_usage');

        // Add welcome message for registered user with typing animation
        const welcomeText = `Welcome to your 7-day free trial! You now have unlimited access to chat with me and can send up to ${REGISTERED_VOICE_LIMIT} voice notes. I'm excited to continue our journey together!`;
        
        // Show typing indicator
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            text: welcomeText,
            sender: 'amara',
            timestamp: new Date(),
            type: 'text',
            isTyping: true
          };
          
          setMessages(prev => [...prev, welcomeMessage]);
          
          if (session) {
            db.messages.create(session.id, 'amara', welcomeText).catch(console.error);
          }
        }, 1500);
      }
    } catch (error: any) {
      setRegistrationErrors([error.message]);
    } finally {
      setIsRegistering(false);
    }
  };

  const checkTrialLimits = () => {
    if (userAccount.tier === 'anonymous') {
      const chatLimitReached = userAccount.messagesUsed >= userAccount.messagesLimit;
      const voiceLimitReached = userAccount.voiceNotesUsed >= userAccount.voiceNotesLimit;
      
      if (chatLimitReached || voiceLimitReached) {
        setShowTrialLimitModal(true);
        return true;
      }
    }
    return false;
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    // Check limits before sending
    if (checkTrialLimits()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Update usage count
    const newMessagesUsed = userAccount.messagesUsed + 1;
    setUserAccount(prev => ({
      ...prev,
      messagesUsed: newMessagesUsed
    }));
    
    // Save message to database if session exists
    if (currentSessionId) {
      try {
        await db.messages.create(currentSessionId, 'user', inputMessage);
        await db.sessions.update(currentSessionId, {
          messages_used: newMessagesUsed,
          session_duration: sessionTime
        });
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }

    // Simulate Amara's response with realistic timing
    setTimeout(async () => {
      setIsTyping(false);
      
      const responses = [
        "I hear you. Can you tell me more about what's contributing to those feelings?",
        "That sounds really challenging. What emotions are coming up for you as you share this?",
        "Thank you for trusting me with this. How long have you been feeling this way?",
        "I can sense this is important to you. What would it feel like if this situation improved?",
        "You're being so brave by opening up about this. What support do you feel you need right now?"
      ];
      
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'amara',
        timestamp: new Date(),
        type: 'text',
        isTyping: true
      };
      
      setMessages(prev => [...prev, response]);
      
      // Save Amara's response to database
      if (currentSessionId) {
        try {
          await db.messages.create(currentSessionId, 'amara', responseText);
        } catch (error) {
          console.error('Failed to save Amara response:', error);
        }
      }

      // Check if this was the last message for anonymous users
      if (userAccount.tier === 'anonymous' && newMessagesUsed >= ANONYMOUS_CHAT_LIMIT) {
        setTimeout(() => {
          setShowTrialLimitModal(true);
        }, 2000);
      }
    }, 1500 + Math.random() * 1000); // Realistic response time
  };

  const handleVoiceNote = () => {
    if (userAccount.tier === 'anonymous' && userAccount.voiceNotesUsed >= userAccount.voiceNotesLimit) {
      setShowTrialLimitModal(true);
      return;
    }

    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        
        // Add voice note message
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: "🎤 Voice note recorded",
          sender: 'user',
          timestamp: new Date(),
          type: 'voice'
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Update voice note usage
        const newVoiceNotesUsed = userAccount.voiceNotesUsed + 1;
        setUserAccount(prev => ({
          ...prev,
          voiceNotesUsed: newVoiceNotesUsed
        }));

        // Check if limit reached
        if (userAccount.tier === 'anonymous' && newVoiceNotesUsed >= ANONYMOUS_VOICE_LIMIT) {
          setTimeout(() => {
            setShowTrialLimitModal(true);
          }, 1000);
        }
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getProgressColor = () => {
    const usage = (userAccount.messagesUsed / userAccount.messagesLimit) * 100;
    if (usage > 75) return 'bg-red-500';
    if (usage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getInputPlaceholder = () => {
    if (userAccount.tier === 'anonymous') {
      const messagesLeft = userAccount.messagesLimit - userAccount.messagesUsed;
      const voiceNotesLeft = userAccount.voiceNotesLimit - userAccount.voiceNotesUsed;
      
      if (messagesLeft <= 0 && voiceNotesLeft <= 0) {
        return "Sign up for your 7-day free trial to continue...";
      } else if (messagesLeft <= 0) {
        return "Chat limit reached. Try a voice note or sign up to continue...";
      } else {
        return `Share what's on your mind... (${messagesLeft} messages left)`;
      }
    }
    return "Share what's on your mind...";
  };

  const canSendMessage = () => {
    if (userAccount.tier === 'registered') return true;
    return userAccount.messagesUsed < userAccount.messagesLimit;
  };

  const canSendVoiceNote = () => {
    if (userAccount.tier === 'registered') return true;
    return userAccount.voiceNotesUsed < userAccount.voiceNotesLimit;
  };

  // Show loading screen first
  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-gray-900 dark:text-white text-lg font-semibold">Chat with Amara</h1>
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">{formatTime(sessionTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Active</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Trial Progress Indicator */}
              {userAccount.tier === 'anonymous' && (
                <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chat Messages</div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor()} transition-all duration-300`}
                          style={{ width: `${(userAccount.messagesUsed / userAccount.messagesLimit) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {userAccount.messagesUsed}/{userAccount.messagesLimit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Voice Notes</div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${(userAccount.voiceNotesUsed / userAccount.voiceNotesLimit) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {userAccount.voiceNotesUsed}/{userAccount.voiceNotesLimit}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {userAccount.isAuthenticated && (
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium">
                  7-Day Free Trial
                </span>
              )}
              
              {userAccount.isAuthenticated && onNavigateToDashboard && (
                <button
                  onClick={() => onNavigateToDashboard(userAccount)}
                  className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
              )}
              
              <button
                onClick={onEndSession}
                className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">End Session</span>
              </button>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm'
                } rounded-2xl px-6 py-4 ${
                  message.sender === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'
                } transition-all duration-300 hover:shadow-md`}
              >
                {message.isTyping ? (
                  <TypewriterText 
                    text={message.text} 
                    speed={25}
                    className="leading-relaxed"
                  />
                ) : (
                  <p className="leading-relaxed">{message.text}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <p className={`text-xs ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {message.type === 'voice' && (
                    <div className={`text-xs flex items-center space-x-1 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Mic className="w-3 h-3" />
                      <span>Voice Note</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <TypingIndicator isVisible={isTyping} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          {/* Trial Limit Warning */}
          {userAccount.tier === 'anonymous' && !canSendMessage() && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 rounded-xl">
              <p className="text-purple-800 dark:text-purple-200 text-sm text-center">
                Trial limit reached. Sign up to continue chatting with unlimited messages!
              </p>
            </div>
          )}
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getInputPlaceholder()}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300"
                rows={2}
                disabled={!canSendMessage()}
                style={{
                  minHeight: '60px',
                  maxHeight: '120px'
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-2">Press Enter to send, Shift + Enter for new line</p>
            </div>
            
            <div className="flex flex-col space-y-3">
              {/* Voice Input Button */}
              <button
                onClick={handleVoiceNote}
                disabled={!canSendVoiceNote()}
                className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  canSendVoiceNote()
                    ? isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                title={isRecording ? 'Stop Recording' : 'Start Voice Note'}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!canSendMessage() || !inputMessage.trim()}
                className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  canSendMessage() && inputMessage.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                title="Send Message"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Limit Modal */}
      {showTrialLimitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your Journey Continues!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You've reached the limit of your anonymous trial. Sign up now to enjoy 1 week of full, 
                unrestricted access to Amara's features—no commitment required!
              </p>
            </div>

            <div className="space-y-4">
              {/* Registration Form */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registrationData.confirmPassword}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Messages */}
              {registrationErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  {registrationErrors.map((error, index) => (
                    <p key={index} className="text-red-600 dark:text-red-400 text-sm">
                      • {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleRegistration}
                disabled={isRegistering}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Sign Up for 7-Day Free Trial</span>
                  </>
                )}
              </button>

              <button
                className="w-full py-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                Sign In (Existing Users)
              </button>

              <button
                onClick={() => setShowTrialLimitModal(false)}
                className="w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-center">What you get with your free trial:</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 text-green-500 mr-3 flex-shrink-0">✓</div>
                  <span className="text-sm">Unlimited chat messages for 7 days</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 text-green-500 mr-3 flex-shrink-0">✓</div>
                  <span className="text-sm">Up to 20 voice notes per week</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 text-green-500 mr-3 flex-shrink-0">✓</div>
                  <span className="text-sm">Save your conversation history</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 text-green-500 mr-3 flex-shrink-0">✓</div>
                  <span className="text-sm">Personalized therapy experience</span>
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 text-green-500 mr-3 flex-shrink-0">✓</div>
                  <span className="text-sm">Progress tracking and insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-gray-900 dark:text-white font-semibold">Session Insights</h2>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Account Status */}
          {userAccount.isAuthenticated && (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium text-sm">Free Trial Active</span>
                </div>
                {onNavigateToDashboard && (
                  <button
                    onClick={() => onNavigateToDashboard(userAccount)}
                    className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center space-x-1"
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>
              <p className="text-green-700 dark:text-green-300 text-xs truncate">{userAccount.email}</p>
            </div>
          )}

          {/* Mood Tracker */}
          <div className="mb-8">
            <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-4">How are you feeling?</h3>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-2 rounded-lg transition-colors ${
                    currentMood === mood ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Smile className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-8">
            <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-4">Quick Topics</h3>
            <div className="space-y-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  disabled={!canSendMessage()}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                    canSendMessage()
                      ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      : 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Support */}
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Need immediate help?</span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
              If you're in crisis, please call the 24/7 support line:
              <a href="tel:988" className="block text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium mt-1">988</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySession;