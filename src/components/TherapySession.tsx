import React, { useState, useRef, useEffect } from 'react';
import { Send, Clock, X, ChevronDown, Smile, AlertCircle, Lock, Mail, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'amara';
  timestamp: Date;
}

interface TherapySessionProps {
  userName: string;
  onEndSession: () => void;
  onNavigateToDashboard?: (userData: UserAccount) => void;
}

interface UserAccount {
  tier: 'anonymous' | 'registered';
  messagesUsed: number;
  messagesLimit: number;
  email: string | null;
  isAuthenticated: boolean;
}

const ANONYMOUS_LIMIT = 3;
const REGISTERED_LIMIT = 8;

const TherapySession: React.FC<TherapySessionProps> = ({ userName, onEndSession, onNavigateToDashboard }) => {
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount>({
    tier: 'anonymous',
    messagesUsed: 0,
    messagesLimit: ANONYMOUS_LIMIT,
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

  useEffect(() => {
    // Show registration modal when reaching anonymous limit
    if (userAccount.tier === 'anonymous' && userAccount.messagesUsed === ANONYMOUS_LIMIT) {
      setShowRegistrationModal(true);
    }
  }, [userAccount.messagesUsed, userAccount.tier]);

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
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would:
      // 1. Make API call to register user
      // 2. Handle email verification if needed
      // 3. Store authentication tokens
      // 4. Update user state with registered account info
      
      const newUserAccount: UserAccount = {
        tier: 'registered',
        messagesUsed: userAccount.messagesUsed,
        messagesLimit: REGISTERED_LIMIT,
        email: registrationData.email,
        isAuthenticated: true
      };

      setUserAccount(newUserAccount);
      setShowRegistrationModal(false);
      setRegistrationData({ email: '', password: '', confirmPassword: '' });
      setRegistrationErrors([]);
      
      // Add a welcome message from Amara
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Welcome to Amara, ${registrationData.email.split('@')[0]}! Thank you for joining us. You now have ${REGISTERED_LIMIT - userAccount.messagesUsed} more messages to continue our conversation. You can also visit your dashboard anytime to track your progress and manage your sessions.`,
        sender: 'amara',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, welcomeMessage]);

      // Show dashboard redirect option after 3 seconds
      setTimeout(() => {
        if (onNavigateToDashboard) {
          const shouldRedirect = window.confirm(
            "Would you like to visit your dashboard to explore your new account features? You can always return to continue this conversation."
          );
          if (shouldRedirect) {
            onNavigateToDashboard(newUserAccount);
          }
        }
      }, 3000);
      
    } catch (error) {
      setRegistrationErrors(['Registration failed. Please try again.']);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if user has reached their message limit
    if (userAccount.messagesUsed >= userAccount.messagesLimit) {
      if (userAccount.tier === 'anonymous') {
        setShowRegistrationModal(true);
      }
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Update message count
    setUserAccount(prev => ({
      ...prev,
      messagesUsed: prev.messagesUsed + 1
    }));

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

  const getProgressColor = () => {
    const usage = (userAccount.messagesUsed / userAccount.messagesLimit) * 100;
    if (usage > 75) return 'bg-red-600';
    if (usage > 50) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const getInputPlaceholder = () => {
    if (userAccount.messagesUsed >= userAccount.messagesLimit) {
      return userAccount.tier === 'anonymous' 
        ? "Sign up to continue chatting..." 
        : "You've reached your message limit for this session...";
    }
    return "Share what's on your mind...";
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor()} transition-all duration-300`}
                    style={{ width: `${(userAccount.messagesUsed / userAccount.messagesLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="text-slate-300 text-sm">
                  {userAccount.messagesUsed}/{userAccount.messagesLimit} messages
                </span>
                {userAccount.isAuthenticated && (
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    Registered
                  </span>
                )}
              </div>
              {userAccount.isAuthenticated && onNavigateToDashboard && (
                <button
                  onClick={() => onNavigateToDashboard(userAccount)}
                  className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}
              <button
                onClick={onEndSession}
                className="bg-red-600/20 text-red-500 hover:bg-red-600/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>End Session</span>
              </button>
            </div>
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
                placeholder={getInputPlaceholder()}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                rows={2}
                disabled={userAccount.messagesUsed >= userAccount.messagesLimit}
              />
              <p className="text-xs text-slate-400 mt-1">Press Enter to send, Shift + Enter for new line</p>
            </div>
            <button
              onClick={handleSend}
              disabled={userAccount.messagesUsed >= userAccount.messagesLimit}
              className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg transition-opacity ${
                userAccount.messagesUsed >= userAccount.messagesLimit
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Continue Your Journey
              </h2>
              <p className="text-slate-300">
                Create your free account to get 5 more messages and save your progress
              </p>
            </div>

            <div className="space-y-4">
              {/* Registration Form */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registrationData.confirmPassword}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Messages */}
              {registrationErrors.length > 0 && (
                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
                  {registrationErrors.map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">
                      • {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={handleRegistration}
                disabled={isRegistering}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRegistrationModal(false)}
                className="w-full py-2 text-slate-400 hover:text-white transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h3 className="text-white font-medium mb-4">What you get:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-300">
                  <div className="w-5 h-5 text-purple-500 mr-2">✓</div>
                  5 additional messages (8 total)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-5 h-5 text-purple-500 mr-2">✓</div>
                  Save your conversation history
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-5 h-5 text-purple-500 mr-2">✓</div>
                  Personalized therapy experience
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-5 h-5 text-purple-500 mr-2">✓</div>
                  Progress tracking across sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

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

          {/* Account Status */}
          {userAccount.isAuthenticated && (
            <div className="mb-6 p-3 bg-green-600/10 rounded-lg border border-green-600/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2 text-green-500">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium text-sm">Registered Account</span>
                </div>
                {onNavigateToDashboard && (
                  <button
                    onClick={() => onNavigateToDashboard(userAccount)}
                    className="text-xs text-green-400 hover:text-green-300 flex items-center space-x-1"
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    <span>Dashboard</span>
                  </button>
                )}
              </div>
              <p className="text-green-400 text-xs truncate">{userAccount.email}</p>
            </div>
          )}

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
                  disabled={userAccount.messagesUsed >= userAccount.messagesLimit}
                  className={`w-full text-left px-4 py-2 rounded-lg text-slate-300 transition-colors text-sm ${
                    userAccount.messagesUsed >= userAccount.messagesLimit
                      ? 'bg-slate-700/50 opacity-50 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
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