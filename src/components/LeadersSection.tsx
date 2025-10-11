import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { X, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import leader images
import leader1 from '@/assets/leader-1.jpg';
import leader2 from '@/assets/leader-2.png';
import leader3 from '@/assets/leader-3.jpg';
import leader5 from '@/assets/leader-5.png';
import leader6 from '@/assets/leader-6.png';

const LeadersSection = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  const leaders = [
    {
      id: 1,
      name: 'Anuary Ghusub',
      title: 'Chief Director',
      image: leader1,
      bio: 'Anuary Ghusub brings over 06 years of experience in international development and community empowerment. He holds a Degree in Social Development from the University of Dar es Salaam and has led numerous successful initiatives across East Africa. Under his leadership, Charty Events has expanded its reach to serve over 1,500 children and 45 communities. His passion for sustainable development and community-driven solutions has been instrumental in creating lasting positive change.',
      email: 'emmanuel.mwalimu@chartyevents.org',
      linkedin: '#'
    },
    {
      id: 2,
      name: 'Saidi kilindo',
      title: 'Secretary of the organization',
      image: leader3,
      bio: 'Saidi manages our international partnerships and donor relations, bringing valuable experience from his previous roles with UNICEF and Save the Children. He has successfully secured funding for over $2 million worth of projects and established partnerships with organizations across 12 countries. His multilingual abilities and cross-cultural communication skills have been essential in building bridges between our local operations and international supporters.',
      email: 'kilindosaid771@gmail.com',
      linkedin: '#'
    },
    {
      id: 3,
      name: 'Amara Ochieng',
      title: 'Community Outreach Specialist',
      image: leader6,
      bio: 'Amara is a young, dynamic professional with a degree in Social Sciences and a passion for grassroots community work. She leads our community engagement efforts and has been crucial in building trust and relationships with local communities. Her youth and energy, combined with her deep understanding of local customs and languages, make her an effective bridge between our organization and the communities we serve. She has organized over 100 community events and workshops.',
      email: 'amara.ochieng@chartyevents.org',
      linkedin: '#'
    },
    {
      id: 4,
      name: 'Victoria Modest',
      title: 'Chair Lady',
      image: leader2,
      bio: 'Victoria Modest is an Environmental Sciences and Management student at Sokoine University of Agriculture (SUA). She serves as the Chair Lady of Al Nahd Charity Foundation and is an Ambassador of the My Birthday Tree Organization and the Tanzania Youth Biodiversity Network (TYBN). Victoria has participated in several outreach and charity activities, including visits to Kigamboni Hisani Orphanage Center, Dar Ul Musleemin in Morogoro, Faraja Orphanage Center during the Ramadan Iftar Party, and Madina Orphanage Center. She is passionate about environmental conservation, youth empowerment, and community development',
      email: 'modestvictoria672@gmail.com',
      linkedin: '#'
    },
    {
      id: 5,
      name: 'Suleiman Ali',
      title: 'Education Coordinator',
      image: leader5,
      bio: 'Suleiman Ali is an Environmental Sciences and Management student at Sokoine University of Agriculture (SUA). He serves as a Leader at Alnahdi Charity Foundation and is an active member of the My Birthday Tree Organization (MBTO) in Morogoro. Through his participation in various tree planting initiatives, he contributes to promoting environmental conservation and sustainability,Suleiman is passionate about supporting orphans and vulnerable children, working toward improving their living standards and educational opportunities. His goal is to empower young lives with essential skills, confidence, and hope for a better future, while continuing to advocate for environmental preservation and community development. and educational programs for children in rural areas. With a Master\'s degree in Education from Kenyatta University, he has developed innovative teaching methods and curriculum adaptations for diverse learning environments. His commitment to educational equity has helped over 2,000 children access quality education and learning resources.',
      email: 'james.mwangi@chartyevents.org',
      linkedin: '#'
    },
    {
      id: 6,
      name: 'Grace Akinyi',
      title: 'Program Manager',
      image: leader6,
      bio: 'Grace Akinyi oversees our comprehensive program management and ensures the effective implementation of all community development initiatives. With a background in Project Management and Social Work, she coordinates between different departments and stakeholders to maximize program impact. Her organizational skills and attention to detail have been essential in maintaining high standards across all our projects and ensuring sustainable outcomes for the communities we serve.',
      email: 'grace.akinyi@chartyevents.org',
      linkedin: '#'
    }
  ];

  const openModal = (leader: any) => {
    setSelectedLeader(leader);
  };

  const closeModal = () => {
    setSelectedLeader(null);
  };

  return (
    <section id="leaders" className="py-20 bg-gradient-to-b from-secondary to-background">
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
            Our Leadership Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the passionate individuals driving positive change and leading our mission to transform lives
          </p>
        </motion.div>

        {/* Leaders Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {leaders.map((leader) => (
              <SwiperSlide key={leader.id}>
                <motion.div
                  className="card-service text-center h-full flex flex-col group"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary-light transition-colors duration-300">
                    {leader.name}
                  </h3>
                  <p className="text-accent font-medium mb-4">{leader.title}</p>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {leader.bio.substring(0, 120)}...
                  </p>

                  <Button
                    onClick={() => openModal(leader)}
                    className="btn-secondary w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    View Bio
                  </Button>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* Leader Bio Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <div className="bg-gradient-to-r from-primary to-primary-light p-6 rounded-t-2xl text-white">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/30">
                      <img
                        src={selectedLeader.image}
                        alt={selectedLeader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedLeader.name}</h3>
                      <p className="text-white/90 text-lg">{selectedLeader.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary mb-3">Biography</h4>
                  <p className="text-foreground leading-relaxed">{selectedLeader.bio}</p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedLeader.email.startsWith('mailto:') ? selectedLeader.email : `mailto:${selectedLeader.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center space-x-2 py-2 px-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </a>
                  <a
                    href={selectedLeader.linkedin}
                    className="flex items-center justify-center space-x-2 py-2 px-4 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LeadersSection;
