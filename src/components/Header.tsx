import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Leaders', href: '#leaders' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      setTimeout(() => {
        const headerHeight = 80; // Adjust for fixed header
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        console.log(`Navigating to ${href}`);
      }, 100); // Small delay for mobile menu close
    } else {
      console.warn(`Element ${href} not found`);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src={logo} 
                alt="Charty Events Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gradient-primary">
                Alnahd Charty Foundation
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Spread Kindness 
              </p>
            </div>
            {/* Location Button removed */}
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary cursor-pointer transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              onClick={() => handleNavClick('#donate')}
              className="btn-donate"
            >
              Donate Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`lg:hidden overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 shadow-lg">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block py-2 text-foreground hover:text-primary cursor-pointer transition-colors duration-200 font-medium"
                  whileHover={{ x: 10 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <div className="pt-4">
                <Button
                  onClick={() => handleNavClick('#donate')}
                  className="btn-donate w-full"
                >
                  Donate Now
                </Button>
              </div>
            </nav>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;