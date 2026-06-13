import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'estudio', label: 'Estúdio' },
  { id: 'artista', label: 'Artista' },
  { id: 'agendar', label: 'Agendar' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/70 backdrop-blur-md border-b border-bone/5 py-3'
          : 'py-6'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3"
        >
          <span className="block h-2 w-2 rotate-45 bg-gold transition-transform duration-500 group-hover:rotate-[225deg]" />
          <span className="font-display text-xl font-black tracking-[0.3em] text-bone">
            OBSIDIAN
          </span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim transition-colors hover:text-gold"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => go('agendar')}
          className="border border-bone/20 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-bone transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
        >
          Reservar →
        </button>
      </nav>
    </header>
  );
}
