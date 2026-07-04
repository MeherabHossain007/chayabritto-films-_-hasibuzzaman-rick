import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="aspect-[3/4] rounded-t-full overflow-hidden bg-stone-200 shadow-xl relative z-10">
              <Image 
                src="https://picsum.photos/seed/photographer/800/1200" 
                alt="Hasibuzzaman Rick"
                width={800}
                height={1200}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative background shape */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary-100 rounded-full -z-0"></div>
          </div>

          <div>
            <span className="text-primary-700 tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
              Founder & CEO
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
              Hello, I&apos;m <br /> Hasibuzzaman Rick.
            </h2>
            <div className="space-y-6 text-stone-600 text-lg font-light leading-relaxed">
              <p>
                Based in the vibrant heart of Dhaka, Bangladesh, my journey in photography began with a simple desire: to freeze fleeting moments and transform them into timeless stories.
              </p>
              <p>
                As the Founder and CEO of <strong className="font-serif italic text-primary-800">Chayabritto Films</strong>, I believe in the power of light and shadow to create profound imagery that speaks louder than words.
              </p>
              <p>
                Photography is not just my profession; it&apos;s my perspective on the world. Whether it&apos;s the structured elegance of a corporate event, the raw emotion of a wedding day, the vibrant tapestry of cultural festivals, or the unseen narratives of street life, I aim to capture the authenticity in every frame.
              </p>
            </div>
            
            <div className="mt-10">
              <span className="font-serif italic text-4xl text-stone-800 opacity-40 block tracking-wider">
                Hasibuzzaman Rick
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
