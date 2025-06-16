import React from 'react';
import { Brain, Heart, RefreshCw, Sun, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Managing Anxiety & Stress',
    description: 'Find calm during moments of panic, worry, and overwhelming pressure.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Processing Difficult Emotions',
    description: 'Talk through feelings of sadness, grief, or confusion in a safe space.'
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'Clarity After Overthinking',
    description: "Break free from mental loops and find perspective when your mind won't quiet down."
  },
  {
    icon: <Sun className="w-6 h-6" />,
    title: 'Boosting Self-Worth',
    description: 'Cultivate self-compassion and emotional awareness through guided reflection.'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Daily Mental Check-ins',
    description: 'Build a consistent practice of emotional well-being with regular check-ins.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white mb-4 transition-colors duration-300">
            What Amara Helps With
          </h2>
          <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300">
            Your companion for life's emotional challenges, big and small.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in-up animate-delay-200">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-[#f8f5ff] dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-all duration-300 group border-0 dark:border dark:border-gray-700 opacity-0 animate-fade-in-up animate-delay-${300 + (index * 100)}`}
            >
              <div className="w-12 h-12 bg-[#9d8cd4]/10 dark:bg-[#9d8cd4]/20 rounded-xl flex items-center justify-center mb-6 text-[#9d8cd4] group-hover:bg-[#9d8cd4] group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#2d3748] dark:text-white mb-3 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;