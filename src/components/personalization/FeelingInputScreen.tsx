import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Heart } from 'lucide-react';

interface FeelingInputScreenProps {
  onNext: (data: { feeling: string }) => void;
  onBack: () => void;
  initialValue: string;
}

const FeelingInputScreen: React.FC<FeelingInputScreenProps> = ({ onNext, onBack, initialValue }) => {
  const [feeling, setFeeling] = useState(initialValue);

  const handleNext = () => {
    if (feeling) {
      onNext({ feeling });
    }
  };

  const feelings = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😄', label: 'Excited', value: 'excited' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-pink-50/20 to-purple-50/20 dark:from-gray-900 dark:via-pink-900/10 dark:to-purple-900/10">
      <div className="max-w-lg mx-auto text-center">
        {/* Illustration Placeholder */}
        <div className="mb-12 animate-fade-in">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            How are you feeling right now?
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Your current mood helps me understand how to best support you
          </p>

          {/* Feeling Selection */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
              {feelings.map((feelingOption) => (
                <button
                  key={feelingOption.value}
                  onClick={() => setFeeling(feelingOption.value)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    feeling === feelingOption.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-pink-300 dark:hover:border-pink-500'
                  }`}
                >
                  <div className="text-4xl mb-2">{feelingOption.emoji}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feelingOption.label}
                  </div>
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
              disabled={!feeling}
              className={`group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 transform ${
                feeling
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Talking
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200 dark:bg-pink-800 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default FeelingInputScreen;