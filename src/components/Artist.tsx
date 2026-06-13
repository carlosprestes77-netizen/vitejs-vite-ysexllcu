import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Artist() {
  return (
    <section id="artista" className="relative z-10 mx-auto max-w-6xl px-6 py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-ink-700 to-ink" />
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">
              iv — o artista
            </p>
          </Reveal>
          <MaskText className="font-display text-4xl font-light leading-[1.2] text-bone sm:text-5xl">
            “A pele me diz <span className="italic">onde a linha</span> quer ir.”
          </MaskText>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-bone-dim">
              Espaço reservado para a biografia, formação e filosofia do artista.
            </p>
            <div className="mt-10 flex gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone-faint">
              <a href="#agendar" className="transition-colors hover:text-gold">Instagram</a>
              <a href="#agendar" className="transition-colors hover:text-gold">Behance</a>
              <a href="#agendar" className="transition-colors hover:text-gold">WhatsApp</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
