import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Stethoscope, Utensils, Home, BookOpen, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      icon: GraduationCap,
      title: 'School Equipment Support',
      description: 'Providing essential educational materials including books, supplies, uniforms, and learning equipment to ensure every child has access to quality education.',
      image: '/api/placeholder/400/300',
      features: ['School Supplies', 'Books & Materials', 'Uniforms', 'Learning Equipment'],
      details: 'Our School Equipment Support program has helped over 500 students in the last year by providing necessary tools for learning.',
    },
    {
      icon: Utensils,
      title: 'Food Assistance Program',
      description: 'Delivering nutritious meals and food packages to families and communities in need, ensuring no one goes hungry in our areas of operation.',
      image: '/api/placeholder/400/300',
      features: ['Daily Meals', 'Food Packages', 'Nutrition Education', 'Emergency Food Aid'],
      details: 'We distribute over 1,000 food packages monthly, focusing on nutritious options for families.',
    },
    {
      icon: Heart,
      title: 'Support & Comfort Services',
      description: 'Offering emotional support, counseling, and comfort to vulnerable individuals and families during difficult times and challenging circumstances.',
      image: '/api/placeholder/400/300',
      features: ['Emotional Support', 'Counseling Services', 'Community Care', 'Family Assistance'],
      details: 'Our counseling services have supported 200+ families this year.',
    },
    {
      icon: BookOpen,
      title: 'Environmental Conservation',
      description: 'Promoting environmental awareness, clean-up initiatives, and sustainable practices to protect our communities and natural resources.',
      image: '/api/placeholder/400/300',
      features: ['Tree Planting', 'Clean-up Drives', 'Environmental Education', 'Sustainability Programs'],
      details: 'Planted 1,000 trees and educated 300 students on sustainability.',
    },
  ];

  const handleLearnMore = (service) => {
    setSelectedService(service);
  };

  return (
    <section id="services" className="py-20 bg-background">
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
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Alnahd Charity Foundation provides targeted assistance programs that address the most critical needs in our communities
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="card-service h-full flex flex-col">
                  {/* Service Icon & Title */}
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary group-hover:text-primary-light transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-foreground leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-primary mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-accent" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleLearnMore(service)}
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    Learn More
                  </Button>      
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Simple Modal for Service Details */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-primary">{selectedService.title}</h3>
                <button onClick={() => setSelectedService(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-foreground mb-4">{selectedService.description}</p>
              <p className="text-muted-foreground mb-4">{selectedService.details}</p>
              <Button onClick={() => setSelectedService(null)} className="w-full">Close</Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="mt-20 text-center bg-gradient-to-r from-accent/10 to-accent-light/10 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your support helps us expand these vital services to reach more children and communities in need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                const element = document.querySelector('#donate');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-donate text-lg px-8 py-3"
            >
              Support Our Services
            </Button>
            <Button
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary text-lg px-8 py-3"
            >
              Get Involved
            </Button>
          </div>
        </motion.div>

        {/* Service Impact */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
            Our Impact This Year
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '320', label: 'Students Supported', icon: BookOpen },
              { number: '850', label: 'Food Packages Distributed', icon: Utensils },
              { number: '15,000', label: 'Meals Provided', icon: Utensils },
              { number: '120', label: 'Families Assisted', icon: Heart },
            ].map((impact, index) => {
              const Icon = impact.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-xl bg-white shadow-soft"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {impact.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{impact.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;