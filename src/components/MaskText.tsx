import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

export default function MaskText({
  children,
  className = '',
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        style={style}
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
