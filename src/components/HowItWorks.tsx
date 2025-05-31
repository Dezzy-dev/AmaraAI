import React from 'react';
import { MessageSquareText, Headphones, Lightbulb, PenTool } from 'lucide-react';

const steps = [
  {
    icon: <MessageSquareText className="w-6 h-6" />,
    title: 'Talk Freely',
    description: 'Type or speak to Amara about anything on your mind, just as you would with a therapist or trusted friend.'
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'Amara Listens',
    description: 'Experience being truly heard as Amara processes your words with empathy and therapeutic understanding.'
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Receive Guidance',
    description: 'Get gentle reflections, coping strategies, and insights that help you see situations with new clarity.'
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: 'Optional Journaling',
    description: 'Track your emotional journey with optional voice conversations and guided journaling sessions.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white transition-colors duration-300 mb-6">How It Works</h2>
            <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300 mb-8">
              Amara combines advanced AI with therapeutic principles to create a supportive experience that feels natural and helpful.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#6695e2]/10 dark:bg-[#6695e2]/20 flex items-center justify-center mr-4 text-[#6695e2]">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2d3748] dark:text-white transition-colors duration-300 mb-2">{step.title}</h3>
                    <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#6695e2]/5 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#9d8cd4]/5 rounded-full"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900/20 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="bg-[#f8f5ff] dark:bg-gray-700 p-4 border-b border-gray-100 dark:border-gray-600 transition-colors duration-300">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <div className="mx-auto text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Amara Chat</div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-[#f8f5ff] dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none max-w-[80%] transition-colors duration-300">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">Hi there, I'm Amara. How are you feeling today?</p>
                </div>
                
                <div className="bg-[#f0f0f0] dark:bg-gray-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] ml-auto transition-colors duration-300">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">I've been feeling overwhelmed with work and can't seem to relax.</p>
                </div>
                
                <div className="bg-[#f8f5ff] dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none max-w-[80%] transition-colors duration-300">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">That sounds challenging. When you're overwhelmed, it can be hard to find moments of peace. Would you like to explore what's contributing to this feeling, or would you prefer some relaxation techniques first?</p>
                </div>
                
                <div className="bg-[#f0f0f0] dark:bg-gray-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] ml-auto transition-colors duration-300">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">I think I'd like to understand why I'm feeling this way first.</p>
                </div>
                
                <div className="bg-[#f8f5ff] dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none max-w-[80%] transition-colors duration-300">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">That's a thoughtful approach. Let's start by exploring when you first noticed feeling overwhelmed. Was there a specific moment or has it been building gradually?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;