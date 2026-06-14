import Reveal from './Reveal';
import MaskText from './MaskText';

type Item = {
  id: number;
  title: string;
  tag: string;
  span: string;
  hue: string;
  src?: string;
};

const ITEMS: Item[] = [
  {
    id: 1,
    title: 'Serpente',
    tag: 'Blackwork',
    span: 'sm:col-span-2 sm:row-span-2',
    hue: 'from-[#181422] via-[#100f18] to-[#09080d]',
  },
  {
    id: 2,
    title: 'Laurel',
    tag: 'Fine Line',
    span: '',
    hue: 'from-[#1a160c] via-[#13110a] to-[#0a0908]',
  },
  {
    id: 3,
    title: 'Meandro',
    tag: 'Geométrico',
    span: '',
    hue: 'from-[#0d1219] via-[#0b0f14] to-[#09090c]',
  },
  {
    id: 4,
    title: 'Perfil',
    tag: 'Figurativo',
    span: 'sm:row-span-2',
    hue: 'from-[#1a0f0e] via-[#130d0c] to-[#0a0908]',
  },
  {
    id: 5,
    title: 'Vênus',
    tag: 'Ornamental',
    span: 'sm:col-span-2',
    hue: 'from-[#1a150a] via-[#15110a] to-[#0a0908]',
  },
  {
    id: 6,
    title: 'Medusa',
    tag: 'Neoclássico',
    span: 'sm:col-span-2',
    hue: 'from-[#121519] via-[#0f1215] to-[#090a0c]',
  },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative z-10 mx-auto max-w-7xl px-7 py-32 sm:px-12">
      {/* Header */}
      <div className="mb-12 flex items-end justify-between">
        <MaskText className="font-display text-5xl font-light italic text-bone sm:text-7xl">
          Obra
        </MaskText>
        <Reveal>
          <p className="font-mono text-[9px] uppercase tracking-[0.6em] text-gold/60">
            ii — galeria
          </p>
        </Reveal>
      </div>

      {/* Grid */}
      <div className="grid auto-rows-[220px] grid-cols-2 gap-1 sm:auto-rows-[260px] sm:grid-cols-3">
        {ITEMS.map((it, i) => (
          <Reveal
            key={it.id}
            delay={(i % 3) * 0.07}
            y={20}
            className={it.span}
          >
            <figure className="group relative h-full w-full cursor-pointer overflow-hidden">
              {/* Background */}
              {it.src ? (
                <img
                  src={it.src}
                  alt={it.title}
                  className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className={`h-full w-full bg-gradient-to-br ${it.hue} transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]`}
                >
                  {/* Placeholder indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                    <span className="block h-1.5 w-1.5 rotate-45 bg-gold/30" />
                  </div>
                </div>
              )}

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Caption */}
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-end justify-between">
                  <span className="font-display text-xl font-light italic text-bone">
                    {it.title}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-gold/80">
                    {it.tag}
                  </span>
                </div>
              </figcaption>

              {/* Border flicker on hover */}
              <div className="pointer-events-none absolute inset-0 border border-bone/0 transition-colors duration-700 group-hover:border-bone/10" />
            </figure>
          </Reveal>
        ))}
      </div>

      {/* Footer line */}
      <Reveal delay={0.1}>
        <p className="mt-8 text-right font-mono text-[9px] uppercase tracking-[0.5em] text-bone/20">
          Fotos reais em breve — os trabalhos falam por si
        </p>
      </Reveal>
    </section>
  );
}
