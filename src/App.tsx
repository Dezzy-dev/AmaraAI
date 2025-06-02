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
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [userName, setUserName] = useState('');

  const handleStartSession = (name: string) => {
    setUserName(name);
    setShowOnboarding(false);
    setShowSession(true);
  };

  const handleEndSession = () => {
    setShowSession(false);
    setShowOnboarding(false);
  };

  if (showSession) {
    return <TherapySession userName={userName} onEndSession={handleEndSession} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleStartSession} />;
  }

  return (
    <div className="font-sans bg-white dark:bg-appDark transition-colors duration-300">
      <Navigation isDark={isDark} toggleDarkMode={toggleDarkMode} />
      <Hero onStartTalking={() => setShowOnboarding(true)} />
      <Features />
      <Unique />
      <HowItWorks />
      <Testimonials />
      <Privacy />
      <FAQ />
      <CallToAction onStartTalking={() => setShowOnboarding(true)} />
      <Waitlist />
      <Footer />
    </div>
  );
}

export default App;