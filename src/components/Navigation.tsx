import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquareText, Sun, Moon } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white dark:bg-appDark shadow-md py-3' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center">
            <div className={`p-2 rounded-full ${
              isScrolled 
                ? 'bg-[#9d8cd4]/10 dark:bg-[#9d8cd4]/20' 
                : 'bg-white/80 dark:bg-appDark/80 backdrop-blur-sm shadow-sm'
            }`}>
              <MessageSquareText className="w-6 h-6 text-[#9d8cd4]" />
            </div>
            <span className={`ml-2 text-xl font-medium ${
              isScrolled 
                ? 'text-[#2d3748] dark:text-white' 
                : 'text-[#6b5ca5] dark:text-[#9d8cd4]'
            }`}>Amara</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200">
              How It Works
            </a>
            <a href="#" className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200">
              Pricing
            </a>
            <a href="#" className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200">
              FAQ
            </a>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#9d8cd4]" />
              ) : (
                <Moon className="w-5 h-5 text-[#9d8cd4]" />
              )}
            </button>
            <a 
              href="#" 
              className="px-5 py-2 bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white dark:text-white rounded-full font-medium shadow-md transition-all duration-300"
            >
              Start Talking
            </a>
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#9d8cd4]" />
              ) : (
                <Moon className="w-5 h-5 text-[#9d8cd4]" />
              )}
            </button>
            <button 
              className="text-[#4a5568] dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-6 py-4 bg-white dark:bg-dark-card border-t dark:border-gray-800">
          <div className="flex flex-col space-y-4">
            <a 
              href="#" 
              className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#" 
              className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#" 
              className="text-[#4a5568] dark:text-gray-300 hover:text-[#9d8cd4] dark:hover:text-[#9d8cd4] transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </a>
            <a 
              href="#" 
              className="px-5 py-2 bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white dark:text-white rounded-full font-medium shadow-md transition-all duration-300 inline-block text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Talking
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;