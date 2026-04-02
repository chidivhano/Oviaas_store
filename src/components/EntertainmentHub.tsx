import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Gamepad2, Music, ChevronRight, X } from 'lucide-react';
import DripBuilder from './DripBuilder';


const tabs = [
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'studios', label: 'Oviaas Studio', icon: Gamepad2 },
];

const content = {
  studios: [
    { id: 1, title: 'Sports Art-Work', category: 'Portfolio', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/sports_artwork_cover.png`, url: 'https://drive.google.com/drive/folders/1-MIYdKpRf8-b7rgwKJxZALKF5RH6tLGO' },
    { id: 2, title: 'Cover Art-Work', category: 'Portfolio', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/cover_artwork_cover.png`, url: 'https://drive.google.com/drive/folders/1-De6eHIHSdkIxxnfs55npzCxSpKXZiue' },
    { id: 3, title: 'SVO- SESSIONS', category: 'Live Performance', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/svo_sessions_cover.png`, url: 'https://hearthis.at/don-teepee/' },
  ],
  games: [
    { id: 1, title: 'Soweto Run Oviaas', genre: 'Endless Runner', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/soweto_run_cover.png`, gamePath: `${import.meta.env.BASE_URL}Soweto_Run_Oviaas/index.html` },
    { id: 2, title: 'Kasi Hoops', genre: 'Arcade Basketball', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/kasi_hoops_cover.png`, gamePath: `${import.meta.env.BASE_URL}Kasi_Hoops/index.html` },
    { id: 3, title: 'Drip Builder', genre: 'Customization', image: `${import.meta.env.BASE_URL}assets/entertainment_hub/drip_builder_cover.png`, component: 'DripBuilder' },
  ],
};

interface EntertainmentHubProps {
  onTogglePerformance?: (isActive: boolean) => void;
}

export default function EntertainmentHub({ onTogglePerformance }: EntertainmentHubProps) {
  const [activeTab, setActiveTab] = useState('games');
  const [launchingItem, setLaunchingItem] = useState<string | null>(null);
  const [activeIframe, setActiveIframe] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [pendingLaunchId, setPendingLaunchId] = useState<number | null>(null);

  // Trigger performance mode when a game or heavy component is active
  useEffect(() => {
    onTogglePerformance?.(!!(activeIframe || activeComponent));
  }, [activeIframe, activeComponent, onTogglePerformance]);

  const handleLaunch = (title: string, path?: string, component?: string, url?: string, id?: number) => {
    setLaunchingItem(title);
    if (id !== undefined) setPendingLaunchId(id);
    
    // Immediate acknowledgement with a slight delay for better transition flow
    setTimeout(() => {
      setLaunchingItem(null);
      setPendingLaunchId(null);
      
      if (component) {
        setActiveComponent(component);
      } else if (path) {
        setIsIframeLoading(true);
        setActiveIframe(path);
      } else if (url) {
        window.open(url, '_blank');
      }
    }, 600);
  };

  return (
    <section className="w-full min-h-screen bg-dark-bg py-24 relative overflow-hidden">
      {/* Launching Overlay */}
      <AnimatePresence>
        {launchingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full border-2 border-[#b026ff] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-[#00f0ff] animate-ping opacity-20" />
                <div className="w-12 h-12 rounded-full bg-[#b026ff] animate-pulse neon-box-purple" />
              </div>
              <h3 className="font-anton text-4xl md:text-6xl uppercase tracking-tighter text-white mb-4">
                Launching
              </h3>
              <p className="font-display text-2xl text-[#00f0ff] uppercase tracking-widest neon-text-blue">
                {launchingItem}
              </p>
              <div className="mt-12 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame Overlay for Native Games */}
      <AnimatePresence>
        {(activeIframe || activeComponent) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[110] bg-dark-bg/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={() => { setActiveIframe(null); setActiveComponent(null); }}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[200] w-12 h-12 rounded-full border border-white/20 hover:border-[#b026ff]/60 bg-black/80 flex items-center justify-center transition-colors group"
            >
              <X className="w-6 h-6 text-white group-hover:text-[#b026ff] transition-colors" />
            </button>

            {activeIframe ? (
              <div className="w-full max-w-[450px] h-full sm:h-[80vh] sm:max-h-[900px] rounded-[3rem] overflow-hidden glass-panel border border-white/10 relative shadow-2xl shadow-[#00f0ff]/20 flex items-center justify-center">
                {isIframeLoading && (
                  <div className="absolute inset-0 z-10 bg-dark-bg flex flex-col items-center justify-center gap-6">
                    <div className="relative w-24 h-24">
                       <div className="absolute inset-0 rounded-full border-4 border-[#00f0ff]/10 border-t-[#00f0ff] animate-spin" />
                       <div className="absolute inset-4 rounded-full border-4 border-[#b026ff]/10 border-b-[#b026ff] animate-[spin_1.5s_linear_infinite_reverse]" />
                    </div>
                    <span className="text-[#00f0ff] font-display text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Game Engine...</span>
                  </div>
                )}
                <iframe 
                  src={activeIframe} 
                  onLoad={() => setIsIframeLoading(false)}
                  className="absolute inset-0 w-full h-full border-none bg-black"
                  title="Oviaas Game"
                />
              </div>
            ) : (
              <div className="w-full h-full sm:h-[90vh] rounded-[2rem] overflow-hidden glass-panel border border-white/10 relative shadow-2xl shadow-[#b026ff]/20 flex flex-col">
                {activeComponent === 'DripBuilder' && <DripBuilder />}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#b026ff]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-anton text-5xl md:text-7xl uppercase tracking-tighter neon-text-purple mb-4">
            Entertainment Hub
          </h2>
          <p className="font-display text-gray-400 tracking-widest uppercase text-sm max-w-xl mx-auto">
            Experience the Oviaas universe. Play, watch, and listen.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mb-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-full flex items-center gap-2 font-display uppercase tracking-widest text-xs transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'studios' && (
              <motion.div
                key="studios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pb-8"
              >
                {content.studios.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleLaunch(
                      item.title, 
                      undefined, 
                      undefined, 
                      'url' in item ? item.url : undefined
                    )}
                    className="w-full aspect-video relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#00f0ff]/30 transition-colors duration-300"
                  >
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <span className="text-xs font-mono text-[#00f0ff] mb-2 block">{item.category}</span>
                      <h3 className="font-display text-xl uppercase tracking-widest text-white">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'games' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {content.games.map((game) => (
                  <div 
                    key={game.id} 
                    className="flex flex-col bg-dark-surface/40 rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#b026ff]/30 transition-all duration-500 group"
                  >
                    {/* Game Placeholder/Thumbnail */}
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img 
                        src={game.image} 
                        alt={game.title} 
                        loading="lazy" 
                        decoding="async" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                           <Play className="w-6 h-6 text-white ml-0.5" />
                         </div>
                      </div>
                    </div>

                    {/* Info & Action */}
                    <div className="p-6 flex flex-col gap-4">
                      <div>
                        <h3 className="font-anton text-2xl uppercase tracking-tight text-white mb-1 group-hover:text-[#b026ff] transition-colors">{game.title}</h3>
                        <span className="text-[10px] font-display tracking-[0.2em] uppercase text-gray-500">{game.genre}</span>
                      </div>

                      <button 
                         onClick={() => handleLaunch(
                          game.title, 
                          'gamePath' in game ? game.gamePath : undefined,
                          'component' in game ? game.component : undefined,
                          undefined,
                          game.id
                        )}
                        disabled={pendingLaunchId === game.id}
                        className={`w-full py-3 rounded-xl font-display text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                          pendingLaunchId === game.id 
                          ? 'bg-white/20 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black hover:bg-[#b026ff] hover:text-white transform hover:scale-[1.02]'
                        }`}
                      >
                        {pendingLaunchId === game.id ? 'Launching...' : 'Play Game'}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
