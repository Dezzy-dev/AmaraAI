import React, { useState, useEffect } from 'react';
import { Phone, ExternalLink, AlertCircle, Heart, Shield, Users, Baby, Stethoscope, ChevronDown, ChevronUp, ChevronLeft, Moon, Sun, MessageCircle, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useDarkMode } from '../hooks/useDarkMode';

const CRISIS_SECTIONS = [
  {
    heading: 'Suicide Prevention & Depression',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    resources: [
      { label: 'Nigeria: Crisis Helpline', value: '112 or 767 (24/7)', link: 'tel:112', isEmergency: true },
      { label: 'US: National Suicide Prevention Lifeline', value: '988', link: 'tel:988', web: 'https://988lifeline.org' },
      { label: 'UK: Samaritans', value: '08457 90 90 90', link: 'tel:08457909090', web: 'https://samaritans.org' },
      { label: 'Canada: Suicide Prevention', value: '', link: '', web: 'https://suicideprevention.ca' },
      { label: 'Australia: Lifeline', value: '13 11 14', link: 'tel:131114', web: 'https://lifeline.org.au' },
    ],
  },
  {
    heading: 'Substance Abuse & Recovery',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    resources: [
      { label: 'Nigeria: NDLEA Drug Help', value: '0800 1020 3040', link: 'tel:080010203040', web: 'https://ndlea.gov.ng' },
      { label: "US: SAMHSA's National Helpline", value: '1-800-662-4357', link: 'tel:18006624357', web: 'https://samhsa.gov/find-help/national-helpline' },
      { label: 'US: Alcohol Crisis Intervention', value: '1-800-234-0246', link: 'tel:18002340246' },
      { label: 'US: National Cocaine Hotline', value: '1-800-262-2463', link: 'tel:18002622463' },
      { label: "US: Al-Anon/Alateen", value: '1-800-344-2666', link: 'tel:18003442666', web: 'https://al-anon.org' },
      { label: 'UK: Drinkline', value: '0800 917 8282', link: 'tel:08009178282' },
      { label: 'Australia: Drug Info', value: '1800 250 015', link: 'tel:1800250015' },
    ],
  },
  {
    heading: 'Abuse & Domestic Violence',
    icon: Shield,
    color: 'from-purple-500 to-indigo-500',
    resources: [
      { label: 'Nigeria: DSVRT', value: '112', link: 'tel:112', web: 'https://dsvrtlagos.org' },
      { label: 'US: Childhelp', value: '1-800-422-4453', link: 'tel:18004224453', web: 'https://childhelp.org' },
      { label: 'US: Domestic Violence Hotline', value: '1-800-799-7233', link: 'tel:18007997233', web: 'https://thehotline.org' },
      { label: 'US: Sexual Assault Hotline', value: '1-800-656-4673', link: 'tel:18006564673', web: 'https://rainn.org' },
      { label: 'UK: Women\'s Aid', value: '0808 2000 247', link: 'tel:08082000247', web: 'https://womensaid.org.uk' },
      { label: 'Australia: 1800RESPECT', value: '1800 737 732', link: 'tel:1800737732', web: 'https://1800respect.org.au' },
    ],
  },
  {
    heading: 'LGBTQ+ Support',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    resources: [
      { label: 'Nigeria: Initiative for Equal Rights', value: '', link: '', web: 'https://theinitiativeforequalrights.org' },
      { label: 'US: GLBT National Center', value: '1-888-843-4564', link: 'tel:18888434564', web: 'https://glbthotline.org' },
      { label: 'UK: Galop LGBT Helpline', value: '0800 999 5428', link: 'tel:08009995428', web: 'https://galop.org.uk' },
      { label: 'Canada: PFLAG', value: '1-888-530-6777', link: 'tel:18885306777', web: 'https://pflagcanada.ca' },
      { label: 'Australia: QLife', value: '1800 184 527', link: 'tel:1800184527', web: 'https://qlife.org.au' },
    ],
  },
  {
    heading: 'Sexual Health & Pregnancy',
    icon: Baby,
    color: 'from-orange-500 to-amber-500',
    resources: [
      { label: 'Nigeria: Marie Stopes', value: '0800 00 22252', link: 'tel:08000022252', web: 'https://mariestopes.org.ng' },
      { label: 'US: Planned Parenthood', value: '1-800-230-7526', link: 'tel:18002307526', web: 'https://plannedparenthood.org' },
      { label: 'US: National AIDS Hotline', value: '1-800-342-2437', link: 'tel:18003422437' },
      { label: 'US: Teen AIDS Hotline', value: '1-800-440-8336', link: 'tel:18004408336' },
    ],
  },
  {
    heading: 'Medical Emergencies',
    icon: Stethoscope,
    color: 'from-red-600 to-rose-500',
    resources: [
      { label: 'Nigeria: Emergency Services', value: '112 or 767', link: 'tel:112', isEmergency: true },
      { label: 'US: Poison Help', value: '1-800-222-1222', link: 'tel:18002221222', web: 'https://poison.org' },
    ],
  },
];

