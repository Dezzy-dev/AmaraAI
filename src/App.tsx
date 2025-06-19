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
import { useDarkMode } from './hooks/useDarkMode';
import { UserProvider, useUser } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext';

type AppView = 'landing' | 'welcome' | 'personalization' | 'session';

function AppContent() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  
  const { userData, setUserData, updateUserData, isUserDataLoaded } = useUser();

  const handleStartTalking = () => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('amaraOnboardingComplete') === 'true';
    
    if (onboardingComplete) {
      // Returning user: skip welcome and personalization, go straight to session
      setCurrentView('session');
    } else {
      // New user: start with welcome flow
      setCurrentView('welcome');
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
    setCurrentView('landing');
    setPersonalizationData(null);
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'session':
        return (
          <TherapySession 
            userName={userData?.name || personalizationData?.name || localStorage.getItem('amaraUserName') || 'there'} 
            userCountry={userData?.country || personalizationData?.country}
            userFeeling={userData?.feeling || personalizationData?.feeling}
            onEndSession={handleEndSession}
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