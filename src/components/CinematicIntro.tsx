import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** A short film title-card that lifts away on load (or on click to skip). */
export default function CinematicIntro() {
  const [done, setDone] = useState(false);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9996] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onClick={() => setDone(true)}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-bone-faint"
          >
            Obsidian apresenta
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-6xl font-black tracking-[0.15em] text-bone sm:text-8xl"
          >
            OBSIDIAN
          </motion.h1>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-6 block h-px w-40 origin-center bg-blood"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-6 font-display text-sm italic text-bone-dim"
          >
            uma obra em movimento
          </motion.p>

          {/* auto-dismiss timer */}
          <motion.div
            className="absolute bottom-12 font-mono text-[9px] uppercase tracking-[0.3em] text-bone-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, times: [0, 0.2, 0.85, 1] }}
            onAnimationComplete={() => setDone(true)}
          >
            toque para entrar
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
