import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageSquareText, ChevronDown, Volume2, VolumeX, Heart, Shield, Clock, Sparkles } from 'lucide-react';

// Test component without props first
export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

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

  const handleStartTalking = () => {
    console.log('Start talking clicked!');
    // Add your logic here
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Simplified background for debugging */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-teal-50">
        {/* Floating orbs */}
        <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-16">
            {/* Content Section - Centered */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="relative backdrop-blur-lg bg-white/40 rounded-3xl p-10 border border-white/30 shadow-2xl">
                
                {/* Main Headline */}
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                    You're Not
                    <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Alone
                    </span>
                  </h1>
                  <div className="h-8 mb-4">
                    <h2 className="text-xl md:text-2xl text-gray-600">
                      Meet Amara, <span className="text-purple-600 font-semibold">{typedText}</span>
                      <span className="animate-pulse">|</span>
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  When the world feels overwhelming, Amara is here. 
                  <span className="font-semibold text-purple-600"> Available instantly, completely private, and always understanding.</span>
                  <br />
                  <span className="text-gray-500 italic">No appointments. No judgment. Just support when you need it most.</span>
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 bg-white/30 rounded-xl p-3 backdrop-blur-sm">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 font-medium">100% Private</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/30 rounded-xl p-3 backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Always Available</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/30 rounded-xl p-3 backdrop-blur-sm">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-gray-700 font-medium">Judgment-Free</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/30 rounded-xl p-3 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    <span className="text-gray-700 font-medium">Instant Relief</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  <button 
                    onClick={handleStartTalking}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="relative flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Start Healing Today - It's Free
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-medium">
                      ✨ No sign-up required • Start talking in seconds • Completely anonymous
                    </p>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="mt-8 pt-6 border-t border-gray-200/30">
                  <div className="text-center mb-4">
                    <div className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-gray-600 italic mb-2">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <p className="text-sm text-purple-600 font-semibold">
                        - {testimonials[currentTestimonial].author}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">250K+</div>
                      <div className="text-sm text-gray-500">Lives Touched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">4.9★</div>
                      <div className="text-sm text-gray-500">User Love</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24/7</div>
                      <div className="text-sm text-gray-500">Here for You</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section - Moved below content */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="relative bg-white/50 backdrop-blur-sm border border-white/30 rounded-3xl overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <iframe
                        src={`https://www.youtube.com/embed/fz7sRsEEi20?autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&loop=1&playlist=fz7sRsEEi20&mute=${isMuted ? 1 : 0}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Meet Amara - Your AI Therapy Companion"
                      />
                    </div>
                  </div>
                </div>

                {/* Video controls */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                </div>

                {/* Video badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-purple-600">
                      Live Demo
                    </span>
                  </div>
                </div>

                {/* Video description */}
                <div className="mt-6 text-center bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <p className="text-purple-600 font-semibold mb-2 flex items-center justify-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Meet Your Compassionate AI Companion
                  </p>
                  <p className="text-sm text-gray-600">
                    Watch Amara introduce herself and discover how she provides the emotional support you deserve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 mb-3">
          <p className="text-purple-600 text-sm font-medium">
            Discover how Amara transforms lives ↓
          </p>
        </div>
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-purple-500 mx-auto" />
        </div>
      </div>
    </div>
  );
}