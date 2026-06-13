import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

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

/**
 * Procedural classical marble bust — head sculpted via vertex displacement
 * giving classical proportions (elongated cranium, strong nose bridge, brow
 * ridge, defined chin), mounted on a lathe-profile chest and square plinth.
 */
function ClassicalBust({
  scroll,
  pointer,
}: {
  scroll: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);

  const marble = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ede5d4',
        roughness: 0.36,
        metalness: 0,
        clearcoat: 0.72,
        clearcoatRoughness: 0.38,
        sheen: 0.45,
        sheenColor: new THREE.Color('#fff6e4'),
        emissive: new THREE.Color('#1a1208'),
        emissiveIntensity: 0.32,
      }),
    []
  );

  // High-resolution sphere sculpted into a classical head
  const headGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.0, 192, 96);
    const pos = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length; i += 3) {
      const ox = pos[i];
      const oy = pos[i + 1];
      const oz = pos[i + 2];

      // Classical canon: elongate vertically, narrow width, shallow depth
      let x = ox * 0.86;
      let y = oy * 1.2;
      let z = oz * 0.90;

      // ── Nose bridge & tip ──────────────────────────────────────────────
      // Nose lives slightly below the equator on the front-center of the head
      if (oz > 0.22 && Math.abs(ox) < 0.42) {
        const adjY = oy + 0.15; // shift reference so nose peak is at adjY≈-0.15
        if (adjY > -0.58 && adjY < 0.18) {
          const fwd = Math.max(0, oz - 0.22) / 0.78;          // 0→1 as z→front
          const cx  = Math.max(0, 1 - Math.abs(ox) / 0.42);   // 0→1 toward centerline
          const cy  = Math.max(0, 1 - Math.abs(adjY - (-0.15)) / 0.36); // bell at nose peak
          const tip = fwd * cx * cy;
          z += tip * 0.28; // main nose protrusion
          // Narrow bridge above nose
          if (adjY > 0.0 && adjY < 0.18) {
            z += fwd * cx * (1 - Math.abs(adjY - 0.1) / 0.1) * 0.08;
          }
        }
      }

      // ── Brow ridge ────────────────────────────────────────────────────
      if (oz > 0.4 && Math.abs(ox) < 0.52 && oy > 0.24 && oy < 0.54) {
        const bw = Math.max(0, 1 - Math.abs(oy - 0.39) / 0.15) *
                   Math.max(0, 1 - Math.abs(ox) / 0.52) *
                   Math.max(0, oz - 0.4) / 0.6 * 0.075;
        z += bw;
      }

      // ── Cheekbone definition ──────────────────────────────────────────
      if (oz > 0.3 && Math.abs(ox) > 0.42 && Math.abs(ox) < 0.72 && oy > -0.35 && oy < 0.18) {
        const ck = Math.max(0, 1 - Math.abs(oy - (-0.08)) / 0.26) *
                   Math.max(0, oz - 0.3) / 0.7 * 0.065;
        z += ck;
        x += (ox > 0 ? 1 : -1) * ck * 0.5; // slight lateral push
      }

      // ── Classical strong chin ─────────────────────────────────────────
      if (oz > 0.24 && Math.abs(ox) < 0.3 && oy < -0.6 && oy > -0.88) {
        const ch = Math.max(0, 1 - Math.abs(oy + 0.74) / 0.14) *
                   Math.max(0, oz - 0.24) / 0.76 * 0.14;
        z += ch;
        y -= ch * 0.4; // elongate chin downward
      }

      // ── Slightly flatten top of cranium (classical feature) ───────────
      if (oy > 0.85) {
        y = oy * (1.2 - (oy - 0.85) * 0.18);
      }

      pos[i]     = x;
      pos[i + 1] = y;
      pos[i + 2] = z;
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Lathe profile for chest & shoulders — classical draped toga-cut look
  const chestPoints = useMemo(
    () => [
      new THREE.Vector2(0.52, -1.4),   // top — meets neck base
      new THREE.Vector2(0.56, -1.66),
      new THREE.Vector2(0.68, -1.94),
      new THREE.Vector2(0.86, -2.28),
      new THREE.Vector2(1.04, -2.62),
      new THREE.Vector2(1.18, -2.98),
      new THREE.Vector2(1.24, -3.34),
      new THREE.Vector2(1.22, -3.66),  // bottom edge of chest piece
    ],
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get();
    const targetY = -0.35 + p * Math.PI * 3 + t * 0.05;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      delta * 3
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.current.y * 0.1 - 0.02,
      delta * 2
    );
    group.current.rotation.z = Math.sin(t * 0.2) * 0.015;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.current.x * 0.25,
      delta * 2
    );
    group.current.position.y = -p * 0.8 + Math.sin(t * 0.5) * 0.04;
  });

  return (
    <Float speed={1} floatIntensity={0.4} rotationIntensity={0}>
      <group ref={group}>
        {/* Classical sculpted head */}
        <mesh
          geometry={headGeo}
          material={marble}
          position={[0, 0.6, 0]}
          castShadow
          receiveShadow
        />

        {/* Neck — tapered cylinder */}
        <mesh material={marble} position={[0, -1.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.52, 0.8, 48, 2]} />
        </mesh>

        {/* Chest & shoulders — lathe of revolution */}
        <mesh material={marble} castShadow receiveShadow>
          <latheGeometry args={[chestPoints, 64]} />
        </mesh>

        {/* Classical square plinth */}
        <mesh
          material={marble}
          position={[0, -3.92, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.22, 1.32, 0.52, 4, 1]} />
        </mesh>
      </group>
    </Float>
  );
}

/** Slow-orbiting key light — the travelling highlight gives the marble life. */
function OrbitingKey() {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.14;
    ref.current.position.set(Math.cos(t) * 6, 5 + Math.sin(t * 0.6) * 1.5, Math.sin(t) * 6 + 2);
  });
  return (
    <spotLight
      ref={ref}
      angle={0.55}
      penumbra={1}
      intensity={120}
      color="#fff2dc"
      castShadow
      shadow-mapSize={[1024, 1024]}
    />
  );
}

/** Drifting interstellar dust around the figure. */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 400;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.6 + Math.random() * 6;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3]     = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = Math.sin(a) * r - 1;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#d8c6a4"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Celestial halo behind the figure. */
function Halo() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(214,196,160,0.55)');
    g.addColorStop(0.4, 'rgba(160,140,108,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0.5, 0.5, -6]}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.12) * 0.3;
    state.camera.position.z = 7 + Math.sin(t * 0.16) * 0.2;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function BustScene({ scroll }: { scroll: MotionValue<number> }) {
  const pointer = usePointer();
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0, 7], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#08070a']} />
        <fog attach="fog" args={['#08070a', 11, 30]} />

        <ambientLight intensity={0.4} color="#cdd6e6" />
        <OrbitingKey />
        <pointLight position={[6, 1, 2]} intensity={16} color="#9fb1cc" />
        <pointLight position={[-4, -3, 4]} intensity={10} color="#b08d57" />

        <Halo />

        <ClassicalBust scroll={scroll} pointer={pointer} />

        <Dust />
        <Stars radius={40} depth={30} count={1400} factor={3} saturation={0} fade speed={0.5} />

        <Rig />

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.75}
          />
          <HueSaturation saturation={-0.3} />
          <Vignette eskil={false} offset={0.22} darkness={0.66} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
