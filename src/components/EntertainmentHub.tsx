import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Gamepad2, Music, ChevronRight, X } from 'lucide-react';
import DripBuilder from './DripBuilder';


const tabs = [
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'studios', label: 'Oviaas Studios', icon: Play },
  { id: 'music', label: 'Audio', icon: Music },
];

const content = {
  studios: [
    { id: 1, title: 'The Neon Thread', duration: '12:45', image: 'https://picsum.photos/seed/movie_neon/800/450' },
    { id: 2, title: 'Behind the Seams', duration: '45:20', image: 'https://picsum.photos/seed/movie_seams/800/450' },
    { id: 3, title: 'Cyberpunk 2077 x Oviaas', duration: '05:15', image: 'https://picsum.photos/seed/movie_cyber/800/450' },
  ],
  games: [
    { id: 1, title: 'Soweto Run Oviaas', genre: 'Endless Runner', image: `${import.meta.env.BASE_URL}assets/gusheshe.png`, gamePath: `${import.meta.env.BASE_URL}Soweto_Run_Oviaas/index.html` },
    { id: 2, title: 'Kasi Hoops', genre: 'Arcade Basketball', image: `${import.meta.env.BASE_URL}assets/Kasi_Hoops/kasi_hoop_charecter_1.png`, gamePath: `${import.meta.env.BASE_URL}Kasi_Hoops/index.html` },
    { id: 3, title: 'Neon Character', genre: 'Action', image: `${import.meta.env.BASE_URL}assets/charecter.png` },
    { id: 4, title: 'Oviaas Coin Rush', genre: 'Arcade', image: `${import.meta.env.BASE_URL}assets/Oviaas_Coin.png` },
    { id: 5, title: 'Gusheshe Night', genre: 'Racing', image: `${import.meta.env.BASE_URL}assets/gusheshe_2.png` },
    { id: 6, title: 'Cyber Character', genre: 'Action', image: `${import.meta.env.BASE_URL}assets/charecter_2.png` },
    { id: 7, title: 'Drip Builder', genre: 'Customization', image: `${import.meta.env.BASE_URL}assets/charecter.png`, component: 'DripBuilder' },
  ],
  music: [
    { id: 1, title: 'Oviaas Vol. 1', artist: 'Various Artists', image: 'https://picsum.photos/seed/music_vol1/500/500' },
    { id: 2, title: 'Cyber Beats', artist: 'DJ Neon', image: 'https://picsum.photos/seed/music_cyber/500/500' },
    { id: 3, title: 'Ambient City', artist: 'The Synth', image: 'https://picsum.photos/seed/music_ambient/500/500' },
  ],
};

export default function EntertainmentHub() {
  const [activeTab, setActiveTab] = useState('games');
  const [launchingItem, setLaunchingItem] = useState<string | null>(null);
  const [activeIframe, setActiveIframe] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const handleLaunch = (title: string, path?: string, component?: string) => {
    if (component) {
      setActiveComponent(component);
    } else if (path) {
      setActiveIframe(path);
    } else {
      setLaunchingItem(title);
      setTimeout(() => {
        setLaunchingItem(null);
      }, 3000);
    }
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
                <iframe 
                  src={activeIframe} 
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
                className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
              >
                {content.studios.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleLaunch(item.title)}
                    className="min-w-[300px] md:min-w-[400px] aspect-video relative rounded-2xl overflow-hidden group snap-center cursor-pointer"
                  >
                    <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <span className="text-xs font-mono text-[#00f0ff] mb-2 block">{item.duration}</span>
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
                    onClick={() => handleLaunch(
                      game.title, 
                      'gamePath' in game ? game.gamePath : undefined,
                      'component' in game ? game.component : undefined
                    )}
                    className="aspect-square relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#b026ff]/50 transition-colors"
                  >
                    <img src={game.image} alt={game.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                      <Gamepad2 className="w-12 h-12 text-white/50 group-hover:text-[#b026ff] transition-colors mb-4 transform group-hover:-translate-y-2 duration-300" />
                      <h3 className="font-anton text-3xl uppercase tracking-tighter text-white mb-2">{game.title}</h3>
                      <span className="text-xs font-display tracking-widest uppercase text-gray-400">{game.genre}</span>
                      
                      <div className="mt-6 px-6 py-2 border border-white/30 rounded-full font-display text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-black">
                        Play Now
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'music' && (
              <motion.div
                key="music"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {content.music.map((album) => (
                  <div 
                    key={album.id} 
                    onClick={() => handleLaunch(album.title)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-full aspect-square relative rounded-full overflow-hidden mb-6 border-4 border-dark-surface group-hover:border-[#00f0ff]/50 transition-colors duration-500">
                      <img src={album.image} alt={album.title} loading="lazy" decoding="async" className="w-full h-full object-cover animate-[spin_20s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite]" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20" />
                      {/* Vinyl Center */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-dark-bg rounded-full border-4 border-dark-surface flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    
                    <h3 className="font-display text-xl uppercase tracking-widest text-white text-center mb-1">{album.title}</h3>
                    <span className="text-xs font-sans text-gray-500 tracking-widest uppercase text-center">{album.artist}</span>
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
