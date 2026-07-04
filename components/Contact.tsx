'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('Message sent successfully! We will get back to you shortly.');
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setFormStatus(null), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Info */}
          <div>
            <span className="text-primary-700 tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
              Get in Touch
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
              Let&apos;s create something <br/> beautiful together.
            </h2>
            <p className="text-stone-600 font-light mb-12">
              Whether you&apos;re planning your dream wedding, launching a new brand, or looking for portraits that tell your story, I&apos;m here to help bring your vision to life.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-stone-700">
                <div className="w-12 h-12 rounded-full border border-primary-200 flex items-center justify-center text-primary-700 bg-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-widest text-stone-900">Location</p>
                  <p className="font-light">Dhaka, Bangladesh</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-stone-700">
                <div className="w-12 h-12 rounded-full border border-primary-200 flex items-center justify-center text-primary-700 bg-white">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-widest text-stone-900">Phone</p>
                  <p className="font-light">+880 1852881561</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-700">
                <div className="w-12 h-12 rounded-full border border-primary-200 flex items-center justify-center text-primary-700 bg-white">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm uppercase tracking-widest text-stone-900">Email</p>
                  <p className="font-light">hasibulrick@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="font-serif text-2xl mb-8">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-primary-600 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-primary-600 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Subject</label>
                <select 
                  id="subject" 
                  className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-primary-600 text-stone-700 transition-colors"
                >
                  <option>Wedding Photography</option>
                  <option>Corporate Photography</option>
                  <option>Cultural Event</option>
                  <option>Street / Portrait</option>
                  <option>Other Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  required 
                  className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-primary-600 transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-primary-700 text-white py-4 rounded-full tracking-widest uppercase text-sm transition-colors"
              >
                Send Request <Send size={16} />
              </button>
              
              {formStatus && (
                <p className="text-green-600 text-sm mt-4 text-center">{formStatus}</p>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
