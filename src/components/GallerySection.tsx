import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Calendar, MapPin } from 'lucide-react';

// Import gallery images
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';
import gallery9 from '@/assets/gallery-9.jpg';
import gallery10 from '@/assets/gallery-10.jpg';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 7,
      image: gallery1,
      title: 'School Equipment Distribution',
      category: 'Education',
      date: 'December 2024',
      location: 'Dar es Salaam',
      description: 'Distributing essential school supplies, books, and learning materials to students in need across multiple schools.'
    },
    {
      id: 2,
      image: gallery2,
      title: 'Community Food Program',
      category: 'Food Support',
      date: 'November 2024',
      location: 'Mwanza Region',
      description: 'Our monthly food assistance program providing nutritious food packages to vulnerable families in the community.'
    },
    {
      id: 3,
      image: gallery1,
      title: 'Environmental Clean-up Drive',
      category: 'Environment',
      date: 'October 2024',
      location: 'Dodoma City',
      description: 'Community members joined together for our environmental conservation initiative, cleaning up public spaces and planting trees.'
    },
    // {
    //   id: 3,
    //   image: gallery3,
    //   title: 'Environmental Clean-up Drive',
    //   category: 'Environment',
    //   date: 'October 2024',
    //   location: 'Dodoma City',
    //   description: 'Community members joined together for our environmental conservation initiative, cleaning up public spaces and planting trees.'
    // },
    {
      id: 4,
      image: gallery3,
      title: 'Support & Comfort Sessions',
      category: 'Support',
      date: 'September 2024',
      location: 'Kilimanjaro Region',
      description: 'Providing emotional support and comfort services to families going through difficult times in our community.'
    },
    // {
    //   id: 5,
    //   image: gallery5,
    //   title: 'School Uniform Distribution',
    //   category: 'Education',
    //   date: 'August 2024',
    //   location: 'Arusha Schools',
    //   description: 'Supporting students with school uniforms and essential learning materials for the new academic year.'
    // },
    // {
    //   id: 6,
    //   image: gallery6,
    //   title: 'Emergency Food Relief',
    //   category: 'Food Support',
    //   date: 'July 2024',
    //   location: 'Rural Communities',
    //   description: 'Emergency food distribution during drought season, reaching over 200 families with essential food supplies.'
    // },
    // {
    //   id: 7,
    //   image: gallery7,
    //   title: 'Environmental Education Workshop',
    //   category: 'Environment',
    //   date: 'June 2024',
    //   location: 'Morogoro Schools',
    //   description: 'Teaching children and communities about environmental conservation and sustainable living practices.'
    // },
    // {
    //   id: 8,
    //   image: gallery8,
    //   title: 'Book Donation Campaign',
    //   category: 'Education',
    //   date: 'May 2024',
    //   location: 'Multiple Libraries',
    //   description: 'Donating books and educational materials to school libraries and community reading centers.'
    // },
    // {
    //   id: 9,
    //   image: gallery9,
    //   title: 'Community Support Meeting',
    //   category: 'Support',
    //   date: 'April 2024',
    //   location: 'Community Centers',
    //   description: 'Regular community meetings providing support, guidance, and comfort to families facing challenges.'
    // },
    // {
    //   id: 10,
    //   image: gallery10,
    //   title: 'Tree Planting Initiative',
    //   category: 'Environment',
    //   date: 'March 2024',
    //   location: 'Various Locations',
    //   description: 'Community tree planting project as part of our environmental conservation and climate awareness program.'
    // }
  ];

  const categories = ['All', 'Education', 'Food Support', 'Environment', 'Support'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item: any) => {
    setSelectedImage(item);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary">
            Our Impact Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Alnahd Charty Foundation makes a difference through school equipment, food support, comfort services, and environmental conservation
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => openLightbox(item)}
                layout
              >
                <div className="relative overflow-hidden rounded-xl shadow-medium hover:shadow-strong transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold mb-1 text-sm lg:text-base">{item.title}</h3>
                      <p className="text-white/90 text-xs lg:text-sm">{item.category}</p>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Gallery Stats */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '500+', label: 'Photos Captured' },
              { number: '50+', label: 'Events Documented' },
              { number: '25+', label: 'Communities Featured' },
              { number: '1000+', label: 'Smiles Shared' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {selectedImage.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {selectedImage.category}
                    </span>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed mb-4">
                  {selectedImage.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedImage.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedImage.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;