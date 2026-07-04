import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import SocialFeed from '@/components/SocialFeed';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <SocialFeed />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
