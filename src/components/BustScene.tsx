import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  ChromaticAberration,
} from '@react-three/postprocessing';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

// ─── Marble GLSL injected into MeshPhysicalMaterial via onBeforeCompile ───────
const MARBLE_FRAG_HEADER = /* glsl */ `
varying vec2 vMarbleUv;

float mh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float mn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mh(i), mh(i+vec2(1,0)), f.x), mix(mh(i+vec2(0,1)), mh(i+vec2(1,1)), f.x), f.y);
}
float mfbm(vec2 p) {
  return mn(p)*0.50 + mn(p*2.01)*0.25 + mn(p*4.07)*0.125 + mn(p*8.17)*0.0625;
}
vec3 marbleAlbedo(vec2 uv) {
  float n  = mfbm(uv * 2.8 + vec2(1.7, 3.1)) * 9.0;
  float n2 = mfbm(uv * 1.3 + vec2(5.3, 2.7)) * 7.0;
  float s1 = sin(uv.y * 9.0  + uv.x * 3.5 + n);
  float s2 = sin(uv.y * 4.5  + uv.x * 6.0 + n2);
  float t1 = (s1 + 1.0) * 0.5;
  float t2 = (s2 + 1.0) * 0.5;
  vec3 base  = vec3(0.930, 0.886, 0.830); // warm ivory
  vec3 vein1 = vec3(0.742, 0.710, 0.668); // light grey vein
  vec3 vein2 = vec3(0.510, 0.475, 0.438); // dark accent vein
  float v1 = (smoothstep(0.44, 0.50, t1) - smoothstep(0.50, 0.56, t1)) * 2.8;
  float v2 = (smoothstep(0.46, 0.50, t2) - smoothstep(0.50, 0.54, t2)) * 1.8;
  float dark = smoothstep(0.0, 0.13, t1);
  vec3 col = mix(base, vein1, clamp(v1 + v2, 0.0, 1.0));
  return mix(vein2 * 0.68, col, dark);
}
`;

function makeMarble() {
  const mat = new THREE.MeshPhysicalMaterial({
    roughness: 0.32,
    metalness: 0.0,
    clearcoat: 0.80,
    clearcoatRoughness: 0.30,
    sheen: 0.50,
    sheenColor: new THREE.Color('#fff4e0'),
    emissive: new THREE.Color('#110d06'),
    emissiveIntensity: 0.28,
  });

  mat.onBeforeCompile = (shader) => {
    // inject marble UV varying into vertex shader
    shader.vertexShader =
      'varying vec2 vMarbleUv;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvMarbleUv = uv;'
      );

    // inject marble functions + override diffuse color in fragment shader
    shader.fragmentShader =
      MARBLE_FRAG_HEADER +
      shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `vec3 _mc = marbleAlbedo(vMarbleUv * 2.0 + vec2(0.0, 0.0));
         vec4 diffuseColor = vec4(_mc, opacity);`
      );
  };

  return mat;
}

// ─── Pointer hook ─────────────────────────────────────────────────────────────
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

