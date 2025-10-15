import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useContactForm } from '@/hooks/use-api';
import { config } from '@/lib/config';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();
  const contactMutation = useContactForm();

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: config.app.contactEmail,
      subdeta: 'We respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: config.app.phone,
      subdeta: 'Mon-Fri, 8:00 AM - 6:00 PM EAT',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Magomeni, Dar es Salaam, Tanzania',
      subdeta: 'East Africa Regional Office',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Monday - Friday',
      subdeta: '8:00 AM - 6:00 PM (EAT)',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: config.social.facebook, label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: config.social.twitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: config.social.linkedin, label: 'LinkedIn', color: 'hover:text-blue-800' },
    { icon: Instagram, href: config.social.instagram, label: 'Instagram', color: 'hover:text-pink-600' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Submit to backend
    contactMutation.mutate(formData, {
      onSuccess: () => {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      },
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary">
            Contact Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us to learn more about our programs, volunteer opportunities, or to discuss partnerships
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-strong"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this regarding?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="mt-1"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full btn-hero text-lg py-4 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{contactMutation.isPending ? 'Sending...' : 'Send Message'}</span>
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Contact Cards */}
            <div className="grid gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary mb-1">
                        {info.title}
                      </h4>
                      <p className="text-foreground font-medium">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.subdeta}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Google Map */}
            <motion.div
              className="bg-white rounded-xl shadow-soft overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-64 relative">
                <iframe
                  src="https://www.google.com/maps?q=Magomeni%2C%20Dar%20es%20Salaam%2C%20Tanzania&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Charty Events Location - Magomeni, Dar es Salaam, Tanzania"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-primary text-sm">Our Office</h4>
                      <p className="text-xs text-muted-foreground">Magomeni, Dar es Salaam, Tanzania</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-soft"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-semibold text-primary mb-4">
                Follow Our Journey
              </h4>
              <p className="text-muted-foreground mb-4">
                Stay connected with our daily activities and impact stories on social media.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-colors duration-200 ${social.color}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-primary text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: 'How can I volunteer with Charty Events?',
                answer: 'Contact us directly or visit our office to discuss volunteer opportunities. We have programs for both local and international volunteers.',
              },
              {
                question: 'Where do my donations go?',
                answer: '98% of donations go directly to our programs. We provide detailed reports on how funds are used to support children and communities.',
              },
              {
                question: 'Can I visit your programs?',
                answer: 'Yes! We welcome visits from donors and partners. Please contact us in advance to arrange a visit to our programs and facilities.',
              },
              {
                question: 'Do you accept corporate partnerships?',
                answer: 'We actively seek corporate partnerships. Contact us to discuss how your organization can support our mission and create mutual value.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">{faq.question}</h4>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default ContactSection;