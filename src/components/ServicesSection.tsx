import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Stethoscope, Utensils, Home, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const services = [
    {
      icon: GraduationCap,
      title: 'Education Support',
      description: 'Providing quality education, school supplies, and scholarships to ensure every child has access to learning opportunities.',
      image: '/api/placeholder/400/300',
      features: ['School Supplies', 'Scholarships', 'Tutoring Programs', 'Digital Learning'],
    },
    {
      icon: Stethoscope,
      title: 'Healthcare Assistance',
      description: 'Delivering comprehensive healthcare services including medical checkups, treatments, and health education programs.',
      image: '/api/placeholder/400/300',
      features: ['Medical Checkups', 'Emergency Treatment', 'Health Education', 'Vaccination Programs'],
    },
    {
      icon: Utensils,
      title: 'Food Donation',
      description: 'Ensuring food security through nutritious meal programs, food distribution, and agricultural training initiatives.',
      image: '/api/placeholder/400/300',
      features: ['Daily Meals', 'Food Packages', 'Nutrition Education', 'Agricultural Training'],
    },
    {
      icon: Home,
      title: 'Orphanage Support',
      description: 'Creating safe, nurturing environments where orphaned children can grow, learn, and thrive in a loving community.',
      image: '/api/placeholder/400/300',
      features: ['Safe Housing', 'Caring Staff', 'Family Environment', 'Life Skills Training'],
    },
  ];

  const handleLearnMore = (service: string) => {
    // Could navigate to detailed service page or show modal
    console.log(`Learning more about ${service}`);
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
            Comprehensive support programs designed to transform lives and build stronger communities
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
                    onClick={() => handleLearnMore(service.title)}
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
              { number: '450', label: 'Students Educated', icon: BookOpen },
              { number: '1,200', label: 'Medical Treatments', icon: Stethoscope },
              { number: '25,000', label: 'Meals Provided', icon: Utensils },
              { number: '85', label: 'Children Housed', icon: Home },
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