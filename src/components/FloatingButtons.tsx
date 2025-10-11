import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { config } from '@/lib/config';
import { useContactForm } from '@/hooks/use-api';
import { useAIBot } from '@/hooks/use-api';

const FloatingButtons = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([
    { type: 'bot', message: `Hello! I'm the Charty Events AI assistant. How can I help you today?\n\nYou can also reach us at ${config.app.contactEmail} or via WhatsApp using the green button.` }
  ]);
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanForm, setHumanForm] = useState({ name: '', email: '', message: '' });
  const contactMutation = useContactForm();
  const aiBotMutation = useAIBot();

  const handleWhatsAppClick = () => {
    // Sanitize and validate number
    const raw = String(config.app.whatsappNumber || '');
    const digits = raw.replace(/[^0-9]/g, '');
    const isValid = /^[1-9][0-9]{7,14}$/.test(digits); // WhatsApp requires intl format without +
    const text = encodeURIComponent(config.app.whatsappMessage || '');

    if (!isValid) {
      console.warn('Invalid WhatsApp number configured. Expected international digits only, 8-15 length. Got:', raw);
      alert('WhatsApp number is not configured correctly. Please check VITE_WHATSAPP_NUMBER in your .env.');
      return;
    }

    const waLink = `https://wa.me/${digits}?text=${text}`;
    const apiLink = `https://api.whatsapp.com/send?phone=${digits}&text=${text}`;

    try {
      const win = window.open(waLink, '_blank');
      if (!win) {
        // Popup blocked; try navigating current tab
        window.location.href = waLink;
      }
    } catch (e) {
      // Fallback to api.whatsapp.com
      try {
        const win2 = window.open(apiLink, '_blank');
        if (!win2) {
          window.location.href = apiLink;
        }
      } catch {
        window.location.href = apiLink;
      }
    }
  };

  const handleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  const handleHumanFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!humanForm.name || !humanForm.email || !humanForm.message) {
      setChatHistory(prev => [...prev, { type: 'bot', message: 'Please fill your name, email and message.' }]);
      return;
    }
    contactMutation.mutate(
      { name: humanForm.name, email: humanForm.email, subject: 'Chat Support', message: humanForm.message },
      {
        onSuccess: (data: any) => {
          setChatHistory(prev => [
            ...prev,
            { type: 'user', message: `(Sent to team) ${humanForm.message}` },
            { type: 'bot', message: data?.message || 'Thanks! Our team received your message and will reply via email.' },
          ]);
          setHumanForm({ name: '', email: '', message: '' });
          setShowHumanForm(false);
        },
        onError: () => {
          setChatHistory(prev => [...prev, { type: 'bot', message: 'Sorry, failed to send. Please try again later or email ' + config.app.contactEmail }]);
        },
      }
    );
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    // Add user message
    const newHistory = [...chatHistory, { type: 'user' as const, message: chatMessage }];
    setChatHistory(newHistory);

    // Call AI bot API
    aiBotMutation.mutate(
      { message: chatMessage.trim() },
      {
        onSuccess: (data: any) => {
          setChatHistory(prev => [...prev, { type: 'bot', message: data.message }]);
        },
        onError: (error: any) => {
          console.error('[ai-bot] API call failed:', error);
          console.error('[ai-bot] Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
          });
          setChatHistory(prev => [
            ...prev,
            {
              type: 'bot',
              message: 'Sorry, I encountered an error. Please try again or contact us directly at ' + config.app.contactEmail
            }
          ]);
        },
      }
    );

    setChatMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat with us on WhatsApp"
        style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)' }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

    </>
  );
};

export default FloatingButtons;
