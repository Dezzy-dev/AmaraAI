import React, { useState, useEffect, useRef } from 'react';
import useUser from '../contexts/useUser';
import { useChat } from '../contexts/ChatContext';
import LoadingScreen from './LoadingScreen';
import { Send, Mic, ArrowLeft, Bot, User, Moon, Sun, Lock } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import AdvancedVoiceRecorder from './AdvancedVoiceRecorder';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { useDarkMode } from '../hooks/useDarkMode';
import SignUpNudge from './SignUpNudge';
import UpgradeModal from './UpgradeModal';
import amaraAvatar from '../assets/amara_avatar.png';
import { toast } from 'react-hot-toast';

interface TherapySessionProps {
  onEndSession: () => void;
  onSignUp: (reason: 'message_limit' | 'voice_limit') => void;
  onSignIn: () => void;
  onChooseFreemium: () => void;
  navigateTo: (view: string) => void;
}

type UpgradeReason = 'trial_end' | 'message_limit' | 'voice_limit';

const TherapySession: React.FC<TherapySessionProps> = ({ 
  onEndSession, 
  onSignUp, 
  onSignIn, 
  onChooseFreemium,
  navigateTo
}) => {
  const { userData, limits, isLoading: isUserLoading, isAnonymousUser, refreshUserDataAfterChat } = useUser();
  const { messages, isLoading: isChatLoading, isTyping, sendMessage, sendVoiceMessage, startNewSession, currentSessionId } = useChat();
  const [isDark, toggleDarkMode] = useDarkMode();

  const [currentMessage, setCurrentMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [showUpgradeModal, setShowUpgradeModal] = useState<UpgradeReason | null>(null);
  const sessionInitializedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionInitializedRef.current && userData) {
        sessionInitializedRef.current = true;
        try {
          if (userData.isAuthenticated) {
            await startNewSession(userData.id, undefined);
          } else {
            await startNewSession(undefined, userData.deviceId);
          }
        } catch (error) {
          console.error('Failed to initialize session:', error);
          toast.error('Unable to start session. Please try refreshing the page.', {
            duration: 5000,
            position: 'top-right',
          });
        }
      }
    };
    if (!isUserLoading && userData && !sessionInitializedRef.current) {
      initializeSession();
    }
  }, [isUserLoading, userData, startNewSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() === '') return;
    
    const text = currentMessage.trim();
    setCurrentMessage('');
    
    try {
      await sendMessage(text, 'text');
      // Refresh user data after sending a message
      await refreshUserDataAfterChat();
    } catch (error: any) {
      if (error.message === 'Daily message limit exceeded') {
        setShowUpgradeModal('message_limit');
      } else {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleSendVoiceMessage = async (blob: Blob, duration: number) => {
    try {
      await sendVoiceMessage(blob, duration);
      setInputMode('text');
      await refreshUserDataAfterChat();
    } catch (error: any) {
      if (error.message === 'Voice note limit exceeded') {
        if (userData?.currentPlan === 'freemium') {
          setShowUpgradeModal('voice_limit');
        } else {
          toast.error('You have reached your daily voice note limit. Try again tomorrow.', {
            duration: 4000,
            position: 'top-right',
          });
        }
      } else {
        console.error('Error sending voice message:', error);
      }
    }
  };

  const handleUpgradeModalClose = () => setShowUpgradeModal(null);
  const handleUpgradeModalSignUp = (path: 'trial_path' | 'freemium_path') => {
    setShowUpgradeModal(null);
    // You can call onSignUp or onChooseFreemium here if needed
    if (path === 'trial_path') {
      onSignUp('message_limit');
    } else {
      onChooseFreemium();
    }
  };

  // Custom end session handler
  const handleEndSession = () => {
    if (userData?.isAuthenticated) {
      navigateTo('dashboard');
    } else {
      onEndSession();
    }
  };

  if (isUserLoading || (!sessionInitializedRef.current && !isUserLoading && !isChatLoading)) {
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

  const isAnonymous = isAnonymousUser();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* End Session Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={handleEndSession}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          End Session
        </button>
      </div>
      <header className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/60 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={handleEndSession} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Amara</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">with {userData?.name || 'Anonymous'}</p>
        </div>
        <div className="flex items-center space-x-2">
          {limits.hasLimits && (
            <div className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full ${
              isAnonymous 
                ? 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700' 
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50'
            }`}>
              {isAnonymous && <Lock size={12} className="mr-1" />}
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
          <div 
            key={msg.id || i} 
            className={`flex items-end gap-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } ${
              msg.isAnimating 
                ? msg.sender === 'user' 
                  ? 'animate-slide-in-right' 
                  : 'animate-slide-in-left'
                : ''
            }`}
          >
            {msg.sender === 'amara' && <AmaraAvatar />}
            <div className={`max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-purple-600 text-white rounded-br-lg' 
                : 'bg-white dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 rounded-bl-lg'
            }`}>
              {msg.message_type === 'voice' && msg.voice_note_url ? (
                <div>
                  <VoiceMessagePlayer audioUrl={msg.voice_note_url} />
                  {msg.sender === 'amara' && msg.message_text && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                      "{msg.message_text}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.message_text}</p>
              )}
            </div>
            {msg.sender === 'user' && <UserAvatar />}
          </div>
        ))}
        <TypingIndicator isVisible={isTyping} />
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
              placeholder={
                isAnonymous && limits.messagesRemaining <= 0 
                  ? "Message limit reached - Sign up to continue" 
                  : "Share what's on your mind..."
              }
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition-shadow disabled:opacity-50"
              disabled={limits.hasLimits && limits.messagesRemaining <= 0}
            />
            <button 
              onClick={() => setInputMode('voice')} 
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={limits.hasLimits && limits.voiceNotesRemaining <= 0}
              title={
                isAnonymous 
                  ? "Voice notes not available for anonymous users" 
                  : limits.voiceNotesRemaining <= 0 
                    ? "Voice note limit reached" 
                    : "Send voice message"
              }
            >
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || (limits.hasLimits && limits.messagesRemaining <= 0)} 
              className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors"
            >
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

      {/* Show sign-up nudge for anonymous users */}
      {isAnonymous && (
        <SignUpNudge
          onSignUp={() => setShowUpgradeModal('message_limit')}
          onSignIn={onSignIn}
          onChooseFreemium={onChooseFreemium}
        />
      )}

      {/* Show UpgradeModal when limit is hit */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={handleUpgradeModalClose}
          onSignUp={handleUpgradeModalSignUp}
          reason={showUpgradeModal}
        />
      )}

      {/* Only show DiagnosticInfo in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm text-xs">
          <h3 className="font-bold mb-2 text-gray-900 dark:text-white">🔧 Diagnostic Info</h3>
          
          <div className="space-y-1 text-gray-600 dark:text-gray-300">
            <div>
              <strong>Environment:</strong>
              <div className="ml-2">
                <div>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</div>
                <div>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</div>
              </div>
            </div>
            
            <div>
              <strong>User:</strong>
              <div className="ml-2">
                <div>Authenticated: {userData?.isAuthenticated ? 'Yes' : 'No'}</div>
                <div>Name: {userData?.name || 'N/A'}</div>
                <div>Plan: {userData?.currentPlan || 'N/A'}</div>
              </div>
            </div>
            
            <div>
              <strong>Session:</strong>
              <div className="ml-2">
                <div>Session ID: {currentSessionId ? '✅' : '❌'}</div>
                <div>Loading: {isChatLoading ? 'Yes' : 'No'}</div>
                <div>Typing: {isTyping ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            <div>
              <strong>Messages:</strong>
              <div className="ml-2">
                <div>Count: {messages.length}</div>
                <div>Last sender: {messages[messages.length - 1]?.sender || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapySession;