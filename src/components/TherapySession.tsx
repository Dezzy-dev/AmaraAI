import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useChat } from '../contexts/ChatContext';
import LoadingScreen from './LoadingScreen';
import { Send, Mic, ArrowLeft, Bot, User, Moon, Sun } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import AdvancedVoiceRecorder from './AdvancedVoiceRecorder';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { useDarkMode } from '../hooks/useDarkMode';
import amaraAvatar from '../assets/amara_avatar.png';

interface TherapySessionProps {
  onEndSession: () => void;
  onSignUp: (reason: 'message_limit' | 'voice_limit') => void;
  onSignIn: () => void;
  onChooseFreemium: () => void;
}

const TherapySession: React.FC<TherapySessionProps> = ({ onEndSession, onSignUp }) => {
  const { userData, limits, isLoading: isUserLoading, incrementMessageCount, incrementVoiceNoteCount } = useUser();
  const { messages, isLoading: isChatLoading, sendMessage, startNewSession } = useChat();
  const [isDark, toggleDarkMode] = useDarkMode();

  const [currentMessage, setCurrentMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSession = async () => {
      if (messages.length === 0 && (userData?.id || userData?.deviceId)) {
        await startNewSession(userData.id || userData.deviceId!);
      }
    };
    if (!isUserLoading) {
      initializeSession();
    }
  }, [isUserLoading, userData, startNewSession, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '' || (limits.hasLimits && limits.messagesRemaining <= 0)) {
      if (limits.hasLimits && limits.messagesRemaining <= 0) {
        onSignUp('message_limit');
      }
      return;
    }
    const text = currentMessage.trim();
    setCurrentMessage('');
    await incrementMessageCount();
    await sendMessage(text, 'text');
  };

  const handleSendVoiceMessage = async (blob: Blob, duration: number) => {
    if (limits.hasLimits && limits.voiceNotesRemaining <= 0) {
      onSignUp('voice_limit');
      return;
    }
    const mockUrl = URL.createObjectURL(blob);
    await incrementVoiceNoteCount();
    await sendMessage(`[Voice Message: ${duration.toFixed(1)}s]`, 'voice', mockUrl);
    setInputMode('text');
  };
  
  if (isUserLoading || (messages.length === 0 && !isUserLoading && !isChatLoading)) {
    return <LoadingScreen onComplete={() => {}} userName={userData?.name} />;
  }

  const UserAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <User size={18} className="text-gray-500 dark:text-gray-400" />
    </div>
  );

  const AmaraAvatar = () => (
    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-md">
      <img src={amaraAvatar} alt="Amara" className="w-full h-full object-cover" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/60 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onEndSession} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Amara</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">with {userData?.name || 'Anonymous'}</p>
        </div>
        <div className="flex items-center space-x-2">
          {limits.hasLimits && (
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
              <span>MSG: {limits.messagesRemaining}/{limits.maxMessages}</span>
              <span>VOICE: {limits.voiceNotesRemaining}/{limits.maxVoiceNotes}</span>
            </div>
          )}
          <button onClick={() => toggleDarkMode(!isDark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, i) => (
          <div key={msg.id || i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'amara' && <AmaraAvatar />}
            <div className={`max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-purple-600 text-white rounded-br-lg' 
                : 'bg-white dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 rounded-bl-lg'
            }`}>
              {msg.message_type === 'voice' && msg.voice_note_url ? (
                <VoiceMessagePlayer audioUrl={msg.voice_note_url} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.message_text}</p>
              )}
            </div>
            {msg.sender === 'user' && <UserAvatar />}
          </div>
        ))}
        <TypingIndicator isVisible={isChatLoading} />
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-3 bg-white dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700/60 backdrop-blur-sm sticky bottom-0">
        {inputMode === 'text' ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share what's on your mind..."
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition-shadow"
              disabled={limits.hasLimits && limits.messagesRemaining <= 0}
            />
            <button onClick={() => setInputMode('voice')} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={limits.hasLimits && limits.voiceNotesRemaining <= 0}>
              <Mic size={20} />
            </button>
            <button onClick={handleSendMessage} disabled={!currentMessage.trim()} className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors">
              <Send size={20} />
            </button>
          </div>
        ) : (
          <AdvancedVoiceRecorder
            onSendVoiceMessage={handleSendVoiceMessage}
            onCancel={() => setInputMode('text')}
          />
        )}
      </footer>
    </div>
  );
};

export default TherapySession;