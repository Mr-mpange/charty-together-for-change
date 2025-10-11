import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Users, CreditCard, Smartphone, Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useDonation, useZenopayPayment } from '@/hooks/use-api';
import { config } from '@/lib/config';

const DonateSection = () => {
  const [selectedAmount, setSelectedAmount] = useState('125000');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [card, setCard] = useState<{ number: string; name: string; expiry: string; cvc: string }>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [mobile, setMobile] = useState<{ provider: string; phone: string }>({
    provider: 'M-Pesa',
    phone: '',
  });
  const [bank, setBank] = useState<{ reference: string }>({
    reference: '',
  });
  const [donorInfo, setDonorInfo] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const { toast } = useToast();
  const donationMutation = useDonation();
  const zenopayPaymentMutation = useZenopayPayment();

  // UI helpers - declared before useEffect
  const displayAmount = selectedAmount === 'custom' ? customAmount : selectedAmount;
  const displayAmountNumber = parseFloat(displayAmount || '0');
  const formattedAmount = isNaN(displayAmountNumber)
    ? '0'
    : displayAmountNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const getDisplayAmount = () => {
    return `${formattedAmount} TZS`;
  };

  const getConvertedDisplay = () => {
    return '';
  };

  const suggestedAmounts = [
    { amount: '25000', impact: 'Provides school supplies for 1 child' },
    { amount: '62500', impact: 'Feeds 5 children for a week' },
    { amount: '125000', impact: 'Supports medical care for 2 children' },
    { amount: '250000', impact: 'Sponsors 1 child\'s education for a month' },
    { amount: '625000', impact: 'Provides clean water access for a family' },
    { amount: '1250000', impact: 'Supports an entire classroom for a month' },
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

    if (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required donor information.",
        variant: "destructive",
      });
      return;
    }

    // Use Zenopay for mobile money payments
    if (paymentMethod === 'mobile') {
      // Validate required fields for mobile money payment
      if (!donorInfo.phone) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number for mobile money payment.",
          variant: "destructive",
        });
        return;
      }

      if (parseFloat(finalAmount) < 100) {
        toast({
          title: "Minimum Amount",
          description: "Minimum donation amount for mobile money is 100 TZS.",
          variant: "destructive",
        });
        return;
      }

      zenopayPaymentMutation.mutate({
        buyerName: `${donorInfo.firstName} ${donorInfo.lastName}`,
        buyerPhone: donorInfo.phone,
        buyerEmail: donorInfo.email,
        amount: parseFloat(finalAmount),
        currency: 'TZS',
        metadata: {
          donationType: donationType,
          message: donorInfo.message,
          provider: mobile.provider
        }
      }, {
        onSuccess: (data) => {
          console.log('Zenopay payment initiated successfully:', data);
          toast({
            title: "Payment Initiated! 📱",
            description: `Your ${data.data?.displayAmount || finalAmount + ' TZS'} payment has been initiated. You will receive a prompt on your phone.`,
          });

          // Reset form after successful initiation
          setSelectedAmount('125000');
          setCustomAmount('');
          setDonationType('one-time');
          setPaymentMethod('card');
          setCard({ number: '', name: '', expiry: '', cvc: '' });
          setMobile({ provider: 'M-Pesa', phone: '' });
          setBank({ reference: '' });
          setDonorInfo({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });
        },
        onError: (error: any) => {
          console.error('Zenopay payment failed:', error);
          const errorMessage = error.response?.data?.message ||
                              error.message ||
                              "Failed to initiate mobile money payment. Please check your details and try again.";

          toast({
            title: "Payment Failed",
            description: errorMessage,
            variant: "destructive",
          });
        },
      });
      return;
    }

    // For card and bank payments, use the legacy donation system (for now)
    // Build a simple payment detail summary
    let paymentSummary = '';
    if (paymentMethod === 'card') {
      paymentSummary = `Card ending ${card.number.slice(-4)} exp ${card.expiry}`;
    } else if (paymentMethod === 'mobile') {
      paymentSummary = `Mobile Money via ${mobile.provider} (${mobile.phone})`;
    } else if (paymentMethod === 'bank') {
      paymentSummary = `Bank Transfer (reference: ${bank.reference || 'n/a'})`;
    }

    const augmentedDonorInfo = {
      ...donorInfo,
      message: [donorInfo.message, paymentSummary].filter(Boolean).join(' | '),
    };

    // Submit to backend (stubbed processing)
    donationMutation.mutate({
      amount: parseFloat(finalAmount),
      type: donationType as 'one-time' | 'monthly',
      paymentMethod: paymentMethod as 'card' | 'mobile' | 'bank',
      donorInfo: augmentedDonorInfo,
    }, {
      onSuccess: (data) => {
        // Reset form on success
        setSelectedAmount('125000');
        setCustomAmount('');
        setDonationType('one-time');
        setPaymentMethod('card');
        setCard({ number: '', name: '', expiry: '', cvc: '' });
        setMobile({ provider: 'M-Pesa', phone: '' });
        setBank({ reference: '' });
        setDonorInfo({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      },
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
              {/* Currency Selection - Removed USD option */}
              <div>
                <Label className="text-lg font-semibold text-primary mb-4 block">
                  Currency
                </Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">All donations are in Tanzanian Shillings (TZS)</p>
                </div>
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
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
              selectedAmount === suggestion.amount
                ? 'border-primary bg-primary/10 text-primary shadow-md'
                : 'border-border hover:border-primary/50'
            }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xl font-bold">{suggestion.amount} TZS</div>
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
                    <Input
                      type="number"
                      placeholder="Enter amount in TSH"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount('custom');
                      }}
                      className=""
                      min="1"
                      step="0.01"
                    />
                    {displayAmountNumber > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        You will donate <span className="font-semibold">{getDisplayAmount()}</span>
                        {getConvertedDisplay() && (
                          <span className="block text-primary font-medium">
                            {getConvertedDisplay()}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
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

                {/* Method-specific UI */}
                <div className="mt-4 space-y-3">
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Card Number"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                      />
                      <Input
                        placeholder="Name on Card"
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                      />
                      <Input
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      />
                      <Input
                        placeholder="CVC"
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      />
                      <div className="md:col-span-2 text-xs text-muted-foreground">
                        This is a demo UI. No real card charge will be made.
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mobile' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        className="border rounded-md h-10 px-3"
                        value={mobile.provider}
                        onChange={(e) => setMobile({ ...mobile, provider: e.target.value })}
                      >
                        <option>M-Pesa</option>
                        <option>Tigo Pesa</option>
                        <option>Airtel Money</option>
                        <option>HaloPesa</option>
                      </select>
                      <Input
                        placeholder="Mobile Number"
                        value={mobile.phone}
                        onChange={(e) => setMobile({ ...mobile, phone: e.target.value })}
                      />
                      <div className="md:col-span-2 text-xs text-muted-foreground">
                        You may receive a prompt on your phone to authorize the payment.
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-2">
                      <div className="text-sm">Transfer to our bank account and include a reference. Contact us for details.</div>
                      <Input
                        placeholder="Your Transfer Reference (optional)"
                        value={bank.reference}
                        onChange={(e) => setBank({ ...bank, reference: e.target.value })}
                      />
                      <div className="text-xs text-muted-foreground">
                        After transferring, you can also email your receipt to donations@chartyevents.org for quicker confirmation.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-primary block">
                  Donor Information
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="First Name" 
                    value={donorInfo.firstName}
                    onChange={(e) => setDonorInfo({...donorInfo, firstName: e.target.value})}
                    required 
                  />
                  <Input 
                    placeholder="Last Name" 
                    value={donorInfo.lastName}
                    onChange={(e) => setDonorInfo({...donorInfo, lastName: e.target.value})}
                    required 
                  />
                </div>
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  required 
                />
                <Input 
                  placeholder="Phone Number" 
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                />
                <Textarea 
                  placeholder="Message (Optional)" 
                  rows={3}
                  value={donorInfo.message}
                  onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={donationMutation.isPending || zenopayPaymentMutation.isPending}
                className="w-full btn-donate text-lg py-4"
              >
                {donationMutation.isPending || zenopayPaymentMutation.isPending
                  ? 'Processing...'
                  : `Donate ${getDisplayAmount()} Now`}
              </Button>
              <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 mr-1" />
                {paymentMethod === 'mobile'
                  ? 'Real payments powered by Zenopay. You will receive a mobile prompt.'
                  : 'Payments are simulated for demo purposes. No charges will be made.'}
              </div>
            </form>
          </motion.div>

          {/* Donation Summary and Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Donation Summary (Sticky) */}
            <div className="bg-white rounded-2xl p-6 shadow-strong md:sticky md:top-24">
              <h3 className="text-2xl font-bold text-primary mb-4">Donation Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">{getDisplayAmount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{donationType.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium capitalize">{
                    paymentMethod === 'card' ? 'Card' : paymentMethod === 'mobile' ? 'Mobile Money' : 'Bank Transfer'
                  }</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Donor</span>
                  <span className="font-medium truncate max-w-[60%]">
                    {(donorInfo.firstName || donorInfo.lastName) ? `${donorInfo.firstName} ${donorInfo.lastName}`.trim() : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium truncate max-w-[60%]">{donorInfo.email || '—'}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">This summary updates as you fill the form.</div>
            </div>

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
                  <strong className="text-primary">62,500 TZS</strong> provides nutritious meals for 5 children for an entire week
                </div>
                <div className="p-3 bg-accent/5 rounded-lg">
                  <strong className="text-accent">250,000 TZS</strong> covers school fees, books, and supplies for one child for a month
                </div>
                <div className="p-3 bg-success/5 rounded-lg">
                  <strong className="text-success">625,000 TZS</strong> funds medical care and health checkups for 10 children
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-primary mb-4">Other Ways to Give</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Bank Transfer:</strong> Contact us for bank details</p>
                <p><strong>Mobile Money:</strong> {config.app.phone}</p>
                <p><strong>Email:</strong> {config.app.contactEmail}</p>
                <p><strong>Phone:</strong> {config.app.phone}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;