import React from 'react';

interface DiagnosticInfoProps {
  userData: any;
  messages: any[];
  isLoading: boolean;
  isTyping: boolean;
  currentSessionId: string | null;
}

const DiagnosticInfo: React.FC<DiagnosticInfoProps> = ({ 
  userData, 
  messages, 
  isLoading, 
  isTyping, 
  currentSessionId 
}) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm text-xs">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">🔧 Diagnostic Info</h3>
      
      <div className="space-y-1 text-gray-600 dark:text-gray-300">
        <div>
          <strong>Environment:</strong>
          <div className="ml-2">
            <div>SUPABASE_URL: {supabaseUrl ? '✅' : '❌'}</div>
            <div>SUPABASE_ANON_KEY: {supabaseAnonKey ? '✅' : '❌'}</div>
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
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
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
  );
};

export default DiagnosticInfo; 