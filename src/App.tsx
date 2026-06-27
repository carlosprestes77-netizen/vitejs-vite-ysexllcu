import { useScroll } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import BustScene from './components/BustScene';
import CinematicOverlay from './components/CinematicOverlay';
import CinematicIntro from './components/CinematicIntro';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Divider from './components/Divider';
import Manifesto from './components/Manifesto';
import Technique from './components/Technique';
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
        <Divider label="ΟΒΣΙΔΙΑΝ · linha & ponto" idKey="a" />
        <Manifesto />
        <Technique />
        <Divider idKey="b" />
        <Gallery />
        <Studio />
        <Artist />
        <Divider label="ΑΘΑΝΑΤΟΣ · arte imortal" idKey="c" />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
