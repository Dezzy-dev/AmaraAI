import React, { useState } from 'react';
import NameInputScreen from './NameInputScreen';
import CountryInputScreen from './CountryInputScreen';
import FeelingInputScreen from './FeelingInputScreen';
import useUser from '../../contexts/useUser';

export interface PersonalizationData {
  name: string;
  country: string;
  feeling: string;
}

interface PersonalizationFlowProps {
  onComplete: (data: PersonalizationData) => void;
}

const PersonalizationFlow: React.FC<PersonalizationFlowProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const { userData } = useUser();
  
  const [userData_local, setUserData] = useState<PersonalizationData>({
    name: userData?.name || '',
    country: userData?.country || '',
    feeling: userData?.feeling || ''
  });

  const handleNext = (data: Partial<PersonalizationData>) => {
    const updatedData = { ...userData_local, ...data };
    setUserData(updatedData);
    
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete(updatedData);
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Progress Indicator */}
      <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            {currentScreen} of 3
          </span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="relative">
        {currentScreen === 1 && (
          <NameInputScreen 
            onNext={handleNext} 
            initialValue={userData_local.name}
          />
        )}
        {currentScreen === 2 && (
          <CountryInputScreen 
            onNext={handleNext} 
            onBack={handleBack}
            initialValue={userData_local.country}
          />
        )}
        {currentScreen === 3 && (
          <FeelingInputScreen 
            onNext={handleNext} 
            onBack={handleBack}
            initialValue={userData_local.feeling}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalizationFlow;