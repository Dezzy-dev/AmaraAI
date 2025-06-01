import React from 'react';
import { ChevronRight, MessageSquareText, ChevronDown } from 'lucide-react';
import Lottie from 'lottie-react';
import chatAnimation from '../assets/chat-animation.json';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
      {/* Enhanced background with radial gradient and blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5ff] via-[#edf7ff] to-[#f0fdff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3619518/pexels-photo-3619518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] bg-cover bg-center opacity-10 dark:opacity-5 backdrop-blur-sm"></div>
        <div className="absolute inset-0 radial-gradient"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-[#9d8cd4] opacity-10 dark:opacity-20 blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-[#5dbfbb] opacity-10 dark:opacity-15 blur-3xl animate-pulse-subtle"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
              <MessageSquareText className="w-8 h-8 text-[#9d8cd4]" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-[#6b5ca5] dark:text-[#9d8cd4]">Amara</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              {/* Main content with enhanced backdrop */}
              <div className="relative backdrop-blur-custom bg-white/30 dark:bg-gray-900/30 rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                {/* Updated copy */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d3748] dark:text-white mb-4 leading-tight opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
                  Healing starts with talking.
                </h1>
                <h2 className="text-xl md:text-2xl text-[#6b5ca5] dark:text-[#9d8cd4] mb-4 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
                  Amara listens, understands, and supports — anytime you need.
                </h2>
                <p className="text-lg md:text-xl text-[#4a5568] dark:text-gray-300 mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
                  Your AI-powered therapy companion. Available 24/7, 100% anonymous, and always here for you.
                </p>

                {/* Enhanced CTAs */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
                  <div className="flex flex-col items-center md:items-start">
                    <button className="px-8 py-4 bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white rounded-full font-medium shadow-lg transition-all duration-300 flex items-center group hover:scale-105 animate-glow">
                      Start Talking
                      <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[15px] text-[#4a5568]/80 dark:text-gray-400 mt-3 font-medium">
                      No sign-up needed. 100% private & anonymous.
                    </p>
                  </div>
                  <button className="px-8 py-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#6b5ca5] dark:text-[#9d8cd4] rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105">
                    See How It Works
                  </button>
                </div>

                {/* Enhanced testimonial */}
                <div className="mt-10 border-t border-gray-200/30 dark:border-gray-700/30 pt-6">
                  <div className="text-[#4a5568] dark:text-gray-300 italic text-lg opacity-0 animate-[fadeIn_0.6s_ease-out_0.9s_forwards] relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-[#9d8cd4]/20">"</span>
                    Trusted by over 100,000 users seeking safe, AI-powered support.
                    <span className="block text-sm mt-2 not-italic text-[#6b5ca5] dark:text-[#9d8cd4]">
                      
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat animation */}
            
            
  

      {/* Enhanced scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeIn_0.6s_ease-out_1s_forwards] text-center">
        <p className="text-[#6b5ca5] dark:text-[#9d8cd4] mb-3 text-sm font-medium bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
          Scroll to see how Amara helps
        </p>
        <div className="animate-bounce-slow">
          <ChevronDown className="w-6 h-6 text-[#9d8cd4]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;