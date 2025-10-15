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
import leader6 from '@/assets/leader-6.jpg';
import leader7 from '@/assets/leader-7.jpg';
import leader8 from '@/assets/leader-8.jpg';

const LeadersSection = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  const leaders = [
    {
      id: 1,
      name: 'Anuary Ghusub',
      title: 'Chief Director',
      image: leader1,
      bio: '𝗔𝗻𝘄𝗮𝗿 𝗚𝗵𝘂𝘀𝘂𝗯 𝗦𝗮𝗹𝘂𝗺 𝗶𝘀 𝘁𝗵𝗲 𝗙𝗼𝘂𝗻𝗱𝗲𝗿 𝗮𝗻𝗱 𝗖𝗵𝗮𝗶𝗿𝗺𝗮𝗻 𝗼𝗳 𝗔𝗹 𝗡𝗮𝗵𝗱 𝗙𝗼𝘂𝗻𝗱𝗮𝘁𝗶𝗼𝗻, 𝗮𝗻 𝗼𝗿𝗴𝗮𝗻𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗯𝗼𝗿𝗻 𝗳𝗿𝗼𝗺 𝗮 𝗱𝗲𝗲𝗽 𝘀𝗲𝗻𝘀𝗲 𝗼𝗳 𝗰𝗼𝗺𝗽𝗮𝘀𝘀𝗶𝗼𝗻 𝗮𝗻𝗱 𝗿𝗲𝗳𝗹𝗲𝗰𝘁𝗶𝗼𝗻 𝗼𝗻 𝘁𝗵𝗲 𝗹𝗶𝘃𝗲𝘀 𝗼𝗳 𝗼𝗿𝗽𝗵𝗮𝗻𝘀  𝘄𝗵𝗮𝘁 𝘁𝗵𝗲𝘆 𝗲𝗮𝘁, 𝘄𝗵𝗲𝗿𝗲 𝘁𝗵𝗲𝘆 𝗴𝗼 𝗱𝘂𝗿𝗶𝗻𝗴 𝗵𝗼𝗹𝗶𝗱𝗮𝘆𝘀, 𝗮𝗻𝗱 𝘄𝗵𝗮𝘁 𝘁𝗵𝗼𝘂𝗴𝗵𝘁𝘀 𝗳𝗶𝗹𝗹 𝘁𝗵𝗲𝗶𝗿 𝘆𝗼𝘂𝗻𝗴 𝗺𝗶𝗻𝗱𝘀. 𝗛𝗶𝘀 𝗷𝗼𝘂𝗿𝗻𝗲𝘆 𝗯𝗲𝗴𝗮𝗻 𝗳𝗿𝗼𝗺 𝗲𝗺𝗽𝗮𝘁𝗵𝘆 𝗮𝗻𝗱 𝗮 𝗱𝗲𝘀𝗶𝗿𝗲 𝘁𝗼 𝗯𝗿𝗶𝗻𝗴 𝗵𝗼𝗽𝗲 𝘁𝗼 𝘁𝗵𝗼𝘀𝗲 𝗳𝗮𝗰𝗶𝗻𝗴 𝗹𝗶𝗳𝗲 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗽𝗮𝗿𝗲𝗻𝘁𝗮𝗹 𝗹𝗼𝘃𝗲. 𝗕𝗲𝘀𝗶𝗱𝗲𝘀 𝗵𝗶𝘀 𝗳𝗼𝘂𝗻𝗱𝗮𝘁𝗶𝗼𝗻 𝗿𝗼𝗹𝗲, 𝗵𝗲 𝘀𝗲𝗿𝘃𝗲𝘀 𝗮𝘀 𝗮 𝗩𝗼𝗹𝘂𝗻𝘁𝗲𝗲𝗿 𝗣𝗿𝗼𝗷𝗲𝗰𝘁 𝗖𝗼𝗼𝗿𝗱𝗶𝗻𝗮𝘁𝗼𝗿 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗧𝗮𝗻𝘇𝗮𝗻𝗶𝗮 𝗬𝗼𝘂𝘁𝗵 𝗕𝗶𝗼𝗱𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆 𝗡𝗲𝘁𝘄𝗼𝗿𝗸 (𝗧𝗬𝗕𝗡) 𝗮𝗻𝗱 𝘁𝗵𝗲 𝗩𝗶𝗰𝗲 𝗣𝗿𝗲𝘀𝗶𝗱𝗲𝗻𝘁 𝗼𝗳 𝗦𝗠𝗖𝗼𝗦𝗘 𝗬𝗼𝘂𝘁𝗵 𝗠𝗮𝗽𝗽𝗲𝗿𝘀. 𝗔𝗻𝘄𝗮𝗿 𝗶𝘀 𝗮 𝗽𝗮𝘀𝘀𝗶𝗼𝗻𝗮𝘁𝗲 𝗚𝗜𝗦 𝗘𝘅𝗽𝗲𝗿𝘁 𝗮𝗻𝗱 𝗬𝗼𝘂𝗻𝗴 𝗘𝗻𝘃𝗶𝗿𝗼𝗻𝗺𝗲𝗻𝘁𝗮𝗹 𝗔𝗱𝘃𝗼𝗰𝗮𝘁𝗲 𝗱𝗲𝗱𝗶𝗰𝗮𝘁𝗲𝗱 𝘁𝗼 𝗰𝗼𝗺𝗯𝗶𝗻𝗶𝗻𝗴 𝘁𝗲𝗰𝗵𝗻𝗼𝗹𝗼𝗴𝘆, 𝗺𝗮𝗽𝗽𝗶𝗻𝗴, 𝗮𝗻𝗱 𝗰𝗼𝗺𝗺𝘂𝗻𝗶𝘁𝘆 𝗰𝗮𝗿𝗲 𝘁𝗼 𝗯𝘂𝗶𝗹𝗱 𝗮 𝗸𝗶𝗻𝗱𝗲𝗿 𝗮𝗻𝗱 𝗺𝗼𝗿𝗲 𝗲𝗾𝘂𝗶𝘁𝗮𝗯𝗹𝗲 𝗳𝘂𝘁𝘂𝗿𝗲 𝗳𝗼𝗿 𝗧𝗮𝗻𝘇𝗮𝗻𝗶𝗮',
      email: 'anwarghusub@gmail.com',
      linkedin: '#'
    },
    {
      id: 2,
      name: 'Saidi kilindo',
      title: 'General Secretary of the organization',
      image: leader3,
      bio: 'Saidi Kilindo is a dedicated leader and humanitarian currently serving as the Secretary of the Organization. He plays an active role in coordinating community and charity initiatives that support orphans and vulnerable children, focusing on improving their living standards and access to education ,Beyo his leadership role, Saidi is deeply involved in environmental conservation efforts through his participation in tree planting programs and awareness campaigns. His passion for service, teamwork, and community development continues to inspire positive change and strengthen the impact of the organization’s mission.',
      email: 'kilindosaid771@gmail.com',
      linkedin: '#'
    },
    {
      id: 3,
      name: 'Sara Musa Saidi',
      title: 'Asistant General Secretary of the organization',
      image: leader6,
      bio: 'Sara Musa Saidi is a dedicated humanitarian and passionate advocate for social welfare, currently serving as an Ambassador of Al Nahd Charity Foundation. Through her commitment to community empowerment and compassion-driven initiatives, she has continuously worked to improve the lives of orphans, vulnerable children, and underprivileged communities.Her active participation in various charitable events and outreach programs reflects her unwavering dedication to service and leadership. Ambassador Sara musa has been part of several impactful visits and events, including:A humanitarian outreach at Kigamboni Hisani Orphanage Center, where she engaged with children and supported welfare programs.A charitable mission to Morogoro Dar Ul Musleemin, focusing on education and community support.The Ramadhan Iftar Party at Faraja Orphanage Center, promoting unity, compassion, and shared blessings during the holy month.A social support visit to Madina Orphanage Center, strengthening ties and providing encouragement to the youth.Through these initiatives and many others,  Sara Musa Saidi continues to uphold the values of empathy, generosity, and service to humanity,inspiring others to join hands in building a more compassionate world.',
      email: 'saramusa391@gmail.com',
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
      name: 'Halima Hakim',
      title: 'Mentor of the organization',
      image: leader7,
      bio: 'Halima A. Hakim is a dedicated science educator and the Academic Master at Kianga Secondary School. She holds a Bachelor’s Degree in Science with Education and has years of experience nurturing young minds and guiding students toward academic excellence As a mentor at Al Nahd Charity Foundation, Halima is passionate about shaping compassionate youth through education, community service, and charity initiatives. Her commitment to empowering others reflects her belief that true change begins with knowledge, kindness, and collective responsibility.',
      email: 'shamigirl67@gmail.com',
      linkedin: '#'
    },
    {
      id: 7,
      name: 'Fajda Hamisi',
      title: ' Public Relations&Communication Director of the organization',
      image: leader8,
      bio: 'Fajda Hamisi is an Public admnistration student at TANZANIA PUBLIC SERVICE COLLAGE (TPSC) MTWARA.she is a  Public Relations&Communication Director of Al Nahd Charity Foundation and is an Ambassador of the Al rahiim Islamic foundation  .passionate about Environmental conservation and youth empowerment,Fajda actively engages in a community projects promoting sustainability biodiversity and social welfare..',
      email: 'fajdarashidi008@gmail.com',
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