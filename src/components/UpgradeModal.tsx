import React from 'react';
import { X, Crown, ShieldCheck, Zap, Star } from 'lucide-react';

type UpgradeReason = 'trial_end' | 'message_limit' | 'voice_limit';

interface UpgradeModalProps {
  onClose: () => void;
  onSignUp: (path: 'trial_path' | 'freemium_path') => void;
  reason: UpgradeReason;
}

const content: { [key in UpgradeReason]: { title: string; description: string } } = {
  trial_end: {
    title: "You've reached your trial limit",
    description: "Continue your healing journey with unlimited conversations. Choose the path that feels right for you."
  },
  message_limit: {
    title: "Unlock Unlimited Messaging",
    description: "You've reached your daily message limit. Upgrade now to continue your conversation without interruption."
  },
  voice_limit: {
    title: "Unlock Unlimited Voice Notes",
    description: "You've used your free voice note for the day. Upgrade to unlock unlimited voice messages and deeper conversations."
  }
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onSignUp, reason }) => {
  // If the reason is invalid, default to 'trial_end' to prevent a crash
  const safeReason = reason in content ? reason : 'trial_end';
  const { title, description } = content[safeReason];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg text-white transform transition-all animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="p-6 sm:p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-purple-500/10 rounded-full mb-4">
              <Crown className="text-purple-400" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">{description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 7-Day Free Trial Option */}
            <div className="bg-gray-700/50 border-2 border-purple-500 rounded-xl p-6 flex flex-col relative">
                <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
                <div className="text-center mb-4">
                    <Zap className="mx-auto text-purple-400 mb-2" size={28}/>
                    <h3 className="text-xl font-bold">7-Day Free Trial</h3>
                    <p className="text-sm text-gray-400">Full access to all premium features.</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 flex-grow">
                    <li className="flex items-start"><Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 shrink-0"/>Unlimited conversations</li>
                    <li className="flex items-start"><Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 shrink-0"/>Voice therapy sessions</li>
                    <li className="flex items-start"><Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 shrink-0"/>Mood tracking & insights</li>
                    <li className="flex items-start"><Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 shrink-0"/>Priority support</li>
                </ul>
                <button 
                    onClick={() => onSignUp('trial_path')}
                    className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    Start 7-Day Free Trial <span className="font-normal text-sm">(Card Required)</span>
                </button>
            </div>

            {/* Freemium Plan Option */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 flex flex-col">
                 <div className="text-center mb-4">
                    <ShieldCheck className="mx-auto text-gray-400 mb-2" size={28}/>
                    <h3 className="text-xl font-bold">Freemium Plan</h3>
                    <p className="text-sm text-gray-400">Basic support with limited features.</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-300 flex-grow">
                    <li className="flex items-start"><X className="w-4 h-4 text-red-400 mr-2 mt-0.5 shrink-0"/>5 messages per day</li>
                    <li className="flex items-start"><X className="w-4 h-4 text-red-400 mr-2 mt-0.5 shrink-0"/>Basic mood check-ins</li>
                </ul>
                 <button 
                    onClick={() => onSignUp('freemium_path')}
                    className="mt-6 w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors">
                    Continue with Freemium
                </button>
            </div>
          </div>
          
          <div className="text-center mt-6">
              <p className="text-xs text-gray-500">No commitment • Cancel anytime • Secure & private</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal; 