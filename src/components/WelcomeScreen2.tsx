import React from 'react';
import { MessageCircle, Heart, TrendingUp, ArrowRight, ChevronLeft } from 'lucide-react';

interface WelcomeScreen2Props {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeScreen2: React.FC<WelcomeScreen2Props> = ({ onNext, onBack }) => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Talk Freely",
      description: "Share your thoughts and feelings without judgment in a completely safe space.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Listen & Reflect",
      description: "Get compassionate AI responses designed to help you explore and understand.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Your Journey",
      description: "Mood insights and journaling tools to understand yourself better over time.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            A Safe Space for{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Thoughts
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empathetic support that's always here when you need it most
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Back
          </button>

          <button
            onClick={onNext}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Learn More
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-200 dark:bg-pink-800 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen2;