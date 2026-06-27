import Reveal from './Reveal';
import MaskText from './MaskText';
import SacredGeometry from './art/SacredGeometry';
import Dotwork from './art/Dotwork';
import Meander from './art/Meander';

const CARDS = [
  {
    gr: 'ΓΡΑΜΜΗ',
    title: 'Fine Line',
    body: 'A linha única, contínua, sem hesitação — o desenho reduzido à sua essência. Precisão de bisturi, peso de gravura.',
    art: <SacredGeometry stroke="#efe9dd" opacity={0.85} className="h-[82%] w-[82%]" />,
  },
  {
    gr: 'ΣΤΙΓΜΗ',
    title: 'Pontilhismo',
    body: 'Milhares de pontos que constroem luz e sombra. Dotwork: o tempo medido em estigmas, profundidade feita de paciência.',
    art: <Dotwork size={220} step={8} color="#efe9dd" className="h-[80%] w-[80%]" />,
  },
  {
    gr: 'ΜΑΙΑΝΔΡΟΣ',
    title: 'Geométrico',
    body: 'Geometria sagrada e o meandro grego. Ordem, simetria e o eterno retorno da forma — blackwork com rigor de templo.',
    art: (
      <div className="h-[78%] w-[78%] overflow-hidden opacity-80">
        <Meander height={180} unit={30} stroke="#efe9dd" opacity={0.9} idKey="card" />
      </div>
    ),
  },
];

export default function Technique() {
  return (
    <section id="tecnica" className="relative z-10 mx-auto max-w-7xl px-7 py-32 sm:px-12">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <Reveal>
            <p className="mb-5 font-sans text-[10px] uppercase tracking-[0.55em] text-gold/60">
              ΤΕΧΝΗ · o ofício
            </p>
          </Reveal>
          <MaskText className="font-display text-5xl font-light italic text-bone sm:text-7xl">
            O método
          </MaskText>
        </div>
        <Reveal>
          <p className="hidden font-mono text-[9px] uppercase tracking-[0.5em] text-bone/30 sm:block">
            ii — técnica
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1} y={24}>
            <article className="group flex h-full flex-col border border-bone/10 bg-ink-900/40 transition-colors duration-700 hover:border-gold/25">
              <div className="dots relative flex aspect-square items-center justify-center overflow-hidden border-b border-bone/10">
                {c.art}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold/70">
                  {c.gr}
                </p>
                <h3 className="mt-2 font-display text-2xl font-light italic text-bone">
                  {c.title}
                </h3>
                <p className="mt-4 text-[13px] font-light leading-[1.85] text-bone-faint">
                  {c.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
