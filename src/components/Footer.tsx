import React from 'react';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-8 sm:py-12 lg:py-16">
      <div className="container-responsive-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Logo & Description - Responsive */}
          <div className="sm:col-span-2 text-center sm:text-left">
            <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
              <span 
                className="text-xl sm:text-2xl lg:text-3xl font-light text-white"
                style={{
                  fontFamily: 'serif',
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                𝒜𝓂𝒶𝓇𝒶
              </span>
            </div>
            <p className="text-gray-400 dark:text-gray-300 leading-relaxed max-w-md mx-auto sm:mx-0 text-sm sm:text-base lg:text-lg">
              Your AI therapy companion, designed to provide emotional support 
              and help you heal, anytime you need it.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 justify-center sm:justify-start">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span>Available 24/7 • Private & Secure</span>
            </div>
          </div>

          {/* Quick Links - Responsive */}
          <div className="text-center sm:text-left">
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300 text-xs sm:text-sm lg:text-base">
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Contact Us</a></li>
            </ul>
          </div>

          {/* Support - Responsive */}
          <div className="text-center sm:text-left">
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">Support</h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-300 text-xs sm:text-sm lg:text-base">
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 crisis-info touch-target">Crisis Resources</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Find a Therapist</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 touch-target">Feedback</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Responsive */}
        <div className="border-t border-gray-800 dark:border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
            <div className="text-gray-400 dark:text-gray-300 text-xs sm:text-sm lg:text-base">
              © 2025 Amara – AI Therapy Companion. All rights reserved.
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">
              <span>Powered by GPT-4 and ElevenLabs voice AI</span>
              <span className="hidden sm:inline">•</span>
              <span>Built for the Bolt Hackathon</span>
            </div>
          </div>

          {/* Disclaimer - Responsive */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 lg:p-6 bg-gray-800 dark:bg-gray-900/50 rounded-lg border border-gray-700/50">
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 dark:text-gray-300 leading-relaxed crisis-info">
              <strong>Important:</strong> Amara is designed to provide emotional support and is not a replacement for professional mental health treatment. 
              If you're experiencing a mental health crisis, please contact your local emergency services or a crisis helpline immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}