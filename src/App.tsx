import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Cart from './components/Cart';

const Showroom = lazy(() => import('./components/Showroom'));
const Collections = lazy(() => import('./components/Collections'));
const EntertainmentHub = lazy(() => import('./components/EntertainmentHub'));
const BrandStory = lazy(() => import('./components/BrandStory'));
const Community = lazy(() => import('./components/Community'));

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('showroom');

  const showroomRef = useRef<HTMLElement>(null);
  const collectionsRef = useRef<HTMLElement>(null);
  const entertainmentRef = useRef<HTMLElement>(null);
  const communityRef = useRef<HTMLElement>(null);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      showroom: showroomRef,
      collections: collectionsRef,
      entertainment: entertainmentRef,
      community: communityRef,
    };
    
    const targetRef = refs[sectionId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simple scroll spy
  useEffect(() => {
    if (!isEntered) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      const sections = [
        { id: 'showroom', ref: showroomRef },
        { id: 'collections', ref: collectionsRef },
        { id: 'entertainment', ref: entertainmentRef },
        { id: 'community', ref: communityRef },
      ];

      for (const section of sections.reverse()) {
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEntered]);

  return (
    <div className="bg-dark-bg min-h-screen text-white font-sans selection:bg-[#b026ff] selection:text-white">
      <AnimatePresence mode="wait">
        {!isEntered ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50"
          >
            <Hero onEnter={() => setIsEntered(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <Navigation 
              onCartClick={() => setIsCartOpen(true)} 
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
            
            <main>
              <Suspense fallback={<div className="w-full h-96 flex items-center justify-center text-white/50 text-xs tracking-widest uppercase animate-pulse">Loading Environment...</div>}>
                <section ref={showroomRef} id="showroom">
                  <Showroom />
                </section>
                
                <BrandStory />
                
                <section ref={collectionsRef} id="collections">
                  <Collections />
                </section>
                
                <section ref={entertainmentRef} id="entertainment">
                  <EntertainmentHub />
                </section>
                
                <section ref={communityRef} id="community">
                  <Community />
                </section>
              </Suspense>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 border-t border-white/10 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src={`${import.meta.env.BASE_URL}Oviaas_Logo.jpeg`} 
                  alt="Oviaas Logo" 
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border border-white/20 grayscale opacity-50"
                  referrerPolicy="no-referrer"
                />
                <span className="font-anton text-4xl uppercase tracking-tighter text-white/20">Oviaas</span>
              </div>
              <p className="font-display text-xs tracking-widest uppercase text-gray-600">
                © 2026 Oviaas Lifestyle. All rights reserved.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Overlay */}
      {isEntered && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <div className="pointer-events-auto">
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
