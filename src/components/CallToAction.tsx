import React from 'react';
import { MessageSquareText, ExternalLink } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#9d8cd4] to-[#6695e2]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Try Amara Now</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Experience the comfort of always having someone to talk to, no matter the time or place.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-[#6b5ca5] rounded-full font-medium shadow-lg shadow-[#6b5ca5]/20 transition-all duration-300 flex items-center">
              <MessageSquareText className="mr-2 w-5 h-5" />
              Talk to Amara
            </button>
            <button className="px-8 py-4 bg-[#6b5ca5]/20 hover:bg-[#6b5ca5]/30 text-white rounded-full font-medium transition-all duration-300 flex items-center">
              <ExternalLink className="mr-2 w-5 h-5" />
              Try Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;