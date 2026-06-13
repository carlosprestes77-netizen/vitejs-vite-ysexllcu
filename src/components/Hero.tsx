import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-28 lg:px-10"
    >
      {/* top status line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone-faint"
      >
        <span>23°33′S 46°38′W</span>
        <span className="hidden sm:block">Estúdio Autoral · Hora Marcada</span>
        <span>Est. MMXIV</span>
      </motion.div>

      {/* center headline framing the monolith */}
      <div className="pointer-events-none relative flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.5em] text-blood"
        >
          ⊹ Tatuagem como obra viva ⊹
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[18vw] font-black leading-[0.82] tracking-tight text-bone sm:text-[15vw] lg:text-[11rem]"
        >
          <span className="block text-stroke">A PELE</span>
          <span className="block italic">é tela</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-8 max-w-md text-balance font-sans text-sm font-light leading-relaxed text-bone-dim"
        >
          Linhas que respiram, sombras com profundidade, geometria sagrada.
          Cada peça é única — desenhada para o corpo que a carrega.
        </motion.p>
      </div>

      {/* bottom row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="flex items-end justify-between"
      >
        <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bone-faint sm:block">
          <span className="text-gold">↻</span> role para girar o monolito
        </div>

        <div className="mx-auto flex flex-col items-center gap-2 sm:mx-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone-dim">
            scroll
          </span>
          <span className="block h-12 w-px animate-pulse-soft bg-gradient-to-b from-bone to-transparent" />
        </div>

        <div className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bone-faint sm:block">
          01 / 05
        </div>
      </motion.div>
    </section>
  );
}
