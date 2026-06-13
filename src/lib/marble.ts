import * as THREE from 'three';

export type Specimen = 'forearm' | 'arm' | 'back';

const IVORY = '#efe9dd';
const VEIN = 'rgba(150,142,128,0.22)';
const CRACK = 'rgba(90,82,70,0.18)';
const INK = 'rgba(32,28,23,0.88)';
const INK_SOFT = 'rgba(32,28,23,0.5)';

/**
 * Builds a marble color map with a neoclassical tattoo carved into it:
 * ivory statuary base + soft grey veining + Greco-Roman line art
 * (Greek profile, meander border, laurel). One canvas per specimen.
 */
export function createMarbleTattoo(kind: Specimen): THREE.CanvasTexture {
  const portrait = kind !== 'back';
  const w = portrait ? 1024 : 2048;
  const h = portrait ? 2048 : 1536;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // --- marble base + veining ---
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#f3eee5');
  grad.addColorStop(0.5, IVORY);
  grad.addColorStop(1, '#e3dccd');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  marbleVeins(ctx, w, h);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // --- tattoo motifs per specimen ---
  if (kind === 'forearm') {
    meanderColumn(ctx, w * 0.5, w);
    laurel(ctx, w * 0.5, h * 0.5, h * 0.4);
  } else if (kind === 'arm') {
    meanderBorderV(ctx, w, h);
    profileMedallion(ctx, w * 0.5, h * 0.42, w * 0.32);
    laurelArc(ctx, w * 0.5, h * 0.74, w * 0.3);
  } else {
    meanderFrame(ctx, w, h);
    profileMedallion(ctx, w * 0.5, h * 0.46, h * 0.26);
    wings(ctx, w * 0.5, h * 0.46, h * 0.34);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function marbleVeins(ctx: CanvasRenderingContext2D, w: number, h: number) {
  for (let i = 0; i < 14; i++) {
    ctx.strokeStyle = i % 4 === 0 ? CRACK : VEIN;
    ctx.lineWidth = Math.random() * 2.5 + 0.5;
    ctx.beginPath();
    let x = Math.random() * w;
    let y = -20;
    ctx.moveTo(x, y);
    const steps = 14;
    for (let s = 0; s < steps; s++) {
      x += (Math.random() - 0.5) * w * 0.22;
      y += h / steps;
      ctx.quadraticCurveTo(
        x + (Math.random() - 0.5) * 60,
        y - h / steps / 2,
        x,
        y
      );
    }
    ctx.stroke();
  }
  // faint speckle
  ctx.fillStyle = 'rgba(120,112,98,0.05)';
  for (let i = 0; i < 400; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** A stylised Greek profile (faces right), the centrepiece motif. */
function profileMedallion(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  // medallion rings
  ctx.strokeStyle = INK_SOFT;
  ctx.lineWidth = r * 0.012;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.12, 0, Math.PI * 2);
  ctx.stroke();

  // face contour (normalised, faces right)
  ctx.strokeStyle = INK;
  ctx.lineWidth = r * 0.03;
  const s = r * 1.5;
  const P = (px: number, py: number): [number, number] => [
    (px - 0.42) * s,
    (py - 0.5) * s,
  ];
  ctx.beginPath();
  ctx.moveTo(...P(0.34, 0.08)); // forehead top
  ctx.bezierCurveTo(...P(0.5, 0.12), ...P(0.56, 0.2), ...P(0.55, 0.3)); // brow
  ctx.lineTo(...P(0.74, 0.47)); // straight Greek nose
  ctx.lineTo(...P(0.52, 0.5)); // under nose
  ctx.bezierCurveTo(...P(0.6, 0.53), ...P(0.6, 0.56), ...P(0.5, 0.57)); // upper lip
  ctx.bezierCurveTo(...P(0.58, 0.61), ...P(0.56, 0.66), ...P(0.5, 0.72)); // chin
  ctx.bezierCurveTo(...P(0.42, 0.82), ...P(0.34, 0.82), ...P(0.32, 0.95)); // jaw/neck
  ctx.stroke();

  // back of head + neck
  ctx.beginPath();
  ctx.moveTo(...P(0.34, 0.08));
  ctx.bezierCurveTo(...P(0.12, 0.12), ...P(0.08, 0.34), ...P(0.16, 0.5));
  ctx.bezierCurveTo(...P(0.2, 0.62), ...P(0.2, 0.78), ...P(0.32, 0.95));
  ctx.stroke();

  // almond eye + brow
  ctx.lineWidth = r * 0.016;
  ctx.beginPath();
  ctx.moveTo(...P(0.44, 0.34));
  ctx.quadraticCurveTo(...P(0.52, 0.31), ...P(0.58, 0.35));
  ctx.quadraticCurveTo(...P(0.52, 0.38), ...P(0.44, 0.34));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(...P(0.51, 0.345), r * 0.02, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(...P(0.43, 0.3));
  ctx.quadraticCurveTo(...P(0.52, 0.27), ...P(0.6, 0.31));
  ctx.stroke();

  // hair curls
  ctx.lineWidth = r * 0.02;
  for (let i = 0; i < 7; i++) {
    const a = -0.6 + i * 0.32;
    const hx = Math.cos(a) * r * 0.42 - r * 0.18;
    const hy = Math.sin(a) * r * 0.42 - r * 0.18;
    ctx.beginPath();
    ctx.arc(hx, hy, r * 0.07, 0, Math.PI * 1.6);
    ctx.stroke();
  }
  ctx.restore();
}

/** Repeating Greek key (meander) along a vertical column. */
function meanderColumn(ctx: CanvasRenderingContext2D, cx: number, w: number) {
  const band = w * 0.34;
  drawMeanderBand(ctx, cx - band / 2, 0, band, ctx.canvas.height, true);
}

function meanderBorderV(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const band = w * 0.12;
  drawMeanderBand(ctx, 0, 0, band, h, true);
  drawMeanderBand(ctx, w - band, 0, band, h, true);
}

function meanderFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const band = Math.min(w, h) * 0.09;
  ctx.save();
  ctx.strokeStyle = INK_SOFT;
  ctx.lineWidth = band * 0.16;
  ctx.strokeRect(band, band, w - band * 2, h - band * 2);
  ctx.strokeRect(band * 1.6, band * 1.6, w - band * 3.2, h - band * 3.2);
  ctx.restore();
}

/** A column of squared spirals approximating a meander. */
function drawMeanderBand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bandW: number,
  bandH: number,
  vertical: boolean
) {
  ctx.save();
  ctx.strokeStyle = INK_SOFT;
  ctx.lineWidth = bandW * 0.06;
  const unit = bandW * 0.5;
  const count = Math.ceil(bandH / unit) + 1;
  for (let i = 0; i < count; i++) {
    const oy = y + i * unit;
    ctx.beginPath();
    const left = x + bandW * 0.15;
    const right = x + bandW * 0.85;
    const a = oy + unit * 0.15;
    const b = oy + unit * 0.85;
    // squared spiral hook
    ctx.moveTo(left, a);
    ctx.lineTo(right, a);
    ctx.lineTo(right, b);
    ctx.lineTo(left + bandW * 0.3, b);
    ctx.lineTo(left + bandW * 0.3, a + unit * 0.35);
    ctx.lineTo(right - bandW * 0.3, a + unit * 0.35);
    ctx.stroke();
  }
  ctx.restore();
  void vertical;
}

/** A symmetric laurel branch climbing the centre. */
function laurel(ctx: CanvasRenderingContext2D, cx: number, cy: number, len: number) {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = len * 0.01;
  ctx.beginPath();
  ctx.moveTo(cx, cy - len / 2);
  ctx.lineTo(cx, cy + len / 2);
  ctx.stroke();
  const leaves = 16;
  for (let i = 0; i < leaves; i++) {
    const t = i / leaves;
    const ly = cy - len / 2 + t * len;
    const side = i % 2 === 0 ? 1 : -1;
    leaf(ctx, cx, ly, side, len * 0.07);
  }
  ctx.restore();
}

function laurelArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = r * 0.02;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, side > 0 ? -0.4 : Math.PI + 0.4, side > 0 ? 0.9 : Math.PI - 0.9, side < 0);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (side > 0 ? -0.3 : Math.PI + 0.3) + side * i * 0.22;
      const lx = cx + Math.cos(a) * r;
      const ly = cy + Math.sin(a) * r;
      leaf(ctx, lx, ly, side, r * 0.12);
    }
  }
  ctx.restore();
}

function leaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  side: number,
  size: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(
    x + side * size * 1.6,
    y - size * 0.9,
    x + side * size * 2.2,
    y - size * 0.2
  );
  ctx.quadraticCurveTo(x + side * size * 1.6, y + size * 0.4, x, y);
  ctx.stroke();
}

/** Stylised wings spreading from a centre point (for the back relief). */
function wings(ctx: CanvasRenderingContext2D, cx: number, cy: number, span: number) {
  ctx.save();
  ctx.strokeStyle = INK_SOFT;
  ctx.lineWidth = span * 0.01;
  for (let side = -1; side <= 1; side += 2) {
    for (let row = 0; row < 4; row++) {
      const r = span * (0.5 + row * 0.16);
      ctx.beginPath();
      ctx.arc(cx, cy, r, side > 0 ? -0.1 : Math.PI + 0.1, side > 0 ? 0.8 : Math.PI - 0.8, side < 0);
      ctx.stroke();
    }
  }
  ctx.restore();
}
