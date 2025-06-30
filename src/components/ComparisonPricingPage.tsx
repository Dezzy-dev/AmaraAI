import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Shield, 
  MessageCircle, 
  Brain, 
  BarChart3, 
  Calendar,
  DollarSign,
  Zap,
  Heart,
  Sparkles,
  Star
} from 'lucide-react';
import useUser from '../contexts/useUser';

interface ComparisonPricingPageProps {
  onStartFreeTrial: (planType: 'monthly' | 'yearly') => void;
  onBack: () => void;
}

const ComparisonPricingPage: React.FC<ComparisonPricingPageProps> = ({
  onStartFreeTrial,
  onBack
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isVisible, setIsVisible] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const monthlyPrice = 19.99;
  const yearlyPrice = 159.99;
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  // Check if user has trialed before and is on freemium
  const hasTrialedBefore = userData?.isAuthenticated && userData?.hasEverTrialed && userData?.currentPlan === 'freemium';

  const comparisonData = [
    {
      category: "Cost",
      amara: "Affordable Subscription",
      traditional: "High Cost Per Session",
      amaraIcon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
      traditionalIcon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
      amaraColor: "text-green-600",
      traditionalColor: "text-red-600"
    },
    {
      category: "Availability",
      amara: "24/7, On-Demand, Instant Access",
      traditional: "Scheduled Appointments, Limited Hours",
      amaraIcon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
      traditionalIcon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
      amaraColor: "text-green-600",
      traditionalColor: "text-orange-600"
    },
    {
      category: "Accessibility",
      amara: "Anywhere with Internet",
      traditional: "Location-Dependent, Travel Required",
      amaraIcon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />,
      traditionalIcon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />,
      amaraColor: "text-green-600",
      traditionalColor: "text-orange-600"
    },
    {
      category: "Privacy & Comfort",
      amara: "Private, Non-Judgmental AI, Anonymous",
      traditional: "In-Person, Potential Social Stigma",
      amaraIcon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      traditionalIcon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      amaraColor: "text-green-600",
      traditionalColor: "text-yellow-600"
    },
    {
      category: "Tools & Features",
      amara: "AI Insights, Journaling, Mood Tracking",
      traditional: "Talk Therapy, Homework Assignments",
      amaraIcon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
      traditionalIcon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      amaraColor: "text-green-600",
      traditionalColor: "text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-pink-200/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Choose Your Journey
              </h1>
            </div>
            
            <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200 dark:border-purple-700 mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                Your Path to Accessible Well-being
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Amara vs. Traditional Therapy
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Discover the unique benefits Amara offers, designed to fit your life and budget while providing meaningful support.
            </p>
          </div>

          {/* Comparison Section */}
          <div className={`mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12 px-4">
              A New Approach to Mental Wellness
            </h2>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comparison</h3>
                </div>
                <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-purple-600 mr-2" fill="currentColor" />
                    <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Amara</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">AI Therapy Companion</p>
                </div>
                <div className="p-6 text-center border-l border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Traditional Therapy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In-Person Sessions</p>
                </div>
              </div>

              {/* Comparison Rows */}
              {comparisonData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors duration-200">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.category}</h4>
                  </div>
                  <div className="p-6 border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className={`${item.amaraColor} mt-0.5`}>
                        {item.amaraIcon}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.amara}</span>
                    </div>
                  </div>
                  <div className="p-6 border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className={`${item.traditionalColor} mt-0.5`}>
                        {item.traditionalIcon}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.traditional}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 sm:space-y-6">
              {comparisonData.map((item, index) => (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                      {item.category}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Amara */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Heart className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" />
                          <h4 className="font-semibold text-purple-600 dark:text-purple-400">Amara</h4>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`${item.amaraColor} mt-0.5`}>
                            {item.amaraIcon}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.amara}</span>
                        </div>
                      </div>
                      
                      {/* Traditional */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Traditional Therapy</h4>
                        <div className="flex items-start space-x-3">
                          <div className={`${item.traditionalColor} mt-0.5`}>
                            {item.traditionalIcon}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.traditional}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 px-4">
                {hasTrialedBefore ? 'Choose Your Plan' : 'Choose Your Plan: Start Your 7-Day Free Trial'}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                {hasTrialedBefore ? 'Continue with premium features' : 'No credit card required during trial • Cancel anytime'}
              </p>
            </div>

            {/* Plan Selection */}
            <div className="max-w-4xl mx-auto grid gap-6 sm:gap-8 md:grid-cols-2">
              {/* Yearly Plan */}
              <div 
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedPlan === 'yearly' 
                    ? 'border-purple-500 ring-4 ring-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => setSelectedPlan('yearly')}
              >
                {/* Most Popular Badge */}
                {!hasTrialedBefore && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-full flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly Plan</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">${yearlyPrice}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">/year</span>
                    </div>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-sm sm:text-base">
                      Equals ${yearlyMonthlyEquivalent.toFixed(2)}/month
                    </p>
                    <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs sm:text-sm font-medium mt-2">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Save {savings}% (2 Months Free!)
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-6">
                    {[
                      'Unlimited conversations with Amara',
                      'Voice therapy sessions',
                      'Advanced mood tracking & insights',
                      'Personal journal integration',
                      'Priority support & new features',
                      'Export your data anytime'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedPlan === 'yearly' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              </div>

              {/* Monthly Plan */}
              <div 
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedPlan === 'monthly' 
                    ? 'border-purple-500 ring-4 ring-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Plan</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">${monthlyPrice}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">/month</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      Billed monthly
                    </p>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-6">
                    {[
                      'Unlimited conversations with Amara',
                      'Voice therapy sessions',
                      'Advanced mood tracking & insights',
                      'Personal journal integration',
                      'Priority support & new features',
                      'Export your data anytime'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedPlan === 'monthly' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8 sm:mt-12 px-4">
              <button
                onClick={() => onStartFreeTrial(selectedPlan)}
                className="group relative inline-flex items-center px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"></div>
                
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                
                <span className="relative flex items-center justify-center w-full sm:w-auto">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse" fill="currentColor" />
                  <span className="text-center">
                    {hasTrialedBefore ? 'Subscribe Now' : 'Start Your 7 Days Free Trial'}
                  </span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:animate-spin" />
                </span>
              </button>
              
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                {hasTrialedBefore 
                  ? `${selectedPlan === 'yearly' 
                      ? `$${yearlyMonthlyEquivalent.toFixed(2)}/month (billed annually at $${yearlyPrice})`
                      : `$${monthlyPrice}/month`
                    }`
                  : `Then ${selectedPlan === 'yearly' 
                      ? `${yearlyMonthlyEquivalent.toFixed(2)}/month (billed annually at $${yearlyPrice})`
                      : `$${monthlyPrice}/month`
                    }`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ComparisonPricingPage;