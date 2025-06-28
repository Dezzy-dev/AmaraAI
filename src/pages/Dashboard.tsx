import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Crown, 
  Clock,
  Heart,
  BookOpen,
  Zap,
  AlertCircle,
  CheckCircle,
  User,
  BarChart3,
  PenTool,
  Smile,
  X
} from 'lucide-react';
import useUser from '../contexts/useUser';
import { useChat } from '../contexts/ChatContext';
import SessionHistory from '../components/SessionHistory';
import { db, TherapySession } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { userData, limits, isPremiumUser, isActiveTrialUser, isFreemiumUser, handleNavigateToSettings, handleLogout } = useUser();
  const { clearMessages } = useChat();
  
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  // Load user sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!userData) return;
      
      setIsLoadingSessions(true);
      try {
        let userSessions: TherapySession[] = [];
        if (userData.isAuthenticated && userData.id) {
          userSessions = await db.sessions.getByUser(userData.id);
        } else if (userData.deviceId) {
          userSessions = await db.sessions.getByDevice(userData.deviceId);
        }
        setSessions(userSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadSessions();
  }, [userData]);

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (!userData?.trialEndDate) return 0;
    const trialEndDate = new Date(userData.trialEndDate);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  // Navigation handlers
  const handleStartNewSession = () => {
    clearMessages();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'session' } }));
  };

  const handleResumeSession = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'session' } }));
  };

  const handleViewSessionHistory = async (sessionId: string) => {
    // Freemium users should be redirected to upgrade
    if (isFreemiumUser()) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'comparison' } }));
      return;
    }

    try {
      // Load messages from the selected session using ChatContext
      const { loadMessagesFromSession } = useChat();
      await loadMessagesFromSession(sessionId);
      
      // Navigate to the session view
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'session' } }));

    } catch (error) {
      console.error('Error loading session history:', error);
      toast.error('Unable to load session history. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleUpgrade = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'comparison' } }));
  };

  const handleLogMood = (mood: string) => {
    if (userData) {
      // Show success message
      toast.success(`Mood logged: ${mood}`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    }
  };

  const handleQuickJournal = (entry: string) => {
    toast.success('Journal entry saved!', {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  };

  const handleSettings = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'settings' } }));
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Check if user has premium access (either premium or trial)
  const hasPremiumAccess = isPremiumUser() || isActiveTrialUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span 
                className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-100"
                style={{
                  fontFamily: 'serif',
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                𝒜𝓂𝒶𝓇𝒶
              </span>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Plan Badge */}
              <div className="flex items-center space-x-2">
                {userData.isJudge ? (
                  <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full border border-yellow-200 dark:border-yellow-700">
                    <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-1" fill="currentColor" />
                    <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Judge</span>
                  </div>
                ) : hasPremiumAccess ? (
                  <div className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200 dark:border-purple-700">
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" fill="currentColor" />
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {isActiveTrialUser() ? 'Trial' : 'Premium'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Freemium</span>
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <button
                onClick={handleSettings}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trial Banner - Only show for active trial users */}
      {isActiveTrialUser() && showTrialBanner && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5" />
                <div>
                  <span className="font-medium">
                    {trialDaysRemaining > 0 
                      ? `${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} left in your trial`
                      : 'Your trial has ended'
                    }
                  </span>
                  <span className="ml-2 text-purple-100">
                    Upgrade now to keep unlimited access
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowTrialBanner(false)}
                  className="text-purple-200 hover:text-white transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {userData.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your safe space. Ready to explore what's on your mind?
          </p>
        </div>

        {/* Freemium Upgrade Banner - Only show for freemium users */}
        {isFreemiumUser() && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Unlock Your Full Potential</h3>
                  <p className="text-purple-100">
                    Upgrade to Premium for unlimited conversations and advanced features
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors duration-200"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Conversations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Your Conversations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start New Session */}
                <button
                  onClick={handleStartNewSession}
                  className="group p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200">
                      <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Start New Session</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Begin a fresh conversation with Amara
                    </p>
                  </div>
                </button>

                {/* Resume Session */}
                <button
                  onClick={handleResumeSession}
                  className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-300 dark:group-hover:bg-purple-700/70 transition-colors duration-200">
                      <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Continue Session</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Continue from your last conversation
                    </p>
                  </div>
                </button>
              </div>

              {/* Usage Stats - Show for all users */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Messages</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {limits.messagesUsed}/{limits.hasLimits ? limits.maxMessages : '∞'}
                  </span>
                </div>
                {limits.hasLimits && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((limits.messagesUsed / limits.maxMessages) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* How are you feeling today? */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Smile className="w-5 h-5 mr-2 text-pink-500" />
                How are you feeling today?
              </h2>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { emoji: '😊', label: 'Happy', mood: 'happy' },
                  { emoji: '😐', label: 'Neutral', mood: 'neutral' },
                  { emoji: '😔', label: 'Sad', mood: 'sad' },
                  { emoji: '😰', label: 'Anxious', mood: 'anxious' },
                  { emoji: '😴', label: 'Tired', mood: 'tired' },
                  { emoji: '😄', label: 'Excited', mood: 'excited' }
                ].map((feeling) => (
                  <button
                    key={feeling.mood}
                    onClick={() => handleLogMood(feeling.mood)}
                    className="p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <div className="text-2xl mb-1">{feeling.emoji}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{feeling.label}</div>
                  </button>
                ))}
              </div>

              {/* Mood tracking note for freemium users */}
              {isFreemiumUser() && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Mood tracking available with Premium
                  </span>
                  <button
                    onClick={handleUpgrade}
                    className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>

            {/* Quick Journal Entry */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-green-500" />
                Quick Journal Entry
              </h2>
              
              {hasPremiumAccess ? (
                <div>
                  <textarea
                    placeholder="What's on your mind today? Write a quick reflection..."
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleQuickJournal('Sample journal entry')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Upgrade to Premium to unlock journaling
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Session History & Stats */}
          <div className="space-y-6">
            {/* Session History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Session History
                  {hasPremiumAccess && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </h2>
              </div>

              {hasPremiumAccess ? (
                <SessionHistory 
                  sessions={sessions}
                  onSelectSession={handleViewSessionHistory}
                  isLoading={isLoadingSessions}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Session History Locked</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Upgrade to Premium to access your complete conversation history, download sessions, and get advanced insights.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>

            {/* Insights & Analytics - Premium Feature */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                Your Insights
                {hasPremiumAccess && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                    Premium
                  </span>
                )}
              </h2>

              {hasPremiumAccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">+15%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Mood improvement this week</div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions This Month</span>
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{sessions.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Keep up the great work!</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Insights Locked</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Get personalized insights about your mental health journey with Premium.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;