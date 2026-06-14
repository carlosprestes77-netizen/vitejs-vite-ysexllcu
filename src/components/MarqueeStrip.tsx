const T = 'OBSIDIAN · ARTE · PERMANÊNCIA · NEOCLÁSSICO · ESCULTURA · TINTA · PELE · SILÊNCIO · LINHA · ';

export default function MarqueeStrip() {
  return (
    <div className="relative z-10 overflow-hidden border-y border-bone/8 py-3.5">
      <p className="animate-marquee whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.6em] text-bone/20">
        {T.repeat(6)}
      </p>
    </div>
  );
}
