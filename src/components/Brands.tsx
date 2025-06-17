import React, { useState, useEffect } from 'react';

export function Brands() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('brands-section');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  const brands = [
    {
      name: "NBC News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/NBC_News_%282023%29.svg"
    },
    {
      name: "USA Today",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fe/USA_Today_%282020-01-29%29.svg"
    },
    {
      name: "CBS News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/dc/CBS_News_logo_%282020%29.svg"
    },
    {
      name: "FOX News",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Fox_News_Channel_logo.svg"
    }
  ];

  return (
    <section id="brands-section" className="relative py-16 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Animated headline */}
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Global Recognition</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Conversations about 
              <span className="relative mx-2">
                <span className="relative bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI wellness
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 animate-scale-in" style={{ animationDelay: '0.8s', animationDuration: '0.6s', animationFillMode: 'forwards' }}></div>
              </span>
              echo globally
            </h2>
          </div>
        </div>

        {/* Animated logos grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 max-w-5xl mx-auto">
          {brands.map((brand, index) => (
            <div 
              key={brand.name}
              className={`group transform transition-all duration-700 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-12 opacity-0 scale-95'
              }`}
              style={{ 
                transitionDelay: `${300 + index * 150}ms` 
              }}
            >
              <div className="relative">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl transform scale-110"></div>
                
                {/* Logo container */}
                <div className="relative flex items-center justify-center h-20 px-6 bg-white dark:bg-white backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-500 group-hover:border-purple-200/50 dark:group-hover:border-purple-700/50 group-hover:-translate-y-1">
                  <img 
                    className="max-h-8 w-auto object-contain transition-all duration-500 group-hover:scale-105" 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated disclaimer */}
        <div className={`mt-12 text-center transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="inline-flex items-start gap-2 px-4 py-3 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30 max-w-2xl">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left leading-relaxed">
              Displayed logos represent platforms discussing AI in mental wellness. 
              <br className="hidden sm:block" />
              This does not imply direct coverage of Amara.
            </p>
          </div>
        </div>

        {/* Floating elements for subtle movement */}
        <div className="absolute top-8 left-8 w-4 h-4 bg-purple-200/30 dark:bg-purple-600/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-blue-200/30 dark:bg-blue-600/20 rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '3s' }}></div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default Brands;