import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Heart,
  PenTool,
  Settings,
  HelpCircle,
  Sparkles,
  Crown,
  Zap,
  TrendingUp,
  BookOpen,
  Smile,
  ArrowRight,
  Play,
  Plus,
  Activity,
  Brain,
  BarChart3,
  Calendar,
  Shield,
  Star,
  Award,
  Infinity,
  Sun,
  Moon
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  current_plan: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_premium' | 'yearly_premium';
  trial_end_date?: string;
  messages_used_today?: number;
  last_session_date?: string;
  last_mood?: string;
  last_journal_entry?: string;
  created_at: string;
}

interface DashboardProps {
  user: UserProfile;
  onStartNewSession: () => void;
  onResumeSession: () => void;
  onUpgrade: () => void;
  onManageSubscription: () => void;
  onLogMood: (mood: string) => void;
  onQuickJournal: (entry: string) => void;
  onGetAIPrompt: () => void;
  onNavigateToSettings: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onStartNewSession,
  onResumeSession,
  onUpgrade,
  onManageSubscription,
  onLogMood,
  onQuickJournal,
  onGetAIPrompt,
  onNavigateToSettings,
  isDark,
  toggleDarkMode
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const { userData } = useUser();

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper functions
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTrialDaysRemaining = () => {
    if (!user.trial_end_date) return 0;
    const endDate = new Date(user.trial_end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isTrialUser = () => {
    return user.current_plan === 'monthly_trial' || user.current_plan === 'yearly_trial';
  };

  const isFreemiumUser = () => {
    return user.current_plan === 'freemium';
  };

  const isPremiumUser = () => {
    return user.current_plan === 'monthly_premium' || user.current_plan === 'yearly_premium';
  };

  const getFreemiumLimits = () => {
    const dailyLimit = 5;
    const used = user.messages_used_today || 0;
    return { used, limit: dailyLimit, remaining: Math.max(0, dailyLimit - used) };
  };

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😄', label: 'Excited', value: 'excited' }
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onLogMood(mood);
  };

  const handleJournalSubmit = () => {
    if (journalEntry.trim()) {
      onQuickJournal(journalEntry.trim());
      setJournalEntry('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Top Navigation */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span
                className="text-2xl font-light text-gray-800 dark:text-gray-100"
                style={{
                  fontFamily: 'serif',
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                𝒜𝓂𝒶𝓇𝒶
              </span>
              {isPremiumUser() && (
                <Crown className="w-5 h-5 text-yellow-500 ml-2" fill="currentColor" />
              )}
            </div>

            {/* Right side navigation */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                <HelpCircle className="w-5 h-5" />
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onNavigateToSettings}
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm relative cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                {user.name.charAt(0).toUpperCase()}
                {isPremiumUser() && (
                  <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user.name}!
            </h1>
            {isPremiumUser() && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full border border-yellow-200 dark:border-yellow-700">
                <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Premium Member</span>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isPremiumUser()
              ? "Welcome to your unlimited healing journey. All features are at your fingertips."
              : isTrialUser() 
              ? "Your healing journey continues with full access to all features."
              : isFreemiumUser()
              ? "Welcome to your safe space. Ready to explore what's on your mind?"
              : "Let's continue your journey of growth and self-discovery."
            }
          </p>
        </div>

        {/* Premium Welcome Banner */}
        {isPremiumUser() && (
          <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center md:text-left flex items-center">
                      <Infinity className="w-5 h-5 mr-2 text-green-600" />
                      Unlimited Access Activated
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
                      Enjoy unlimited conversations, voice notes, and all premium features
                    </p>
                  </div>
                </div>
                <button
                  onClick={onManageSubscription}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-full hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full md:w-auto"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trial Status Banner (for trial users only) */}
        {isTrialUser() && (
          <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center md:text-left">
                      Your Free Trial Ends in {getTrialDaysRemaining()} Days!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
                      Continue enjoying unlimited access to all premium features
                    </p>
                  </div>
                </div>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full md:w-auto"
                >
                  Secure Your Premium Access
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Banner (for freemium users only) */}
        {isFreemiumUser() && (
          <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-center md:text-left">Unlock Your Full Potential</h3>
                    <p className="text-purple-100 text-center md:text-left">
                      Upgrade to Premium for unlimited conversations and advanced features
                    </p>
                  </div>
                </div>
                <button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full md:w-auto"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chat Session Management */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-purple-600" />
                Your Conversations
                {isPremiumUser() && (
                  <div className="ml-3 flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Infinity className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Unlimited</span>
                  </div>
                )}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={onStartNewSession}
                  disabled={isFreemiumUser() && getFreemiumLimits().remaining === 0}
                  className={`group p-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
                    isFreemiumUser() && getFreemiumLimits().remaining === 0
                      ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed'
                      : isPremiumUser()
                      ? 'border-green-300 dark:border-green-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                      : 'border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isFreemiumUser() && getFreemiumLimits().remaining === 0
                        ? 'bg-gray-200 dark:bg-gray-600'
                        : isPremiumUser()
                        ? 'bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50'
                        : 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50'
                    }`}>
                      <Plus className={`w-6 h-6 ${
                        isFreemiumUser() && getFreemiumLimits().remaining === 0
                          ? 'text-gray-400'
                          : isPremiumUser()
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-purple-600 dark:text-purple-400'
                      }`} />
                    </div>
                    <h3 className={`font-medium mb-2 ${
                      isFreemiumUser() && getFreemiumLimits().remaining === 0
                        ? 'text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Start New Session
                    </h3>
                    <p className={`text-sm ${
                      isFreemiumUser() && getFreemiumLimits().remaining === 0
                        ? 'text-gray-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {isFreemiumUser() && getFreemiumLimits().remaining === 0
                        ? 'Daily limit reached'
                        : isPremiumUser()
                        ? 'Unlimited conversations await'
                        : 'Begin a fresh conversation with Amara'
                      }
                    </p>
                  </div>
                </button>

                <button
                  onClick={onResumeSession}
                  className={`group p-6 rounded-xl border transition-all duration-200 ${
                    isPremiumUser()
                      ? 'border-green-200 dark:border-green-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isPremiumUser()
                        ? 'bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50'
                        : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50'
                    }`}>
                      <Play className={`w-6 h-6 ${
                        isPremiumUser()
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resume Session</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {user.last_session_date
                        ? `Continue from ${new Date(user.last_session_date).toLocaleDateString()}`
                        : 'No previous session found'
                      }
                    </p>
                  </div>
                </button>
              </div>

              {/* Freemium Usage Indicator - Only show for freemium users */}
              {isFreemiumUser() && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Daily Messages
                    </span>
                    <span className="text-sm text-amber-600 dark:text-amber-300">
                      {getFreemiumLimits().used} / {getFreemiumLimits().limit}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getFreemiumLimits().used / getFreemiumLimits().limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Mood Check */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Smile className="w-6 h-6 mr-3 text-pink-600" />
                How are you feeling today?
                {isPremiumUser() && (
                  <Star className="w-5 h-5 ml-2 text-yellow-500" fill="currentColor" />
                )}
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    disabled={isFreemiumUser()}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedMood === mood.value
                        ? isPremiumUser()
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : isFreemiumUser()
                        ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed opacity-60'
                        : isPremiumUser()
                        ? 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mood.emoji}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Freemium upgrade prompt - Only show for freemium users */}
              {isFreemiumUser() && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      🔒 Mood tracking available with Premium
                    </span>
                    <button
                      onClick={onUpgrade}
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Journal Quick Entry */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <PenTool className="w-6 h-6 mr-3 text-blue-600" />
                Quick Journal Entry
                {isPremiumUser() && (
                  <div className="ml-3 flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI Enhanced</span>
                  </div>
                )}
              </h2>

              <div className="space-y-4">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={
                    isFreemiumUser() 
                      ? "Upgrade to Premium to unlock journaling..." 
                      : isPremiumUser()
                      ? "Share your thoughts... AI insights will help you reflect deeper"
                      : "What's on your mind today?"
                  }
                  disabled={isFreemiumUser()}
                  className={`w-full p-4 border rounded-xl resize-none transition-colors duration-200 ${
                    isFreemiumUser()
                      ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                      : isPremiumUser()
                      ? 'bg-white dark:bg-gray-700 border-green-200 dark:border-green-600 text-gray-900 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  rows={3}
                />

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center space-x-3">
                    {/* AI Prompt button - Available for trial and premium users */}
                    {!isFreemiumUser() && (isTrialUser() || isPremiumUser()) && (
                      <button
                        onClick={onGetAIPrompt}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          isPremiumUser()
                            ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                            : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Prompt
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleJournalSubmit}
                    disabled={!journalEntry.trim() || isFreemiumUser()}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                      !journalEntry.trim() || isFreemiumUser()
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : isPremiumUser()
                        ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                        : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    }`}
                  >
                    Save Entry
                  </button>
                </div>

                {/* Freemium upgrade prompt - Only show for freemium users */}
                {isFreemiumUser() && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        🔒 Journaling available with Premium
                      </span>
                      <button
                        onClick={onUpgrade}
                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.5s' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity
              </h3>

              <div className="space-y-3">
                {user.last_mood && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Last Mood</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.last_mood}</p>
                    </div>
                  </div>
                )}

                {user.last_journal_entry && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Last Journal</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user.last_journal_entry.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                )}

                {user.last_session_date && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Last Session</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(user.last_session_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights - Available for trial and premium users */}
            {(isTrialUser() || isPremiumUser()) && (
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                  Amara's Insights
                  {isPremiumUser() && (
                    <div className="ml-2 flex items-center space-x-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      <BarChart3 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Advanced</span>
                    </div>
                  )}
                </h3>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    isPremiumUser()
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700'
                  }`}>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {isPremiumUser()
                        ? "Your emotional patterns show consistent growth and self-awareness. Your premium insights reveal deeper connections between your mood and activities."
                        : "You've been focusing on self-reflection this week. This shows great emotional awareness."
                      }
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        isPremiumUser()
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {isPremiumUser() ? 'Premium Analysis' : 'Weekly Pattern'}
                      </span>
                      <TrendingUp className={`w-4 h-4 ${
                        isPremiumUser()
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`} />
                    </div>
                  </div>

                  <button className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {isPremiumUser() ? 'View Advanced Analytics' : 'View Detailed Insights'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Subscription Management - Only for premium users */}
            {isPremiumUser() && (
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.7s' }}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                  Premium Member
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize flex items-center">
                      {user.current_plan.replace('_', ' ')}
                      <Shield className="w-4 h-4 ml-2 text-green-500" />
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <Infinity className="w-4 h-4 mr-1" />
                      Unlimited Access
                    </span>
                  </div>

                  <button
                    onClick={onManageSubscription}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Manage Subscription
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;