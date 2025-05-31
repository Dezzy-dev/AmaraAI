import React, { useEffect } from 'react';
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
import { useDarkMode } from './hooks/useDarkMode'; // Adjust path as needed

function App() {
  const [isDark, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    // Update document title
    document.title = "Amara | AI Therapy Companion";
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        window.scrollTo({
          top: (target as HTMLElement).offsetTop - 80,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <div className="font-sans bg-white dark:bg-appDark transition-colors duration-300">
      <Navigation isDark={isDark} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <Features />
      <Unique />
      <HowItWorks />
      <Testimonials />
      <Privacy />
      <CallToAction />
      <Waitlist />
      <Footer />
    </div>
  );
}

export default App;