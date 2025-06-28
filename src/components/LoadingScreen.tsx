import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  userName?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, userName }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    "Preparing your safe space...",
    "Connecting with Amara...",
    "Taking a moment to breathe together..."
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 1000);

    // Complete loading after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 flex items-center justify-center z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200/20 dark:bg-purple-600/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-200/20 dark:bg-pink-600/10 rounded-full animate-pulse blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/10 dark:bg-blue-600/5 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative text-center max-w-md mx-auto px-6">
        {/* Amara Logo with Animation */}
        <div className="mb-12 animate-fade-in">
          <div className="relative mx-auto w-32 h-32 mb-8">
            {/* Breathing animation circles */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-4 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Central heart icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg">
                <Heart className="w-8 h-8 text-purple-600 animate-pulse" fill="currentColor" />
              </div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>
            <div className="absolute top-1/4 -left-4 animate-bounce" style={{ animationDelay: '2.5s' }}>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Amara Text Logo */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 
            className="text-4xl md:text-5xl font-light text-gray-800 dark:text-gray-100 mb-2"
            style={{
              fontFamily: 'serif',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            𝒜𝓂𝒶𝓇𝒶
          </h1>
          {userName && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome, {userName}
            </p>
          )}
        </div>

        {/* Loading Message with Typewriter Effect */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg text-gray-600 dark:text-gray-300 min-h-[1.5rem] transition-all duration-300">
            {messages[currentMessage]}
          </p>
        </div>

        {/* Subtle Loading Indicator */}
        <div className="mt-8 flex justify-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;