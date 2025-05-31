import React from 'react';
import { Clock, Shield, Cpu, MessageCircle } from 'lucide-react';

const uniqueFeatures = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'No Appointments. No Waiting.',
    description: "Amara is always here, whether it's 2PM or 2AM, ready to provide support whenever you need it most."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Judgment-Free & Private',
    description: 'Speak openly in a completely safe space without fear of judgment or social consequences.'
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Advanced Therapeutic AI',
    description: 'Built with AI trained in therapeutic response models to provide meaningful support and guidance.'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Human-like Conversation',
    description: 'Amara speaks like a real human and listens like a true friend, creating a natural therapeutic experience.'
  }
];

const Unique: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#f0fdff] to-[#f8f5ff] dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white transition-colors duration-300 mb-4">Why Amara is Different</h2>
          <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300">A new approach to emotional support designed for modern life.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {uniqueFeatures.map((feature, index) => (
            <div key={index} className="flex items-start p-1">
              <div className="w-12 h-12 bg-[#5dbfbb]/10 dark:bg-[#5dbfbb]/20 rounded-xl flex items-center justify-center mr-5 text-[#5dbfbb] flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#2d3748] dark:text-white transition-colors duration-300 mb-2">{feature.title}</h3>
                <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Unique;