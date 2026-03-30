import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

interface Drop {
  id: string;
  title: string;
  status: string;
  image: string;
  items: number;
  dropTime?: number;
}

const drops: Drop[] = [
  {
    id: 'black-tee',
    title: 'Black Tee',
    status: 'Live',
    image: 'https://i.postimg.cc/1tdZNT9r/1774303174064.png',
    items: 1,
  },
  {
    id: 'white-tee',
    title: 'White Tee',
    status: 'Live',
    image: 'https://i.postimg.cc/q7xG4Zrj/1774303242181.png',
    items: 1,
  },
  {
    id: 'white-pitbull-hoodie',
    title: 'White Pitbull Hoodie',
    status: 'Live',
    image: 'https://i.postimg.cc/xjsX6TdB/1774303025005.png',
    items: 1,
  },
];

export default function Collections() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const upcomingDrop = drops.find(d => d.status === 'Upcoming');
    if (!upcomingDrop || !upcomingDrop.dropTime) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = upcomingDrop.dropTime! - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full min-h-screen bg-dark-bg py-24 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-anton text-5xl md:text-7xl uppercase tracking-tighter neon-text-blue">
              Drops
            </h2>
            <p className="font-display text-gray-400 tracking-widest uppercase text-sm mt-2">
              Exclusive Collections
            </p>
          </div>
          
          <button className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-white hover:text-[#00f0ff] transition-colors group">
            View Archive
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drops.map((drop, index) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={drop.image}
                alt={drop.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:opacity-80" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full border backdrop-blur-md ${
                    drop.status === 'Upcoming' 
                      ? 'border-[#ffd700]/50 text-[#ffd700] bg-[#ffd700]/10' 
                      : 'border-[#00f0ff]/50 text-[#00f0ff] bg-[#00f0ff]/10'
                  }`}>
                    {drop.status}
                  </span>
                  
                  <span className="text-xs font-display tracking-widest text-white/70">
                    {String(drop.items).padStart(2, '0')} ITEMS
                  </span>
                </div>
                
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="font-anton text-3xl md:text-4xl uppercase tracking-tighter text-white mb-2">
                    {drop.title}
                  </h3>
                  
                  {drop.status === 'Upcoming' ? (
                    <div className="flex items-center gap-4 text-sm font-mono text-[#ffd700]">
                      <Clock className="w-4 h-4" />
                      <span>
                        {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-display uppercase tracking-widest text-white/0 group-hover:text-white/100 transition-colors duration-300">
                      Explore Collection <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
