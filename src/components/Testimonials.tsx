import React from 'react';

const Testimonials = () => {
  const testimonialsData = [
    {
      quote: "Amara helped me through an anxiety spiral at 2AM when I had no one else to talk to. The gentle guidance helped me find my center again.",
      name: "Jamie, 26",
      role: "Graduate Student",
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png"
    },
    {
      quote: "As someone who struggles with traditional therapy, Amara has been a game-changer. It helps me articulate feelings I couldn't even name before.",
      name: "Alex, 31", 
      role: "Software Engineer",
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png"
    },
    {
      quote: "I use Amara daily for emotional check-ins. It's helped me become more aware of my patterns and develop healthier coping strategies.",
      name: "Taylor, 28",
      role: "Healthcare Worker", 
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png"
    }
  ];

  return (
    <section id="testimonials" className="py-12 bg-[#f8f5ff] dark:bg-gray-900 sm:py-16 lg:py-20 transition-colors duration-300">
      <div className="container-responsive-wide">
        <div className="flex flex-col items-center">
          <div className="text-center animate-fade-in-up">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">
              What our users say about their journey with Amara
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl xl:text-5xl transition-colors duration-300">
              Real Moments, Real Healing
            </h2>
          </div>

          <div className="relative mt-10 md:mt-24 md:order-2">
            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
              <div 
                className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter animate-pulse" 
                style={{
                  background: "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)"
                }}
              ></div>
            </div>

            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-3">
              {testimonialsData.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`flex flex-col overflow-hidden shadow-xl animate-fade-in-up animate-delay-${(index + 2) * 200} opacity-0`}
                  style={{ animationFillMode: 'forwards' }}
                >
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white dark:bg-gray-800 lg:py-8 lg:px-7 transition-colors duration-300 hover:transform hover:scale-105 transition-transform">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <svg 
                            key={starIndex}
                            className="w-5 h-5 text-[#FDB241]" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <blockquote className="flex-1 mt-8">
                        <p className="text-lg leading-relaxed text-gray-900 dark:text-white transition-colors duration-300">
                          "{testimonial.quote}"
                        </p>
                      </blockquote>
                    </div>

                    <div className="flex items-center mt-8">
                      <img 
                        className="flex-shrink-0 object-cover rounded-full w-11 h-11" 
                        src={testimonial.avatar} 
                        alt={`${testimonial.name} avatar`} 
                      />
                      <div className="ml-4">
                        <p className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">
                          {testimonial.name}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;