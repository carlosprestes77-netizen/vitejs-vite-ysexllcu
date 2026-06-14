import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Reveal from './Reveal';

const LINES = [
  { t: 'Não tatuamos', italic: false, d: 0 },
  { t: 'a moda.', italic: true, d: 0.09 },
  { t: 'Esculpimos sobre o corpo', italic: false, d: 0.18 },
  { t: 'aquilo que o tempo respeita —', italic: true, d: 0.27 },
  { t: 'a linha, a proporção,', italic: false, d: 0.36 },
  { t: 'o silêncio.', italic: true, d: 0.45 },
];

const PILLARS = [
  {
    n: '01',
    title: 'A Linha',
    body: 'Precisão como reverência. Cada traço é uma decisão irreversível que existirá além de nós.',
  },
  {
    n: '02',
    title: 'A Proporção',
    body: 'O corpo como escultura viva. A anatomia guia, nunca obstrui. A forma serve o espírito.',
  },
  {
    n: '03',
    title: 'O Silêncio',
    body: 'O vazio é tão expressivo quanto a tinta. O que não se tatua define o que se grava.',
  },
];

function LineMask({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  return (
    <div ref={ref} className="overflow-hidden pb-[0.06em]">
      <motion.div
        initial={{ y: '112%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative z-10 px-7 py-36 sm:px-12 lg:py-44"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <Reveal>
          <p className="mb-20 font-mono text-[9px] uppercase tracking-[0.6em] text-gold/60">
            i — manifesto
          </p>
        </Reveal>

        {/* Per-line mask statement */}
        <div className="mb-24 border-l border-gold/25 pl-7 sm:pl-14">
          {LINES.map((l, i) => (
            <LineMask key={i} delay={l.d}>
              <p
                className={`font-display font-light leading-[1.0] ${
                  l.italic ? 'italic text-bone-dim' : 'text-bone'
                }`}
                style={{ fontSize: 'clamp(2.2rem, 6.5vw, 5.2rem)' }}
              >
                {l.t}
              </p>
            </LineMask>
          ))}
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 border-t border-bone/10 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.09}>
              <div className="flex flex-col gap-4 py-10 sm:border-l sm:border-bone/10 sm:px-10 sm:first:border-l-0 sm:first:pl-0">
                <span className="font-mono text-[9px] tracking-[0.45em] text-gold/55">
                  {p.n}
                </span>
                <h3 className="font-display text-2xl font-light italic text-bone">
                  {p.title}
                </h3>
                <p className="text-[13px] font-light leading-[1.8] text-bone-faint">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
