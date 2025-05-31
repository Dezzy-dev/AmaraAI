import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Email submitted:', email);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-[#f8f5ff]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9d8cd4]/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5dbfbb]/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-center text-[#2d3748] mb-6">
                Want early access to voice therapy with Amara?
              </h2>
              <p className="text-lg text-center text-[#4a5568] mb-8">
                Join our waitlist to be among the first to experience our most advanced features.
              </p>
              
              {submitted ? (
                <div className="bg-[#5dbfbb]/10 text-[#5dbfbb] p-4 rounded-xl text-center">
                  <p className="font-medium">Thank you for joining our waitlist!</p>
                  <p className="text-sm mt-1">We'll notify you as soon as early access is available.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="flex-grow px-4 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9d8cd4]/50"
                    />
                    <button
                      type="submit"
                      className="bg-[#9d8cd4] hover:bg-[#8a7ac0] text-white px-6 rounded-r-full transition-colors duration-300 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;