import Reveal from './Reveal';
import MaskText from './MaskText';

export default function Studio() {
  return (
    <section id="estudio" className="relative z-10 mx-auto max-w-6xl px-6 py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/70">
              iii — o espaço
            </p>
          </Reveal>
          <MaskText className="font-display text-4xl font-light leading-[1.1] text-bone sm:text-5xl">
            Um estúdio <span className="italic text-bone-dim">como galeria</span>
          </MaskText>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-bone-dim">
              Luz baixa, concreto e silêncio. Atendimento privativo, hora
              marcada. As fotos do espaço entram aqui.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ink-700 to-ink" />
        </Reveal>
      </div>
    </section>
  );
}
