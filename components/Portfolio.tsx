'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

type PortfolioItem = {
  id: string | number;
  category: string;
  image: string;
};

// Fallback data when API is not available
const fallbackItems: PortfolioItem[] = [
  { id: 1, category: 'Wedding', image: 'https://picsum.photos/seed/wed1/800/1000' },
  { id: 2, category: 'Wedding', image: 'https://picsum.photos/seed/wed2/1000/800' },
  { id: 3, category: 'Corporate', image: 'https://picsum.photos/seed/corp1/800/800' },
  { id: 4, category: 'Cultural', image: 'https://picsum.photos/seed/cult1/800/1200' },
  { id: 5, category: 'Street', image: 'https://picsum.photos/seed/str1/1000/800' },
  { id: 6, category: 'Wedding', image: 'https://picsum.photos/seed/wed3/800/800' },
  { id: 7, category: 'Street', image: 'https://picsum.photos/seed/str2/800/1000' },
  { id: 8, category: 'Corporate', image: 'https://picsum.photos/seed/corp2/1200/800' },
  { id: 9, category: 'Cultural', image: 'https://picsum.photos/seed/cult2/800/800' },
];

const fallbackCategories = ['All', 'Wedding', 'Corporate', 'Cultural', 'Street'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackItems);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            setPortfolioItems(data.photos);
          }
          if (data.categories && data.categories.length > 1) {
            setCategories(data.categories);
          }
        }
      } catch {
        // Silently fall back to static data
      } finally {
        setLoaded(true);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Selected Works</h2>
          <div className="w-16 h-px bg-primary-600 mx-auto mb-8"></div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm tracking-widest uppercase transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-800 text-stone-50'
                    : 'bg-transparent text-stone-600 hover:text-primary-700 border border-stone-200 hover:border-primary-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden group rounded-2xl break-inside-avoid"
              >
                <div className="relative w-full aspect-[4/5]">
                    <Image 
                      src={item.image} 
                      alt={`${item.category} photography`}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-stone-50 font-serif italic text-xl tracking-wide">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
