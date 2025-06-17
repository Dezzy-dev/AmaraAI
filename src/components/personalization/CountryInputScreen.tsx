import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Globe } from 'lucide-react';

interface CountryInputScreenProps {
  onNext: (data: { country: string }) => void;
  onBack: () => void;
  initialValue: string;
}

const CountryInputScreen: React.FC<CountryInputScreenProps> = ({ onNext, onBack, initialValue }) => {
  const [country, setCountry] = useState(initialValue);

  const handleNext = () => {
    if (country.trim()) {
      onNext({ country: country.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && country.trim()) {
      handleNext();
    }
  };

  // Popular countries for quick selection
  const popularCountries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-lg mx-auto text-center">
        {/* Illustration Placeholder */}
        <div className="mb-12 animate-fade-in">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Which country are you joining me from?
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            This helps me understand your context better
          </p>

          {/* Input Field */}
          <div className="mb-8">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your country"
              className="w-full max-w-md mx-auto px-6 py-4 text-lg text-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Popular Countries */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Or choose from popular options:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {popularCountries.map((countryOption) => (
                <button
                  key={countryOption}
                  onClick={() => setCountry(countryOption)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 rounded-full transition-colors duration-300"
                >
                  {countryOption}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              <ChevronLeft className="mr-2 w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!country.trim()}
              className={`group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform ${
                country.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default CountryInputScreen;