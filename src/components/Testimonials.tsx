import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "Amara helped me through an anxiety spiral at 2AM when I had no one else to talk to. The gentle guidance helped me find my center again.",
    name: "Jamie, 26",
    role: "Graduate Student"
  },
  {
    quote: "As someone who struggles with traditional therapy, Amara has been a game-changer. It helps me articulate feelings I couldn't even name before.",
    name: "Alex, 31",
    role: "Software Engineer"
  },
  {
    quote: "I use Amara daily for emotional check-ins. It's helped me become more aware of my patterns and develop healthier coping strategies.",
    name: "Taylor, 28",
    role: "Healthcare Worker"
  },
  {
    quote: "The privacy aspect was huge for me. I can be completely honest without worrying about judgment, which has led to real breakthroughs.",
    name: "Morgan, 34",
    role: "Marketing Director"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#f8f5ff] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d3748] dark:text-white transition-colors duration-300 mb-4">Real Moments, Real Healing</h2>
          <p className="text-lg text-[#4a5568] dark:text-gray-300 transition-colors duration-300">What our users say about their journey with Amara.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-md dark:shadow-gray-900/20 flex items-center justify-center text-[#6b5ca5] dark:text-[#9d8cd4] hover:text-[#9d8cd4] transition-colors duration-300 pointer-events-auto"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-md dark:shadow-gray-900/20 flex items-center justify-center text-[#6b5ca5] dark:text-[#9d8cd4] hover:text-[#9d8cd4] transition-colors duration-300 pointer-events-auto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/40 border-0 dark:border dark:border-gray-700 p-8 md:p-10 transition-colors duration-300">
                      <div className="mb-6">
                        <svg width="45" height="36" className="text-[#9d8cd4]/30" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27H18V36H13.5C2.69687 36 0 25.2 0 25.2V36H9V27C9 19.5442 2.95584 13.5 -4.5 13.5V4.5C4.5 4.5 13.5 -0.000000 13.5 -0.000000L13.5 0ZM40.5 0C33.0442 0 27 6.04416 27 13.5C27 20.9558 33.0442 27 40.5 27H45V36H40.5C29.6969 36 27 25.2 27 25.2V36H36V27C36 19.5442 29.9558 13.5 22.5 13.5V4.5C31.5 4.5 40.5 -0.000000 40.5 -0.000000L40.5 0Z"/>
                        </svg>
                      </div>
                      <p className="text-xl text-[#2d3748] dark:text-white transition-colors duration-300 mb-8 italic">{testimonial.quote}</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#9d8cd4]/10 dark:bg-[#9d8cd4]/20 rounded-full flex items-center justify-center text-[#9d8cd4]">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-[#2d3748] dark:text-white transition-colors duration-300">{testimonial.name}</h4>
                          <p className="text-sm text-[#6b7280] dark:text-gray-400 transition-colors duration-300">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
                  index === activeIndex ? 'bg-[#9d8cd4]' : 'bg-[#9d8cd4]/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}