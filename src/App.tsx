import React, { useState, useEffect } from 'react';
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
import { UserProvider, useUser } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext';
import Settings from './components/Settings';

type UserPath = 'trial_path' | 'freemium_path' | null;
type AppView = 'landing' | 'welcome' | 'personalization' | 'session' | 'comparison' | 'credit-card' | 'dashboard' | 'settings';

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

function AppContent() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const { userData, setUserData, updateUserData, isLoading: isUserDataLoading } = useUser();

  const handleStartTalking = () => {
    // Check if user is authenticated
    if (userData && userData.isAuthenticated) {
      // Authenticated users go directly to session
      setCurrentView('session');
    } else {
      // Anonymous user flow
      const onboardingComplete = localStorage.getItem('amaraOnboardingComplete') === 'true';
      if (onboardingComplete) {
        // Returning anonymous user: skip welcome and personalization, go straight to session
        setCurrentView('session');
      } else {
        // New anonymous user: start with welcome flow
        setCurrentView('welcome');
      }
    }
  };

  const handleWelcomeComplete = () => {
    // After welcome, always go to personalization for new users
    setCurrentView('personalization');
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
    
    setCurrentView('session');
  };

  const handleEndSession = () => {
    setCurrentView(userData && userData.isAuthenticated ? 'dashboard' : 'landing');
    setPersonalizationData(null);
  };

  const openAuthModal = (mode: 'signup' | 'signin', path: UserPath = null) => {
    setAuthMode(mode);
    setUserPath(path);
    setShowAuthModal(true);
  };

  const handleSignUp = (path: UserPath = 'trial_path') => openAuthModal('signup', path);
  const handleSignIn = () => openAuthModal('signin');

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    
    // Update user data to mark as authenticated and set plan
    if (userData) {
      const planType = userPath === 'freemium_path' ? 'freemium' : 'monthly_trial';
      updateUserData({ 
        isAuthenticated: true,
        currentPlan: planType
      });
    }
    
    // Route user based on their chosen path
    if (userPath === 'trial_path') {
      // Redirect to comparison/pricing page
      setCurrentView('comparison');
    } else if (userPath === 'freemium_path') {
      // Redirect to dashboard with freemium user
      setCurrentView('dashboard');
    }
    
    // Reset path
    setUserPath(null);
  };

  const handleStartFreeTrial = (planType: 'monthly' | 'yearly') => {
    setSelectedPlan(planType);
    setCurrentView('credit-card');
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
    
    setCurrentView('dashboard');
  };

  const handleBackToAuth = () => {
    setCurrentView('landing');
    setShowAuthModal(true);
  };

  const handleBackToComparison = () => {
    setCurrentView('comparison');
  };

  // Dashboard handlers
  const handleStartNewSession = () => {
    // If user has personalization data, skip to session
    if (userData && userData.name) {
      setCurrentView('session');
    } else {
      setCurrentView('personalization');
    }
  };

  const handleResumeSession = () => {
    setCurrentView('session');
  };

  const handleUpgrade = () => {
    setCurrentView('comparison');
  };

  const handleManageSubscription = () => {
    console.log('Managing subscription...');
  };

  const handleLogMood = (mood: string) => {
    console.log('Logging mood:', mood);
  };

  const handleQuickJournal = (entry: string) => {
    console.log('Saving journal entry:', entry);
  };

  const handleGetAIPrompt = () => {
    console.log('Getting AI prompt...');
  };

  const handleNavigateToSettings = () => {
    setCurrentView('settings');
  };

  // Create mock user for dashboard when authenticated
  const getMockUser = (): UserProfile | null => {
    if (!userData || !userData.isAuthenticated) return null;
    
    return {
      id: userData.id || '1',
      name: userData.name,
      email: userData.email || 'user@example.com',
      current_plan: userData.currentPlan || 'freemium',
      trial_end_date: userData.trialEndDate,
      messages_used_today: userData.dailyMessagesUsed || 0,
      last_session_date: new Date().toISOString(),
      last_mood: 'Happy 😊',
      last_journal_entry: 'Today was a good day...',
      created_at: new Date().toISOString()
    };
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
            setCurrentView('dashboard');
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
            setCurrentView('dashboard');
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
            setCurrentView('dashboard');
          }}
          className="block px-3 py-2 bg-green-500 text-white text-xs rounded shadow hover:bg-green-600"
        >
          Demo: Premium User
        </button>
        <button
          onClick={() => {
            setUserData(null);
            setCurrentView('landing');
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
            setCurrentView('landing');
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
    const mockUser = getMockUser();
    
    switch (currentView) {
      case 'dashboard':
        return mockUser ? (
          <Dashboard
            user={mockUser}
            onStartNewSession={handleStartNewSession}
            onResumeSession={handleResumeSession}
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
            onLogMood={handleLogMood}
            onQuickJournal={handleQuickJournal}
            onGetAIPrompt={handleGetAIPrompt}
            onNavigateToSettings={handleNavigateToSettings}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
          />
        ) : null;

      case 'settings':
        return mockUser ? (
          <Settings
            user={mockUser}
            onBackToDashboard={() => setCurrentView('dashboard')}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
          />
        ) : null;

      case 'credit-card':
        return (
          <CreditCardPage
            selectedPlan={selectedPlan}
            onSuccess={handleCreditCardSuccess}
            onBack={handleBackToComparison}
          />
        );

      case 'comparison':
        return (
          <ComparisonPricingPage 
            onStartFreeTrial={handleStartFreeTrial}
            onBack={handleBackToAuth}
          />
        );

      case 'session':
        return (
          <TherapySession 
            userName={userData?.name || personalizationData?.name || localStorage.getItem('amaraUserName') || 'there'} 
            userCountry={userData?.country || personalizationData?.country}
            userFeeling={userData?.feeling || personalizationData?.feeling}
            onEndSession={handleEndSession}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
          />
        );

      case 'personalization':
        return <PersonalizationFlow onComplete={handlePersonalizationComplete} />;

      case 'welcome':
        return <WelcomeFlow onComplete={handleWelcomeComplete} />;

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
      </ChatProvider>
    </UserProvider>
  );
}

export default App;