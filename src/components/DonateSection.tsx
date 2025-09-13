import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Users, DollarSign, CreditCard, Smartphone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const DonateSection = () => {
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();

  const suggestedAmounts = [
    { amount: '10', impact: 'Provides school supplies for 1 child' },
    { amount: '25', impact: 'Feeds 5 children for a week' },
    { amount: '50', impact: 'Supports medical care for 2 children' },
    { amount: '100', impact: 'Sponsors 1 child\'s education for a month' },
    { amount: '250', impact: 'Provides clean water access for a family' },
    { amount: '500', impact: 'Supports an entire classroom for a month' },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile', name: 'Mobile Money', icon: Smartphone },
    { id: 'bank', name: 'Bank Transfer', icon: Building },
  ];

  const impactStats = [
    { icon: Heart, number: '1,500+', label: 'Children Supported' },
    { icon: Shield, number: '98%', label: 'Funds to Programs' },
    { icon: Award, number: '15+', label: 'Years of Impact' },
    { icon: Users, number: '45', label: 'Communities Served' },
  ];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank You! 🎉",
      description: `Your ${donationType} donation of $${finalAmount} will make a real difference in children's lives.`,
    });

    // In a real app, this would process the payment
    console.log('Processing donation:', {
      amount: finalAmount,
      type: donationType,
      paymentMethod,
    });
  };

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-secondary to-background">
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
            Make a Donation
          </h2>
          <p className="text-2xl text-gradient-accent font-semibold mb-2">
            Your Support Makes a Difference
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every donation, no matter the size, helps us provide essential services to children and communities in need
          </p>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Donation Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-strong"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleDonate} className="space-y-6">
              {/* Donation Type */}
              <div>
                <Label className="text-lg font-semibold text-primary mb-4 block">
                  Donation Type
                </Label>
                <RadioGroup value={donationType} onValueChange={setDonationType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <Label htmlFor="one-time" className="cursor-pointer">One-time Donation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">Monthly Recurring</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Selection */}
              <div>
                <Label className="text-lg font-semibold text-primary mb-4 block">
                  Select Amount
                </Label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {suggestedAmounts.map((suggestion) => (
                    <motion.button
                      key={suggestion.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(suggestion.amount);
                        setCustomAmount('');
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        selectedAmount === suggestion.amount
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xl font-bold">${suggestion.amount}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {suggestion.impact}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="flex items-center space-x-3">
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">Other Amount</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex-1">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount('custom');
                        }}
                        className="pl-10"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="text-lg font-semibold text-primary mb-4 block">
                  Payment Method
                </Label>
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{method.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-primary block">
                  Donor Information
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" required />
                  <Input placeholder="Last Name" required />
                </div>
                <Input type="email" placeholder="Email Address" required />
                <Input placeholder="Phone Number" />
                <Textarea placeholder="Message (Optional)" rows={3} />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-donate text-lg py-4"
              >
                Donate ${selectedAmount === 'custom' ? customAmount || '0' : selectedAmount} Now
              </Button>
            </form>
          </motion.div>

          {/* Donation Impact & Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Donate to Charty Events?</h3>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: '98% of donations go directly to programs' },
                  { icon: Award, text: 'Certified transparent charity organization' },
                  { icon: Users, text: 'Direct community impact with measurable results' },
                  { icon: Heart, text: 'Over 15 years of trusted service' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impact Examples */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-primary mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <strong className="text-primary">$25</strong> provides nutritious meals for 5 children for an entire week
                </div>
                <div className="p-3 bg-accent/5 rounded-lg">
                  <strong className="text-accent">$100</strong> covers school fees, books, and supplies for one child for a month
                </div>
                <div className="p-3 bg-success/5 rounded-lg">
                  <strong className="text-success">$250</strong> funds medical care and health checkups for 10 children
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-primary mb-4">Other Ways to Give</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Bank Transfer:</strong> Contact us for bank details</p>
                <p><strong>Mobile Money:</strong> +255 123 456 789</p>
                <p><strong>Email:</strong> donations@chartyevents.org</p>
                <p><strong>Phone:</strong> +255 123 456 789</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;