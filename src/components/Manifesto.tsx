import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative z-10 flex min-h-[80vh] items-center justify-center px-6 py-40"
    >
      <div className="max-w-3xl text-center">
        <Reveal>
          <p className="mb-10 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">
            i — manifesto
          </p>
        </Reveal>
        <MaskText className="font-display text-3xl font-light leading-[1.35] text-bone sm:text-4xl lg:text-[2.7rem]">
          Não tatuamos a moda.{' '}
          <span className="italic text-bone-dim">
            Esculpimos sobre o corpo aquilo que o tempo respeita
          </span>{' '}
          — a linha clássica, a proporção, o silêncio.
        </MaskText>
      </div>
    </section>
  );
}
