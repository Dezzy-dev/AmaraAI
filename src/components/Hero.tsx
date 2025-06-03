import React, { useState } from 'react';
import { ChevronRight, MessageSquareText, ChevronDown, Volume2, VolumeX, Heart, Shield, Clock } from 'lucide-react';

interface HeroProps {
  onStartTalking: () => void;
}

export default function Hero({ onStartTalking }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-12 overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5ff] via-[#edf7ff] to-[#f0fdff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3619518/pexels-photo-3619518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] bg-cover bg-center opacity-10 dark:opacity-5 backdrop-blur-sm"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-[#9d8cd4] opacity-10 dark:opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-[#5dbfbb] opacity-10 dark:opacity-15 blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
            <MessageSquareText className="w-8 h-8 text-[#9d8cd4]" />
          </div>
          <h2 className="ml-3 text-2xl font-semibold text-[#6b5ca5] dark:text-[#9d8cd4]">Amara</h2>
        </div>

        {/* Main Content Section */}
        <div className="text-center mb-16">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2d3748] dark:text-white mb-6 leading-tight opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
            You're Not{' '}
            <span className="bg-gradient-to-r from-[#9d8cd4] via-[#8a7ac0] to-[#5dbfbb] bg-clip-text text-transparent">
              Alone
            </span>
          </h1>

          {/* Simplified Subtitle */}
          <h2 className="text-2xl md:text-3xl text-[#6b5ca5] dark:text-[#9d8cd4] mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards] max-w-3xl mx-auto">
            Meet your AI therapy companion who truly understands
          </h2>

          {/* Clean Description */}
          <p className="text-xl md:text-2xl text-[#4a5568] dark:text-gray-300 mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_0.4s_forwards] max-w-4xl mx-auto leading-relaxed">
            Professional support available instantly.{' '}
            <span className="font-semibold text-[#9d8cd4]">Private, caring, and always here</span>{' '}
            when you need someone to talk to.
          </p>

          {/* CTA Button */}
          <div className="mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_0.5s_forwards]">
            <button 
              onClick={onStartTalking}
              className="group px-10 py-5 bg-gradient-to-r from-[#9d8cd4] to-[#8a7ac0] hover:from-[#8a7ac0] hover:to-[#7a6bb3] text-white text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[#9d8cd4]/25"
            >
              <div className="flex items-center justify-center">
                <Heart className="w-6 h-6 mr-3" />
                Start Talking with Amara
                <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <p className="text-sm text-[#4a5568] dark:text-gray-400 mt-4 font-medium">
              ✨ No sign-up required • Start in seconds • Completely anonymous
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
            {[
              { icon: Shield, text: '100% Private', color: '[#9d8cd4]' },
              { icon: Clock, text: 'Available 24/7', color: '[#5dbfbb]' },
              { icon: Heart, text: 'Judgment-Free', color: '[#9d8cd4]' }
            ].map(({ icon: Icon, text, color }) => (
              <div
                key={text}
                className="flex items-center space-x-3 px-6 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-white/30 dark:border-gray-700/30 shadow-lg"
              >
                <Icon className={`w-5 h-5 text-${color}`} />
                <span className="font-medium text-[#4a5568] dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center gap-12 mb-16 opacity-0 animate-[fadeIn_0.6s_ease-out_0.7s_forwards]">
            {[
              { value: '100K+', label: 'Conversations', color: '[#9d8cd4]' },
              { value: '4.9★', label: 'User Rating', color: '[#5dbfbb]' },
              { value: '24/7', label: 'Available', color: '[#9d8cd4]' }
            ].map(({ value, label, color }) => (
              <div key={label} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold text-${color} mb-1`}>
                  {value}
                </div>
                <div className="text-sm text-[#4a5568] dark:text-gray-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section - Below Content */}
        <div className="max-w-4xl mx-auto opacity-0 animate-[fadeIn_0.6s_ease-out_0.8s_forwards]">
          <div className="relative">
            {/* Video Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#9d8cd4]/10 to-[#5dbfbb]/10 backdrop-blur-sm border border-white/20 dark:border-gray-800/20">
              <div className="relative aspect-video bg-gradient-to-br from-[#9d8cd4]/5 to-[#5dbfbb]/5">
                <iframe
                  src={`https://www.youtube.com/embed/fz7sRsEEi20?autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&loop=1&playlist=fz7sRsEEi20&mute=${isMuted ? 1 : 0}`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Meet Amara - AI Therapy Companion"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-[#6b5ca5] dark:text-[#9d8cd4]" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#6b5ca5] dark:text-[#9d8cd4]" />
                )}
              </button>
            </div>

            {/* Video Badge */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#6b5ca5] dark:text-[#9d8cd4]">
                  Meet Amara
                </span>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-8 text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
            <p className="text-[#6b5ca5] dark:text-[#9d8cd4] font-semibold mb-2 flex items-center justify-center text-lg">
              <Heart className="w-5 h-5 mr-2" />
              Say hello to your compassionate AI companion
            </p>
            <p className="text-[#4a5568] dark:text-gray-400">
              Watch Amara introduce herself and discover how she provides the emotional support you deserve
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeIn_0.6s_ease-out_1s_forwards] text-center">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 dark:border-gray-700/30 mb-3">
          <p className="text-[#6b5ca5] dark:text-[#9d8cd4] text-sm font-medium">
            Discover how Amara transforms lives ↓
          </p>
        </div>
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#9d8cd4]" />
        </div>
      </div>
    </section>
  );
}