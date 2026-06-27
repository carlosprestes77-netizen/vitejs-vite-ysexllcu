import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Artist() {
  return (
    <section
      id="artista"
      className="relative z-10 overflow-hidden px-7 py-36 sm:px-12 lg:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-4 top-10 select-none font-display text-[clamp(8rem,30vw,22rem)] font-light italic leading-none text-bone/[0.025]"
      >
        V
      </div>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-16 font-sans text-[10px] uppercase tracking-[0.55em] text-gold/60">
            ΤΕΧΝΙΤΗΣ · o artista
          </p>
        </Reveal>

        <div className="mb-20">
          <MaskText
            className="font-display font-light leading-[1.0] text-bone"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
          >
            “A pele me diz
          </MaskText>
          <MaskText
            className="font-display font-light italic leading-[1.0] text-bone-dim"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
            delay={0.08}
          >
            onde a linha quer ir.”
          </MaskText>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal delay={0.05}>
            <div className="dots aspect-[4/5] w-full max-w-xs overflow-hidden bg-gradient-to-b from-ink-700 to-ink lg:max-w-[320px]">
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-bone/10">
                  Retrato em breve
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:pt-4">
            <Reveal>
              <h3 className="font-display text-3xl font-light italic text-bone">
                Nome do Artista
              </h3>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-gold/60">
                Fundador · Tatuador Chefe
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-[13px] font-light leading-[1.9] text-bone-faint">
                Espaço reservado para a biografia, formação e filosofia do artista
                — uma trajetória dedicada à linha precisa e ao ponto paciente.
                Arte permanente que resiste ao tempo tanto quanto à tendência.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-10 flex flex-wrap gap-7 font-mono text-[9px] uppercase tracking-[0.4em] text-bone-faint">
                <a href="#" className="transition-colors hover:text-gold">Instagram</a>
                <a href="#" className="transition-colors hover:text-gold">Behance</a>
                <a href="#" className="transition-colors hover:text-gold">WhatsApp</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
