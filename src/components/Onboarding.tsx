import React, { useState } from 'react';
import { Heart, Shield, Mic, ChevronLeft, ChevronRight, Lock, UserCheck, Headphones, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  concerns: string[];
  preferredTime: string;
  hasUsedTherapy: boolean | null;
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    concerns: [],
    preferredTime: '',
    hasUsedTherapy: null,
  });

  const concerns = [
    { id: 'anxiety', label: 'Anxiety & Worry', emoji: '😰' },
    { id: 'stress', label: 'Stress Management', emoji: '😤' },
    { id: 'depression', label: 'Feeling Down', emoji: '😔' },
    { id: 'relationships', label: 'Relationships', emoji: '💔' },
    { id: 'worklife', label: 'Work/Life Balance', emoji: '⚖️' },
    { id: 'sleep', label: 'Sleep Issues', emoji: '😴' },
    { id: 'confidence', label: 'Self-Confidence', emoji: '💪' },
    { id: 'other', label: 'Something Else', emoji: '💭' },
  ];

  const timePreferences = [
    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'evening', label: 'Evening (5 PM - 10 PM)' },
    { value: 'night', label: 'Night (10 PM - 6 AM)' },
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleConcern = (concernId: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concernId)
        ? prev.concerns.filter(id => id !== concernId)
        : [...prev.concerns, concernId]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Welcome to Amara</h2>
            <p className="text-slate-300 text-center">Let's personalize your experience</p>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">What brings you here today?</h2>
            <p className="text-slate-300 text-center">Select all that apply</p>
            <div className="grid grid-cols-2 gap-4">
              {concerns.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => toggleConcern(concern.id)}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.concerns.includes(concern.id)
                      ? 'bg-purple-600/20 border-purple-600'
                      : 'bg-slate-800 border-slate-700 hover:border-purple-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{concern.emoji}</div>
                  <div className="text-white text-sm">{concern.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Your Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-2">When do you prefer to have sessions?</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  {timePreferences.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Have you used therapy before?</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, hasUsedTherapy: true })}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      formData.hasUsedTherapy === true
                        ? 'bg-purple-600/20 border-purple-600'
                        : 'bg-slate-800 border-slate-700 hover:border-purple-600/50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, hasUsedTherapy: false })}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      formData.hasUsedTherapy === false
                        ? 'bg-purple-600/20 border-purple-600'
                        : 'bg-slate-800 border-slate-700 hover:border-purple-600/50'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Privacy & Trust</h2>
            <p className="text-slate-300 text-center">Your safety and privacy are our top priorities</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <Lock className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="text-white font-medium mb-1">End-to-End Encryption</h3>
                <p className="text-slate-300 text-sm">Your conversations are fully encrypted</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <UserCheck className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="text-white font-medium mb-1">Anonymous Sessions</h3>
                <p className="text-slate-300 text-sm">No personal data required</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <Headphones className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="text-white font-medium mb-1">Crisis Support</h3>
                <p className="text-slate-300 text-sm">24/7 emergency assistance</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <AlertCircle className="w-6 h-6 text-indigo-600 mb-2" />
                <h3 className="text-white font-medium mb-1">HIPAA Compliant</h3>
                <p className="text-slate-300 text-sm">Healthcare privacy standards</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Ready to Start</h2>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h3 className="text-white font-medium mb-4">Session Summary</h3>
              <div className="space-y-2 text-slate-300">
                <p>Name: {formData.name}</p>
                <p>Focus Areas: {formData.concerns.map(c => 
                  concerns.find(con => con.id === c)?.label
                ).join(', ')}</p>
                <p>Preferred Time: {timePreferences.find(t => t.value === formData.preferredTime)?.label}</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                Start Voice Session
              </button>
              <button className="w-full py-3 px-4 bg-transparent border border-slate-700 rounded-lg text-white font-medium hover:bg-slate-800 transition-colors">
                Video Session
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className={`flex items-center text-slate-300 hover:text-white transition-colors ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <button
            onClick={handleNext}
            className={`flex items-center text-purple-600 hover:text-purple-500 transition-colors ${
              step === 5 ? 'invisible' : ''
            }`}
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;