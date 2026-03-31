import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, useAnimations, Float, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────
   Walking T-Shirt GLB Model
   ───────────────────────────────────────────────────────── */
const MODEL_PATH = `${import.meta.env.BASE_URL}assets/Walking_Tshirt_Preview.glb`;

function WalkingTShirt({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions, names } = useAnimations(animations, groupRef);

  // Play the first animation (walking) on mount
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]]!;
      action.reset().fadeIn(0.5).play();
    }
    return () => {
      names.forEach((name) => {
        actions[name]?.fadeOut(0.5);
      });
    };
  }, [actions, names]);

  // Pause/resume based on isPlaying
  useEffect(() => {
    names.forEach((name) => {
      const action = actions[name];
      if (action) {
        action.paused = !isPlaying;
      }
    });
  }, [isPlaying, actions, names]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={2.5}
        position={[0, -2, 0]}
        castShadow
        receiveShadow
      />
    </group>
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
  const count = 40;
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
            <sphereGeometry args={[0.015 + Math.random() * 0.025, 8, 8]} />
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

/* ── The 3D Scene ── */
function Scene({ isPlaying }: { isPlaying: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      shadows
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 22]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 4, 3]} intensity={0.8} color="#b026ff" />
      <pointLight position={[4, 3, -3]} intensity={0.6} color="#00f0ff" />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.6}
        angle={0.35}
        penumbra={0.8}
        color="#ffffff"
        castShadow
      />

      {/* Model */}
      <Suspense fallback={<Loader />}>
        <WalkingTShirt isPlaying={isPlaying} />
      </Suspense>

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2, 0]}
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

      {/* Controls — user can drag/zoom */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={1.5}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </Canvas>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════ */
export default function MerchPreview3D() {
  const [isPlaying, setIsPlaying] = useState(true);

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
              Watch our merch come alive. Drag to rotate, scroll to zoom —
              interact with the walking t-shirt preview and see the fit in motion.
              <span className="text-white/70 font-medium"> This is streetwear you can feel through the screen.</span>
            </p>
          </motion.div>
        </div>

        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-5xl mx-auto"
        >
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden glass-panel border border-white/10">
            <Scene isPlaying={isPlaying} />

            {/* Play/Pause button */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:border-[#b026ff]/50 transition-all duration-300 text-xs font-display uppercase tracking-widest z-20"
            >
              {isPlaying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  Play
                </>
              )}
            </button>

            {/* Interaction hint */}
            <div className="absolute top-6 right-6 flex items-center gap-2 text-white/40 text-xs font-display uppercase tracking-widest pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4.1L12 6" /><path d="M5.1 8L2.8 6.4" /><path d="M18.9 8l2.3-1.6" />
                <path d="M12 6v4" /><circle cx="12" cy="14" r="6" />
                <path d="M12 14l-2.5 2.5" /><path d="M12 14l2.5 2.5" />
              </svg>
              Drag to Rotate
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: '👕',
                title: 'Walking Preview',
                description: 'See the t-shirt in motion — watch how the fabric moves and flows as it walks',
              },
              {
                icon: '🔄',
                title: '360° Interaction',
                description: 'Drag to orbit around the model and explore every angle, zoom in to inspect details',
              },
              {
                icon: '⏯️',
                title: 'Play & Pause',
                description: 'Control the walking animation — pause to inspect a frame, play to see the flow',
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
        </motion.div>
      </div>
    </section>
  );
}

// Preload the model
useGLTF.preload(MODEL_PATH);
