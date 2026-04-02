import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Float, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────
   Model Paths
   ───────────────────────────────────────────────────────── */
const HOODIE_PATH = `${import.meta.env.BASE_URL}assets/ovs_hoodie_3d.glb`;
const TSHIRT_PATH = `${import.meta.env.BASE_URL}assets/oviaas_3d_tshirt.glb`;

/* ─────────────────────────────────────────────────────────
   Intersection Observer Hook — only render Canvas when visible
   ───────────────────────────────────────────────────────── */
function useInView(rootMargin = '200px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // once visible, stay visible
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isInView };
}

/* ─────────────────────────────────────────────────────────
   Generic GLB Model Component — clones scene to avoid
   shared scene-graph issues between two canvases
   ───────────────────────────────────────────────────────── */
function GLBModel({
  path,
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
}: {
  path: string;
  scale?: number;
  position?: [number, number, number];
}) {
  const { scene } = useGLTF(path);
  // Clone so each canvas owns its own scene graph
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      castShadow
      receiveShadow
    />
  );
}

/* ── Loading spinner ── */
function Loader() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (meshRef.current) meshRef.current.rotation.z -= delta * 3;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[0.5, 0.08, 16, 40, Math.PI * 1.5]} />
      <meshStandardMaterial color="#b026ff" emissive="#b026ff" emissiveIntensity={1} />
    </mesh>
  );
}

/* ── Floating particles around the model ── */
function Particles() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 20; // reduced for perf
  const positions = useRef(
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 8,
      speed: 0.2 + Math.random() * 0.5,
    }))
  );

  useFrame((_state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      {positions.current.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={0.4} rotationIntensity={0}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.015 + Math.random() * 0.025, 6, 6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#b026ff' : i % 3 === 1 ? '#00f0ff' : '#ffffff'}
              emissive={i % 3 === 0 ? '#b026ff' : i % 3 === 1 ? '#00f0ff' : '#ffffff'}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ── Loading placeholder shown before Canvas mounts ── */
function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] rounded-3xl">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-[#b026ff]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#b026ff] animate-spin" />
      </div>
      <span className="text-white/40 text-xs font-display uppercase tracking-widest">
        Loading {label}...
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Individual 3D Viewer Scene
   ───────────────────────────────────────────────────────── */
function ModelScene({
  modelPath,
  modelScale,
  modelPosition,
  cameraPosition,
  cameraFov,
  isInteracting,
}: {
  modelPath: string;
  modelScale: number;
  modelPosition: [number, number, number];
  cameraPosition: [number, number, number];
  cameraFov: number;
  isInteracting: boolean;
}) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: cameraFov }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]} // cap device pixel ratio for performance
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
      }}
      shadows
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 18, 35]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight position={[-4, 4, 3]} intensity={0.8} color="#b026ff" />
      <pointLight position={[4, 3, -3]} intensity={0.6} color="#00f0ff" />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.6}
        angle={0.35}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <GLBModel path={modelPath} scale={modelScale} position={modelPosition} />
      </Suspense>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, modelPosition[1], 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
        color="#b026ff"
      />

      {/* Particles */}
      <Particles />

      {/* Environment */}
      <Environment preset="city" />

      {/* Controls — zoomed out by default, user can zoom in */}
      <OrbitControls
        enabled={isInteracting}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={25}
        autoRotate={!isInteracting}
        autoRotateSpeed={1.2}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.15}
      />
    </Canvas>
  );
}

/* ─────────────────────────────────────────────────────────
   Lazy-loaded 3D Card — only renders Canvas when scrolled
   into viewport (with 200px pre-fetch margin)
   ───────────────────────────────────────────────────────── */
