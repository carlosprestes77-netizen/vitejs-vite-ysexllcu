import Reveal from './Reveal';

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-10 lg:py-44"
    >
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="vertical mx-auto font-mono text-[11px] uppercase tracking-[0.4em] text-bone-faint lg:mx-0">
              ⊹ Manifesto ⊹ Nº 01
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-9">
          <Reveal>
            <h2 className="font-display text-3xl font-light leading-[1.25] text-bone sm:text-4xl lg:text-[2.9rem]">
              Não fazemos tatuagens.{' '}
              <span className="italic text-bone-dim">
                Esculpimos memória sobre o corpo
              </span>{' '}
              — cada traço é decisão, cada sombra tem peso, e o resultado{' '}
              <span className="text-blood">envelhece junto com você.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Projeto único',
                d: 'Nenhum desenho se repete. Estudamos sua história, seu corpo e a luz da pele antes da agulha tocar.',
              },
              {
                n: '02',
                t: 'Técnica & higiene',
                d: 'Material descartável, biossegurança total e equipamentos de ponta. Arte séria pede rigor.',
              },
              {
                n: '03',
                t: 'Experiência',
                d: 'Um espaço pensado como galeria. Som, café, conforto — o ritual importa tanto quanto a obra.',
              },
            ].map((b, i) => (
              <Reveal key={b.n} delay={i * 0.12}>
                <div className="border-t border-bone/15 pt-5">
                  <span className="font-mono text-xs text-blood">{b.n}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-bone">
                    {b.t}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-bone-dim">
                    {b.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
