import React from 'react';
import { MessageCircle, Play } from 'lucide-react';

interface HeroProps {
  onStartTalking: () => void;
}

export default function Hero({ onStartTalking }: HeroProps) {
  const handleStartTalking = () => {
    onStartTalking();
  };

  return (
    <div className="overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <section className="pt-16 sm:pt-20 lg:pt-24 xl:pt-28 bg-gray-50 dark:bg-gray-900 relative">
        {/* Bolt.new Badges - Responsive positioning */}
        <div className="absolute top-16 sm:top-20 lg:top-24 right-4 sm:right-6 z-10">
          {/* Light Mode Badge */}
          <div className="block dark:hidden">
            <img 
              src="/black_circle_360x360.png" 
              alt="Powered by Bolt.new" 
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-50 hover:opacity-70 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animate-delay-1000"
              title="Powered by Bolt.new"
            />
          </div>
          
          {/* Dark Mode Badge */}
          <div className="hidden dark:block">
            <img 
              src="/white_circle_360x360.png" 
              alt="Powered by Bolt.new" 
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-50 hover:opacity-70 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animate-delay-1000"
              title="Powered by Bolt.new"
            />
          </div>
        </div>

        <div className="container-responsive-wide">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            {/* Subtitle - Responsive */}
            <h1 className="px-4 sm:px-6 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 font-inter">
              AI therapy companion, made for healing
            </h1>
            
            {/* Main Headline - Fully responsive */}
            <p className="mt-4 sm:mt-5 lg:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight lg:leading-tight text-gray-900 dark:text-gray-100 px-4">
              Feel Better.
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative"> Talk Freely. </span>
              </span>
              Meet Amara.
            </p>

            {/* CTA Buttons - Responsive layout */}
            <div className="px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-9 lg:mt-12">
              <button
                onClick={handleStartTalking}
                className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg lg:text-xl font-bold text-white transition-all duration-200 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 border-2 border-transparent rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transform hover:scale-105 shadow-lg hover:shadow-xl touch-target-lg"
                role="button"
              >
                <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Start Talking</span>
                <div className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden ml-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </button>

              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-200 border-2 border-gray-400 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900 dark:hover:bg-gray-100 dark:focus:bg-gray-100 dark:hover:text-gray-900 dark:focus:text-gray-900 touch-target-lg"
                role="button"
              >
                <Play className="w-5 h-5 lg:w-6 lg:h-6 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">See How It Works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Section - Fully responsive */}
        <div className="pb-8 sm:pb-12 lg:pb-16 bg-white dark:bg-gray-800">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gray-50 dark:bg-gray-900"></div>
            <div className="relative container-responsive-wide">
              <div className="max-w-6xl mx-auto animate-fade-up-delayed">
                {/* Video Introduction Text - Responsive */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
                    Watch Amara Introduce Herself
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 px-4">
                    See how natural conversations with your AI therapy companion feel
                  </p>
                </div>

                {/* YouTube Embed - Responsive aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl dark:shadow-black/50"
                    src="https://www.youtube.com/embed/fz7sRsEEi20?autoplay=1&mute=1&loop=1&playlist=fz7sRsEEi20&controls=1&modestbranding=1&rel=0&showinfo=0"
                    title="Amara AI Therapy Companion Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Trust indicators - Responsive */}
                <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
                  <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 px-4">
                    Trusted by thousands • Private & Secure • Available 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}