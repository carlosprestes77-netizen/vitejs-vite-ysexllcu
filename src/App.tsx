import { useScroll } from 'framer-motion';
import StatueScene from './components/StatueScene';
import CinematicOverlay from './components/CinematicOverlay';
import CinematicIntro from './components/CinematicIntro';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Manifesto from './components/Manifesto';
import Gallery from './components/Gallery';
import Studio from './components/Studio';
import Artist from './components/Artist';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // Drives the 3D monolith's rotation across the whole page (0 → 1).
  const { scrollYProgress } = useScroll();

  return (
    <div className="grain vignette relative min-h-screen bg-ink text-bone selection:bg-blood">
      {/* film title-card on load */}
      <CinematicIntro />

      {/* custom art cursor */}
      <Cursor />

      {/* living 3D backdrop — rotating marble specimens */}
      <StatueScene scroll={scrollYProgress} />

      {/* global cinematic grade, leak, scanlines, letterbox + HUD */}
      <CinematicOverlay />

      <Navbar />

      <main className="relative">
        <Hero />
        <Marquee />
        <Manifesto />
        <Gallery />
        <Studio />
        <Artist />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
