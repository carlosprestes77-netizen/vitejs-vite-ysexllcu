import { useEffect, useRef, useState } from 'react';

/** A lagging ring + crosshair dot that swells over interactive elements.
 *  Disabled automatically on touch / coarse-pointer devices. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      const el = e.target as HTMLElement;
      setHovering(
        !!el.closest('a, button, [data-cursor="hover"], input, textarea, label')
      );
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[width,height,margin,border-color,background-color] duration-300 ease-out"
        style={{
          borderColor: hovering ? '#c1121f' : '#c8a45c',
          width: hovering ? 64 : 40,
          height: hovering ? 64 : 40,
          marginLeft: hovering ? -32 : -20,
          marginTop: hovering ? -32 : -20,
          mixBlendMode: 'difference',
          backgroundColor: hovering ? 'rgba(193,18,31,0.08)' : 'transparent',
        }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-bone"
        style={{ mixBlendMode: 'difference' }}
      />
    </>
  );
}
