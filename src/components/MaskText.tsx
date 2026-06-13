import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** A line of type that rises from behind a mask edge as it enters view —
 *  the signature "editorial" reveal of award-winning sites. */
export default function MaskText({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '115%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
