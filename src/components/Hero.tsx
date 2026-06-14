import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative z-10 flex min-h-screen flex-col justify-between px-7 pt-9 pb-10 sm:px-12 sm:pt-12 sm:pb-14"
    >
      {/* ── Top row: editorial corner labels ─────────────────────────── */}
      <div className="flex w-full items-start justify-between">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] uppercase tracking-[0.5em] text-gold/75"
        >
          Atelier de tatuagem
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[9px] uppercase tracking-[0.5em] text-bone/30"
        >
          Est.&nbsp;MMXXIV
        </motion.p>
      </div>

      {/* ── Bottom section: enormous title + footer row ───────────────── */}
      <div>
        {/* Mask-reveal on the wordmark — slides up from below */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '108%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.65, duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light italic leading-[0.86] tracking-[-0.02em] text-bone"
            style={{ fontSize: 'clamp(4.2rem, 20vw, 16.5rem)' }}
          >
            Obsidian
          </motion.h1>
        </div>

        {/* Footer row: tagline left, scroll line right */}
        <div className="mt-5 flex items-end justify-between sm:mt-7">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 1.4 }}
            className="font-sans text-[11px] font-light leading-[1.75] text-bone/55"
          >
            A pele como mármore.<br />
            A linha como escultura.
          </motion.p>

          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="block h-14 w-px origin-top animate-pulse-soft bg-gradient-to-b from-bone/45 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
