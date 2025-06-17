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
import { useDarkMode } from './hooks/useDarkMode';

type UserPath = 'trial_path' | 'freemium_path' | null;

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false);
  const [showPersonalizationFlow, setShowPersonalizationFlow] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showComparisonPricing, setShowComparisonPricing] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [userPath, setUserPath] = useState<UserPath>(null);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);

  const handleStartTalking = () => {
    setShowWelcomeFlow(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeFlow(false);
    setShowPersonalizationFlow(true);
  };

  const handlePersonalizationComplete = (data: PersonalizationData) => {
    setPersonalizationData(data);
    setShowPersonalizationFlow(false);
    setShowSession(true);
  };

  const handleEndSession = () => {
    setShowSession(false);
    setShowPersonalizationFlow(false);
    setShowWelcomeFlow(false);
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
      setShowComparisonPricing(true);
    } else if (userPath === 'freemium_path') {
      // Redirect to dashboard (for now, just close everything)
      console.log('Redirecting to freemium dashboard...');
      // In a real app, this would navigate to the dashboard
    }
    
    // Reset path
    setUserPath(null);
  };

  const handleStartFreeTrial = (planType: 'monthly' | 'yearly') => {
    console.log(`Starting ${planType} free trial...`);
    // This would integrate with your payment processor
    // For now, just close the comparison page
    setShowComparisonPricing(false);
  };

  const handleBackToAuth = () => {
    setShowComparisonPricing(false);
    setShowAuthModal(true);
  };

  // Show comparison/pricing page
  if (showComparisonPricing) {
    return (
      <ComparisonPricingPage 
        onStartFreeTrial={handleStartFreeTrial}
        onBack={handleBackToAuth}
      />
    );
  }

  return (
    <div className="font-sans bg-white dark:bg-appDark transition-colors duration-300">
      {showSession ? (
        <TherapySession 
          userName={personalizationData?.name || 'there'} 
          userCountry={personalizationData?.country}
          userFeeling={personalizationData?.feeling}
          onEndSession={handleEndSession}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
      ) : showPersonalizationFlow ? (
        <PersonalizationFlow onComplete={handlePersonalizationComplete} />
      ) : showWelcomeFlow ? (
        <WelcomeFlow onComplete={handleWelcomeComplete} />
      ) : (
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
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;