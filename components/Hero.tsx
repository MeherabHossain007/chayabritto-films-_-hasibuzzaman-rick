'use client';

import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://picsum.photos/seed/wedding4/1920/1080")',
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-primary-300 tracking-[0.2em] uppercase text-sm mb-4 font-semibold"
        >
          Hasibuzzaman Rick
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-50 font-light mb-6 tracking-tight drop-shadow-lg"
        >
          Capturing <span className="italic text-primary-400">Life&apos;s</span> Essence
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-stone-200 text-lg md:text-xl font-light mb-10 max-w-2xl text-balance drop-shadow-md"
        >
          Specializing in Corporate, Wedding, Cultural, and Street Photography based in Dhaka, Bangladesh.
        </motion.p>

        <motion.a
          href="#portfolio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white px-8 py-4 rounded-full tracking-widest text-sm uppercase transition-colors"
        >
          Explore Portfolio
        </motion.a>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-300"
      >
        <span className="text-xs uppercase tracking-widest opacity-70">Scroll</span>
        <motion.div
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
