import { Instagram, Facebook, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div className="relative h-20 w-72 md:h-24 md:w-96 mb-6 transition-all duration-300">
            <Image
              src="/logo-white.png"
              alt="Chayabritto Films Logo"
              fill
              className="object-contain object-center md:object-left"
            />
          </div>
          <p className="text-sm font-light uppercase tracking-widest text-stone-300">Hasibuzzaman Rick | Founder & CEO</p>
          <p className="text-xs font-light uppercase tracking-widest mt-1 opacity-70">Chayabritto Films</p>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-400 transition-colors">
            <Instagram size={20} />
          </a>
          <a href="https://www.facebook.com/chayabrittofilms" target="_blank" className="hover:text-primary-400 transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-primary-400 transition-colors">
            <Twitter size={20} />
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs tracking-widest uppercase opacity-60">
        &copy; {new Date().getFullYear()} Hasibuzzaman Rick. All Rights Reserved.
      </div>
    </footer>
  );
}
