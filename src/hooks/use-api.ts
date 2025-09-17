import { useMutation } from '@tanstack/react-query';
import { apiService, ContactFormData, DonationData } from '@/lib/api';
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

