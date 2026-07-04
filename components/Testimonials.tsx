const testimonials = [
  {
    content: "Rick has an incredible eye. He captured our wedding in a way that feels so authentic and deeply emotional. Every time we look at the photos, we relive those beautiful moments. Beyond his talent, his calming presence made everyone feel at ease.",
    client: "Sarah & Tahmid",
    role: "Wedding Clients"
  },
  {
    content: "The corporate headshots and event coverages Chayabritto Films provided exceeded our expectations. The photos are sharp, professional, and exactly what our brand needed. Highly recommended for any corporate requirements across Dhaka.",
    client: "Ahmed R.",
    role: "Marketing Director"
  },
  {
    content: "The cultural portraits Rick took during Pohela Boishakh are simply magical. He knows how to use natural light to his advantage. It’s hard to find someone so passionate about capturing the essence of our culture.",
    client: "Nadia I.",
    role: "Portrait Client"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-primary-950 text-white overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900/20 skew-x-[-20deg] translate-x-32 hidden lg:block border-l border-primary-800/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary-300 tracking-[0.2em] uppercase text-sm font-semibold mb-4 block">
            Client Words
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-50">Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, i) => (
            <div key={i} className="bg-stone-900/40 border border-primary-900/50 p-8 rounded-2xl flex flex-col">
              <p className="font-serif italic text-lg text-primary-100 flex-grow mb-8 leading-relaxed">
                &quot;{testi.content}&quot;
              </p>
              <div>
                <h4 className="font-bold text-stone-50 uppercase tracking-widest text-sm">{testi.client}</h4>
                <p className="text-primary-400 text-xs mt-1 uppercase tracking-wider">{testi.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
