import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Edges, Stars, Float } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { createInkTexture } from '../lib/inkTexture';

interface SceneProps {
  scroll: MotionValue<number>;
}

/** Shared, mutable pointer position updated from a window listener
 *  (the canvas is pointer-events:none so it never receives events itself). */
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

function Monolith({
  scroll,
  pointer,
}: {
  scroll: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const ink = useMemo(() => createInkTexture(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get(); // 0 → 1 over the whole page

    // Spin: scroll drives ~3 full turns, plus a slow idle rotation.
    const targetY = p * Math.PI * 6 + t * 0.18;
    group.current.rotation.y = targetY;

    // Tilt with scroll + a gentle breathing wobble.
    group.current.rotation.z = Math.sin(t * 0.4) * 0.04 + p * 0.25;
    group.current.rotation.x = Math.sin(t * 0.3) * 0.03;

    // Subtle parallax lean toward the cursor.
    const targetX = pointer.current.x * 0.18;
    const targetTilt = -pointer.current.y * 0.12;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      targetX,
      delta * 2
    );
    group.current.rotation.x += THREE.MathUtils.lerp(0, targetTilt, 0.6);

    // Drift downward slightly as you scroll, then ease back.
    group.current.position.y = -p * 0.6;
  });

  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.6}>
      <group ref={group}>
        <RoundedBox args={[1.7, 4.4, 1.7]} radius={0.08} smoothness={6}>
          <meshStandardMaterial
            color="#0c0c10"
            metalness={0.6}
            roughness={0.35}
            emissive="#e0913a"
            emissiveMap={ink}
            emissiveIntensity={2.4}
            bumpMap={ink}
            bumpScale={0.04}
          />
          <Edges threshold={15} color="#2a2a32" />
        </RoundedBox>

        {/* faint glowing rune-line wrapping the base */}
        <mesh position={[0, -2.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.45, 0.012, 8, 80]} />
          <meshBasicMaterial color="#c1121f" />
        </mesh>
      </group>
    </Float>
  );
}

/** Geometric satellites orbiting the monolith — the "figuras 3d". */
function Satellites({ scroll }: { scroll: MotionValue<number> }) {
  const ring = useRef<THREE.Group>(null);
  const shards = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scroll.get();
    if (ring.current) {
      ring.current.rotation.z = t * 0.15 + p * Math.PI * 2;
      ring.current.rotation.x = Math.PI / 2.6 + p * 0.4;
    }
    if (shards.current) {
      shards.current.rotation.y = -t * 0.25 - p * Math.PI * 3;
    }
  });

  const shardData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 3.1 + (i % 3) * 0.5,
        y: Math.sin(i * 1.7) * 1.6,
        scale: 0.18 + (i % 4) * 0.05,
        speed: 0.4 + (i % 3) * 0.2,
      })),
    []
  );

  return (
    <>
      {/* thin orbital ring */}
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[2.7, 0.008, 12, 120]} />
          <meshBasicMaterial color="#c8a45c" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[3.2, 0.005, 12, 120]} />
          <meshBasicMaterial color="#c1121f" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* drifting icosahedron shards */}
      <group ref={shards}>
        {shardData.map((s, i) => (
          <Float key={i} speed={s.speed} floatIntensity={2} rotationIntensity={2}>
            <mesh
              position={[
                Math.cos(s.angle) * s.radius,
                s.y,
                Math.sin(s.angle) * s.radius,
              ]}
              scale={s.scale}
            >
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#15151a"
                metalness={0.9}
                roughness={0.2}
                emissive="#c8a45c"
                emissiveIntensity={0.25}
                flatShading
              />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}

function Rig() {
  // Subtle camera breathing so reflections stay alive.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.z = 8 + Math.sin(t * 0.2) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function MonolithScene({ scroll }: SceneProps) {
  const pointer = usePointer();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0b']} />
        <fog attach="fog" args={['#0a0a0b', 9, 18]} />

        {/* dramatic lighting */}
        <ambientLight intensity={0.25} />
        <spotLight
          position={[6, 9, 6]}
          angle={0.4}
          penumbra={1}
          intensity={120}
          color="#fff3e0"
          castShadow
        />
        <pointLight position={[-6, -2, 2]} intensity={40} color="#c1121f" />
        <pointLight position={[5, -4, -4]} intensity={30} color="#c8a45c" />

        <Suspense fallback={null}>
          <Monolith scroll={scroll} pointer={pointer} />
          <Satellites scroll={scroll} />
        </Suspense>

        <Stars
          radius={50}
          depth={40}
          count={1800}
          factor={4}
          saturation={0}
          fade
          speed={0.6}
        />
        <Rig />

        {/* cinematic lens pass: glowing engravings + RGB fringe + vignette */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.8}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation
            modulationOffset={0.4}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
