import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-3 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 p-4 rounded-2xl rounded-tl-md transition-all duration-300">
        {/* Elegant typing dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Amara is thinking...
      </span>
    </div>
  );
};

export default TypingIndicator;