import { useToast } from "@/hooks/use-toast";

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (multiply Naira value by 100)
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export const initializePaystack = (config: PaystackConfig) => {
  // Create a random reference if not provided
  const reference =
    config.reference || `ref-${Math.floor(Math.random() * 1000000000)}`;

  // Create a new Paystack instance
  const handler = (window as any).PaystackPop?.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount, // In kobo
    ref: reference,
    metadata: config.metadata || {},
    callback: (response: any) => {
      config.onSuccess(response.reference);
    },
    onClose: () => {
      config.onCancel();
    },
  });

  // Open the payment modal
  if (handler) {
    handler.openIframe();
    return true;
  }

  return false;
};

export const usePaystackPayment = () => {
  const { toast } = useToast();

  const initiatePayment = (config: PaystackConfig) => {
    // Check if Paystack SDK is loaded
    if (!(window as any).PaystackPop) {
      toast({
        title: "Payment Error",
        description: "Payment provider not available. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    return initializePaystack(config);
  };

  return { initiatePayment };
};
