const WORDS = [
  'BLACKWORK',
  'FINE LINE',
  'DOTWORK',
  'GEOMÉTRICO',
  'ORNAMENTAL',
  'REALISMO',
  'NEOTRAD',
  'LETTERING',
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-bone/10 bg-ink/40 py-5 backdrop-blur-sm">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl font-bold italic tracking-wide text-bone-dim"
          >
            {w}
            <span className="text-blood not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
