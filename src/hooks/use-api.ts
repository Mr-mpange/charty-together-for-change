import { useMutation, useQuery } from '@tanstack/react-query';
import { apiService, ContactFormData, DonationData, ZenopayPaymentData, ZenopayCardPaymentData, ZenopayBankPaymentData, CurrencyConversionData, AIBotRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Mutation Hooks
export const useContactForm = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.submitContactForm,
    onSuccess: (data) => {
      toast({
        title: "Message Sent! 📧",
        description: data.message || "Thank you for contacting us. We'll get back to you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDonation = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: apiService.processDonation,
    onSuccess: (data) => {
      toast({
        title: "Thank You! 🎉",
        description: data.message || "Your donation will make a real difference in children's lives.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Donation Failed",
        description: error.response?.data?.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Zenopay Payment Hooks
export const useZenopayPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.initiateMobileMoneyPayment,
    onSuccess: (data) => {
      toast({
        title: "Payment Initiated! 📱",
        description: `Your ${data.data.displayAmount} payment has been initiated. You will receive a prompt on your phone.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useZenopayCardPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.initiateCardPayment,
    onSuccess: (data) => {
      toast({
        title: "Card Payment Initiated! 💳",
        description: `Your ${data.data.displayAmount} card payment has been initiated. Please complete the payment on the secure page.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Card Payment Failed",
        description: error.response?.data?.message || "Failed to initiate card payment. Please check your card details and try again.",
        variant: "destructive",
      });
    },
  });
};

export const useZenopayBankPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiService.initiateBankPayment,
    onSuccess: (data) => {
      toast({
        title: "Bank Payment Initiated! 🏦",
        description: `Your ${data.data.displayAmount} bank payment has been initiated. Please complete the transfer using the provided reference.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bank Payment Failed",
        description: error.response?.data?.message || "Failed to initiate bank payment. Please check your details and try again.",
        variant: "destructive",
      });
    },
  });
};

export const usePaymentStatus = (orderId: string) => {
  return useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: () => apiService.checkPaymentStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 5000, // Check every 5 seconds
  });
};

// Currency Conversion Hooks
export const useCurrencyRate = () => {
  return useQuery({
    queryKey: ['currency-rate'],
    queryFn: apiService.getCurrencyRate,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000, // Consider data fresh for 4 minutes
  });
};

export const useAIBot = () => {
  return useMutation({
    mutationFn: apiService.getAIBotResponse,
    onError: (error: any) => {
      console.error('[ai-bot] API call failed:', error);
    },
  });
};

