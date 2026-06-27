import { motion } from 'framer-motion';
import SacredGeometry from './art/SacredGeometry';
import Constellation from './art/Constellation';
import Meander from './art/Meander';

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative z-10 flex min-h-screen flex-col justify-between overflow-hidden px-7 pb-8 pt-24 sm:px-12 sm:pb-12 sm:pt-28"
    >
      {/* ── Sacred-geometry halo, framing the marble bust behind it ──────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-start justify-center"
      >
        <div className="relative mt-[11vh] aspect-square w-[min(94vw,640px)]">
          <div className="absolute inset-0 animate-spin-slow">
            <SacredGeometry stroke="#b08d57" opacity={0.34} className="h-full w-full" />
          </div>
          <div className="absolute inset-[19%] animate-spin-rev">
            <SacredGeometry
              stroke="#efe9dd"
              opacity={0.16}
              baseDelay={0.3}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Constellation accent ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-[15%] hidden w-[240px] animate-float-slow opacity-60 sm:block"
      >
        <Constellation className="h-auto w-full" />
      </div>

      {/* ── Top corner labels ────────────────────────────────────────────── */}
      <div className="relative flex w-full items-start justify-between">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] uppercase tracking-[0.45em] text-gold/75"
        >
          Linha · Ponto · Permanência
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] uppercase tracking-[0.45em] text-bone/30"
        >
          Est.&nbsp;MMXXIV
        </motion.p>
      </div>

      {/* ── Bottom block: Greek line, wordmark, tagline, meander ─────────── */}
      <div className="relative">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.4 }}
          className="mb-3 font-sans text-[11px] uppercase tracking-[0.55em] text-bone/40"
        >
          ΤΕΧΝΗ&nbsp;ΑΘΑΝΑΤΟΣ — arte imortal
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light italic leading-[0.82] tracking-[-0.02em] text-bone"
            style={{ fontSize: 'clamp(4rem, 19vw, 16rem)' }}
          >
            Obsidian
          </motion.h1>
        </div>

        <div className="mt-6 flex items-end justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.4 }}
            className="max-w-xs font-sans text-[12px] font-light leading-[1.8] text-bone/55"
          >
            A linha é a lei. O ponto é o tempo.
            <br />
            Tatuagem neoclássica — fine line &amp; pontilhismo.
          </motion.p>

          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden h-16 w-px origin-top animate-pulse-soft bg-gradient-to-b from-gold/60 to-transparent sm:block"
          />
        </div>

        <div className="mt-8">
          <Meander height={16} unit={16} opacity={0.4} idKey="hero" className="w-full" />
        </div>
      </div>
    </section>
  );
}
