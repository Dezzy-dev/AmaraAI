import React from 'react';
import { TherapySession as SessionData } from '../lib/supabase';
import { MessageSquare, Calendar, Clock } from 'lucide-react';

interface SessionHistoryProps {
  sessions: SessionData[];
  onSelectSession: (sessionId: string) => void;
  isLoading: boolean;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, onSelectSession, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Session History</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Session History</h2>
        <p className="text-gray-500 dark:text-gray-400">You don't have any saved sessions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Session History</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(session => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className="w-full text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-purple-700 dark:text-purple-400">
                Session from {new Date(session.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{new Date(session.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  <span>{session.messages_used} messages</span>
                </div>
              </div>
            </div>
            {/* We can add a summary here in the future if we store one */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              Click to view the conversation.
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory; 