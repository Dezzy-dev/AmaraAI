import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface SignUpNudgeProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onChooseFreemium: () => void;
}

const SignUpNudge: React.FC<SignUpNudgeProps> = ({ onSignUp, onSignIn, onChooseFreemium }) => {
  return (
    <div className="sticky bottom-0 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-pink-900/20 border-t border-purple-200 dark:border-purple-700/50 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Left side - Message */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Unlock unlimited conversations with Amara
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Choose your path: Full trial or freemium access
              </p>
            </div>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSignIn}
              className="px-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              Sign In
            </button>

            <button
              onClick={onChooseFreemium}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full transition-colors duration-200 flex items-center"
            >
              <Heart className="w-3 h-3 mr-1" />
              Choose Freemium
            </button>
            
            <button
              onClick={onSignUp}
              className="group inline-flex items-center px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Sign Up for Trial
              <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpNudge;