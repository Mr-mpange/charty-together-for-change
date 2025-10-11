import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import hero images
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
import hero4 from '@/assets/hero-4.jpg';
import hero5 from '@/assets/hero-5.jpg';
import hero6 from '@/assets/hero-6.jpg';
import hero7 from '@/assets/hero-7.jpg';
import hero8 from '@/assets/hero-8.jpg';
import hero9 from '@/assets/hero-9.jpg';
import hero10 from '@/assets/hero-10.jpg';

const heroImages = [
  { src: hero1, alt: 'Children learning in classroom' },
  { src: hero2, alt: 'Healthcare workers providing medical care' },
  { src: hero3, alt: 'Volunteers distributing food' },
  { src: hero4, alt: 'Children playing at orphanage' },
  { src: hero5, alt: 'Community well construction' },
  { src: hero6, alt: 'School supplies distribution' },
  { src: hero7, alt: 'Elderly care center' },
  { src: hero8, alt: 'Agricultural training program' },
  { src: hero9, alt: 'Mobile health clinic' },
  { src: hero10, alt: 'Vocational training center' },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    heroImages.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        setNextImage((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 250); // Faster transition
    }, 15000); // Longer interval

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
      setNextImage((prev) => (prev + 1) % heroImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      setNextImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <motion.img
            key={`current-${currentImage}`}
            src={heroImages[currentImage].src}
            alt={heroImages[currentImage].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 1 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.img
            key={`next-${nextImage}`}
            src={heroImages[nextImage].src}
            alt={heroImages[nextImage].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/30 via-primary/20 to-primary-light/10" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentImage(index);
                setNextImage((index + 1) % heroImages.length);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentImage ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Alnahd Charity{' '}
          <span className="text-gradient-accent bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            Foundation
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Providing Essential Assistance Through School Equipment, Food Support, Comfort & Environmental Care
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => handleNavClick('#donate')}
            className="btn-donate text-lg px-8 py-4"
          >
            Donate Now
          </Button>
          <Button
            onClick={() => handleNavClick('#about')}
            className="btn-secondary text-lg px-8 py-4"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Quick Highlights */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { title: 'School Equipment', icon: '📚' },
            { title: 'Food Support', icon: '🥖' },
            { title: 'Comfort & Care', icon: '💙' },
            { title: 'Environment', icon: '🌱' },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <h3 className="font-semibold text-white">{service.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;