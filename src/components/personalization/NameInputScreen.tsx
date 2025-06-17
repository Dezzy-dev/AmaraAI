import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';

interface NameInputScreenProps {
  onNext: (data: { name: string }) => void;
  initialValue: string;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNext, initialValue }) => {
  const [name, setName] = useState(initialValue);

  const handleNext = () => {
    if (name.trim()) {
      onNext({ name: name.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
      <div className="max-w-lg mx-auto text-center">
        {/* Illustration Placeholder */}
        <div className="mb-12 animate-fade-in">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            What should I call you?
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Let's start with something simple and personal
          </p>

          {/* Input Field */}
          <div className="mb-8">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="w-full max-w-md mx-auto px-6 py-4 text-lg text-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className={`group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform ${
              name.trim()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-200 dark:bg-pink-800 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default NameInputScreen;