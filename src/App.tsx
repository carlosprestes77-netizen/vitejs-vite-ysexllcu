import { useScroll } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import BustScene from './components/BustScene';
import CinematicOverlay from './components/CinematicOverlay';
import CinematicIntro from './components/CinematicIntro';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeStrip from './components/MarqueeStrip';
import Manifesto from './components/Manifesto';
import Gallery from './components/Gallery';
import Studio from './components/Studio';
import Artist from './components/Artist';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useSmoothScroll();
  // Drives the slow rotation of the marble bust across the whole page.
  const { scrollYProgress } = useScroll();

  return (
    <div className="grain vignette relative min-h-screen bg-ink text-bone">
      <CinematicIntro />
      <Cursor />

      {/* living backdrop — the rotating marble bust */}
      <BustScene scroll={scrollYProgress} />

      {/* restrained cinematic grade */}
      <CinematicOverlay />

      <Navbar />

      <main className="relative">
        <Hero />
        <MarqueeStrip />
        <Manifesto />
        <Gallery />
        <MarqueeStrip />
        <Studio />
        <Artist />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
