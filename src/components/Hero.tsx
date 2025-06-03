import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageSquareText, ChevronDown, Volume2, VolumeX, Heart, Shield, Clock, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartTalking: () => void;
}

export default function Hero({ onStartTalking }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const testimonials = [
    { text: "Amara helped me through my darkest moments", author: "Sarah M." },
    { text: "Finally, someone who truly understands me", author: "David K." },
    { text: "Available when I needed support most", author: "Maria L." }
  ];

  const typewriterTexts = [
    "someone who truly listens",
    "your safe space to heal",
    "support without judgment",
    "therapy that fits your life"
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    const currentFullText = typewriterTexts[currentTextIndex];
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= currentFullText.length) {
        setTypedText(currentFullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentTextIndex]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        {/* Gradient background with animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        </div>
        
        {/* Floating orbs with better animation */}
        <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-teal-400/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Logo with animation */}
          <div className="flex items-center justify-center mb-8 animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl border border-purple-200/50">
                <MessageSquareText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Amara</h2>
              <p className="text-sm text-purple-500 dark:text-purple-400">AI Therapy Companion</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Enhanced Content Section */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="relative">
                {/* Main content card with glassmorphism */}
                <div className="relative backdrop-blur-lg bg-white/40 dark:bg-gray-900/40 rounded-3xl p-10 border border-white/30 dark:border-gray-800/30 shadow-2xl">
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                  
                  {/* Emotional hook headline */}
                  <div className="mb-6">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-white mb-4 leading-tight animate-fadeInUp">
                      You're Not
                      <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                        Alone
                      </span>
                    </h1>
                    <div className="h-8 mb-4">
                      <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                        Meet Amara, <span className="text-purple-600 dark:text-purple-400 font-semibold">{typedText}</span>
                        <span className="animate-pulse">|</span>
                      </h2>
                    </div>
                  </div>

                  {/* Emotional description */}
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                    When the world feels overwhelming, Amara is here. 
                    <span className="font-semibold text-purple-600 dark:text-purple-400"> Available instantly, completely private, and always understanding.</span>
                    <br />
                    <span className="text-gray-500 dark:text-gray-400 italic">No appointments. No judgment. Just support when you need it most.</span>
                  </p>

                  {/* Enhanced feature highlights with icons */}
                  <div className="grid grid-cols-2 gap-4 mb-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <div className="flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 backdrop-blur-sm">
                      <Shield className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">100% Private</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 backdrop-blur-sm">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Always Available</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 backdrop-blur-sm">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Judgment-Free</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 backdrop-blur-sm">
                      <Sparkles className="w-5 h-5 text-teal-500" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Instant Relief</span>
                    </div>
                  </div>

                  {/* Compelling CTA */}
                  <div className="space-y-4 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                    <button 
                      onClick={onStartTalking}
                      className="group relative w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        <Heart className="w-5 h-5 mr-2 animate-pulse" />
                        Start Healing Today - It's Free
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                    
                    <div className="text-center lg:text-left">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        ✨ No sign-up required • Start talking in seconds • Completely anonymous
                      </p>
                    </div>
                  </div>

                  {/* Social proof with testimonial rotation */}
                  <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-gray-700/30 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
                    <div className="text-center lg:text-left mb-4">
                      <div className="bg-white/40 dark:bg-gray-800/40 rounded-2xl p-4 backdrop-blur-sm">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                          "{testimonials[currentTestimonial].text}"
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                          - {testimonials[currentTestimonial].author}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">250K+</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Lives Touched</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">4.9★</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">User Love</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24/7</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Here for You</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Video Section */}
            <div className="flex-1 max-w-2xl animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              <div className="relative">
                {/* Video container with enhanced styling */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur opacity-30 animate-pulse"></div>
                  
                  <div className="relative bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-3xl overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-purple-100/20 to-blue-100/20 dark:from-gray-800/20 dark:to-gray-900/20">
                      <iframe
                        src={`https://www.youtube.com/embed/fz7sRsEEi20?autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&loop=1&playlist=fz7sRsEEi20&mute=${isMuted ? 1 : 0}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Meet Amara - Your AI Therapy Companion"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced video controls */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>

                {/* Enhanced video badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl border border-purple-200/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      Live Demo
                    </span>
                  </div>
                </div>

                {/* Video description */}
                <div className="mt-6 text-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2 flex items-center justify-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Meet Your Compassionate AI Companion
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Watch Amara introduce herself and discover how she provides the emotional support you deserve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-fadeInUp" style={{animationDelay: '1s'}}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 mb-3">
          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
            Discover how Amara transforms lives ↓
          </p>
        </div>
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-purple-500 mx-auto" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}