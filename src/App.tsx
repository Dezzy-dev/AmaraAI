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
import Dashboard from './pages/Dashboard';
import { useDarkMode } from './hooks/useDarkMode';
import { UserProvider, UserData } from './contexts/UserContext';
import useUser from './contexts/useUser';
import { ChatProvider, useChat } from './contexts/ChatContext';
import Settings from './components/Settings';
import { auth, db } from './lib/supabase';
import UpgradeModal from './components/UpgradeModal';
import { Session } from '@supabase/supabase-js';
import CrisisResources from './pages/CrisisResources';
import LoadingScreen from './components/LoadingScreen';

type UserPath = 'trial_path' | 'freemium_path' | null;
type AppView = 'landing' | 'welcome' | 'personalization' | 'session' | 'comparison' | 'credit-card' | 'dashboard' | 'settings' | 'crisis-resources';
type UpgradeReason = 'trial_end' | 'message_limit' | 'voice_limit';

function AppContent() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [view, setView] = useState<AppView>('landing');
  const [previousView, setPreviousView] = useState<AppView | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [authSuccessTrigger, setAuthSuccessTrigger] = useState(false);
  const [sessionCounter, setSessionCounter] = useState(0);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason>('trial_end');
  const [isDirectSubscription, setIsDirectSubscription] = useState(false);
  
  const { userData, setUserData, updateUserData, isLoading: isUserDataLoading, clearUserData } = useUser();
  const { clearMessages, loadMessages, loadMessagesFromSession } = useChat();

  const navigateTo = (newView: AppView) => {
    setPreviousView(view);
    setView(newView);
  };

  const handleBack = () => {
    // Fix for settings page back navigation
    if (view === 'settings' && userData?.isAuthenticated) {
      setView('dashboard');
      setPreviousView(null);
      return;
    }
    
    if (previousView) {
      setView(previousView);
      setPreviousView(null);
    } else {
      setView(userData && userData.isAuthenticated ? 'dashboard' : 'landing');
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
        currentPlan: 'freemium' as const,
        dailyMessagesUsed: 0,
        voiceNotesUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        subscription_status: null,
        trial_ends_at: null,
      });
    }
    
    // Set localStorage flags for anonymous user onboarding completion
    localStorage.setItem('amaraUserName', data.name);
    localStorage.setItem('amaraOnboardingComplete', 'true');
    
    navigateTo('session');
  };

  const handleEndSession = () => {
    setView('dashboard');
  };

  const openAuthModal = (mode: 'signup' | 'signin', path: UserPath = null) => {
    setAuthMode(mode);
    setUserPath(path);
    setShowAuthModal(true);
  };

  const handleSignUp = (path: 'trial_path' | 'freemium_path') => {
    // Logic for what happens when user picks a plan in the modal
    setShowUpgradeModal(false);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleChooseFreemium = () => {
    // This would contain logic to set user to freemium
    setShowUpgradeModal(false); 
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
    // Only proceed if user data has finished loading and user is authenticated
    if (!isUserDataLoading && userData?.isAuthenticated && !initialAuthCheckComplete) {
      // Check if we're not already on a logged-in view to avoid unnecessary navigation
      const loggedInViews: AppView[] = ['dashboard', 'session', 'settings', 'comparison', 'credit-card'];
      
      if (!loggedInViews.includes(view)) {
        // User just authenticated via OAuth, route them to dashboard
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
      
      // Mark the initial check as complete after navigation attempt
      setInitialAuthCheckComplete(true);
    }
  }, [userData?.isAuthenticated, isUserDataLoading, initialAuthCheckComplete, view, navigateTo]);

  const handleStartFreeTrial = (planType: 'monthly' | 'yearly') => {
    setSelectedPlan(planType);
    
    // Check if user has ever trialed before
    if (userData?.isAuthenticated && userData?.hasEverTrialed && userData?.currentPlan === 'freemium') {
      // User has trialed before, this is a direct subscription
      setIsDirectSubscription(true);
    } else {
      // First time trial or not authenticated
      setIsDirectSubscription(false);
    }
    
    navigateTo('credit-card');
  };

  const handleCreditCardSuccess = () => {
    if (!userData) return;
    
    if (isDirectSubscription) {
      // Direct subscription for users who have trialed before
      const premiumPlan = selectedPlan === 'monthly' ? 'monthly_premium' : 'yearly_premium';
      updateUserData({
        currentPlan: premiumPlan
      });
    } else {
      // First time trial
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      const trialPlan = selectedPlan === 'monthly' ? 'monthly_trial' : 'yearly_trial';
      updateUserData({
        currentPlan: trialPlan,
        trialEndDate: trialEndDate.toISOString(),
        hasEverTrialed: true
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
    // Subscription management logic
  };

  const handleLogMood = (mood: string) => {
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
    // AI prompt logic
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
      setView('landing');
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

  const handleShowUpgradeModal = (reason: UpgradeReason) => {
    // For anonymous users, show the sign-up modal instead of upgrade modal
    if (!userData?.isAuthenticated) {
      openAuthModal('signup');
      return;
    }
    
    setUpgradeReason(reason);
    setShowUpgradeModal(true);
  };

  const handleCrisisResourcesClick = () => {
    setView('crisis-resources');
  };

  // Listen for custom navigation events from CrisisResources
  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (e.detail && e.detail.view) {
        setView(e.detail.view);
      }
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Instead, show loading screen only for protected views
  if (isUserDataLoading && (view === 'dashboard' || view === 'session' || view === 'settings')) {
    return <LoadingScreen onComplete={() => {}} userName={userData?.name} />;
  }

  // Render current view
  const renderCurrentView = () => {
    switch (view) {
      case 'dashboard':
        return userData && userData.isAuthenticated ? <Dashboard /> : null;

      case 'settings':
        // Add null check for userData before rendering Settings
        if (!userData) {
          // If userData is null, redirect to landing and show auth modal
          setView('landing');
          openAuthModal('signin');
          return null;
        }
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
            selectedPlan={selectedPlan}
            isDirectSubscription={isDirectSubscription}
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
            onEndSession={handleEndSession}
            onSignUp={handleShowUpgradeModal}
            onSignIn={() => openAuthModal('signin')}
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
            <Hero onStartTalking={handleStartTalking} onSignUp={handleSignUp} onSignIn={handleSignIn} />
            <Brands />
            <Features />
            <Unique />
            <HowItWorks />
            <Testimonials />
            <Privacy />
            <CallToAction onSignUp={handleSignUp} />
            <FAQ />
            <Footer onCrisisResourcesClick={handleCrisisResourcesClick} />
          </>
        );

      case 'crisis-resources':
        return <CrisisResources />;

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
    <div className={`h-screen overflow-y-auto bg-white dark:bg-gray-900 font-sans`}>
      <Toaster position="bottom-center" />
      {renderCurrentView()}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onSignUp={handleSignUp}
          reason={upgradeReason}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </UserProvider>
  );
}

export default App;