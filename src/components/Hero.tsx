import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial 
          color="#b026ff" 
          emissive="#b026ff"
          emissiveIntensity={0.5}
          wireframe
          distort={0.4} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}

export default function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-dark-bg">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <AnimatedShape />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-2">
            <img 
              src="/Oviaas_Logo.jpeg" 
              alt="Oviaas Logo" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#b026ff] neon-box-purple"
              referrerPolicy="no-referrer"
            />
            <h1 className="font-anton text-7xl md:text-9xl uppercase tracking-tighter neon-text-purple">
              Oviaas
            </h1>
          </div>
          <p className="font-display text-xl md:text-2xl tracking-widest uppercase text-white/70 mb-12">
            Lifestyle
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={onEnter}
          className="pointer-events-auto group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-[#b026ff]/50 transition-colors duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#b026ff]/20 to-[#00f0ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
          <span className="relative font-display font-semibold tracking-widest uppercase text-sm z-10 flex items-center gap-2">
            Enter Experience
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </motion.button>
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
    </section>
  );
}
