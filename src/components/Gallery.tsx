import Reveal from './Reveal';

type Item = {
  id: number;
  title: string;
  tag: string;
  span: string; // grid span classes for an editorial mosaic
  hue: string; // placeholder gradient until real photos land
  src?: string;
};

/** Drop real photo URLs into `src` when they arrive — the cinematic
 *  grade is applied globally, so every image inherits the film look. */
const ITEMS: Item[] = [
  { id: 1, title: 'Serpente Ornamental', tag: 'Blackwork', span: 'sm:col-span-2 sm:row-span-2', hue: 'from-[#1a1320] to-[#0a0a0b]' },
  { id: 2, title: 'Mão de Fátima', tag: 'Fine Line', span: '', hue: 'from-[#201a13] to-[#0a0a0b]' },
  { id: 3, title: 'Geometria Sagrada', tag: 'Dotwork', span: '', hue: 'from-[#13201a] to-[#0a0a0b]' },
  { id: 4, title: 'Caveira Barroca', tag: 'Realismo', span: 'sm:row-span-2', hue: 'from-[#1a1313] to-[#0a0a0b]' },
  { id: 5, title: 'Fênix', tag: 'Neotrad', span: 'sm:col-span-2', hue: 'from-[#1d1813] to-[#0a0a0b]' },
  { id: 6, title: 'Lua & Maré', tag: 'Ornamental', span: '', hue: 'from-[#131820] to-[#0a0a0b]' },
  { id: 7, title: 'Adaga', tag: 'Traditional', span: '', hue: 'from-[#201320] to-[#0a0a0b]' },
];

export default function Gallery() {
  return (
    <section
      id="galeria"
      className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10"
    >
      <Reveal>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-blood">
              ⊹ Nº 02 · Portfólio
            </p>
            <h2 className="mt-4 font-display text-5xl font-black leading-none text-bone sm:text-7xl">
              Galeria <span className="italic text-stroke-gold">viva</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm font-light text-bone-dim md:block">
            Cada peça é um quadro. As fotos reais do trabalho entram aqui — já
            com a mesma textura de cinema do site.
          </p>
        </div>
      </Reveal>

      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal key={it.id} delay={(i % 4) * 0.08} className={it.span}>
            <figure className="group relative h-full w-full overflow-hidden border border-bone/10">
              {it.src ? (
                <img
                  src={it.src}
                  alt={it.title}
                  className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${it.hue} transition-transform duration-700 group-hover:scale-105`}
                >
                  <span className="font-gothic text-5xl text-bone/10">
                    {String(it.id).padStart(2, '0')}
                  </span>
                </div>
              )}

              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold">
                  {it.tag}
                </p>
                <p className="font-display text-lg font-semibold text-bone">
                  {it.title}
                </p>
              </figcaption>

              {!it.src && (
                <span className="absolute right-3 top-3 font-mono text-[8px] uppercase tracking-[0.2em] text-bone-faint">
                  [ foto em breve ]
                </span>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
