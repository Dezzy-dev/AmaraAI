import React, { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Unique from './components/Unique';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Privacy from './components/Privacy';
import CallToAction from './components/CallToAction';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Onboarding from './components/Onboarding';
import TherapySession from './components/TherapySession';
import FAQ from './components/FAQ';
import Brands from './components/Brands';
import WelcomeFlow from './components/WelcomeFlow';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [userName, setUserName] = useState('');

  const handleStartTalking = () => {
    setShowWelcomeFlow(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeFlow(false);
    setShowOnboarding(true);
  };

  const handleStartSession = (name: string) => {
    setUserName(name);
    setShowOnboarding(false);
    setShowSession(true);
  };

  const handleEndSession = () => {
    setShowSession(false);
    setShowOnboarding(false);
    setShowWelcomeFlow(false);
  };

  if (showSession) {
    return <TherapySession userName={userName} onEndSession={handleEndSession} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleStartSession} />;
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
    </div>
  );
}

export default App;