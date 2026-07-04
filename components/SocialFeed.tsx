'use client';

import { motion } from 'motion/react';
import { Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const socialPosts = [
  { id: 1, type: 'instagram', image: 'https://picsum.photos/seed/inst1/600/600', link: '#' },
  { id: 2, type: 'instagram', image: 'https://picsum.photos/seed/inst2/600/600', link: '#' },
  { id: 3, type: 'facebook', image: 'https://picsum.photos/seed/fb1/600/600', link: '#' },
  { id: 4, type: 'instagram', image: 'https://picsum.photos/seed/inst3/600/600', link: '#' },
  { id: 5, type: 'facebook', image: 'https://picsum.photos/seed/fb2/600/600', link: '#' },
  { id: 6, type: 'instagram', image: 'https://picsum.photos/seed/inst4/600/600', link: '#' },
];

export default function SocialFeed() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary-700 tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
              Social Connection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
              Latest from Social Media
            </h2>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              className="flex items-center gap-2 text-stone-600 hover:text-primary-600 transition-colors uppercase tracking-widest text-sm font-medium border-b border-stone-200 pb-1"
            >
              Instagram <Instagram size={16} />
            </a>
            <a 
              href="https://www.facebook.com/chayabrittofilms" 
              target="_blank" 
              className="flex items-center gap-2 text-stone-600 hover:text-primary-600 transition-colors uppercase tracking-widest text-sm font-medium border-b border-stone-200 pb-1"
            >
              Facebook <Facebook size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {socialPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square group overflow-hidden bg-stone-100 block"
            >
              <Image
                src={post.image}
                alt={`Social post ${post.id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                {post.type === 'instagram' ? (
                  <Instagram size={24} className="text-white" />
                ) : (
                  <Facebook size={24} className="text-white" />
                )}
                <div className="absolute top-2 right-2">
                  <ArrowUpRight size={16} className="text-white opacity-70" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-stone-500 font-light max-w-xl mx-auto italic">
            &quot;Follow along for more stories, behind-the-scenes, and daily inspirations. Let&apos;s build a community centered around beautiful moments.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
