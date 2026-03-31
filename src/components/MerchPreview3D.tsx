import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────
   T-Shirt 3D Model — a stylised flat tee built from geometry
   (no external .glb required)
   ───────────────────────────────────────────────────────── */

function TShirtBody({ color, hovered }: { color: string; hovered: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const mat = (
    <meshPhysicalMaterial
      color={color}
      roughness={0.55}
      metalness={0.05}
      clearcoat={0.3}
      clearcoatRoughness={0.4}
      emissive={hovered ? '#b026ff' : '#000000'}
      emissiveIntensity={hovered ? 0.15 : 0}
    />
  );

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main body (torso) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.4, 2.8, 0.35]} />
        {mat}
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-1.55, 0.65, 0]} rotation={[0, 0, Math.PI * 0.18]} castShadow>
        <boxGeometry args={[1.1, 0.9, 0.3]} />
        {mat}
      </mesh>

      {/* Right sleeve */}
      <mesh position={[1.55, 0.65, 0]} rotation={[0, 0, -Math.PI * 0.18]} castShadow>
        <boxGeometry args={[1.1, 0.9, 0.3]} />
        {mat}
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.35, 0.05]}>
        <cylinderGeometry args={[0.55, 0.55, 0.15, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Brand logo stripe across chest */}
      <mesh position={[0, 0.35, 0.19]}>
        <boxGeometry args={[1.6, 0.12, 0.02]} />
        <meshStandardMaterial color="#b026ff" emissive="#b026ff" emissiveIntensity={0.8} />
      </mesh>

      {/* Small logo dot */}
      <mesh position={[0, 0.6, 0.19]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

/* ── Floating particles around the t-shirt ── */
function Particles() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60;
  const positions = useRef(
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8,
      speed: 0.2 + Math.random() * 0.5,
    }))
  );

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.current.map((p, i) => (
        <Float key={i} speed={p.speed} floatIntensity={0.5} rotationIntensity={0}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
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

/* ── Ground reflection ring ── */
function GroundRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <ringGeometry args={[2.5, 3.5, 64]} />
      <meshStandardMaterial
        color="#b026ff"
        emissive="#b026ff"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── The 3D Scene ── */
function Scene() {
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState('#1a1a1a');

  const colors = [
    { name: 'Midnight', hex: '#1a1a1a' },
    { name: 'Cloud', hex: '#e8e8e8' },
    { name: 'Neon Purple', hex: '#8b1fff' },
    { name: 'Ocean', hex: '#0066cc' },
  ];

  return (
    <>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 8, 18]} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-3, 3, 2]} intensity={0.8} color="#b026ff" />
        <pointLight position={[3, 2, -2]} intensity={0.6} color="#00f0ff" />
        <spotLight position={[0, 8, 0]} intensity={0.5} angle={0.4} penumbra={0.8} color="#ffffff" />

        {/* T-Shirt */}
        <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.1}>
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <TShirtBody color={activeColor} hovered={hovered} />
          </group>
        </Float>

        {/* Environment */}
        <Particles />
        <GroundRing />
        <Environment preset="city" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      </Canvas>

      {/* Color picker overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {colors.map((c) => (
          <button
            key={c.hex}
            onClick={() => setActiveColor(c.hex)}
            className={`group relative w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
              activeColor === c.hex
                ? 'border-[#b026ff] scale-110 neon-box-purple'
                : 'border-white/20 hover:border-white/50'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          >
            {activeColor === c.hex && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-display uppercase tracking-widest text-white/70 whitespace-nowrap">
                {c.name}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════ */
export default function MerchPreview3D() {
  return (
    <section className="w-full min-h-screen bg-dark-bg relative overflow-hidden py-24">
      {/* Background elements */}
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
              Get up close with our merch before you cop. Drag to rotate, scroll to zoom —
              explore every angle and see how the fabric catches the light.
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
          className="relative w-full max-w-4xl mx-auto"
        >
          <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden glass-panel border border-white/10">
            <Scene />

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

          {/* Info cards below viewer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: '🔄',
                title: '360° View',
                description: 'Drag to spin the garment and explore every detail from any angle',
              },
              {
                icon: '🔍',
                title: 'Zoom In',
                description: 'Scroll or pinch to get up close with the fabric texture and stitching',
              },
              {
                icon: '🎨',
                title: 'Switch Colors',
                description: 'Tap the color swatches below to preview different colorways',
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
