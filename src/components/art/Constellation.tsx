import { motion } from 'framer-motion';

// A small invented constellation — points joined by thin lines, the way a
// star map (or a fine-line tattoo) charts the myths.
const P: [number, number][] = [
  [40, 150],
  [82, 92],
  [120, 120],
  [152, 58],
  [188, 108],
  [224, 42],
  [248, 96],
  [272, 150],
  [160, 162],
  [104, 30],
];
const E: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [2, 8],
  [1, 9],
];

export default function Constellation({
  className = '',
  color = '#efe9dd',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 300 200" className={className} fill="none">
      {E.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={P[a][0]}
          y1={P[a][1]}
          x2={P[b][0]}
          y2={P[b][1]}
          stroke={color}
          strokeWidth={0.5}
          opacity={0.45}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {P.map(([x, y], i) => {
        const bright = i % 4 === 0;
        return (
          <g key={i}>
            {bright && (
              <motion.circle
                cx={x}
                cy={y}
                r={5}
                fill={color}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.12 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
              />
            )}
            <motion.circle
              cx={x}
              cy={y}
              r={bright ? 2.1 : 1.2}
              fill={color}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: bright ? 0.95 : 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45 + i * 0.08 }}
            />
          </g>
        );
      })}
    </svg>
  );
}
