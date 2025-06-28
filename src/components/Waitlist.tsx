import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-[#f8f5ff] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-gray-900/40 border-0 dark:border dark:border-gray-700 p-8 md:p-12 relative overflow-hidden transition-colors duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9d8cd4]/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5dbfbb]/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-center text-[#2d3748] dark:text-white transition-colors duration-300 mb-6 opacity-0 animate-fade-in-up">
                Want early access to voice therapy with Amara?
              </h2>
              <p className="text-lg text-center text-[#4a5568] dark:text-gray-300 transition-colors duration-300 mb-8 opacity-0 animate-fade-in-up animate-delay-200">
                Join our waitlist to be among the first to experience our most advanced features.
              </p>
              
              {submitted ? (
                <div className="bg-[#5dbfbb]/10 dark:bg-[#5dbfbb]/20 text-[#5dbfbb] p-4 rounded-xl text-center transition-colors duration-300 opacity-0 animate-fade-in-up animate-delay-300">
                  <p className="font-medium">Thank you for joining our waitlist!</p>
                  <p className="text-sm mt-1">We'll notify you as soon as early access is available.</p>
                </div>
              ) : (
                <div className="max-w-md mx-auto opacity-0 animate-fade-in-up animate-delay-300">
                  <form onSubmit={handleSubmit}>
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="flex-grow px-4 py-3 rounded-l-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d8cd4]/50 transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      className="bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white px-6 rounded-r-full transition-colors duration-300 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 transition-colors duration-300 mt-3">
                    We respect your privacy and will never share your information.
                  </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;