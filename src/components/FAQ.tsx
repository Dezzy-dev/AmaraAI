import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is AMARA, and how does it work?",
    answer: "AMARA is an AI-powered mental health companion. It lets you anonymously vent, express your thoughts, and get reflective, supportive responses from an empathetic AI."
  },
  {
    question: "Is AMARA a replacement for therapy?",
    answer: "No. AMARA is not a licensed therapist. It provides emotional support, but it doesn't replace professional mental health care or diagnosis."
  },
  {
    question: "Can AMARA diagnose mental health conditions?",
    answer: "No. AMARA cannot diagnose, treat, or prescribe. It's a supportive AI for talking through your feelings — not a clinical tool."
  },
  {
    question: "How does AMARA personalize its advice?",
    answer: "AMARA uses AI to understand your emotions, tone, and the topics you bring up — offering personalized responses that match your mood and mental state, while keeping things anonymous."
  },
  {
    question: "Can I use AMARA if I'm already seeing a therapist?",
    answer: "Yes. AMARA can be a helpful support tool alongside therapy. It gives you a private space to reflect and vent between sessions."
  },
  {
    question: "Will AMARA judge me or give biased advice?",
    answer: "Never. AMARA is built to be non-judgmental and unbiased. It's a safe space — no shame, no pressure, just you and your thoughts."
  },
  {
    question: "What should I do if I'm experiencing a crisis?",
    answer: "AMARA is not a crisis tool. If you are in immediate danger or distress, please contact a licensed professional or emergency service in your country."
  },
  {
    question: "What kind of issues can AMARA help with?",
    answer: "AMARA supports you through stress, anxiety, relationship issues, self-doubt, loneliness, and more. Whether you want to vent or seek clarity, AMARA listens."
  },
  {
    question: "Does AMARA provide advice, or is it just for venting?",
    answer: "Both. You can just talk, or ask AMARA for advice, calming techniques, or thought prompts. It's your space — AMARA responds based on your needs."
  },
  {
    question: "What's included in the free version of AMARA?",
    answer: "The free version lets you send up to 8 messages. After that, you'll need to upgrade to continue chatting."
  },
  {
    question: "How much does AMARA cost?",
    answer: "After the free trial, AMARA Premium costs $15.99 and gives you unlimited access to chat anytime, with full support features unlocked."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime via your account or billing settings. No long process, no hidden fees — just full control in your hands."
  }
];

const FAQ: React.FC = () => {
  // Use an array to track each item's state individually instead of a single openIndex
  const [openStates, setOpenStates] = useState<boolean[]>(new Array(faqs.length).fill(false));

  const toggleItem = (index: number) => {
    setOpenStates(prevStates => {
      const newStates = new Array(faqs.length).fill(false); // Close all first
      newStates[index] = !prevStates[index]; // Then toggle the clicked one
      return newStates;
    });
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="faq">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white mb-4 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300">
            Find answers to common questions about Amara and how it can support you
          </p>
        </div>

        {/* Changed from grid to flex column to eliminate any grid-related issues */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={`faq-${index}`} // More explicit key
              className={`bg-[#f8f5ff] dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-all duration-300 border-0 dark:border dark:border-gray-700 opacity-0 animate-fade-in-up animate-delay-${200 + (index * 50)}`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(`Clicked FAQ ${index}`); // Debug log
                  toggleItem(index);
                }}
                className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#9d8cd4] focus:ring-opacity-50 rounded-t-2xl"
                type="button"
              >
                <h3 className="text-[#2d3748] dark:text-white font-medium pr-8 transition-colors duration-300">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openStates[index] ? (
                    <Minus className="w-5 h-5 text-[#9d8cd4]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#9d8cd4]" />
                  )}
                </div>
              </button>
              
              {/* Simple conditional rendering instead of complex animations */}
              {openStates[index] && (
                <div className="px-6 pb-4 animate-fade-in">
                  <p className="text-[#4a5568] dark:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FAQ;