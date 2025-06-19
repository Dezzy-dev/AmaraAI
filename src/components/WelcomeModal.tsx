import React from 'react';

interface WelcomeModalProps {
  userName: string;
  onStartTour: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName, onStartTour }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-4" style={{fontFamily: 'serif'}}>Welcome to Amara, {userName}!</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">
          We're so glad you're here. Amara is your safe space to explore your thoughts and feelings.<br/>
          Let's get you acquainted with your new dashboard!
        </p>
        <button
          onClick={onStartTour}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Start Tour
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal; 