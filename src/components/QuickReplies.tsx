import React from 'react';
import { MessageCircle, Heart, Lightbulb, RefreshCw, HelpCircle } from 'lucide-react';

interface QuickRepliesProps {
  onReplySelect: (reply: string) => void;
  isDisabled: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onReplySelect, isDisabled }) => {
  const quickReplies = [
    { text: "Tell me more", icon: MessageCircle },
    { text: "How does that make you feel?", icon: Heart },
    { text: "I need help with anxiety", icon: HelpCircle },
    { text: "Let's change topics", icon: RefreshCw },
    { text: "Can you help me reflect?", icon: Lightbulb }
  ];

  return (
    <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50">
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
        {quickReplies.map((reply, index) => {
          const IconComponent = reply.icon;
          return (
            <button
              key={index}
              onClick={() => onReplySelect(reply.text)}
              disabled={isDisabled}
              className={`inline-flex items-center px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                isDisabled
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-300 transform hover:scale-105 shadow-sm hover:shadow-md'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {reply.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickReplies;