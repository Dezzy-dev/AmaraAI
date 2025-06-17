import React, { useState } from 'react';
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
import Dashboard from './components/Dashboard';
import { useDarkMode } from './hooks/useDarkMode';

type UserPath = 'trial_path' | 'freemium_path' | null;
type AppView = 'landing' | 'welcome' | 'personalization' | 'session' | 'comparison' | 'dashboard';

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

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Mock user data for demonstration
  const mockUsers = {
    freemium: {
      id: '1',
      name: 'Alex',
      email: 'alex@example.com',
      current_plan: 'freemium' as const,
      messages_used_today: 3,
      last_session_date: '2025-01-08',
      last_mood: 'Happy 😊',
      created_at: '2025-01-01'
    },
    trial: {
      id: '2',
      name: 'Jordan',
      email: 'jordan@example.com',
      current_plan: 'yearly_trial' as const,
      trial_end_date: '2025-01-15',
      messages_used_today: 0,
      last_session_date: '2025-01-08',
      last_mood: 'Anxious 😰',
      last_journal_entry: 'Today was challenging but I learned something new about myself...',
      created_at: '2025-01-08'
    },
    premium: {
      id: '3',
      name: 'Sam',
      email: 'sam@example.com',
      current_plan: 'yearly_premium' as const,
      messages_used_today: 0,
      last_session_date: '2025-01-08',
      last_mood: 'Excited 😄',
      last_journal_entry: 'Feeling grateful for the progress I\'ve made this month...',
      created_at: '2024-12-01'
    }
  };

  const handleStartTalking = () => {
    setCurrentView('welcome');
  };

  const handleWelcomeComplete = () => {
    setCurrentView('personalization');
  };

  const handlePersonalizationComplete = (data: PersonalizationData) => {
    setPersonalizationData(data);
    setCurrentView('session');
  };

  const handleEndSession = () => {
    setCurrentView('landing');
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
    
    // Route user based on their chosen path
    if (userPath === 'trial_path') {
      // Redirect to comparison/pricing page
      setCurrentView('comparison');
    } else if (userPath === 'freemium_path') {
      // Redirect to dashboard with freemium user
      setCurrentUser(mockUsers.freemium);
      setCurrentView('dashboard');
    }
    
    // Reset path
    setUserPath(null);
  };

  const handleStartFreeTrial = (planType: 'monthly' | 'yearly') => {
    console.log(`Starting ${planType} free trial...`);
    // Simulate successful trial start
    setCurrentUser(mockUsers.trial);
    setCurrentView('dashboard');
  };

  const handleBackToAuth = () => {
    setCurrentView('landing');
    setShowAuthModal(true);
  };

  // Dashboard handlers
  const handleStartNewSession = () => {
    setCurrentView('personalization');
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
    if (currentUser) {
      setCurrentUser({ ...currentUser, last_mood: mood });
    }
  };

  const handleQuickJournal = (entry: string) => {
    console.log('Saving journal entry:', entry);
    if (currentUser) {
      setCurrentUser({ ...currentUser, last_journal_entry: entry });
    }
  };

  const handleGetAIPrompt = () => {
    console.log('Getting AI prompt...');
  };

  // Demo buttons for testing different user states
  const renderDemoButtons = () => (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <button
        onClick={() => {
          setCurrentUser(mockUsers.freemium);
          setCurrentView('dashboard');
        }}
        className="block px-3 py-2 bg-orange-500 text-white text-xs rounded shadow hover:bg-orange-600"
      >
        Demo: Freemium User
      </button>
      <button
        onClick={() => {
          setCurrentUser(mockUsers.trial);
          setCurrentView('dashboard');
        }}
        className="block px-3 py-2 bg-purple-500 text-white text-xs rounded shadow hover:bg-purple-600"
      >
        Demo: Trial User
      </button>
      <button
        onClick={() => {
          setCurrentUser(mockUsers.premium);
          setCurrentView('dashboard');
        }}
        className="block px-3 py-2 bg-green-500 text-white text-xs rounded shadow hover:bg-green-600"
      >
        Demo: Premium User
      </button>
      <button
        onClick={() => {
          setCurrentUser(null);
          setCurrentView('landing');
        }}
        className="block px-3 py-2 bg-gray-500 text-white text-xs rounded shadow hover:bg-gray-600"
      >
        Back to Landing
      </button>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return currentUser ? (
          <Dashboard
            user={currentUser}
            onStartNewSession={handleStartNewSession}
            onResumeSession={handleResumeSession}
            onUpgrade={handleUpgrade}
            onManageSubscription={handleManageSubscription}
            onLogMood={handleLogMood}
            onQuickJournal={handleQuickJournal}
            onGetAIPrompt={handleGetAIPrompt}
          />
        ) : null;

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
            userName={personalizationData?.name || 'there'} 
            userCountry={personalizationData?.country}
            userFeeling={personalizationData?.feeling}
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
            <Navigation isDark={isDark} toggleDarkMode={toggleDarkMode} />
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

export default App;