import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** A quiet, elegant curtain that lifts away on load. */
export default function CinematicIntro() {
  const [done, setDone] = useState(false);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9996] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-3xl font-light text-bone sm:text-4xl"
            >
              OBSIDIAN
            </motion.span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 block h-px w-24 origin-center bg-gold/60"
              onAnimationComplete={() => setTimeout(() => setDone(true), 500)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
