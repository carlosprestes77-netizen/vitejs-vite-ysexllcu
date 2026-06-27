import { motion } from 'framer-motion';
import { polar } from './util';

const C = 100;
const CIRCLES = [30, 50, 72, 90];
const TICKS = Array.from({ length: 48 }, (_, i) => i * (360 / 48));
const HEX = Array.from({ length: 6 }, (_, i) => polar(C, C, 72, i * 60 - 90));
const HEX_PATH = 'M' + HEX.map((p) => p.join(',')).join(' L') + ' Z';
const FLOWER = Array.from({ length: 6 }, (_, i) => polar(C, C, 16, i * 60));

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: '-8%' },
  transition: { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/**
 * Sacred-geometry mandala — concentric circles, a flower of life, a hexagon
 * and a radiant tick-ring, all drawn in a single hairline weight. Each path
 * "draws itself" on scroll via framer's pathLength animation.
 */
export default function SacredGeometry({
  stroke = '#b08d57',
  className = '',
  baseDelay = 0,
  opacity = 1,
}: {
  stroke?: string;
  className?: string;
  baseDelay?: number;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={0.6}
      style={{ opacity }}
    >
      {CIRCLES.map((r, i) => (
        <motion.circle key={r} cx={C} cy={C} r={r} {...draw(baseDelay + i * 0.1)} />
      ))}

      <motion.path d={HEX_PATH} {...draw(baseDelay + 0.28)} />

      {TICKS.map((a, i) => {
        const long = i % 6 === 0;
        const [x1, y1] = polar(C, C, 90, a);
        const [x2, y2] = polar(C, C, long ? 98 : 94, a);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            {...draw(baseDelay + 0.35 + i * 0.008)}
          />
        );
      })}

      <motion.circle cx={C} cy={C} r={16} {...draw(baseDelay + 0.5)} />
      {FLOWER.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={16} {...draw(baseDelay + 0.55 + i * 0.05)} />
      ))}
    </svg>
  );
}
