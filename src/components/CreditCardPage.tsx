import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface CreditCardPageProps {
  selectedPlan: 'monthly' | 'yearly';
  onSuccess: () => void;
  onBack: () => void;
}

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  nameOnCard: string;
}

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  nameOnCard?: string;
}

const CreditCardPage: React.FC<CreditCardPageProps> = ({
  selectedPlan,
  onSuccess,
  onBack
}) => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nameOnCard: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Plan pricing
  const planPricing = {
    monthly: { price: 19.99, period: 'month' },
    yearly: { price: 159.99, period: 'year', monthlyEquivalent: 13.33 }
  };

  const currentPlan = planPricing[selectedPlan];

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validation functions
  const validateCardNumber = (cardNumber: string): string | undefined => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!cleanNumber) return 'Card number is required';
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return 'Invalid card number length';
    if (!/^\d+$/.test(cleanNumber)) return 'Card number must contain only digits';
    return undefined;
  };

  const validateExpiryDate = (expiryDate: string): string | undefined => {
    if (!expiryDate) return 'Expiry date is required';
    const [month, year] = expiryDate.split('/');
    if (!month || !year) return 'Invalid expiry date format';
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return 'Invalid month';
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'Card has expired';
    }
    return undefined;
  };

  const validateCVC = (cvc: string): string | undefined => {
    if (!cvc) return 'CVC is required';
    if (cvc.length < 3 || cvc.length > 4) return 'CVC must be 3 or 4 digits';
    if (!/^\d+$/.test(cvc)) return 'CVC must contain only digits';
    return undefined;
  };

  const validateNameOnCard = (name: string): string | undefined => {
    if (!name.trim()) return 'Name on card is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear payment error
    if (paymentError) {
      setPaymentError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      cardNumber: validateCardNumber(formData.cardNumber),
      expiryDate: validateExpiryDate(formData.expiryDate),
      cvc: validateCVC(formData.cvc),
      nameOnCard: validateNameOnCard(formData.nameOnCard)
    };

    // Remove undefined errors
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setPaymentError('');

    // DEMO LOGIC - DO NOT USE IN PRODUCTION
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    
    // Demo success condition
    if (cleanCardNumber === '4111222233334444') {
      // Simulate successful payment
      setIsLoading(false);
      onSuccess();
    } else {
      // Simulate payment failure
      setIsLoading(false);
      setPaymentError('Payment failed. Please check your card details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Activate Your 7-Day Free Trial
              </h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full border border-green-200 dark:border-green-700 mb-6">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Secure & Encrypted
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Activate Your 7-Day Free Trial
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Just one more step to unlock full access. No charges for 7 days.
            </p>
            
            <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Lock className="w-4 h-4 mr-2" />
              Your payment information is secure and encrypted
            </div>
          </div>

          {/* Plan Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan Summary</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {selectedPlan} Plan
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  7-day free trial, then ${currentPlan.price}/{currentPlan.period}
                  {selectedPlan === 'yearly' && (
                    <span className="text-green-600 dark:text-green-400 ml-2">
                      (${currentPlan.monthlyEquivalent}/month)
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $0.00
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Today
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Information
              </h2>
            </div>

            {paymentError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">Payment Failed</p>
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">{paymentError}</p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-2">
                    Demo tip: Use card number 4111 2222 3333 4444 for successful payment
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.cardNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cardNumber}</p>
                )}
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.expiryDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.cvc ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.cvc && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cvc}</p>
                  )}
                </div>
              </div>

              {/* Name on Card */}
              <div>
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name on Card
                </label>
                <input
                  id="nameOnCard"
                  type="text"
                  value={formData.nameOnCard}
                  onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.nameOnCard ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.nameOnCard && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nameOnCard}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Start My Free Trial
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trial Confirmation & Disclaimer */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Trial Terms
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>
                By clicking "Start My Free Trial", you agree to our{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Privacy Policy
                </a>.
              </p>
              <p>
                After 7 days, you will be charged ${currentPlan.price}/{currentPlan.period} unless you cancel.
              </p>
              <p>
                You can cancel anytime from your account settings. No questions asked.
              </p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Demo Mode:</strong> This is a demonstration. Use card number <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">4111 2222 3333 4444</code> for successful payment simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPage;