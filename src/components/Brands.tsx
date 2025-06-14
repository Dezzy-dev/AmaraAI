import React from 'react';

export function Brands() {
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
    <section className="py-12 bg-white dark:bg-gray-900 sm:py-16 lg:py-20 overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="xl:flex xl:items-center xl:justify-between animate-fade-up">
          <h2 className="text-xl font-bold text-center text-gray-400 dark:text-gray-500 xl:text-left animate-slide-in-left">
            Our mission echoes global conversations around mental wellness and AI
          </h2>

          <div className="grid items-center grid-cols-1 mt-10 gap-y-6 xl:mt-0 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-8">
            {brands.map((brand, index) => (
              <div 
                key={brand.name}
                className={`group animate-fade-in-up animate-delay-${(index + 1) * 200}`}
              >
                <div className="flex items-center justify-center w-full h-16 px-4 bg-white rounded-md shadow-sm dark:bg-white">
                  <img 
                    className="object-contain max-h-10 w-auto transition-all duration-300 transform group-hover:scale-105 group-hover:opacity-90" 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-center text-gray-400 dark:text-gray-600">
            *Displayed logos represent platforms that discuss AI in mental wellness. This does not imply direct coverage of Amara.*
          </p>
        </div>
      </div>
    </section>
  );
}
