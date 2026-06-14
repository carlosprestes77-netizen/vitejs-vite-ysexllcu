const NAV = [
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Estúdio', href: '#estudio' },
  { label: 'Artista', href: '#artista' },
  { label: 'Reservar', href: '#agendar' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-bone/8 bg-ink pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-7 sm:px-12">
        {/* Top row */}
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <span className="block h-2 w-2 rotate-45 bg-gold" />
            <span className="font-display text-xl font-black tracking-[0.35em] text-bone">
              OBSIDIAN
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="font-mono text-[9px] uppercase tracking-[0.45em] text-bone-faint transition-colors hover:text-gold"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-bone/8" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/20">
            [ endereço · horário · cidade — em breve ]
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/20">
            © {new Date().getFullYear()} Obsidian Atelier · Arte permanente
          </p>
        </div>
      </div>
    </footer>
  );
}
