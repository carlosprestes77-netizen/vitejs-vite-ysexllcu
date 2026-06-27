import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { hash } from './util';

type Dot = { x: number; y: number; r: number; o: number };

/**
 * A dotwork (pontilhismo) sphere — thousands of stippled points whose density
 * and size follow Lambert sphere shading. The signature technique of the
 * atelier, rendered as living SVG.
 */
function buildOrb(size: number, step: number): Dot[] {
  const R = size / 2;
  const dots: Dot[] = [];
  const L = { x: -0.55, y: -0.62, z: 0.56 }; // light from upper-left
  const n = Math.ceil(size / step);

  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const px = i * step;
      const py = j * step;
      const rr = Math.sqrt(px * px + py * py) / R;
      if (rr > 1) continue;

      const nx = px / R;
      const ny = py / R;
      const nz = Math.sqrt(Math.max(0, 1 - rr * rr));
      const lambert = Math.max(0, nx * L.x + ny * L.y + nz * L.z);
      const shadow = 1 - lambert; // 0 lit … 1 dark
      const rim = Math.pow(rr, 3) * 0.45; // edge core-shadow
      const dark = Math.min(1, shadow * 0.9 + rim);

      const keep = 0.1 + dark * 0.95;
      if (hash(i, j) > keep) continue;

      const jx = (hash(i + 13, j) - 0.5) * step * 0.55;
      const jy = (hash(i, j + 7) - 0.5) * step * 0.55;
      dots.push({
        x: R + px + jx,
        y: R + py + jy,
        r: step * (0.11 + dark * 0.19),
        o: 0.3 + dark * 0.6,
      });
    }
  }
  return dots;
}

export default function Dotwork({
  size = 220,
  step = 9,
  color = '#efe9dd',
  className = '',
  delay = 0,
}: {
  size?: number;
  step?: number;
  color?: string;
  className?: string;
  delay?: number;
}) {
  const dots = useMemo(() => buildOrb(size, step), [size, step]);
  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {dots.map((d, k) => (
        <circle key={k} cx={d.x} cy={d.y} r={d.r} fill={color} opacity={d.o} />
      ))}
    </motion.svg>
  );
}
