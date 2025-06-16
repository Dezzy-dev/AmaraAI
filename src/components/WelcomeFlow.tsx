import React, { useState } from 'react';
import WelcomeScreen1 from './WelcomeScreen1';
import WelcomeScreen2 from './WelcomeScreen2';
import WelcomeScreen3 from './WelcomeScreen3';

interface WelcomeFlowProps {
  onComplete: () => void;
}

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Indicators */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === currentScreen
                  ? 'bg-purple-600 w-8'
                  : step < currentScreen
                  ? 'bg-purple-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Screen Content */}
      <div className="relative">
        {currentScreen === 1 && (
          <WelcomeScreen1 onNext={handleNext} />
        )}
        {currentScreen === 2 && (
          <WelcomeScreen2 onNext={handleNext} onBack={handleBack} />
        )}
        {currentScreen === 3 && (
          <WelcomeScreen3 onNext={handleNext} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default WelcomeFlow;