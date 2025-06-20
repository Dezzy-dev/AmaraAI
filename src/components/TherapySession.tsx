import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, MessageSquare, Mic, Send, Heart, ArrowLeft, Lock, Zap, Crown, UserPlus, LogIn } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import TypingIndicator from './TypingIndicator';
import TypewriterText from './TypewriterText';
import SignUpNudge from './SignUpNudge';
import TrialLimitModal from './TrialLimitModal';
import { useChat } from '../contexts/ChatContext';
import { useUser } from '../contexts/UserContext';

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
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  const { messages, addMessage, startSession, endSession } = useChat();
  const { userData, incrementMessageCount, incrementVoiceNoteCount } = useUser();

  // Determine user type
  const isPremiumUser = () => {
    return userData?.currentPlan === 'monthly_premium' || userData?.currentPlan === 'yearly_premium';
  };

  const isTrialUser = () => {
    return userData?.currentPlan === 'monthly_trial' || userData?.currentPlan === 'yearly_trial';
  };

  const isActiveTrialUser = () => {
    if (!isTrialUser()) return false;
    
    // Check if trial has expired
    if (userData?.trialEndDate) {
      const trialEndDate = new Date(userData.trialEndDate);
      const now = new Date();
      return now < trialEndDate;
    }
    
    // If no trial end date, assume trial is active (fallback)
    return true;
  };

  const isExpiredTrialUser = () => {
    return isTrialUser() && !isActiveTrialUser();
  };

  const isFreemiumUser = () => {
    return userData?.currentPlan === 'freemium';
  };

  const isAnonymousUser = () => {
    return !userData?.isAuthenticated;
  };

  const isAuthenticated = () => {
    return userData?.isAuthenticated === true;
  };

  // Get trial days remaining
  const getTrialDaysRemaining = () => {
    if (!userData?.trialEndDate) return 0;
    const trialEndDate = new Date(userData.trialEndDate);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Limits only apply to non-premium users
  const FREEMIUM_DAILY_MESSAGES = 5;
  const FREEMIUM_VOICE_NOTES = 1;
  const ANONYMOUS_MESSAGES = 3;
  const ANONYMOUS_VOICE_NOTES = 0;

  // Get current limits based on user type
  const getCurrentLimits = () => {
    if (isPremiumUser()) {
      // Premium users have no limits
      return {
        maxMessages: Infinity,
        maxVoiceNotes: Infinity,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        voiceNotesUsed: userData?.voiceNotesUsed || 0,
        messagesRemaining: Infinity,
        voiceNotesRemaining: Infinity,
        hasLimits: false
      };
    } else if (isActiveTrialUser()) {
      // Active trial users have unlimited access (premium features)
      return {
        maxMessages: Infinity,
        maxVoiceNotes: Infinity,
        messagesUsed: userData?.dailyMessagesUsed || 0,
        voiceNotesUsed: userData?.voiceNotesUsed || 0,
        messagesRemaining: Infinity,
        voiceNotesRemaining: Infinity,
        hasLimits: false
      };
    } else if (isExpiredTrialUser()) {
      // Expired trial users have freemium limits
      const messagesUsed = userData?.dailyMessagesUsed || 0;
      const voiceNotesUsed = userData?.voiceNotesUsed || 0;
      return {
        maxMessages: FREEMIUM_DAILY_MESSAGES,
        maxVoiceNotes: FREEMIUM_VOICE_NOTES,
        messagesUsed,
        voiceNotesUsed,
        messagesRemaining: Math.max(0, FREEMIUM_DAILY_MESSAGES - messagesUsed),
        voiceNotesRemaining: Math.max(0, FREEMIUM_VOICE_NOTES - voiceNotesUsed),
        hasLimits: true
      };
    } else if (isAnonymousUser()) {
      // Anonymous users have 3 message limit, no voice notes
      const messagesUsed = userData?.dailyMessagesUsed || 0;
      const voiceNotesUsed = userData?.voiceNotesUsed || 0;
      return {
        maxMessages: ANONYMOUS_MESSAGES,
        maxVoiceNotes: ANONYMOUS_VOICE_NOTES,
        messagesUsed,
        voiceNotesUsed,
        messagesRemaining: Math.max(0, ANONYMOUS_MESSAGES - messagesUsed),
        voiceNotesRemaining: 0,
        hasLimits: true
      };
    } else if (isFreemiumUser()) {
      const messagesUsed = userData?.dailyMessagesUsed || 0;
      const voiceNotesUsed = userData?.voiceNotesUsed || 0;
      return {
        maxMessages: FREEMIUM_DAILY_MESSAGES,
        maxVoiceNotes: FREEMIUM_VOICE_NOTES,
        messagesUsed,
        voiceNotesUsed,
        messagesRemaining: Math.max(0, FREEMIUM_DAILY_MESSAGES - messagesUsed),
        voiceNotesRemaining: Math.max(0, FREEMIUM_VOICE_NOTES - voiceNotesUsed),
        hasLimits: true
      };
    } else {
      // Fallback for any other case
      const messagesUsed = userData?.dailyMessagesUsed || 0;
      const voiceNotesUsed = userData?.voiceNotesUsed || 0;
      return {
        maxMessages: FREEMIUM_DAILY_MESSAGES,
        maxVoiceNotes: FREEMIUM_VOICE_NOTES,
        messagesUsed,
        voiceNotesUsed,
        messagesRemaining: Math.max(0, FREEMIUM_DAILY_MESSAGES - messagesUsed),
        voiceNotesRemaining: Math.max(0, FREEMIUM_VOICE_NOTES - voiceNotesUsed),
        hasLimits: true
      };
    }
  };

  const limits = getCurrentLimits();

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
      startSession();
      
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

  // Check limits (only for non-premium users and non-active trial users)
  useEffect(() => {
    if (!isPremiumUser() && !isActiveTrialUser() && limits.hasLimits) {
      // For anonymous users, only show modal after message limit is reached
      if (isAnonymousUser()) {
        if (limits.messagesUsed >= limits.maxMessages) {
          setShowTrialModal(true);
        }
      } else {
        const messagesLimitReached = limits.messagesUsed >= limits.maxMessages;
        const voiceNotesLimitReached = limits.voiceNotesUsed >= limits.maxVoiceNotes;
        if (messagesLimitReached || voiceNotesLimitReached) {
          setShowTrialModal(true);
        }
      }
    }
  }, [limits.messagesUsed, limits.voiceNotesUsed, limits, isPremiumUser, isActiveTrialUser]);

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
    
    if (isPremiumUser()) {
      greeting += "As a premium member, you have unlimited access to all my features. ";
    } else if (isActiveTrialUser()) {
      const daysRemaining = getTrialDaysRemaining();
      if (daysRemaining > 0) {
        greeting += `You're currently enjoying your free trial with unlimited access! You have ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining. `;
      } else {
        greeting += "You're currently enjoying your free trial with unlimited access! ";
      }
    } else if (isExpiredTrialUser()) {
      greeting += "Your trial period has ended. You can continue with freemium access or upgrade to premium for unlimited features. ";
    }
    
    greeting += "What's on your mind today? Feel free to share anything - I'm here to listen without judgment.";
    
    return greeting;
  };

  const generateAmaraResponse = (userMessage: string) => {
    // Simple response generation based on message content
    const responses = [
      "I hear you, and what you're sharing is really important. Can you tell me more about how that makes you feel?",
      "Thank you for trusting me with that. It sounds like you're going through something significant. What would feel most helpful right now?",
      "I can sense the emotion in your words. You're being really brave by opening up about this. What's the hardest part for you?",
      "That sounds really challenging. I want you to know that your feelings are completely valid. How long have you been carrying this?",
      "I'm glad you felt comfortable sharing that with me. Sometimes just putting our thoughts into words can be healing. What comes up for you when you think about this?"
    ];
    
    // Use message length to add some variety to responses
    const responseIndex = userMessage.length % responses.length;
    return responses[responseIndex];
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() && (isPremiumUser() || limits.messagesRemaining > 0)) {
      addMessage('user', currentMessage.trim());
      setCurrentMessage('');
      
      // Increment message count in database
      await incrementMessageCount();
      
      // Simulate Amara's response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const response = generateAmaraResponse(currentMessage);
          addMessage('amara', response);
          setIsTyping(false);
        }, 1500 + Math.random() * 1000);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = async (reply: string) => {
    if (isPremiumUser() || limits.messagesRemaining > 0) {
      addMessage('user', reply);
      
      // Increment message count in database
      await incrementMessageCount();
      
      // Simulate Amara's response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const response = generateAmaraResponse(reply);
          addMessage('amara', response);
          setIsTyping(false);
        }, 1500 + Math.random() * 1000);
      }, 500);
    }
  };

  const handleVoiceNote = async () => {
    if (isPremiumUser() || limits.voiceNotesRemaining > 0) {
      setIsRecording(!isRecording);
      if (!isRecording) {
        // Simulate voice note
        setTimeout(async () => {
          setIsRecording(false);
          
          // Increment voice note count in database
          await incrementVoiceNoteCount();
          
          addMessage('user', '[Voice message: "I just wanted to talk about how I\'ve been feeling lately..."]');
          
          // Simulate Amara's response
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const response = "Thank you for sharing that voice message with me. I can hear the emotion in your voice, and I want you to know that I'm here to listen. What would you like to explore about those feelings?";
              addMessage('amara', response);
              setIsTyping(false);
            }, 1500);
          }, 500);
        }, 3000);
      }
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    console.log('Adding reaction:', emoji, 'to message:', messageId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSessionClick = () => {
    endSession();
    onEndSession();
  };

  const getMessageCounterColor = () => {
    if (isPremiumUser()) return 'text-green-500 dark:text-green-400'; // Green for unlimited
    if (limits.messagesRemaining <= 1) return 'text-red-500 dark:text-red-400';
    if (limits.messagesRemaining <= 2) return 'text-orange-500 dark:text-orange-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getVoiceCounterColor = () => {
    if (isPremiumUser()) return 'text-green-500 dark:text-green-400'; // Green for unlimited
    if (limits.voiceNotesRemaining === 0) return 'text-red-500 dark:text-red-400';
    return 'text-purple-500 dark:text-purple-400';
  };

  const shouldShowLimitWarnings = () => {
    return !isPremiumUser() && limits.hasLimits;
  };

  const shouldDisableInput = () => {
    return !isPremiumUser() && limits.hasLimits && limits.messagesRemaining === 0;
  };

  const shouldDisableVoice = () => {
    return !isPremiumUser() && limits.hasLimits && limits.voiceNotesRemaining === 0;
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">Chat with Amara</h1>
                {isPremiumUser() && (
                  <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">{formatTime(sessionDuration)}</span>
                </div>
                
                {/* Only show counters for non-premium users */}
                {!isPremiumUser() && !isActiveTrialUser() && (
                  <>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className={`whitespace-nowrap font-medium ${getMessageCounterColor()}`}>
                        {isAnonymousUser() 
                          ? `${limits.messagesUsed}/${limits.maxMessages}` 
                          : isFreemiumUser() 
                          ? `${limits.messagesRemaining} left` 
                          : `${limits.messagesUsed}/${limits.maxMessages}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mic className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className={`whitespace-nowrap font-medium ${getVoiceCounterColor()}`}>
                        {isAnonymousUser() 
                          ? `${limits.voiceNotesUsed}/${limits.maxVoiceNotes}` 
                          : isFreemiumUser() 
                          ? `${limits.voiceNotesRemaining} left` 
                          : `${limits.voiceNotesUsed}/${limits.maxVoiceNotes}`
                        }
                      </span>
                    </div>
                  </>
                )}
                
                {/* Trial indicator */}
                {isActiveTrialUser() && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-500" />
                    <span className="whitespace-nowrap font-medium text-purple-600 dark:text-purple-400">
                      Trial ({getTrialDaysRemaining()}d left)
                    </span>
                  </div>
                )}
                
                {/* Premium indicator */}
                {isPremiumUser() && (
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-yellow-500" />
                    <span className="whitespace-nowrap font-medium text-yellow-600 dark:text-yellow-400">
                      Premium
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Conditional Header Buttons */}
          {isAuthenticated() ? (
            // Authenticated users see End Session button
            <>
              <button
                onClick={handleEndSessionClick}
                className="inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">End Session</span>
              </button>
              
              <button
                onClick={handleEndSessionClick}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </>
          ) : (
            // Anonymous users see Sign Up and Sign In buttons
            <>
              <button
                onClick={onSignIn}
                className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
              
              <button
                onClick={() => onSignUp('trial_path')}
                className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Sign Up</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Usage Warning Banner - Only for non-premium users */}
      {shouldShowLimitWarnings() && (limits.messagesRemaining <= 2 || limits.voiceNotesRemaining === 0) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-orange-200 dark:border-orange-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {limits.messagesRemaining === 0 
                    ? (isAnonymousUser() ? "Anonymous message limit reached" : "Daily message limit reached")
                    : limits.messagesRemaining === 1
                    ? (isAnonymousUser() ? "1 message remaining" : "1 message remaining today")
                    : (isAnonymousUser() 
                        ? `${limits.messagesRemaining} messages remaining` 
                        : `${limits.messagesRemaining} messages remaining today`)
                  }
                </p>
                {limits.voiceNotesRemaining === 0 && (
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    {isAnonymousUser() 
                      ? "Voice notes require an account. Sign up for free access!"
                      : "You've used your free voice note. Upgrade for unlimited voice notes!"
                    }
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onSignUp('trial_path')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {isAnonymousUser() ? "Sign Up Free" : "Upgrade Now"}
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Amara's Avatar */}
              {message.sender === 'amara' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-serif">𝒜</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Amara</span>
                </div>
              )}
              
              {/* Message Bubble */}
              <div className={`p-3 sm:p-4 rounded-2xl ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-md' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-tl-md shadow-sm'
              }`}>
                {message.sender === 'amara' ? (
                  <TypewriterText 
                    text={message.text} 
                    speed={30}
                    className="leading-relaxed text-sm sm:text-base"
                  />
                ) : (
                  <p className="leading-relaxed text-sm sm:text-base">{message.text}</p>
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
                        className="p-1 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
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
      <div className="px-3 sm:px-4 py-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              disabled={shouldDisableInput()}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border transition-all duration-200 ${
                shouldDisableInput()
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4">
        {/* Message Limit Warning - Only for non-premium users */}
        {shouldShowLimitWarnings() && limits.messagesRemaining <= 2 && limits.messagesRemaining > 0 && (
          <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {isAnonymousUser() 
                  ? `You have ${limits.messagesRemaining} message${limits.messagesRemaining === 1 ? '' : 's'} remaining. Sign up for unlimited conversations.`
                  : `You have ${limits.messagesRemaining} message${limits.messagesRemaining === 1 ? '' : 's'} remaining today. Upgrade for unlimited conversations.`
                }
              </p>
              <button
                onClick={() => onSignUp('trial_path')}
                className="ml-3 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors duration-200 whitespace-nowrap"
              >
                {isAnonymousUser() ? "Sign Up Free" : "Upgrade"}
              </button>
            </div>
          </div>
        )}

        {/* Message Limit Reached - Only for non-premium users */}
        {shouldShowLimitWarnings() && limits.messagesRemaining === 0 && (
          <div className="mb-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                  {isAnonymousUser() 
                    ? "Anonymous limit reached" 
                    : isFreemiumUser() 
                    ? "Daily limit reached" 
                    : "Trial limit reached"
                  }
                </h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                {isAnonymousUser()
                  ? "You've reached the limit for anonymous users. Sign up for free access to unlimited conversations with Amara!"
                  : isFreemiumUser() 
                  ? "Your daily message limit has been reached. Upgrade for unlimited conversations and features!"
                  : "Upgrade for unlimited conversations with Amara and access to all premium features."
                }
              </p>
              <button
                onClick={() => onSignUp('trial_path')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Crown className="w-5 h-5 mr-2" />
                {isAnonymousUser() ? "Sign Up Free" : "Upgrade Now"}
              </button>
            </div>
          </div>
        )}

        {/* Voice Note Limit Warning - Only for non-premium users */}
        {shouldShowLimitWarnings() && limits.voiceNotesRemaining === 0 && (
          <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {isAnonymousUser()
                    ? "Voice notes require an account. Sign up for free access to voice features!"
                    : "You've used your free voice note. Upgrade for unlimited voice notes and enhanced communication!"
                  }
                </p>
              </div>
              <button
                onClick={() => onSignUp('trial_path')}
                className="ml-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors duration-200 whitespace-nowrap"
              >
                {isAnonymousUser() ? "Sign Up Free" : "Upgrade"}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-2 sm:space-x-3">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                shouldDisableInput()
                  ? (isAnonymousUser() ? "Sign up to continue..." : "Upgrade to continue...")
                  : isPremiumUser()
                  ? "Share anything on your mind... unlimited conversations await!"
                  : "Share what's on your mind..."
              }
              disabled={shouldDisableInput()}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border resize-none transition-all duration-200 text-sm sm:text-base ${
                shouldDisableInput()
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                  : isPremiumUser()
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
              }`}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          {/* Voice Button */}
          <button
            onClick={handleVoiceNote}
            disabled={shouldDisableVoice()}
            className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 relative ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : shouldDisableVoice()
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : isPremiumUser()
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            {shouldDisableVoice() && (
              <Lock className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />
            )}
          </button>
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || shouldDisableInput()}
            className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 ${
              !currentMessage.trim() || shouldDisableInput()
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : isPremiumUser()
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
            }`}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Persistent Sign-Up Nudge - Only show for non-authenticated users */}
      {!userData?.isAuthenticated && (
        <SignUpNudge 
          onSignUp={() => onSignUp('trial_path')} 
          onSignIn={onSignIn}
          onChooseFreemium={() => onSignUp('freemium_path')}
        />
      )}

      {/* Trial Limit Modal - Only for non-premium users */}
      {!isPremiumUser() && (
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
      )}
    </div>
  );
};

export default TherapySession;