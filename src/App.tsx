import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Hero from './components/Hero';
import Features from './components/Features';
import Unique from './components/Unique';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Privacy from './components/Privacy';
import CallToAction from './components/CallToAction';
import Waitlist from './components/Waitlist';
import { Footer } from './components/Footer';
import Navigation from './components/Navigation';
import TherapySession from './components/TherapySession';
import FAQ from './components/FAQ';
import Brands from './components/Brands';
import WelcomeFlow from './components/WelcomeFlow';
import PersonalizationFlow, { PersonalizationData } from './components/personalization/PersonalizationFlow';
import AuthModal from './components/auth/AuthModal';
import ComparisonPricingPage from './components/ComparisonPricingPage';
import CreditCardPage from './components/CreditCardPage';
import Dashboard from './components/Dashboard';
import { useDarkMode } from './hooks/useDarkMode';
import { UserProvider, useUser, UserData } from './contexts/UserContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import Settings from './components/Settings';
import { auth, db } from './lib/supabase';

type UserPath = 'trial_path' | 'freemium_path' | null;
type AppView = 'landing' | 'welcome' | 'personalization' | 'session' | 'comparison' | 'credit-card' | 'dashboard' | 'settings';

function AppContent() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [previousView, setPreviousView] = useState<AppView | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [authSuccessTrigger, setAuthSuccessTrigger] = useState(false);
  const [sessionCounter, setSessionCounter] = useState(0);
  
  const { userData, setUserData, updateUserData, isLoading: isUserDataLoading, clearUserData } = useUser();
  const { clearMessages, loadMessages, loadMessagesFromSession } = useChat();

  const navigateTo = (view: AppView) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleBack = () => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null); // Clear after one use
    } else {
      // Default back behavior
      setCurrentView(userData && userData.isAuthenticated ? 'dashboard' : 'landing');
    }
  };

  const handleStartTalking = () => {
    // Check if user is authenticated
    if (userData && userData.isAuthenticated) {
      // Authenticated users go directly to session
      navigateTo('session');
    } else {
      // Anonymous user flow
      const onboardingComplete = localStorage.getItem('amaraOnboardingComplete') === 'true';
      if (onboardingComplete) {
        // Returning anonymous user: skip welcome and personalization, go straight to session
        navigateTo('session');
      } else {
        // New anonymous user: start with welcome flow
        navigateTo('welcome');
      }
    }
  };

  const handleWelcomeComplete = () => {
    // After welcome, always go to personalization for new users
    navigateTo('personalization');
  };

  const handlePersonalizationComplete = (data: PersonalizationData) => {
    setPersonalizationData(data);
    
    // Store personalization data in user context
    if (userData) {
      updateUserData({
        name: data.name,
        country: data.country,
        feeling: data.feeling
      });
    } else {
      // Create new user data for anonymous users
      setUserData({
        name: data.name,
        country: data.country,
        feeling: data.feeling,
        isAuthenticated: false,
        currentPlan: 'freemium', // Default to freemium for anonymous users
        dailyMessagesUsed: 0,
        voiceNotesUsed: 0,
        lastResetDate: new Date().toDateString()
      });
    }
    
    // Set localStorage flags for anonymous user onboarding completion
    localStorage.setItem('amaraUserName', data.name);
    localStorage.setItem('amaraOnboardingComplete', 'true');
    
    navigateTo('session');
  };

  const handleEndSession = () => {
    navigateTo(userData && userData.isAuthenticated ? 'dashboard' : 'landing');
    setPersonalizationData(null);
  };

  const openAuthModal = (mode: 'signup' | 'signin', path: UserPath = null) => {
    setAuthMode(mode);
    setUserPath(path);
    setShowAuthModal(true);
  };

  const handleSignUp = (path: UserPath = 'trial_path') => openAuthModal('signup', path);
  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleChooseFreemium = () => {
    openAuthModal('signup', 'freemium_path');
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setAuthSuccessTrigger(true);
    
    // Show success toast for login
    toast.success('You have successfully logged in', {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  };

  // Handle post-authentication routing
  useEffect(() => {
    if (authSuccessTrigger && !isUserDataLoading && userData?.isAuthenticated) {
      // Route user based on their chosen path
      if (userPath === 'trial_path') {
        // Redirect to comparison/pricing page
        navigateTo('comparison');
      } else if (userPath === 'freemium_path') {
        // Redirect to dashboard with freemium user
        navigateTo('dashboard');
      } else {
        // Default redirect for any other successful auth (e.g., direct sign-in)
        navigateTo('dashboard');
      }
      
      // Reset states
      setUserPath(null);
      setAuthSuccessTrigger(false);
    }
  }, [authSuccessTrigger, isUserDataLoading, userData?.isAuthenticated, userPath]);

  // Handle OAuth authentication routing (when user signs in via OAuth)
  useEffect(() => {
    if (!isUserDataLoading && userData?.isAuthenticated && currentView !== 'dashboard') {
      // User just authenticated via OAuth, route them to dashboard
      console.log('OAuth user authenticated, routing to dashboard');
      navigateTo('dashboard');
      
      // Show success toast for OAuth login
      toast.success('You have successfully signed in!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    }
  }, [userData?.isAuthenticated, isUserDataLoading, currentView]);

  const handleStartFreeTrial = (planType: 'monthly' | 'yearly') => {
    setSelectedPlan(planType);
    navigateTo('credit-card');
  };

  const handleCreditCardSuccess = () => {
    console.log(`Starting ${selectedPlan} free trial...`);
    
    // Calculate trial end date (7 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    
    // Update user context with trial plan and end date
    if (userData) {
      updateUserData({
        currentPlan: selectedPlan === 'monthly' ? 'monthly_trial' : 'yearly_trial',
        trialEndDate: trialEndDate.toISOString()
      });
    }
    
    navigateTo('dashboard');
  };

  const handleBackToAuth = () => {
    navigateTo('landing');
    setShowAuthModal(true);
  };

  const handleBackToComparison = () => {
    navigateTo('comparison');
  };

  // Dashboard handlers
  const handleStartNewSession = () => {
    clearMessages();
    setSessionCounter(prev => prev + 1); // Increment session counter to force remount
    if (userData && userData.name) {
      navigateTo('session');
    } else {
      navigateTo('personalization');
    }
  };

  const handleResumeSession = () => {
    navigateTo('session');
  };

  const handleViewSessionHistory = async (sessionId: string) => {
    // Prevent freemium users from accessing session history
    if (userData?.currentPlan === 'freemium') {
      navigateTo('comparison');
      return;
    }

    try {
      // Load messages from the selected session using ChatContext
      await loadMessagesFromSession(sessionId);
      
      // Navigate to the session view
      navigateTo('session');

    } catch (error) {
      console.error('Error loading session history:', error);
      // Show user-friendly error message
      toast.error('Unable to load session history. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleUpgrade = () => {
    navigateTo('comparison');
  };

  const handleManageSubscription = () => {
    console.log('Managing subscription...');
  };

  const handleLogMood = (mood: string) => {
    console.log('Logging mood:', mood);
    // Update user data with mood if needed
    if (userData) {
      updateUserData({ feeling: mood });
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
    console.log('Saving journal entry:', entry);
    // In a real app, this would save to the database
    // For now, just show a success message
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

  const handleGetAIPrompt = () => {
    console.log('Get AI Prompt clicked');
  };

  const handleNavigateToSettings = () => {
    navigateTo('settings');
  };

  const handleLogout = async () => {
    try {
      // 1. Sign out from Supabase
      await auth.signOut();
      
      // 2. Clear all local user state (but not messages)
      clearUserData();
      
      // 3. Reset any other local storage items if necessary
      localStorage.removeItem('amaraOnboardingComplete');
      localStorage.removeItem('amaraUserName');

      // 4. Show success toast
      toast.success('You have successfully logged out', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });

      // 5. Navigate to landing and show sign-in
      setCurrentView('landing');
      openAuthModal('signin');

    } catch (error) {
      console.error('Error logging out:', error);
      // Fallback in case of error
      clearUserData();
      navigateTo('landing');
      
      // Show error toast
      toast.error('Error logging out. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    setUserPath(null); // Reset user path when closing modal
  };

  // Demo buttons for testing different user states (hidden in production)
  const renderDemoButtons = () => {
    // Hide demo buttons in production
    if (import.meta.env.PROD) return null;
    
    return (
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <button
          onClick={() => {
            setUserData({
              name: 'Alex',
              email: 'alex@example.com',
              isAuthenticated: true,
              currentPlan: 'freemium',
              dailyMessagesUsed: 3,
              voiceNotesUsed: 0,
              lastResetDate: new Date().toDateString()
            });
            navigateTo('dashboard');
          }}
          className="block px-3 py-2 bg-orange-500 text-white text-xs rounded shadow hover:bg-orange-600"
        >
          Demo: Freemium User
        </button>
        <button
          onClick={() => {
            // Set trial end date to 3 days from now for demo
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 3);
            
            setUserData({
              name: 'Jordan',
              email: 'jordan@example.com',
              isAuthenticated: true,
              currentPlan: 'yearly_trial',
              dailyMessagesUsed: 0,
              voiceNotesUsed: 0,
              lastResetDate: new Date().toDateString(),
              trialEndDate: trialEndDate.toISOString()
            });
            navigateTo('dashboard');
          }}
          className="block px-3 py-2 bg-purple-500 text-white text-xs rounded shadow hover:bg-purple-600"
        >
          Demo: Trial User
        </button>
        <button
          onClick={() => {
            setUserData({
              name: 'Sam',
              email: 'sam@example.com',
              isAuthenticated: true,
              currentPlan: 'yearly_premium',
              dailyMessagesUsed: 0,
              voiceNotesUsed: 0,
              lastResetDate: new Date().toDateString()
            });
            navigateTo('dashboard');
          }}
          className="block px-3 py-2 bg-green-500 text-white text-xs rounded shadow hover:bg-green-600"
        >
          Demo: Premium User
        </button>
        <button
          onClick={() => {
            setUserData(null);
            navigateTo('landing');
          }}
          className="block px-3 py-2 bg-gray-500 text-white text-xs rounded shadow hover:bg-gray-600"
        >
          Back to Landing
        </button>
        <button
          onClick={() => {
            // Clear localStorage to test new user flow
            localStorage.removeItem('amaraOnboardingComplete');
            localStorage.removeItem('amaraUserName');
            setUserData(null);
            navigateTo('landing');
          }}
          className="block px-3 py-2 bg-red-500 text-white text-xs rounded shadow hover:bg-red-600"
        >
          Clear Onboarding
        </button>
      </div>
    );
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return userData && userData.isAuthenticated ? (
          <Dashboard 
            user={userData}
            onStartNewSession={handleStartNewSession}
            onResumeSession={handleResumeSession}
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
            onLogMood={handleLogMood}
            onQuickJournal={handleQuickJournal}
            onGetAIPrompt={handleGetAIPrompt}
            onNavigateToSettings={handleNavigateToSettings}
            onLogout={handleLogout}
            onViewSessionHistory={handleViewSessionHistory}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
          />
        ) : null;

      case 'settings':
        return (
          <Settings 
            user={userData}
            onBack={handleBack}
            isDark={isDark} 
            toggleDarkMode={toggleDarkMode}
          />
        );

      case 'credit-card':
        return (
          <CreditCardPage
            planType={selectedPlan}
            onSuccess={handleCreditCardSuccess}
            onBack={handleBackToComparison}
          />
        );

      case 'comparison':
        return (
          <ComparisonPricingPage 
            onStartFreeTrial={handleStartFreeTrial}
            onBack={handleBack}
          />
        );

      case 'session':
        return (
          <TherapySession
            key={sessionCounter}
            onEndSession={handleEndSession}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
            onChooseFreemium={handleChooseFreemium}
          />
        );

      case 'personalization':
        return <PersonalizationFlow onComplete={handlePersonalizationComplete} />;

      case 'welcome':
        return <WelcomeFlow onComplete={handleWelcomeComplete} />;

      case 'landing':
        return (
          <>
            <Navigation onSignUp={handleSignUp} onSignIn={handleSignIn} />
            <Hero onStartTalking={handleStartTalking} onSignUp={handleSignUp} />
            <Brands />
            <Features />
            <Unique />
            <HowItWorks />
            <Testimonials />
            <Privacy />
            <CallToAction onSignUp={handleSignUp} />
            <FAQ />
            <Footer />
          </>
        );

      default:
        return (
          <>
            <Navigation isDark={isDark} toggleDarkMode={toggleDarkMode} onSignIn={handleSignIn} />
            <Hero onStartTalking={handleStartTalking} />
            <Brands />
            <Features />
            <Unique />
            <HowItWorks />
            <Testimonials />
            <Privacy />
            <FAQ />
            <CallToAction onStartTalking={handleStartTalking} />
            <Waitlist />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="font-sans bg-white dark:bg-appDark transition-colors duration-300">
      {renderCurrentView()}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Demo buttons for testing */}
      {renderDemoButtons()}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AppContent />
        <Toaster />
      </ChatProvider>
    </UserProvider>
  );
}

export default App;