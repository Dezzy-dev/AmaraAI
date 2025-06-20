import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import { auth } from '../../lib/supabase';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auth.signUp(email, password, name);
      // Automatically sign in the user after successful sign-up
      await auth.signIn(email, password);
      
      setSuccess('Account created and signed in successfully!');
      
      // Call onAuthSuccess immediately after successful authentication
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await auth.signIn(email, password);
      setSuccess('Signed in successfully!');
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple', action: 'signup' | 'signin') => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auth.signInWithOAuth(provider);
      // OAuth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error(`${action} with ${provider} error:`, error);
      setError(error.message || `Failed to ${action} with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await auth.resetPassword(email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Error/Success Messages */}
        {(error || success) && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 max-w-md w-full mx-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth Pages */}
        <div className="w-full max-w-md">
          {mode === 'signup' ? (
            <SignUpPage
              onSignUp={handleSignUp}
              onSocialSignUp={(provider) => handleSocialAuth(provider, 'signup')}
              onNavigateToSignIn={() => setMode('signin')}
              onClose={handleClose}
              isLoading={isLoading}
            />
          ) : (
            <SignInPage
              onSignIn={handleSignIn}
              onSocialSignIn={(provider) => handleSocialAuth(provider, 'signin')}
              onNavigateToSignUp={() => setMode('signup')}
              onForgotPassword={handleForgotPassword}
              onClose={handleClose}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;