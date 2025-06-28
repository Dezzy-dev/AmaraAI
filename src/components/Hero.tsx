import React, { useState, useEffect } from 'react';
import { MessageCircle, LogIn, Sparkles, Heart, Brain, Shield } from 'lucide-react';
// Import the logo images directly for proper bundling
import blackCircleLogo from '../assets/black_circle_360x360.png';
import whiteCircleLogo from '../assets/white_circle_360x360.png';

interface HeroProps {
  onStartTalking: () => void;
  onSignUp: (path: 'trial_path' | 'freemium_path') => void;
  onSignIn?: () => void;
}

export default function Hero({ onStartTalking, onSignUp, onSignIn }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs - Responsive sizing */}
        <div className="absolute top-16 sm:top-20 left-2 sm:left-4 lg:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-32 lg:h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-32 sm:top-40 right-4 sm:right-8 lg:right-16 w-8 h-8 sm:w-12 sm:h-12 lg:w-24 lg:h-24 bg-blue-200/40 dark:bg-blue-500/20 rounded-full animate-bounce blur-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-24 sm:bottom-32 left-1/4 w-6 h-6 sm:w-10 sm:h-10 lg:w-20 lg:h-20 bg-pink-200/30 dark:bg-pink-500/20 rounded-full animate-pulse blur-lg" style={{ animationDelay: '2s' }}></div>
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
      </div>

      <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-16" onMouseMove={handleMouseMove}>
        {/* Dynamic cursor follower - only visible on larger screens */}
        <div 
          className="hidden lg:block absolute w-64 h-64 xl:w-96 xl:h-96 bg-gradient-radial from-purple-300/20 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out blur-3xl"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
          }}
        ></div>

        {/* Bolt.new Logo Badge - Responsive positioning and sizing */}
        <div className="absolute top-12 sm:top-16 md:top-20 lg:top-24 right-2 sm:right-4 lg:right-6 z-30">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1.2s' }}>
            <a 
              href="https://bolt.new/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block hover:scale-110 transition-all duration-300 cursor-pointer"
              aria-label="Powered by Bolt.new"
            >
              {/* Light Mode Logo */}
              <div className="block dark:hidden">
                <img 
                  src={blackCircleLogo} 
                  alt="Powered by Bolt.new" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:rotate-3"
                />
              </div>
              
              {/* Dark Mode Logo */}
              <div className="hidden dark:block">
                <img 
                  src={whiteCircleLogo} 
                  alt="Powered by Bolt.new" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:rotate-3"
                />
              </div>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            </a>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl">
          <div className="max-w-5xl mx-auto text-center">
            {/* Floating Icons - Responsive positioning */}
            <div className="absolute inset-0 pointer-events-none">
              <Heart className={`absolute top-24 sm:top-32 left-2 sm:left-4 lg:left-12 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-pink-400 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-60' : 'translate-y-10 opacity-0'} animate-bounce`} style={{ animationDelay: '0.5s' }} />
              <Brain className={`absolute top-36 sm:top-48 right-4 sm:right-8 lg:right-20 w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-purple-400 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-60' : 'translate-y-10 opacity-0'} animate-pulse`} style={{ animationDelay: '1s' }} />
              <Shield className={`absolute bottom-24 sm:bottom-32 left-4 sm:left-8 lg:left-16 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-400 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-60' : 'translate-y-10 opacity-0'} animate-bounce`} style={{ animationDelay: '1.5s' }} />
              <Sparkles className={`absolute top-16 sm:top-20 right-12 sm:right-16 lg:right-32 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-60' : 'translate-y-10 opacity-0'} animate-pulse`} style={{ animationDelay: '2s' }} />
            </div>

            {/* Subtitle with responsive text and padding */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-600 mb-4 sm:mb-6">
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300">AI therapy companion, made for healing</span>
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-purple-500 animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
              </div>
            </div>
            
            {/* Main Headline with better responsive typography */}
            <h1 className="mt-6 sm:mt-8 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight text-gray-900 dark:text-gray-100 px-2 sm:px-4">
              <span className={`inline-block transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
                Feel Better.
              </span>
              <br />
              <span className={`relative inline-block transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
                <span className="absolute inset-0 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-2xl opacity-40 animate-pulse"></span>
                <span className="relative bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-transparent animate-gradient-x">
                  Talk Freely.
                </span>
              </span>
              <br />
              <span className={`inline-block transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
                Meet 
                <span className="relative ml-1 sm:ml-2 lg:ml-3">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-30 animate-pulse"></span>
                  <span className="relative text-purple-600 dark:text-purple-400">Amara</span>
                  <span className="absolute -top-0.5 sm:-top-1 lg:-top-2 -right-0.5 sm:-right-1 lg:-right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-ping"></span>
                </span>
              </span>
            </h1>

            {/* Enhanced CTA Buttons with better responsive design */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-12 px-3 sm:px-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '0.8s' }}>
              <button
                onClick={onStartTalking}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"></div>
                <MessageCircle className="relative w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                <span className="relative">Start Talking</span>
                <div className="relative ml-2 sm:ml-3 w-0 group-hover:w-3 sm:group-hover:w-4 lg:group-hover:w-6 transition-all duration-300 overflow-hidden">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              <button
                onClick={onSignIn}
                className="group inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-500/50 hover:bg-gray-900 focus:bg-gray-900 hover:text-white focus:text-white hover:border-gray-900 focus:border-gray-900 dark:hover:bg-gray-100 dark:focus:bg-gray-100 dark:hover:text-gray-900 dark:focus:text-gray-900 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 group-hover:animate-pulse" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Video Section with better responsive design */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pb-6 sm:pb-8 lg:pb-16">
          <div className="relative">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl">
              <div className={`max-w-6xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '1s' }}>
                {/* Video Introduction with responsive text */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <LogIn className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white ml-0.5 sm:ml-1" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      Watch Amara Introduce Herself
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-4">
                    Experience the future of AI therapy with natural, empathetic conversations
                  </p>
                </div>

                {/* Enhanced YouTube Embed with responsive design */}
                <div className="relative group">
                  <div className="absolute -inset-1 sm:-inset-2 lg:-inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl sm:rounded-2xl lg:rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-0.5 sm:p-1 lg:p-2 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl">
                    <div className="relative w-full rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/fz7sRsEEi20?autoplay=1&mute=1&loop=1&playlist=fz7sRsEEi20&controls=1&modestbranding=1&rel=0&showinfo=0"
                        title="Amara AI Therapy Companion Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Enhanced Trust Indicators with responsive layout */}
                <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 sm:gap-2 animate-pulse">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                      <span>Trusted by thousands</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <span>Private & Secure</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 animate-pulse" style={{ animationDelay: '1s' }}>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                      <span>Available 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}