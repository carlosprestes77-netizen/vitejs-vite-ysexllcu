import { useEffect, useRef, useState } from 'react';

/** Ticking film timecode: HH:MM:SS:FF (24fps). */
function Timecode() {
  const [tc, setTc] = useState('00:00:00:00');
  const start = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - start.current) / 1000;
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = Math.floor(elapsed % 60);
      const f = Math.floor((elapsed % 1) * 24);
      const p = (n: number) => String(n).padStart(2, '0');
      setTc(`${p(h)}:${p(m)}:${p(s)}:${p(f)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <span className="tabular-nums">{tc}</span>;
}

/** Full-screen cinematic treatment applied over the whole site:
 *  color grade, drifting light leak, scanlines, letterbox bars + camera HUD. */
export default function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9990]">
      {/* color grade + leak + scanlines */}
      <div className="cine-grade absolute inset-0" />
      <div className="cine-leak absolute inset-0" />
      <div className="cine-scan absolute inset-0" />

      {/* letterbox bars (height animates in via the .cine-bar keyframe) */}
      <div className="cine-bar absolute inset-x-0 top-0 h-[22px] bg-ink">
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
      <div className="cine-bar absolute inset-x-0 bottom-0 h-[22px] bg-ink">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* camera HUD */}
      <div className="absolute bottom-7 left-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim mix-blend-difference">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blood" />
        REC
      </div>
      <div className="absolute bottom-7 right-5 font-mono text-[10px] tracking-[0.2em] text-bone-dim mix-blend-difference">
        <Timecode />
      </div>
      <div className="absolute top-7 left-5 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint mix-blend-difference">
        24 FPS · 2.39:1
      </div>
      <div className="absolute top-7 right-5 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint mix-blend-difference">
        ISO 800 · ƒ1.4
      </div>
    </div>
  );
}
