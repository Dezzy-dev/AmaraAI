import React from 'react';
import { ChevronRight, MessageSquareText, ChevronDown } from 'lucide-react';
import Lottie from 'lottie-react';
import chatAnimation from '../assets/chat-animation.json';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden bg-gradient-to-br from-[#f8f5ff] via-[#edf7ff] to-[#f0fdff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3619518/pexels-photo-3619518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-[#9d8cd4] opacity-10 dark:opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-[#5dbfbb] opacity-10 dark:opacity-15 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
              <MessageSquareText className="w-8 h-8 text-[#9d8cd4]" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-[#6b5ca5] dark:text-[#9d8cd4]">Amara</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d3748] dark:text-white mb-6 leading-tight opacity-0 animate-[fadeIn_0.6s_ease-out_forwards] transition-colors duration-300">
                Feel Better. <br />
                <span className="text-[#6b5ca5] dark:text-[#9d8cd4]">Talk Freely.</span><br />
                Meet Amara.
              </h1>
              
              <p className="text-lg md:text-xl text-[#4a5568] dark:text-gray-300 mb-10 max-w-xl opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards] transition-colors duration-300">
                Amara is your AI therapy companion — here to listen, support, and help you heal, anytime you need.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
                <button className="px-6 py-3 bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white rounded-full font-medium shadow-lg shadow-[#9d8cd4]/20 dark:shadow-[#9d8cd4]/40 transition-all duration-300 flex items-center">
                  Start Talking
                  <ChevronRight className="ml-1 w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#6b5ca5] dark:text-[#9d8cd4] rounded-full font-medium shadow-lg transition-all duration-300">
                  See How It Works
                </button>
              </div>
            </div>
            
            {/* Chat animation */}
            <div className="w-80 h-80 flex-shrink-0 opacity-0 animate-[fadeIn_0.6s_ease-out_0.9s_forwards] bg-white/10 dark:bg-gray-800/20 rounded-3xl p-4 backdrop-blur-sm">
              <Lottie 
                animationData={chatAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeIn_0.6s_ease-out_1s_forwards]">
        <div className="animate-bounce-slow">
          <ChevronDown className="w-6 h-6 text-[#9d8cd4]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;