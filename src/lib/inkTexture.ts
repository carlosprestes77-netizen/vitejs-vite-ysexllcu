import * as THREE from 'three';

/**
 * Generates a tall canvas texture covered in tattoo-style line art
 * (sacred geometry, sun, all-seeing eye, serpent, dagger, moon phases).
 * White glowing strokes on black so it can be used as an emissive map:
 * only the engraved lines light up on the dark stone.
 */
export function createInkTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 2560;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = w / 2;

  // ---- Panel 1: radiant sun with all-seeing eye ----
  sun(ctx, cx, 380, 200);
  eye(ctx, cx, 380, 120);

  divider(ctx, w, 640);

  // ---- Panel 2: sacred geometry — flower of life fragment ----
  flowerOfLife(ctx, cx, 940, 110);

  divider(ctx, w, 1240);

  // ---- Panel 3: coiled serpent ----
  serpent(ctx, cx, 1560, 230);

  divider(ctx, w, 1880);

  // ---- Panel 4: dagger through a crescent ----
  crescent(ctx, cx, 2160, 150);
  dagger(ctx, cx, 2160, 320);

  // scattered dotwork stars for atmosphere
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 2.2 + 0.4;
    ctx.globalAlpha = Math.random() * 0.7 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function sun(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.lineWidth = 3;
  const rays = 32;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const inner = r * (i % 2 === 0 ? 1.05 : 1.0);
    const outer = r * (i % 2 === 0 ? 1.5 : 1.28);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
    ctx.lineTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function eye(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x, y - w * 0.6, x + w, y);
  ctx.quadraticCurveTo(x, y + w * 0.6, x - w, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, w * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, w * 0.14, 0, Math.PI * 2);
  ctx.fill();
}

function flowerOfLife(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(x, y, r * 1.7, 0, Math.PI * 2);
  ctx.stroke();
}

function serpent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.lineWidth = 6;
  ctx.beginPath();
  const turns = 3.2;
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2 * turns;
    const rad = size * (1 - t * 0.78);
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad * 0.92;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  // head
  ctx.beginPath();
  ctx.arc(x + size, y, 14, 0, Math.PI * 2);
  ctx.fill();
}

function crescent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI * 0.35, Math.PI * 1.65);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + r * 0.45, y, r * 0.92, Math.PI * 0.5, Math.PI * 1.5, true);
  ctx.stroke();
}

function dagger(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number
) {
  ctx.lineWidth = 4;
  // blade
  ctx.beginPath();
  ctx.moveTo(x, y - len * 0.55);
  ctx.lineTo(x - 16, y + len * 0.25);
  ctx.lineTo(x, y + len * 0.32);
  ctx.lineTo(x + 16, y + len * 0.25);
  ctx.closePath();
  ctx.stroke();
  // guard
  ctx.beginPath();
  ctx.moveTo(x - 46, y + len * 0.25);
  ctx.lineTo(x + 46, y + len * 0.25);
  ctx.stroke();
  // handle
  ctx.beginPath();
  ctx.moveTo(x, y + len * 0.25);
  ctx.lineTo(x, y + len * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y + len * 0.54, 9, 0, Math.PI * 2);
  ctx.stroke();
}

function divider(ctx: CanvasRenderingContext2D, w: number, y: number) {
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(w * 0.2, y);
  ctx.lineTo(w * 0.42, y);
  ctx.moveTo(w * 0.58, y);
  ctx.lineTo(w * 0.8, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w * 0.5, y, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}
