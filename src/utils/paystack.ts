interface PaystackConfig {
  key: string; // Public Key
  email: string;
  amount: number; // in kobo
  ref: string;
  metadata?: any;
  currency?: string;
  channels?: string[];
  onSuccess: (response: any) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

export const initializePaystack = (
  email: string,
  amount: number, // in kobo
  fullName: string,
  onSuccess: (response: any) => void,
  onClose: () => void
) => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Paystack public key is not set in environment variables.");
    alert("Payment service is not configured. Please contact support.");
    return;
  }

  if (!window.PaystackPop) {
    console.error("PaystackPop is not defined. Make sure the Paystack script is loaded.");
    alert("Payment gateway not loaded. Please try again later.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: email,
    amount: amount,
    ref: `amara-${Date.now()}`, // Generate a unique reference
    currency: 'NGN', // Set currency to Naira
    channels: ['card', 'bank_transfer', 'ussd', 'qr', 'mobile_money'], // Specify payment channels
    metadata: {
      full_name: fullName,
    },
    onClose: function() {
      onClose();
    },
    callback: function(response) {
      onSuccess(response);
    }
  });

  handler.openIframe();
};