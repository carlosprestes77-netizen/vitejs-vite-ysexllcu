import Reveal from './Reveal';

export default function Studio() {
  return (
    <section
      id="estudio"
      className="relative z-10 border-y border-bone/10 bg-ink-800/40 py-32 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* text */}
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-blood">
                ⊹ Nº 03 · O Espaço
              </p>
              <h2 className="mt-4 font-display text-5xl font-black leading-[0.95] text-bone sm:text-7xl">
                Um estúdio <br />
                <span className="italic text-bone-dim">como galeria</span>
              </h2>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-bone-dim">
                Luz baixa, concreto, plantas e vinil girando. Um lugar para
                desacelerar antes do ritual. Aqui entram as fotos reais do
                espaço — recepção, cabines privativas e a parede de flash.
              </p>

              <div className="mt-10 flex gap-10">
                {[
                  { k: 'Privativo', v: 'Cabines' },
                  { k: 'Biossegurança', v: '100%' },
                  { k: 'Atendimento', v: 'Hora marcada' },
                ].map((s) => (
                  <div key={s.k}>
                    <p className="font-display text-2xl font-bold text-bone">
                      {s.v}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
                      {s.k}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* photo placeholders */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { h: 'h-64', label: 'Recepção' },
              { h: 'h-44', label: 'Flash wall' },
              { h: 'h-44', label: 'Cabine' },
              { h: 'h-64', label: 'Detalhe' },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 0.1} className={i % 3 === 0 ? 'row-span-2' : ''}>
                <div
                  className={`group relative ${
                    i % 3 === 0 ? 'h-full min-h-[18rem]' : p.h
                  } overflow-hidden border border-bone/10 bg-gradient-to-br from-ink-700 to-ink`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-gothic text-3xl text-bone/10">
                      {p.label}
                    </span>
                  </div>
                  <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.2em] text-bone-faint">
                    [ foto do espaço ]
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