// ─── Classical bust (procedural geometry + marble shader) ─────────────────────
function ClassicalBust({
  scroll,
  pointer,
}: {
  scroll: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const marble = useMemo(makeMarble, []);

  // High-resolution sculpted head
  const headGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.0, 256, 128);
    const pos = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length; i += 3) {
      const ox = pos[i], oy = pos[i + 1], oz = pos[i + 2];

      // Classical canon: elongate cranium, narrow width, shallow depth
      let x = ox * 0.87;
      let y = oy * 1.22;
      let z = oz * 0.91;

      // ── Nose bridge + tip ──────────────────────────────────────
      if (oz > 0.20 && Math.abs(ox) < 0.44) {
        const adjY = oy + 0.14;
        if (adjY > -0.60 && adjY < 0.22) {
          const fwd = Math.max(0, oz - 0.20) / 0.80;
          const cx  = Math.max(0, 1.0 - Math.abs(ox) / 0.44);
          const cy  = Math.max(0, 1.0 - Math.abs(adjY - (-0.16)) / 0.38);
          const tip = fwd * cx * cy;
          z += tip * 0.30; // strong nose protrusion
          // narrow bridge above tip
          if (adjY > 0.04 && adjY < 0.22)
            z += fwd * cx * (1.0 - Math.abs(adjY - 0.13) / 0.09) * 0.10;
        }
      }

      // ── Brow ridge ────────────────────────────────────────────
      if (oz > 0.38 && Math.abs(ox) < 0.54 && oy > 0.22 && oy < 0.56) {
        const bw = Math.max(0, 1.0 - Math.abs(oy - 0.39) / 0.17) *
                   Math.max(0, 1.0 - Math.abs(ox) / 0.54) *
                   Math.max(0, oz - 0.38) / 0.62 * 0.080;
        z += bw;
      }

      // ── Cheekbones ────────────────────────────────────────────
      if (oz > 0.28 && Math.abs(ox) > 0.40 && Math.abs(ox) < 0.75 && oy > -0.38 && oy < 0.20) {
        const ck = Math.max(0, 1.0 - Math.abs(oy - (-0.10)) / 0.28) *
                   Math.max(0, oz - 0.28) / 0.72 * 0.068;
        z += ck;
        x += (ox > 0 ? 1 : -1) * ck * 0.45;
      }

      // ── Strong classical chin ─────────────────────────────────
      if (oz > 0.22 && Math.abs(ox) < 0.32 && oy < -0.60 && oy > -0.90) {
        const ch = Math.max(0, 1.0 - Math.abs(oy + 0.75) / 0.15) *
                   Math.max(0, oz - 0.22) / 0.78 * 0.16;
        z += ch;
        y -= ch * 0.45;
      }

      // ── Flatten top of cranium (Hellenistic feature) ──────────
      if (oy > 0.82) y = oy * (1.22 - (oy - 0.82) * 0.20);

      // ── Subtle jaw definition ─────────────────────────────────
      if (Math.abs(ox) > 0.55 && Math.abs(ox) < 0.90 && oy < -0.30 && oy > -0.70) {
        x += (ox > 0 ? 1 : -1) * 0.03;
      }

      pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Lathe profile for neck (more elegant than a cylinder)
  const neckPoints = useMemo(() => [
    new THREE.Vector2(0.44, 0.40),
    new THREE.Vector2(0.40, 0.10),
    new THREE.Vector2(0.38, -0.22),
    new THREE.Vector2(0.41, -0.52),
    new THREE.Vector2(0.48, -0.72),
  ], []);

  // Lathe profile for chest & shoulders — classical toga-cut silhouette
  const chestPoints = useMemo(() => [
    new THREE.Vector2(0.48, -0.72),
    new THREE.Vector2(0.55, -1.00),
    new THREE.Vector2(0.66, -1.30),
    new THREE.Vector2(0.84, -1.64),
    new THREE.Vector2(1.02, -2.00),
    new THREE.Vector2(1.16, -2.38),
    new THREE.Vector2(1.24, -2.76),
    new THREE.Vector2(1.26, -3.16),
    new THREE.Vector2(1.22, -3.52),
  ], []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get();

    // Scroll-driven Y rotation + very slow auto-rotate
    const targetY = -0.35 + p * Math.PI * 3 + t * 0.045;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, delta * 3);

    // Pointer tilt
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.current.y * 0.08 - 0.02,
      delta * 2
    );

    // Micro breathing: subtle uniform scale pulse
    const breathe = 1 + Math.sin(t * 0.55) * 0.0045;
    group.current.scale.setScalar(breathe);

    // Gentle side sway from Z rotation
    group.current.rotation.z = Math.sin(t * 0.18) * 0.012;

    // Pointer horizontal drift
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.current.x * 0.22,
      delta * 2
    );
    // Scroll vertical
    group.current.position.y = -p * 0.6 + Math.sin(t * 0.45) * 0.035;
  });

  return (
    <Float speed={0.9} floatIntensity={0.35} rotationIntensity={0}>
      <group ref={group}>
        {/* Sculpted head */}
        <mesh geometry={headGeo} material={marble} position={[0, 0.55, 0]} castShadow receiveShadow />

        {/* Neck — elegant lathe */}
        <mesh material={marble} position={[0, 0, 0]} castShadow receiveShadow>
          <latheGeometry args={[neckPoints, 64]} />
        </mesh>

        {/* Chest / shoulders */}
        <mesh material={marble} castShadow receiveShadow>
          <latheGeometry args={[chestPoints, 80]} />
        </mesh>

        {/* Classical square plinth */}
        <mesh material={marble} position={[0, -3.78, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.26, 1.36, 0.52, 4, 1]} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Particle aura — fine gold dust drifting off the marble ──────────────────
function MarbleAura() {
  const ref = useRef<THREE.Points>(null);

  const { geo, mat } = useMemo(() => {
    const COUNT = 2800;
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 1.5;
      const ySrc = (Math.random() - 0.35) * 4.8;
      positions[i * 3]     = Math.cos(angle) * r;
      positions[i * 3 + 1] = ySrc;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      phases[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aPhase;
        uniform float uTime;
        void main() {
          float t = fract(aPhase + uTime * 0.038);
          vec3 p = position;
          p.y += t * 5.0 - 2.4;
          p.x += sin(uTime * 0.28 + aPhase * 6.283) * 0.10;
          p.z += cos(uTime * 0.35 + aPhase * 6.283) * 0.10;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float pulse = 0.6 + 0.4 * sin(uTime * 1.8 + aPhase * 12.566);
          gl_PointSize = (4.0 / -mv.z) * pulse;
        }
      `,
      fragmentShader: /* glsl */ `
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.05, d) * 0.55;
          gl_FragColor = vec4(0.94, 0.84, 0.62, a);
        }
      `,
    });

    return { geo: g, mat: m };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Slow-orbiting key light — warm travelling highlight ──────────────────────
function OrbitingKey() {
  const ref = useRef<THREE.SpotLight>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.13;
    ref.current.position.set(Math.cos(t) * 7, 5.5 + Math.sin(t * 0.55) * 2, Math.sin(t) * 7 + 2.5);
  });
  return (
    <spotLight
      ref={ref}
      angle={0.50}
      penumbra={1}
      intensity={160}
      color="#fff0d0"
      castShadow
      shadow-mapSize={[2048, 2048]}
    />
  );
}

// ─── Interstellar dust ────────────────────────────────────────────────────────
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 500;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3.0 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3]     = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = Math.sin(a) * r - 1;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#d4b88a"
        transparent
        opacity={0.50}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Celestial halo ───────────────────────────────────────────────────────────
function Halo() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0,   'rgba(220, 200, 155, 0.60)');
    g.addColorStop(0.35,'rgba(160, 138, 100, 0.22)');
    g.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0.4, 0.3, -7]}>
      <planeGeometry args={[18, 18]} />
      <meshBasicMaterial map={tex} transparent opacity={0.52} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ─── Camera micro-drift ───────────────────────────────────────────────────────
function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.11) * 0.28;
    state.camera.position.z = 7 + Math.sin(t * 0.15) * 0.18;
    state.camera.lookAt(0, 0.4, 0); // focus slightly above origin — centers the head
  });
  return null;
}

// ─── Scene root ───────────────────────────────────────────────────────────────
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
        <color attach="background" args={['#070609']} />
        <fog attach="fog" args={['#070609', 12, 32]} />

        {/* Lighting — warm orbiting key + cool ambient fill + amber underlighting */}
        <ambientLight intensity={0.30} color="#c8d4e8" />
        <OrbitingKey />
        <pointLight position={[5, 2, 3]}   intensity={18} color="#9ab0cc" />
        <pointLight position={[-4, -2, 4]} intensity={12} color="#b08d50" />
        <pointLight position={[0, -4, 2]}  intensity={4}  color="#3a2a10" />  {/* subtle underlight */}
        <spotLight  position={[-3, 4, -4]} angle={0.9} penumbra={1} intensity={22} color="#8899bb" />

        <Halo />

        <ClassicalBust scroll={scroll} pointer={pointer} />
        <MarbleAura />

        <Dust />
        <Stars radius={45} depth={35} count={1600} factor={3} saturation={0} fade speed={0.4} />

        <Rig />

        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.48}
            luminanceSmoothing={0.88}
            mipmapBlur
            radius={0.80}
          />
          <ChromaticAberration offset={new THREE.Vector2(0.0006, 0.0006)} />
          <HueSaturation saturation={-0.28} />
          <Vignette eskil={false} offset={0.20} darkness={0.70} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
