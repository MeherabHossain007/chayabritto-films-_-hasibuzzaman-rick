'use client';

import { useState } from 'react';
import { Camera, PartyPopper, Briefcase, Footprints, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

const services = [
  {
    title: 'Wedding Photography',
    description: 'Comprehensive coverage of your special day, capturing every emotion, detail, and unforgettable moment from pre-wedding to the reception.',
    icon: PartyPopper,
    image: 'https://picsum.photos/seed/wed_serv/800/600',
    startingPrice: '৳ 10,000',
    subsections: [
      { name: 'Pre-Wedding Shoot (Outdoor)', price: '৳ 10,000', details: '2-hour outdoor session with 25 edited photos.' },
      { name: 'Gaye Holud / Mehendi', price: '৳ 15,000', details: 'Full event coverage for one side, 100 edited photos, 1 cinematic video.' },
      { name: 'Wedding Ceremony', price: '৳ 25,000', details: 'Full event coverage, 150 edited photos, 1 exclusive cinematic highlight, premium photo album.' },
      { name: 'Reception & Post-Wedding', price: '৳ 20,000', details: 'Full event coverage, 100 edited photos, 1 cinematic video, standard photo album.' }
    ]
  },
  {
    title: 'Corporate Events',
    description: 'Professional imagery for your brand. Be it conferences, seminars, or corporate headshots, we deliver high-quality photos that represent your company.',
    icon: Briefcase,
    image: 'https://picsum.photos/seed/corp_serv/800/600',
    startingPrice: '৳ 5,000',
    subsections: [
      { name: 'Executive Headshots', price: '৳ 5,000 / Person', details: 'Professional lighting setup at your location or our studio.' },
      { name: 'Half-Day Conference Coverage', price: '৳ 15,000', details: 'Up to 4 hours of coverage, documenting speakers and audience interactions.' },
      { name: 'Full-Day Corporate Event', price: '৳ 25,000', details: 'Up to 8 hours of comprehensive coverage, fast delivery for social media.' },
      { name: 'Product / Brand Photography', price: 'Custom Quote', details: 'Tailored to your specific brand requirements and product volume.' }
    ]
  },
  {
    title: 'Cultural Documentation',
    description: 'Preserving the heritage and vibrant colors of cultural festivals and traditional ceremonies with an authentic, documentary style approach.',
    icon: Camera,
    image: 'https://picsum.photos/seed/cult_serv/800/600',
    startingPrice: '৳ 10,000',
    subsections: [
      { name: 'Traditional Artisan Portraits', price: '৳ 10,000', details: 'Focusing on individual stories and craftsmanship.' },
      { name: 'Pohela Boishakh / Festivals', price: '৳ 12,000', details: 'Capturing the vibrant essence, colors, and crowds.' },
      { name: 'Cultural Dance / Music Shows', price: '৳ 15,000', details: 'Dynamic stage photography with low-light expertise.' },
      { name: 'Documentary Photo Essay', price: '৳ 20,000', details: 'A comprehensive visual story covering multiple days or events.' }
    ]
  },
  {
    title: 'Street & Portrait',
    description: 'Bringing out the unique narratives of individuals and street life through evocative, natural lighting and candid moments.',
    icon: Footprints,
    image: 'https://picsum.photos/seed/street_serv/800/600',
    startingPrice: '৳ 5,000',
    subsections: [
      { name: 'Street Photography Tour', price: '৳ 5,000', details: 'Guided photo walk discovering hidden gems and local life.' },
      { name: 'Outdoor Portrait Session', price: '৳ 8,000', details: 'Natural light portraiture in selected scenic locations.' },
      { name: 'Editorial & Fashion Shoot', price: '৳ 15,000', details: 'Conceptual shoot with styling and location scouting.' },
      { name: 'Fine Art Prints', price: 'Prices Vary', details: 'High-quality prints of selected street and portrait photographs.' }
    ]
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <section id="services" className="py-24 bg-stone-900 text-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <span className="text-primary-400 tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
            Expertise
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Services & Pricing</h2>
          <p className="text-stone-400 text-lg font-light">
            We adapt to your needs, whether it&apos;s an intimate portrait session or a multi-day wedding celebration. Here&apos;s a brief overview of our starting packages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                onClick={() => setSelectedService(service)}
                className="group cursor-pointer border border-stone-800 hover:border-primary-800 hover:bg-stone-800/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/60 group-hover:bg-stone-900/40 transition-colors" />
                  <div className="absolute bottom-6 left-6 p-4 bg-stone-900/80 backdrop-blur-sm rounded-full text-primary-400 group-hover:text-primary-300 transition-colors">
                    <Icon size={24} />
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl md:text-3xl text-stone-100 mb-4 group-hover:text-primary-200 transition-colors">{service.title}</h3>
                  <p className="text-stone-400 font-light mb-8 flex-grow leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-800 group-hover:border-primary-800/50 transition-colors">
                    <div>
                      <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Starting From</p>
                      <p className="text-primary-400 font-medium tracking-wider text-xl">{service.startingPrice}</p>
                    </div>
                    <div className="flex items-center gap-2 text-stone-300 group-hover:text-primary-400 font-medium uppercase tracking-widest text-sm transition-colors">
                      View Packages <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-48 sm:h-64 rounded-t-3xl overflow-hidden">
                <Image 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 bg-stone-950/50 hover:bg-stone-950 blur-0 rounded-full text-stone-200 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-6 left-6 sm:left-8">
                   <h3 className="font-serif text-3xl sm:text-4xl text-stone-50">{selectedService.title}</h3>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
                <p className="text-stone-300 font-light mb-8 leading-relaxed">
                  {selectedService.description}
                </p>
                
                <h4 className="text-primary-400 tracking-[0.2em] uppercase text-xs font-semibold mb-6">Detailed Packages</h4>
                
                <div className="space-y-6">
                  {selectedService.subsections.map((sub, i) => (
                    <div key={i} className="group p-5 bg-stone-950/50 border border-stone-800/50 rounded-2xl hover:border-primary-900/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h5 className="text-stone-100 font-medium tracking-wide text-lg">{sub.name}</h5>
                        <span className="text-primary-300 font-semibold tracking-wider whitespace-nowrap bg-primary-950/50 px-3 py-1 rounded-full text-sm">
                          {sub.price}
                        </span>
                      </div>
                      <p className="text-stone-400 font-light text-sm leading-relaxed">
                        {sub.details}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-6 border-t border-stone-800 text-center">
                   <a href="#contact" onClick={() => setSelectedService(null)} className="inline-block bg-primary-700 hover:bg-primary-600 text-white px-8 py-3 rounded-full tracking-widest text-sm uppercase transition-colors">
                      Book This Service
                   </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
