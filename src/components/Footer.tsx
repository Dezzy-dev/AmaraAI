import React from 'react';
import { MessageSquareText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2d3748] dark:bg-gray-950 text-white pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-white/10 dark:bg-[#9d8cd4]/20 p-2 rounded-full transition-colors duration-300">
                <MessageSquareText className="w-6 h-6 text-[#9d8cd4]" />
              </div>
              <h2 className="ml-2 text-xl font-medium text-white dark:text-white transition-colors duration-300">Amara</h2>
            </div>
            <p className="text-gray-400 dark:text-gray-300 transition-colors duration-300">
              AMARA is built to help people feel heard without fear or shame.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-white transition-colors duration-300">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">How It Works</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-white transition-colors duration-300">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white dark:text-white transition-colors duration-300">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Cookies</a></li>
              <li><a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 dark:border-gray-600 pt-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">
              © 2025 Amara – AI Therapy Companion. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">
                Powered by GPT-4 and ElevenLabs voice AI | Built for the Bolt Hackathon
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;