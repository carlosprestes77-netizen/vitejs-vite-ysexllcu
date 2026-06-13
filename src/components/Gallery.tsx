import Reveal from './Reveal';
import MaskText from './MaskText';

type Item = { id: number; title: string; tag: string; span: string; hue: string; src?: string };

/** Drop real photo URLs into `src` when they arrive. */
const ITEMS: Item[] = [
  { id: 1, title: 'Serpente', tag: 'Blackwork', span: 'sm:col-span-2 sm:row-span-2', hue: 'from-[#15131a] to-[#0a0908]' },
  { id: 2, title: 'Laurel', tag: 'Fine line', span: '', hue: 'from-[#17150f] to-[#0a0908]' },
  { id: 3, title: 'Meandro', tag: 'Geométrico', span: '', hue: 'from-[#101512] to-[#0a0908]' },
  { id: 4, title: 'Perfil', tag: 'Figurativo', span: 'sm:row-span-2', hue: 'from-[#151010] to-[#0a0908]' },
  { id: 5, title: 'Vênus', tag: 'Ornamental', span: 'sm:col-span-2', hue: 'from-[#16130d] to-[#0a0908]' },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative z-10 mx-auto max-w-6xl px-6 py-32">
      <div className="mb-14 flex items-end justify-between">
        <MaskText className="font-display text-4xl font-light italic text-bone sm:text-6xl">
          Obra
        </MaskText>
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">
            ii — galeria
          </p>
        </Reveal>
      </div>

      <div className="grid auto-rows-[230px] grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
        {ITEMS.map((it, i) => (
          <Reveal key={it.id} delay={(i % 3) * 0.1} className={it.span}>
            <figure className="group relative h-full w-full overflow-hidden">
              {it.src ? (
                <img
                  src={it.src}
                  alt={it.title}
                  className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${it.hue} transition-transform duration-[1200ms] ease-out group-hover:scale-105`} />
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-display text-lg italic text-bone">{it.title}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold">{it.tag}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
