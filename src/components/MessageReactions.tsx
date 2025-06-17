import React from 'react';

interface MessageReactionsProps {
  messageId: string;
  reactions: string[];
  onAddReaction: (messageId: string, emoji: string) => void;
  isVisible: boolean;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions,
  onAddReaction,
  isVisible
}) => {
  const availableReactions = ['❤️', '👍', '🤔', '😊', '🙏'];

  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-2 mt-2">
      {/* Reaction Buttons */}
      <div className="flex space-x-1">
        {availableReactions.slice(0, 3).map((emoji) => (
          <button
            key={emoji}
            onClick={() => onAddReaction(messageId, emoji)}
            className={`p-1.5 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110 ${
              reactions.includes(emoji) 
                ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-300 dark:ring-purple-600' 
                : 'hover:shadow-sm'
            }`}
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {/* Active Reactions Display */}
      {reactions.length > 0 && (
        <div className="flex space-x-1 ml-2">
          {reactions.map((reaction, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 animate-fade-in"
            >
              {reaction}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;