import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { createMarbleTattoo, type Specimen } from '../lib/marble';

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Visibility window for a specimen across scroll progress (0..1). */
const band = (p: number, start: number, end: number, fade = 0.09) =>
  Math.min(smoothstep(start - fade, start + fade, p), 1 - smoothstep(end - fade, end + fade, p));

/** A revolved marble limb (lathe) — wrist → muscle → elbow taper. */
function limbGeometry(radiusScale: number, lengthScale: number) {
  const base: [number, number][] = [
    [0.02, -1.78],
    [0.24, -1.74],
    [0.3, -1.45],
    [0.35, -1.0],
    [0.43, -0.35],
    [0.46, 0.25],
    [0.4, 0.9],
    [0.34, 1.45],
    [0.28, 1.72],
    [0.02, 1.78],
  ];
  const pts = base.map(([x, y]) => new THREE.Vector2(x * radiusScale, y * lengthScale));
  return new THREE.LatheGeometry(pts, 80);
}

/** A gently convex marble slab — the "back" relief. */
function backGeometry() {
  const geo = new THREE.PlaneGeometry(2.7, 3.4, 48, 48);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const bow = 0.45 * (1 - (x / 1.35) ** 2) * (1 - (y / 1.7) ** 2 * 0.4);
    pos.setZ(i, bow);
  }
  geo.computeVertexNormals();
  return geo;
}

function Specimen({
  scroll,
  pointer,
  geometry,
  kind,
  range,
  baseScale,
  turns,
  flat = false,
}: {
  scroll: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  geometry: THREE.BufferGeometry;
  kind: Specimen;
  range: [number, number];
  baseScale: number;
  turns: number;
  flat?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const tex = useMemo(() => createMarbleTattoo(kind), [kind]);

  useFrame((state, delta) => {
    if (!group.current || !mat.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get();
    const v = band(p, range[0], range[1]);

    group.current.visible = v > 0.004;
    const target = baseScale * (0.82 + 0.18 * v);
    const s = THREE.MathUtils.lerp(group.current.scale.x, target, delta * 4);
    group.current.scale.setScalar(s);
    mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, v, delta * 4);

    // turn as you scroll, plus a slow idle drift
    const spin = p * Math.PI * turns + t * 0.16;
    if (flat) {
      group.current.rotation.y = Math.sin(spin * 0.3) * 0.5 + pointer.current.x * 0.25;
      group.current.rotation.x = -0.08 + Math.sin(t * 0.3) * 0.03;
    } else {
      group.current.rotation.y = spin + pointer.current.x * 0.3;
      group.current.rotation.z = Math.sin(t * 0.4) * 0.03;
      group.current.rotation.x = -pointer.current.y * 0.12;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0}>
      <group ref={group} scale={baseScale}>
        <mesh geometry={geometry} castShadow>
          <meshPhysicalMaterial
            ref={mat}
            map={tex}
            bumpMap={tex}
            bumpScale={0.01}
            color="#efe9dd"
            roughness={0.5}
            metalness={0}
            clearcoat={0.5}
            clearcoatRoughness={0.5}
            envMapIntensity={0.5}
            transparent
            opacity={0}
            side={flat ? THREE.DoubleSide : THREE.FrontSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.z = 7 + Math.sin(t * 0.18) * 0.25;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pointer;
}

const PLATES = [
  { n: 'I', t: 'Antebraço', sub: 'Estudo em mármore' },
  { n: 'II', t: 'Braço', sub: 'Linhas de louro' },
  { n: 'III', t: 'Costas', sub: 'Baixo-relevo' },
];

export default function StatueScene({ scroll }: { scroll: MotionValue<number> }) {
  const pointer = usePointer();
  const [active, setActive] = useState(0);

  const forearm = useMemo(() => limbGeometry(1, 1), []);
  const arm = useMemo(() => limbGeometry(1.32, 1.08), []);
  const back = useMemo(() => backGeometry(), []);

  useEffect(() => {
    const unsub = scroll.on('change', (p) => {
      setActive(p < 0.4 ? 0 : p < 0.7 ? 1 : 2);
    });
    return () => unsub();
  }, [scroll]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0c0b0a']} />
        <fog attach="fog" args={['#0c0b0a', 8, 16]} />

        {/* museum lighting: warm key + cool rim + soft fill */}
        <ambientLight intensity={0.35} color="#e8dcc6" />
        <spotLight
          position={[-5, 7, 6]}
          angle={0.5}
          penumbra={1}
          intensity={90}
          color="#fff1da"
          castShadow
        />
        <pointLight position={[6, 1, 3]} intensity={22} color="#9fb4c8" />
        <pointLight position={[0, -4, 4]} intensity={14} color="#b08d57" />

        <Suspense fallback={null}>
          <group position={[0, 0.1, 0]}>
            <Specimen
              scroll={scroll}
              pointer={pointer}
              geometry={forearm}
              kind="forearm"
              range={[-1, 0.4]}
              baseScale={1.15}
              turns={9}
            />
            <Specimen
              scroll={scroll}
              pointer={pointer}
              geometry={arm}
              kind="arm"
              range={[0.32, 0.72]}
              baseScale={1.0}
              turns={7}
            />
            <Specimen
              scroll={scroll}
              pointer={pointer}
              geometry={back}
              kind="back"
              range={[0.64, 2]}
              baseScale={1.2}
              turns={4}
              flat
            />
          </group>
        </Suspense>

        <Rig />

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.85}
            mipmapBlur
            radius={0.7}
          />
          <HueSaturation saturation={-0.42} />
          <BrightnessContrast brightness={-0.02} contrast={0.12} />
          <Vignette eskil={false} offset={0.28} darkness={0.62} />
        </EffectComposer>
      </Canvas>

      {/* museum exhibit plate */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold/70">
          Espécime {PLATES[active].n}
        </p>
        <p className="mt-1 font-display text-lg italic text-bone/80">
          {PLATES[active].t}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone-faint">
          {PLATES[active].sub}
        </p>
      </div>
    </div>
  );
}
