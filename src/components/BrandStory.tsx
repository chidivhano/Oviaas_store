import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={containerRef} className="w-full min-h-[150vh] bg-dark-bg relative overflow-hidden flex flex-col items-center justify-center py-32">
      {/* Background Parallax Images */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.img 
          style={{ y: y1 }}
          src="https://i.postimg.cc/vZ8C6j8H/1774303139847.png" 
          alt="Background Texture" 
          className="absolute top-0 left-0 w-full h-[120%] object-cover mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <motion.img 
          style={{ y: y2 }}
          src="https://i.postimg.cc/vZ8C6j8H/1774303139847.png" 
          alt="Background Texture" 
          className="absolute bottom-0 right-0 w-full h-[120%] object-cover mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-6 relative z-10 text-center max-w-4xl"
      >
        <div className="inline-block mb-8">
          <span className="px-4 py-2 text-xs uppercase tracking-[0.3em] border border-white/20 rounded-full text-gray-400">
            The Origin
          </span>
        </div>
        
        <h2 className="font-anton text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
          Born in <br/>
          <span className="text-white">Real Life</span>
        </h2>
        
        <div className="space-y-8 font-display text-lg md:text-2xl tracking-wide text-gray-300 leading-relaxed max-w-2xl mx-auto">
          <p>
            Oviaas isn’t just clothing. It’s a lifestyle. A reflection of movement, identity, and everyday expression.
          </p>
          <p>
            Created to move with you — from the streets to the moments that matter. Thoughtfully crafted pieces, intentional design, and a culture rooted in authenticity.
          </p>
          <p>
            This isn’t about escaping reality — it’s about owning it.
          </p>
          <p className="text-white font-semibold">
            We don’t follow trends.<br/>
            We define how life is worn.
          </p>
        </div>

        {/* Timeline / Progress Indicator */}
        <div className="mt-24 flex flex-col items-center">
          <div className="w-[1px] h-32 bg-gradient-to-b from-white/50 to-transparent mb-8" />
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-[#00f0ff] rounded-full neon-box-blue" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
