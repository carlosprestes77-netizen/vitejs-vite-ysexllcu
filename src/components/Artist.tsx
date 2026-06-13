import Reveal from './Reveal';

export default function Artist() {
  return (
    <section
      id="artista"
      className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-10"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        {/* portrait placeholder */}
        <Reveal className="lg:col-span-5">
          <div className="group relative aspect-[4/5] overflow-hidden border border-bone/10 bg-gradient-to-b from-ink-700 to-ink">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-gothic text-4xl text-bone/10">
                retrato do artista
              </span>
            </div>
            <span className="absolute left-3 top-3 font-mono text-[8px] uppercase tracking-[0.2em] text-bone-faint">
              [ foto do tatuador ]
            </span>
            {/* nameplate */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink to-transparent p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                Artista residente
              </p>
              <p className="font-display text-2xl font-bold text-bone">
                [ nome do artista ]
              </p>
            </div>
          </div>
        </Reveal>

        {/* bio */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-blood">
              ⊹ Nº 04 · O Artista
            </p>
            <h2 className="mt-4 font-display text-4xl font-light leading-[1.2] text-bone sm:text-5xl">
              “A pele me diz <span className="italic">onde a linha</span> quer
              ir.”
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-sm font-light leading-relaxed text-bone-dim">
              Espaço reservado para a bio — anos de carreira, formação, estilos
              de assinatura, prêmios e a filosofia por trás de cada peça. Mande
              o texto e as infos que eu encaixo aqui com capricho.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-bone/10 bg-bone/10 sm:grid-cols-4">
            {[
              { k: 'Anos', v: '—' },
              { k: 'Peças', v: '—' },
              { k: 'Estilos', v: '—' },
              { k: 'Cidade', v: '—' },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 0.08}>
                <div className="bg-ink p-6 text-center">
                  <p className="font-display text-3xl font-black text-bone">
                    {s.v}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-faint">
                    {s.k}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* social placeholders */}
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Instagram', 'TikTok', 'Behance', 'WhatsApp'].map((s) => (
                <a
                  key={s}
                  href="#agendar"
                  className="border border-bone/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim transition-all hover:border-blood hover:text-blood"
                >
                  {s}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
