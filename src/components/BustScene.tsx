import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

const MODEL_URL = `${import.meta.env.BASE_URL}models/bust.glb`;
useGLTF.preload(MODEL_URL);

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

function Bust({
  scroll,
  pointer,
}: {
  scroll: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);

  // Clone, drape it in polished marble, and normalise size/centre.
  const { object, scale, center } = useMemo(() => {
    const obj = scene.clone(true);
    const marble = new THREE.MeshPhysicalMaterial({
      color: '#e9e3d6',
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.45,
      sheen: 0.3,
      sheenColor: new THREE.Color('#fff6e8'),
      emissive: new THREE.Color('#1c1812'),
      emissiveIntensity: 0.35,
    });
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = marble;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = 4.6 / Math.max(size.x, size.y, size.z);
    return { object: obj, scale: s, center: c };
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get();
    // slow, dignified turn driven by scroll + a faint idle drift
    const targetY = -0.35 + p * Math.PI * 3 + t * 0.05;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, delta * 3);
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
    group.current.position.y = -p * 0.8;
  });

  return (
    <Float speed={1} floatIntensity={0.35} rotationIntensity={0}>
      <group ref={group}>
        <primitive
          object={object}
          scale={scale}
          position={[-center.x * scale, -center.y * scale, -center.z * scale]}
        />
      </group>
    </Float>
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
        <color attach="background" args={['#0c0b0a']} />
        <fog attach="fog" args={['#0c0b0a', 8, 17]} />

        {/* museum lighting */}
        <ambientLight intensity={0.5} color="#e8dcc6" />
        <spotLight
          position={[-5, 6, 6]}
          angle={0.5}
          penumbra={1}
          intensity={110}
          color="#fff2dc"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[6, 1, 2]} intensity={20} color="#aebfd0" />
        <pointLight position={[0, -3, 5]} intensity={10} color="#b08d57" />

        <Suspense fallback={null}>
          <Bust scroll={scroll} pointer={pointer} />
        </Suspense>

        <Rig />

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.7}
          />
          <HueSaturation saturation={-0.34} />
          <Vignette eskil={false} offset={0.25} darkness={0.62} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
