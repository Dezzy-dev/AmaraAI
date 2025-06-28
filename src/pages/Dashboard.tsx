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
  X,
  ChevronRight,
  Sparkles,
  Target,
  Activity,
  Eye,
  Edit3
} from 'lucide-react';
import useUser from '../contexts/useUser';
import { useChat } from '../contexts/ChatContext';
import SessionHistory from '../components/SessionHistory';
import { db, TherapySession, MoodLog, JournalEntry } from '../lib/supabase';
import { toast } from 'react-hot-toast';

// Affirmations and quotes for daily inspiration
const DAILY_AFFIRMATIONS = [
  "You're doing the best you can, and that's enough.",
  "Every feeling is valid. You're safe here.",
  "Let's take a breath together.",
  "Your mental health matters, and so do you.",
  "Progress isn't always linear, and that's okay.",
  "You have the strength to face whatever comes your way.",
  "It's okay to not be okay sometimes.",
  "You're worthy of love, care, and compassion.",
  "Small steps forward are still progress.",
  "You're not alone in this journey.",
  "Your feelings are temporary, but your strength is permanent.",
  "Today is a new opportunity to be kind to yourself."
];

const Dashboard: React.FC = () => {
  const { userData, limits, isPremiumUser, isActiveTrialUser, isFreemiumUser } = useUser();
  const { clearMessages } = useChat();
  
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [recentMoods, setRecentMoods] = useState<MoodLog[]>([]);
  const [recentJournals, setRecentJournals] = useState<JournalEntry[]>([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({
    chats: 0,
    moods: 0,
    journals: 0
  });
  const [dailyAffirmation, setDailyAffirmation] = useState('');
  const [expandedJournal, setExpandedJournal] = useState<string | null>(null);

  // Get daily affirmation based on date (consistent per day)
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const affirmationIndex = dayOfYear % DAILY_AFFIRMATIONS.length;
    setDailyAffirmation(DAILY_AFFIRMATIONS[affirmationIndex]);
  }, []);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!userData) return;
      
      setIsLoadingSessions(true);
      setIsLoadingMoods(true);
      setIsLoadingJournals(true);

      try {
        // Load sessions
        let userSessions: TherapySession[] = [];
        if (userData.isAuthenticated && userData.id) {
          userSessions = await db.sessions.getByUser(userData.id);
        } else if (userData.deviceId) {
          userSessions = await db.sessions.getByDevice(userData.deviceId);
        }
        setSessions(userSessions);

        // Load recent mood logs
        let moodLogs: MoodLog[] = [];
        if (userData.isAuthenticated && userData.id) {
          moodLogs = await db.moodLogs.getByUser(userData.id, 5);
        } else if (userData.deviceId) {
          moodLogs = await db.moodLogs.getByDevice(userData.deviceId, 5);
        }
        setRecentMoods(moodLogs);

        // Load recent journal entries
        let journalEntries: JournalEntry[] = [];
        if (userData.isAuthenticated && userData.id) {
          journalEntries = await db.journalEntries.getByUser(userData.id, 3);
        } else if (userData.deviceId) {
          journalEntries = await db.journalEntries.getByDevice(userData.deviceId, 3);
        }
        setRecentJournals(journalEntries);

        // Calculate weekly stats
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyChats = userSessions.filter(s => new Date(s.created_at) > oneWeekAgo).length;
        const weeklyMoods = moodLogs.filter(m => new Date(m.created_at) > oneWeekAgo).length;
        const weeklyJournals = journalEntries.filter(j => new Date(j.created_at) > oneWeekAgo).length;
        
        setWeeklyStats({
          chats: weeklyChats,
          moods: weeklyMoods,
          journals: weeklyJournals
        });

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingSessions(false);
        setIsLoadingMoods(false);
        setIsLoadingJournals(false);
      }
    };

    loadUserData();
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
    if (isFreemiumUser()) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'comparison' } }));
      return;
    }

    try {
      const { loadMessagesFromSession } = useChat();
      await loadMessagesFromSession(sessionId);
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

  const handleLogMood = async (mood: string) => {
    if (!userData) return;

    try {
      if (userData.isAuthenticated && userData.id) {
        await db.moodLogs.create(mood, userData.id, undefined, undefined);
      } else if (userData.deviceId) {
        await db.moodLogs.create(mood, undefined, userData.deviceId, undefined);
      }
      
      // Refresh mood logs
      let moodLogs: MoodLog[] = [];
      if (userData.isAuthenticated && userData.id) {
        moodLogs = await db.moodLogs.getByUser(userData.id, 5);
      } else if (userData.deviceId) {
        moodLogs = await db.moodLogs.getByDevice(userData.deviceId, 5);
      }
      setRecentMoods(moodLogs);

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
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
    }
  };

  const handleQuickJournal = async (entry: string) => {
    if (!userData || !entry.trim()) return;

    try {
      if (userData.isAuthenticated && userData.id) {
        await db.journalEntries.create(entry, userData.id, undefined, undefined);
      } else if (userData.deviceId) {
        await db.journalEntries.create(entry, undefined, userData.deviceId, undefined);
      }
      
      // Refresh journal entries
      let journalEntries: JournalEntry[] = [];
      if (userData.isAuthenticated && userData.id) {
        journalEntries = await db.journalEntries.getByUser(userData.id, 3);
      } else if (userData.deviceId) {
        journalEntries = await db.journalEntries.getByDevice(userData.deviceId, 3);
      }
      setRecentJournals(journalEntries);

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
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry. Please try again.');
    }
  };

  const handleSettings = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'settings' } }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      'happy': '😊',
      'neutral': '😐',
      'sad': '😔',
      'anxious': '😰',
      'tired': '😴',
      'excited': '😄',
      'angry': '😠',
      'peaceful': '😌',
      'stressed': '😫',
      'grateful': '🙏'
    };
    return moodMap[mood.toLowerCase()] || '😐';
  };

  const getAccessTierInfo = () => {
    if (userData?.isJudge) {
      return { label: 'Judge', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Crown };
    }
    if (isPremiumUser()) {
      return { label: 'Premium', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: Crown };
    }
    if (isActiveTrialUser()) {
      return { label: 'Trial', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: Zap };
    }
    return { label: 'Freemium', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: User };
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const hasPremiumAccess = isPremiumUser() || isActiveTrialUser();
  const accessTier = getAccessTierInfo();
  const AccessIcon = accessTier.icon;

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
              {/* Access Tier Badge */}
              <div className={`flex items-center px-3 py-1 rounded-full border ${accessTier.color}`}>
                <AccessIcon className="w-4 h-4 mr-1" fill={userData?.isJudge || isPremiumUser() ? "currentColor" : "none"} />
                <span className="text-xs font-medium">{accessTier.label}</span>
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

      {/* Persistent Trial Banner - No dismiss button for trial users */}
      {isActiveTrialUser() && (
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
              <button
                onClick={handleUpgrade}
                className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
              >
                Upgrade Now
              </button>
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

        {/* Daily Affirmation */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-full">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Today's Affirmation</h3>
              <p className="text-gray-700 dark:text-gray-300 italic">"{dailyAffirmation}"</p>
            </div>
          </div>
        </div>

        {/* Freemium Upgrade Banner */}
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

              {/* Usage Stats */}
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

            {/* Weekly Usage Snapshot */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                This Week's Progress
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weeklyStats.chats}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Chats</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{weeklyStats.moods}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Moods</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{weeklyStats.journals}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Journals</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                {weeklyStats.chats + weeklyStats.moods + weeklyStats.journals > 0 ? (
                  <p className="text-green-600 dark:text-green-400 font-medium">Great progress this week! 🌟</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Let's start tracking your wellness journey!</p>
                )}
              </div>
            </div>

            {/* How are you feeling today? */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Smile className="w-5 h-5 mr-2 text-pink-500" />
                How are you feeling today?
              </h2>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
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

              {/* Recent Mood History */}
              {recentMoods.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Moods</h3>
                  <div className="flex space-x-3 overflow-x-auto">
                    {recentMoods.map((mood) => (
                      <div key={mood.id} className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 min-w-[100px]">
                        <div className="text-center">
                          <div className="text-lg mb-1">{getMoodEmoji(mood.mood)}</div>
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{mood.mood}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(mood.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state for moods */}
              {recentMoods.length === 0 && !isLoadingMoods && (
                <div className="text-center py-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Let's begin tracking how you feel. Amara is here for you.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Journal Entry */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-green-500" />
                Journal Entry
              </h2>
              
              {hasPremiumAccess ? (
                <div>
                  <textarea
                    placeholder="What's on your mind today? Write a quick reflection..."
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleQuickJournal(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Press Ctrl+Enter to save</p>
                    <button
                      onClick={(e) => {
                        const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                        if (textarea?.value.trim()) {
                          handleQuickJournal(textarea.value);
                          textarea.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Save Entry
                    </button>
                  </div>

                  {/* Recent Journal Entries */}
                  {recentJournals.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Entries</h3>
                      <div className="space-y-3">
                        {recentJournals.map((journal) => (
                          <div key={journal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {expandedJournal === journal.id 
                                    ? journal.entry_text 
                                    : `${journal.entry_text.slice(0, 100)}${journal.entry_text.length > 100 ? '...' : ''}`
                                  }
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatTimeAgo(journal.created_at)}
                                </p>
                              </div>
                              {journal.entry_text.length > 100 && (
                                <button
                                  onClick={() => setExpandedJournal(expandedJournal === journal.id ? null : journal.id)}
                                  className="ml-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  {expandedJournal === journal.id ? 'Less' : 'More'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state for journals */}
                  {recentJournals.length === 0 && !isLoadingJournals && (
                    <div className="mt-4 text-center py-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Start your first journal entry above. Writing helps process thoughts and emotions.
                      </p>
                    </div>
                  )}
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
                  {isPremiumUser() && (
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

            {/* Insights & Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                Your Insights
                {isPremiumUser() && (
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
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {weeklyStats.chats + weeklyStats.moods + weeklyStats.journals > 5 ? '+15%' : 'Getting Started'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {weeklyStats.chats + weeklyStats.moods + weeklyStats.journals > 5 
                        ? 'Mood improvement this week' 
                        : 'Keep logging to see insights'
                      }
                    </div>
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