const ADDITIONAL_RESOURCES = [
  { label: 'ULifeline', web: 'https://ulifeline.org', desc: 'College student resources and self-assessment tools' },
  { label: 'Alcoholics Anonymous', web: 'https://aa.org', desc: 'Recovery community for alcohol addiction' },
  { label: 'Narcotics Anonymous', web: 'https://na.org', desc: 'Recovery community for drug addiction' },
  { label: 'Self-Mutilators Anonymous', web: 'https://selfmutilatorsanonymous.org', desc: 'Support for self-harm recovery' },
];

const INFO_RESOURCES = [
  { label: 'NIMH', web: 'https://nimh.nih.gov', desc: 'Mental health information and research' },
  { label: 'NIH', web: 'https://nih.gov', desc: 'Comprehensive health information' },
  { label: 'MedlinePlus', web: 'https://medlineplus.gov', desc: 'Drug and treatment information' },
];

const ResourceCard = ({ section, index }: { section: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const IconComponent = section.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
        <div 
          className={`bg-gradient-to-r ${section.color} p-6 cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">{section.heading}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm opacity-80">{section.resources.length} resources</span>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
            </div>
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="p-6 space-y-4">
            {section.resources.map((resource: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{resource.label}</div>
                  {resource.value && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">{resource.value}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {resource.link && (
                    <a
                      href={resource.link}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        resource.isEmergency 
                          ? 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {resource.web && (
                    <a
                      href={resource.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-full transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CrisisResources = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const { userData } = useUser();
  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    setHeaderVisible(true);
  }, []);

  // Navigation handler
  const handleBack = () => {
    // Custom event for AppContent to listen and handle navigation
    const event = new CustomEvent('navigate', {
      detail: {
        view: userData && userData.isAuthenticated ? 'dashboard' : 'landing',
      },
    });
    window.dispatchEvent(event);
  };

  // Dark mode toggle handler
  const handleToggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100`}>
      {/* Top Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>
        <button
          onClick={handleToggleDark}
          className="inline-flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
          <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
      {/* Emergency Alert */}
      <div className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <strong>Emergency:</strong> If you're in immediate danger, call{' '}
            <a href="tel:112" className="underline font-bold hover:text-red-200 transition-colors">112</a> or{' '}
            <a href="tel:767" className="underline font-bold hover:text-red-200 transition-colors">767</a> now
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            You're Not Alone
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Professional support is available 24/7. These resources are free, confidential, and staffed by trained professionals who care.
          </p>
          
          {/* Chat with Amara Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                const event = new CustomEvent('navigate', {
                  detail: { view: 'session' },
                });
                window.dispatchEvent(event);
              }}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              aria-label="Start a chat session with Amara"
            >
              <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Chat with Amara for Immediate Support
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Get immediate emotional support and guidance from your AI therapy companion
            </p>
          </div>
        </div>

        {/* Crisis Sections */}
        <div className="space-y-8 mb-16">
          {CRISIS_SECTIONS.map((section, index) => (
            <ResourceCard key={section.heading} section={section} index={index} />
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Support Communities</h2>
            <div className="space-y-4">
              {ADDITIONAL_RESOURCES.map((resource: any, idx: number) => (
                <div key={idx} className="group">
                  <a
                    href={resource.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div>
                      <div className="font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">{resource.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resource.desc}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Health Information</h2>
            <div className="space-y-4">
              {INFO_RESOURCES.map((resource: any, idx: number) => (
                <div key={idx} className="group">
                  <a
                    href={resource.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div>
                      <div className="font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">{resource.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resource.desc}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This page provides educational resources only. For professional mental health support, please contact a licensed provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisResources