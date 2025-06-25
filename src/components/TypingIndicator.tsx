import React from 'react';
import amaraAvatar from '../assets/amara_avatar.png';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-md">
        <img src={amaraAvatar} alt="Amara" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-lg shadow-sm px-4 py-2.5 max-w-md lg:max-w-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Amara is typing</span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;