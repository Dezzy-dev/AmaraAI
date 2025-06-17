import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceNote: () => void;
  isDisabled: boolean;
  isRecording: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onVoiceNote,
  isDisabled,
  isRecording,
  placeholder = "Share what's on your mind..."
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-4">
      {isDisabled && (
        <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-center">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            Trial limit reached. Sign up to continue your conversation with Amara.
          </p>
        </div>
      )}
      
      <div className="flex items-end space-x-3">
        {/* Text Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isDisabled ? "Sign up to continue..." : placeholder}
            disabled={isDisabled}
            className={`w-full px-4 py-3 rounded-2xl border resize-none transition-all duration-200 ${
              isDisabled
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none'
            }`}
            rows={1}
            style={{ 
              minHeight: '48px', 
              maxHeight: '120px',
              resize: 'none'
            }}
          />
        </div>
        
        {/* Voice Button */}
        <button
          onClick={onVoiceNote}
          disabled={isDisabled}
          className={`p-3 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-lg'
              : isDisabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 shadow-sm hover:shadow-md'
          }`}
          title={isRecording ? 'Recording...' : 'Voice message'}
        >
          <Mic className="w-5 h-5" />
        </button>
        
        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isDisabled}
          className={`p-3 rounded-full transition-all duration-200 ${
            !message.trim() || isDisabled
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;