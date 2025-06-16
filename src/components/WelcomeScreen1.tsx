import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

interface WelcomeScreen1Props {
  onNext: () => void;
}

const WelcomeScreen1: React.FC<WelcomeScreen1Props> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Illustration */}
        <div className="mb-12 animate-fade-in">
          <div className="relative mx-auto w-48 h-48 mb-8">
            {/* Main circle with breathing animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Central heart icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg">
                <Heart className="w-12 h-12 text-purple-600 animate-pulse" fill="currentColor" />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/4 -left-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hello, I'm{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Amara
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Your private space to talk it out, reflect, and feel truly heard.
          </p>

          <button
            onClick={onNext}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-200 dark:bg-pink-800 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default WelcomeScreen1;