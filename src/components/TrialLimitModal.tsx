import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface TrialLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

const TrialLimitModal: React.FC<TrialLimitModalProps> = ({ 
  isOpen, 
  onClose, 
  onSignUp, 
  onSignIn 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            You've reached your trial limit
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Continue your healing journey with unlimited conversations, voice therapy sessions, and personalized insights tailored just for you.
          </p>
          
          {/* Benefits List */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What you'll get:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Unlimited text and voice conversations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Advanced mood tracking and insights
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Personal journal integration
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Priority support and new features
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onSignUp}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start 7-Day Free Trial
            </button>
            
            <button 
              onClick={onSignIn}
              className="w-full py-3 border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 rounded-full font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            >
              Sign In to Existing Account
            </button>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            No credit card required for trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialLimitModal;