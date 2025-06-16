import React from 'react';
import { Shield, Lock, Heart, ExternalLink, ArrowRight, ChevronLeft } from 'lucide-react';

interface WelcomeScreen3Props {
  onNext: () => void;
  onBack: () => void;
}

const WelcomeScreen3: React.FC<WelcomeScreen3Props> = ({ onNext, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-8">
            <Shield className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Privacy,{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Our Promise
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built on trust and care, designed with your wellbeing in mind
          </p>
        </div>

        {/* Privacy Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Everything You Share Stays Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your conversations are encrypted and secure. No one else can access your personal thoughts and feelings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Amara is an AI Companion
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm here to listen, support, and guide you, but I'm not a licensed therapist or medical professional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-8 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Our Commitment to You
          </h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              We're here to listen, support, and guide, not to diagnose or provide medical advice
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              If you're in crisis, please reach out to emergency services or a crisis hotline
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              Amara works best alongside professional care when needed
            </li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-700">
            <a
              href="#"
              className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
            >
              Read our full Privacy Policy & Crisis Protocol
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
            Begin Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full opacity-5 blur-3xl"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen3;