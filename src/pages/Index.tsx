import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import LeadersSection from '@/components/LeadersSection';
import GallerySection from '@/components/GallerySection';
import DonateSection from '@/components/DonateSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <LeadersSection />
        <GallerySection />
        <DonateSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
