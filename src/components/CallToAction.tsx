import React from 'react';
import { MessageCircle, Play, ArrowRight } from 'lucide-react';

interface CallToActionProps {
  onStartTalking: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onStartTalking }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
        }}
      ></div>
      {/* Soft Transparent Overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70 z-10"></div>
      {/* Decorative Blurs */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 dark:bg-white/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-white/10 dark:bg-white/15 rounded-full blur-3xl"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
            Ready to Feel Better?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto px-4">
            Your healing journey starts with a single conversation.
            Amara is here, ready to listen.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 animate-fade-up animate-delay-300">
          <button
            onClick={onStartTalking}
            aria-label="Talk to Amara"
            className="group bg-white text-purple-600 hover:text-purple-700 dark:bg-gray-100 dark:text-purple-700 dark:hover:text-purple-800 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            Talk to Amara
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            aria-label="Try Demo"
            className="flex items-center gap-3 text-white hover:text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium transition-all duration-300 hover:bg-white/10 border border-white/20 hover:border-white/30 w-full sm:w-auto justify-center transform hover:scale-105"
          >
            <Play className="w-5 h-5 animate-pulse-slow" />
            Try Demo
          </button>
        </div>
        {/* Trust Elements */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/80 animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow animate-delay-200"></div>
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow animate-delay-400"></div>
            <span>Start Immediately</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;