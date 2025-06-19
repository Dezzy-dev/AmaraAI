import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react';

interface NavigationProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  onSignIn?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDark, toggleDarkMode, onSignIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleStartTalking = () => {
    // You can replace this with your navigation logic
    console.log('Navigate to onboarding');
  };

  const navItems = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Why Amara?', id: 'testimonials' },
    { label: 'Try Demo', id: 'try-amara' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo - Responsive */}
          <div className="flex items-center">
            <span 
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 dark:text-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 opacity-0 animate-fade-in-up"
              style={{
                fontFamily: 'serif',
                letterSpacing: '0.02em',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => {
                // You can replace this with your home navigation logic
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              𝒜𝓂𝒶𝓇𝒶
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 text-sm xl:text-base whitespace-nowrap opacity-0 animate-fade-in-up animate-delay-${200 + (index * 100)}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Sign In Button */}
            {onSignIn && (
              <button
                onClick={onSignIn}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 text-sm xl:text-base whitespace-nowrap opacity-0 animate-fade-in-up animate-delay-400"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            
            <button
              onClick={handleStartTalking}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-sm xl:text-base whitespace-nowrap opacity-0 animate-fade-in-up animate-delay-500"
            >
              Start Talking
            </button>
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle - Always visible */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            
            {/* Mobile Menu Button - Hidden on desktop */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Responsive */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg">
            <nav className="px-6 py-4 space-y-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium py-3 px-2 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-0 animate-fade-in-up animate-delay-${200 + (index * 100)}`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Sign In Button - Mobile */}
              {onSignIn && (
                <button
                  onClick={() => {
                    onSignIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium py-3 px-2 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-0 animate-fade-in-up animate-delay-400"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
              
              <button
                onClick={handleStartTalking}
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 mt-4 opacity-0 animate-fade-in-up animate-delay-500"
              >
                Start Talking
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;