function Model3DCard({
  model,
  delay,
}: {
  model: (typeof MODELS)[number];
  delay: number;
}) {
  const { ref, isInView } = useInView('300px');
  const [isInteracting, setIsInteracting] = useState(false);

  // Auto-lock when leaving viewport
  useEffect(() => {
     if (!isInView) setIsInteracting(false);
  }, [isInView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="relative w-full mx-auto flex flex-col"
    >
      {/* Model Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{model.icon}</span>
        <h3 className="font-anton text-2xl md:text-3xl uppercase tracking-tight text-white">
          {model.label}
        </h3>
      </div>

      {/* 3D Viewer */}
      <div
        ref={ref}
        className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-white/10"
      >
        {isInView ? (
          <ModelScene
            modelPath={model.path}
            modelScale={model.scale}
            modelPosition={model.position}
            cameraPosition={model.cameraPosition}
            cameraFov={model.cameraFov}
            isInteracting={isInteracting}
          />
        ) : (
          <LoadingPlaceholder label={model.label} />
        )}

        {/* Mobile Interaction Overlay */}
        <AnimatePresence>
          {!isInteracting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInteracting(true)}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px] md:hidden cursor-pointer group"
            >
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-3 group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b026ff]">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="text-white text-xs font-display uppercase tracking-[0.2em] font-bold">Tap To Explore</span>
              </div>
            </motion.div>
          )}

          {isInteracting && (
             <motion.button 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               onClick={() => setIsInteracting(false)}
               className="absolute top-4 left-4 z-20 px-4 py-2 bg-dark-surface/80 backdrop-blur-md border border-[#b026ff]/30 rounded-lg flex items-center gap-2 group md:hidden transition-all duration-300 hover:border-[#b026ff]"
             >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00f0ff]">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="22" y1="22" x2="16" y2="16"></line>
                </svg>
                <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Lock View</span>
             </motion.button>
          )}
        </AnimatePresence>

        {/* Interaction hint */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-white/40 text-xs font-display uppercase tracking-widest pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 4.1L12 6" />
            <path d="M5.1 8L2.8 6.4" />
            <path d="M18.9 8l2.3-1.6" />
            <path d="M12 6v4" />
            <circle cx="12" cy="14" r="6" />
            <path d="M12 14l-2.5 2.5" />
            <path d="M12 14l2.5 2.5" />
          </svg>
          Drag &amp; Zoom
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mt-4 leading-relaxed text-center">
        {model.description}
      </p>
    </motion.div>
  );
}

/* ── Model configuration ── */
const MODELS = [
  {
    id: 'hoodie',
    label: 'OVS Hoodie 3D',
    description:
      'The Oviaas hoodie brought to life — rotate, zoom in and explore every stitch.',
    path: HOODIE_PATH,
    scale: 2.2,
    position: [0, -2, 0] as [number, number, number],
    cameraPosition: [0, 1.5, 14] as [number, number, number],
    cameraFov: 40,
    icon: '🧥',
  },
  {
    id: 'tshirt',
    label: 'Oviaas 3D Shirt',
    description:
      "See the iconic Oviaas tee in full 3D — drag to spin it around and inspect the fit.",
    path: TSHIRT_PATH,
    scale: 2.2,
    position: [0, -2, 0] as [number, number, number],
    cameraPosition: [0, 1.5, 14] as [number, number, number],
    cameraFov: 40,
    icon: '👕',
  },
] as const;

/* ══════════════════════════════════════════
   MAIN EXPORT — Dual 3D Model Previews
   ══════════════════════════════════════════ */
export default function MerchPreview3D() {
  return (
    <section className="w-full min-h-screen bg-dark-bg relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#b026ff]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-[#00f0ff]/8 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] border border-[#b026ff]/30 text-[#b026ff] rounded-full mb-6 backdrop-blur-sm bg-[#b026ff]/5">
              Interactive 3D Experience
            </span>
            <h2 className="font-anton text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter neon-text-purple mb-6">
              Feel The<br />
              <span className="neon-text-blue">Drip</span>
            </h2>
            <p className="font-sans text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our merch in full 3D. Drag to rotate, scroll to zoom in —
              see every angle and detail before you cop.
              <span className="text-white/70 font-medium">
                {' '}
                This is streetwear you can feel through the screen.
              </span>
            </p>
          </motion.div>
        </div>

        {/* Dual 3D Viewers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MODELS.map((model, idx) => (
            <Model3DCard key={model.id} model={model} delay={0.15 * idx} />
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {[
            {
              icon: '🔍',
              title: 'Zoom In Close',
              description:
                'Scroll to zoom in and inspect every detail — stitching, prints, and textures up close',
            },
            {
              icon: '🔄',
              title: '360° Interaction',
              description:
                'Drag to orbit around the model and explore every angle of the fit',
            },
            {
              icon: '✨',
              title: 'True-to-Life 3D',
              description:
                "Real 3D mockups of our merch — see exactly what you're getting before you buy",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-panel p-5 text-center group hover:border-[#b026ff]/30 transition-colors duration-300"
            >
              <span className="text-2xl mb-3 block">{card.icon}</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-2">
                {card.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Preload the smaller model eagerly; the larger t-shirt loads on demand
useGLTF.preload(HOODIE_PATH);
