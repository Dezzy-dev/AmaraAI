import React from 'react';
import { Lightbulb, X, Sparkles, Heart } from 'lucide-react';

interface TrialLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void;
  onChooseFreemium: () => void;
  onSignIn: () => void;
}

const TrialLimitModal: React.FC<TrialLimitModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartTrial,
  onChooseFreemium,
  onSignIn 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 transform animate-scale-in relative">
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
            Continue your healing journey with unlimited conversations. Choose the path that feels right for you.
          </p>
          
          {/* Options Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Trial Option */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">7-Day Free Trial</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Full access to all premium features including voice therapy and advanced insights
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 text-left">
                <li>• Unlimited conversations</li>
                <li>• Voice therapy sessions</li>
                <li>• Mood tracking & insights</li>
                <li>• Personal journal integration</li>
                <li>• Priority support</li>
              </ul>
            </div>

            {/* Freemium Option */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Freemium Plan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Basic support with limited features to get you started
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 text-left">
                <li>• 5 messages per day</li>
                <li>• Basic mood check-ins</li>
                <li>• Community support</li>
                <li>• Limited features</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onStartTrial}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start 7-Day Free Trial (Credit Card Required)
            </button>
            
            <button 
              onClick={onChooseFreemium}
              className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Continue with Freemium Plan
            </button>

            <div className="flex items-center justify-center space-x-4 pt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Already have an account?</span>
              <button 
                onClick={onSignIn}
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            No commitment • Cancel anytime • Secure & private
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrialLimitModal;