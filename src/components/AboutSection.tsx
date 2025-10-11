import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle, Users, Heart, Globe } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: 'Community Focused',
      description: 'We work directly with local communities to understand their needs and create lasting solutions.',
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Every program is designed with love and empathy, ensuring dignity and respect for all beneficiaries.',
    },
    {
      icon: Globe,
      title: 'Sustainable Impact',
      description: 'Our initiatives are built for long-term sustainability, creating lasting change for generations.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary">
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
            About Charity Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming lives across Tanzania through compassionate action and sustainable development
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Mission & Vision */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Mission */}
            <div className="card-service">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
              </div>
              <p className="text-foreground leading-relaxed">
                To empower orphaned children and vulnerable communities across Tanzania by providing 
                access to quality education, healthcare, nutritious food, and safe shelter. We believe 
                every child deserves the opportunity to thrive and reach their full potential.
              </p>
            </div>

            {/* Vision */}
            <div className="card-service">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-light rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
              </div>
              <p className="text-foreground leading-relaxed">
                A Tanzania where every child has access to basic necessities and opportunities for 
                growth, regardless of their background. We envision thriving communities that are 
                self-sufficient and empowered to create positive change.
              </p>
            </div>
          </motion.div>

          {/* Objectives */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Our Objectives</h3>
            
            {[
              'Provide quality education and learning resources to orphaned children',
              'Ensure access to healthcare services and medical support',
              'Deliver nutritious meals and food security programs',
              'Create safe and nurturing living environments',
              'Develop sustainable community empowerment initiatives',
              'Foster partnerships for long-term positive impact',
            ].map((objective, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                <p className="text-foreground leading-relaxed">{objective}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
            Why Choose Us?
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We combine passion with purpose to deliver meaningful impact in every community we serve
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="card-service text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">{feature.title}</h4>
                <p className="text-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-primary via-primary-light to-primary rounded-2xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '1,500+', label: 'Children Helped' },
              { number: '45', label: 'Communities Served' },
              { number: '12', label: 'Years of Service' },
              { number: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;