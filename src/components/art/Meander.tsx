/**
 * The Greek meander (key / fret) — drawn as a tiling pattern so it can run
 * any width or fill any block. The hook is designed on a 24-unit grid and
 * scaled to `unit`.
 */
export default function Meander({
  height = 22,
  unit = 22,
  stroke = '#b08d57',
  opacity = 0.5,
  className = '',
  idKey = '',
}: {
  height?: number;
  unit?: number;
  stroke?: string;
  opacity?: number;
  className?: string;
  idKey?: string;
}) {
  const id = `meander-${unit}-${height}-${idKey}`;
  const s = unit / 24;
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <pattern id={id} width={unit} height={unit} patternUnits="userSpaceOnUse">
          <path
            transform={`scale(${s})`}
            d="M0,21 H24 M3,21 V3 H21 V21 H9 V9 H15 V15"
            fill="none"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
