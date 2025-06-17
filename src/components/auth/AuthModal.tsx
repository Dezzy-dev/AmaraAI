import React, { useState } from 'react';
import { X } from 'lucide-react';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'signin';
  onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signup',
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);

  if (!isOpen) return null;

  const handleSignUp = async (email: string, password: string) => {
    console.log('Sign up:', { email, password });
    // Implement actual sign up logic here
    // For now, simulate success
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      onClose();
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    console.log('Sign in:', { email, password });
    // Implement actual sign in logic here
    // For now, simulate success
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      onClose();
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple', action: 'signup' | 'signin') => {
    console.log(`${action} with ${provider}`);
    // Implement social auth logic here
    // For now, simulate success
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      onClose();
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
    // Implement forgot password logic here
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Auth Pages */}
        <div className="w-full max-w-md">
          {mode === 'signup' ? (
            <SignUpPage
              onSignUp={handleSignUp}
              onSocialSignUp={(provider) => handleSocialAuth(provider, 'signup')}
              onNavigateToSignIn={() => setMode('signin')}
              onClose={onClose}
            />
          ) : (
            <SignInPage
              onSignIn={handleSignIn}
              onSocialSignIn={(provider) => handleSocialAuth(provider, 'signin')}
              onNavigateToSignUp={() => setMode('signup')}
              onForgotPassword={handleForgotPassword}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;