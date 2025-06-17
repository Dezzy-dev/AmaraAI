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
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false);
  const [showPersonalizationFlow, setShowPersonalizationFlow] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
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

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  if (showSession) {
    return (
      <TherapySession 
        userName={personalizationData?.name || 'there'} 
        userCountry={personalizationData?.country}
        userFeeling={personalizationData?.feeling}
        onEndSession={handleEndSession} 
      />
    );
  }

  if (showPersonalizationFlow) {
    return <PersonalizationFlow onComplete={handlePersonalizationComplete} />;
  }

  if (showWelcomeFlow) {
    return <WelcomeFlow onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="font-sans bg-white dark:bg-appDark transition-colors duration-300">
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
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default App;