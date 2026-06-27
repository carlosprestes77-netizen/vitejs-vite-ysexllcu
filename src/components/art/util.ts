// Deterministic helpers for the procedurally generated line + dot artwork.
// No Math.random — stable across renders (and SSR-safe).

export function hash(i: number, j: number): number {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function polar(
  cx: number,
  cy: number,
  r: number,
  deg: number,
): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
