import Reveal from './Reveal';
import MaskText from './MaskText';

const METRICS = [
  { n: '100%', label: 'Privativo' },
  { n: '1:1', label: 'Atendimento' },
  { n: '∞', label: 'Cuidado' },
];

export default function Studio() {
  return (
    <section
      id="estudio"
      className="relative z-10 overflow-hidden px-7 py-36 sm:px-12 lg:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-10 select-none font-display text-[clamp(8rem,30vw,22rem)] font-light italic leading-none text-bone/[0.025] sm:right-16"
      >
        IV
      </div>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-16 font-sans text-[10px] uppercase tracking-[0.55em] text-gold/60">
            ΝΑΟΣ · o espaço
          </p>
        </Reveal>

        <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-28">
          <div>
            <MaskText
              className="font-display font-light leading-[1.05] text-bone"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}
            >
              Um espaço <span className="italic text-bone-dim">como templo</span>
            </MaskText>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-[13px] font-light leading-[1.9] text-bone-faint">
                Luz baixa. Concreto bruto. Som de vinil. O estúdio foi concebido
                como extensão da filosofia do trabalho — um lugar onde a atenção
                é total e o tempo não tem pressa.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-14 grid grid-cols-3 gap-6 border-t border-bone/10 pt-8">
                {METRICS.map((m) => (
                  <div key={m.n}>
                    <p className="font-display text-3xl font-light italic text-bone">
                      {m.n}
                    </p>
                    <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.4em] text-bone-faint">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="relative">
            <div className="dots aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ink-700 to-ink">
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-bone/10">
                  Fotos do espaço em breve
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 h-24 w-24 border border-gold/15" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
