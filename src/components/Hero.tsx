import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.4 }}
        className="mb-8 font-mono text-[10px] uppercase tracking-[0.5em] text-gold/80"
      >
        Atelier de tatuagem
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[15vw] font-light italic leading-[0.85] tracking-tight text-bone sm:text-[12vw] lg:text-[9rem]"
      >
        Obsidian
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.4 }}
        className="mt-8 max-w-sm text-balance font-sans text-sm font-light leading-relaxed text-bone-dim"
      >
        A pele como mármore. A linha como escultura.
      </motion.p>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        className="absolute bottom-10 left-1/2 block h-14 w-px -translate-x-1/2 animate-pulse-soft bg-gradient-to-b from-bone/50 to-transparent"
      />
    </section>
  );
}
