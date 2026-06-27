import Reveal from './Reveal';
import MaskText from './MaskText';

type Item = {
  id: number;
  fig: string;
  title: string;
  tag: string;
  span: string;
  hue: string;
  src?: string;
};

const ITEMS: Item[] = [
  { id: 1, fig: 'I', title: 'Serpente', tag: 'Blackwork', span: 'sm:col-span-2 sm:row-span-2', hue: 'from-[#181422] via-[#100f18] to-[#09080d]' },
  { id: 2, fig: 'II', title: 'Laurel', tag: 'Fine Line', span: '', hue: 'from-[#1a160c] via-[#13110a] to-[#0a0908]' },
  { id: 3, fig: 'III', title: 'Meandro', tag: 'Geométrico', span: '', hue: 'from-[#0d1219] via-[#0b0f14] to-[#09090c]' },
  { id: 4, fig: 'IV', title: 'Perfil', tag: 'Neoclássico', span: 'sm:row-span-2', hue: 'from-[#1a0f0e] via-[#130d0c] to-[#0a0908]' },
  { id: 5, fig: 'V', title: 'Vênus', tag: 'Pontilhismo', span: 'sm:col-span-2', hue: 'from-[#1a150a] via-[#15110a] to-[#0a0908]' },
  { id: 6, fig: 'VI', title: 'Medusa', tag: 'Geometria Sagrada', span: 'sm:col-span-2', hue: 'from-[#121519] via-[#0f1215] to-[#090a0c]' },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative z-10 mx-auto max-w-7xl px-7 py-32 sm:px-12">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <Reveal>
            <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.55em] text-gold/60">
              ΕΡΓΟΝ · a obra
            </p>
          </Reveal>
          <MaskText className="font-display text-5xl font-light italic text-bone sm:text-7xl">
            Acervo
          </MaskText>
        </div>
        <Reveal>
          <p className="hidden font-mono text-[9px] uppercase tracking-[0.5em] text-bone/30 sm:block">
            iii — galeria
          </p>
        </Reveal>
      </div>

      <div className="grid auto-rows-[210px] grid-cols-2 gap-1 sm:auto-rows-[250px] sm:grid-cols-3">
        {ITEMS.map((it, i) => (
          <Reveal key={it.id} delay={(i % 3) * 0.07} y={20} className={it.span}>
            <figure className="group relative h-full w-full cursor-pointer overflow-hidden">
              {it.src ? (
                <img
                  src={it.src}
                  alt={it.title}
                  className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className={`dots-dense h-full w-full bg-gradient-to-br ${it.hue} transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]`}
                />
              )}

              {/* corner ticks — museum framing on hover */}
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-bone/0 transition-colors duration-500 group-hover:border-gold/50" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-bone/0 transition-colors duration-500 group-hover:border-gold/50" />

              {/* darkening + placard on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-bone/40">
                  Fig.&nbsp;{it.fig}
                </p>
                <div className="mt-1 flex items-end justify-between">
                  <span className="font-display text-xl font-light italic text-bone">
                    {it.title}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-gold/80">
                    {it.tag}
                  </span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 text-right font-mono text-[9px] uppercase tracking-[0.45em] text-bone/20">
          Fotografias reais em breve — a obra fala por si
        </p>
      </Reveal>
    </section>
  );
}
