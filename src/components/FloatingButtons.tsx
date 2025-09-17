import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { config } from '@/lib/config';
import { useContactForm } from '@/hooks/use-api';

const FloatingButtons = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([
    { type: 'bot', message: `Hello! I'm the Charty Events AI assistant. How can I help you today?\n\nYou can also reach us at ${config.app.contactEmail} or via WhatsApp using the green button.` }
  ]);
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanForm, setHumanForm] = useState({ name: '', email: '', message: '' });
  const contactMutation = useContactForm();

  const getBotReply = (raw: string): string => {
    const msg = raw.toLowerCase();
    const email = config.app.contactEmail;
    const phone = config.app.phone;
    const whatsapp = config.app.whatsappNumber;

    if (msg.includes('email') || msg.includes('mail')) {
      return `You can contact us via email at ${email}. We typically reply within 24 hours.`;
    }
    if (msg.includes('phone') || msg.includes('call') || msg.includes('mobile')) {
      return `You can call us at ${phone}. For quick chat, tap the green WhatsApp button.`;
    }
    if (msg.includes('whatsapp') || msg.includes('wa')) {
      return `Tap the green WhatsApp button at the bottom-right or open https://wa.me/${whatsapp} to chat with us.`;
    }
    if (msg.includes('location') || msg.includes('where') || msg.includes('address')) {
      return `We are located in Dar es Salaam, Tanzania. See the map in the Contact section for details.`;
    }
    if (msg.includes('donate') || msg.includes('support')) {
      return `Thank you for your kindness! Visit the Donate section on our site or write to ${email} for donation guidance.`;
    }
    if (msg.includes('hours') || msg.includes('time') || msg.includes('open')) {
      return `Our office hours are Monday to Friday, 8:00 AM – 6:00 PM (EAT).`;
    }
    return `Thanks! I've noted your message. If you need direct support, email ${email} or use WhatsApp (green button).`;
  };

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

    // Simulate AI response (rule-based). In a real app, call your AI API here.
    const reply = getBotReply(chatMessage);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'bot', message: reply }]);
    }, 600);

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

      {/* AI Bot Floating Button */}
      {config.app.aiBotEnabled && (
        <motion.button
          onClick={handleAIChat}
          className="fixed bottom-6 right-24 md:right-24 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Chat with our AI Assistant"
          style={{ boxShadow: '0 4px 20px rgba(147, 51, 234, 0.4)' }}
        >
          <Bot className="w-7 h-7" />
        </motion.button>
      )}
      {/* AI Chat Window */}
      <AnimatePresence>
        {config.app.aiBotEnabled && showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
            style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-90">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm break-words whitespace-pre-wrap ${
                      chat.type === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {chat.message}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Human Toggle */}
            <div className="px-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Need a real person?</div>
                <button
                  onClick={() => setShowHumanForm(v => !v)}
                  className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                >
                  {showHumanForm ? 'Close' : 'Contact Human'}
                </button>
              </div>
            </div>

            {/* Contact Human Form */}
            {showHumanForm && (
              <form onSubmit={handleHumanFormSubmit} className="px-4 pb-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Your name"
                    value={humanForm.name}
                    onChange={(e) => setHumanForm({ ...humanForm, name: e.target.value })}
                    className="h-9"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={humanForm.email}
                    onChange={(e) => setHumanForm({ ...humanForm, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <Input
                  placeholder="Your message to our team"
                  value={humanForm.message}
                  onChange={(e) => setHumanForm({ ...humanForm, message: e.target.value })}
                  className="h-9"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={contactMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                    {contactMutation.isPending ? 'Sending…' : 'Send to Team'}
                  </Button>
                </div>
              </form>
            )}

            {/* Quick Replies */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {['Email','Phone','WhatsApp','Location','Donate','Hours'].map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      setChatMessage(label);
                      setTimeout(() => handleSendMessage(), 0);
                    }}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message and press Enter..."
                  className="flex-1 h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default FloatingButtons;
