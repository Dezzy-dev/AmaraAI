import React from 'react';
import { Lock, Shield, UserCheck, Heart } from 'lucide-react';

const privacyFeatures = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Private & Encrypted',
    description: 'Your conversations are fully encrypted and private, accessible only to you.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'No Account Required',
    description: 'Start talking immediately—create an account only if you want conversation continuity.'
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: 'Ethical Design',
    description: 'Built with clear ethical guidelines and transparency about AI capabilities.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Complementary Support',
    description: 'Designed to bridge gaps in care, not replace professional therapists when needed.'
  }
];

const Privacy: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white transition-colors duration-300 mb-4">Designed for Privacy & Trust</h2>
          <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300">Your emotional wellbeing deserves a space that respects your privacy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {privacyFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-[#f8f5ff] dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 border-0 dark:border dark:border-gray-700 transition-all duration-300 opacity-0 animate-fade-in-up animate-delay-${200 + (index * 100)}`}
            >
              <div className="w-12 h-12 bg-[#5dbfbb]/10 dark:bg-[#5dbfbb]/20 rounded-xl flex items-center justify-center mb-6 text-[#5dbfbb]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#2d3748] dark:text-white transition-colors duration-300 mb-3">{feature.title}</h3>
              <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Privacy;