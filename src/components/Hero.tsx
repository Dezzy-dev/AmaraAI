import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, MessageSquareText, ChevronDown, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
      });
    }
  }, []);

  // Auto-play video when it loads (muted for browser compatibility)
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsVideoPlaying(true);
        } catch (error) {
          console.log('Autoplay prevented by browser:', error);
          setShowVideoControls(true);
        }
      };
      
      setTimeout(playVideo, 1000);
    }
  }, [videoLoaded]);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setShowVideoControls(true);
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPlaying(true);
      setShowVideoControls(false);
    }
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
              <MessageSquareText className="w-8 h-8 text-[#9d8cd4]" />
            </div>
            <h2 className="ml-3 text-xl font-medium text-[#6b5ca5] dark:text-[#9d8cd4]">Amara</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Content Section */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="relative backdrop-blur-custom bg-white/30 dark:bg-gray-900/30 rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d3748] dark:text-white mb-4 leading-tight opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
                  Meet Amara
                </h1>
                <h2 className="text-xl md:text-2xl text-[#6b5ca5] dark:text-[#9d8cd4] mb-4 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
                  Your AI therapy companion who truly listens
                </h2>
                <p className="text-lg md:text-xl text-[#4a5568] dark:text-gray-300 mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
                  Available 24/7, completely anonymous, and designed to provide the support you deserve without judgment.
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_0.4s_forwards]">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#9d8cd4] rounded-full"></div>
                    <span className="text-[#4a5568] dark:text-gray-300">100% Anonymous</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#5dbfbb] rounded-full"></div>
                    <span className="text-[#4a5568] dark:text-gray-300">Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#9d8cd4] rounded-full"></div>
                    <span className="text-[#4a5568] dark:text-gray-300">No Judgment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#5dbfbb] rounded-full"></div>
                    <span className="text-[#4a5568] dark:text-gray-300">Instant Support</span>
                  </div>
                </div>

                {/* Enhanced CTAs */}
                <div className="flex flex-wrap gap-6 justify-center lg:justify-start opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
                  <div className="flex flex-col items-center lg:items-start">
                    <button className="px-8 py-4 bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white rounded-full font-medium shadow-lg transition-all duration-300 flex items-center group hover:scale-105 animate-glow">
                      Start Talking with Amara
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[15px] text-[#4a5568]/80 dark:text-gray-400 mt-3 font-medium">
                      No sign-up needed. Start in seconds.
                    </p>
                  </div>
                  <button 
                    onClick={toggleVideoPlayback}
                    className="px-8 py-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#6b5ca5] dark:text-[#9d8cd4] rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 flex items-center"
                  >
                    {isVideoPlaying ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                    {isVideoPlaying ? 'Pause Video' : 'Watch Introduction'}
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 border-t border-gray-200/30 dark:border-gray-700/30 pt-6 opacity-0 animate-[fadeIn_0.6s_ease-out_0.9s_forwards]">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center lg:text-left">
                    <div>
                      <div className="text-2xl font-bold text-[#9d8cd4]">100K+</div>
                      <div className="text-sm text-[#4a5568] dark:text-gray-400">Conversations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#5dbfbb]">4.9★</div>
                      <div className="text-sm text-[#4a5568] dark:text-gray-400">User Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#9d8cd4]">24/7</div>
                      <div className="text-sm text-[#4a5568] dark:text-gray-400">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="flex-1 max-w-2xl opacity-0 animate-[fadeIn_0.6s_ease-out_0.5s_forwards]">
              <div className="relative">
                {/* Video Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#9d8cd4]/10 to-[#5dbfbb]/10 backdrop-blur-sm border border-white/20 dark:border-gray-800/20">
                  {/* Video Element */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#9d8cd4]/5 to-[#5dbfbb]/5">
                    {!videoLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-[#9d8cd4]/30 border-t-[#9d8cd4] rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-[#6b5ca5] dark:text-[#9d8cd4] font-medium">Loading Amara...</p>
                        </div>
                      </div>
                    )}
                    
                    <video
                      ref={videoRef}
                      className="w-full h-full rounded-lg"
                      muted={isVideoMuted}
                      onEnded={handleVideoEnd}
                      playsInline
                    >
                      <source src="https://player.vimeo.com/progressive_redirect/playback/824804225/rendition/720p/file.mp4?loc=external&signature=4d6e0c1f1f49f56784e844680694c1d2f7d51d5c25a85a320f9f0c3d7e4f5c7a" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <button
                      onClick={toggleVideoPlayback}
                      className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-[#6b5ca5] dark:text-[#9d8cd4] hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleVideoMute}
                      className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-[#6b5ca5] dark:text-[#9d8cd4] hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      {isVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Video Info Badge */}
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
                <div className="mt-6 text-center">
                  <p className="text-[#6b5ca5] dark:text-[#9d8cd4] font-medium mb-2">
                    👋 Say hello to your AI therapy companion
                  </p>
                  <p className="text-sm text-[#4a5568] dark:text-gray-400">
                    Watch Amara introduce herself and learn how she can support your mental wellness journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
}