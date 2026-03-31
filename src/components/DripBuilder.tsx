import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shirt,
  Trophy,
  Image as ImageIcon,
  Unlock,
  X,
  Check,
  Heart,
  Share2,
  Lock,
  Save,
  Sparkles,
  ChevronLeft,
  User,
  ShoppingBag
} from 'lucide-react';

// ==========================================
// 1. ASSET PATHS (served from /public/Drip_Builder/)
// ==========================================

const BASE = import.meta.env.BASE_URL + 'Drip_Builder/';

// ==========================================
// 2. DATA & CONSTANTS
// ==========================================

const CLOTHING_DB = [
  // TOPS
  {
    id: 't_black_tee',
    category: 'top',
    name: 'Oviäas Black Tee',
    image: BASE + 'ovs_black_tee.png',
    isLocked: false,
    // position & size as % of avatar container
    style: { top: '12%', left: '50%', width: '82%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_white_tee',
    category: 'top',
    name: 'Oviäas White Tee',
    image: BASE + 'ovs_white_tee.png',
    isLocked: false,
    style: { top: '12%', left: '50%', width: '82%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_black_hoodie',
    category: 'top',
    name: 'Oviaas Black Hoodie',
    image: BASE + 'ovs_black_hoodie.png',
    isLocked: false,
    style: { top: '10%', left: '50%', width: '90%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_white_hoodie',
    category: 'top',
    name: 'OVS White Hoodie',
    image: BASE + 'ovs_white_hoodie.png',
    isLocked: true,
    code: 'SOWETO26',
    style: { top: '8%', left: '50%', width: '95%', transform: 'translateX(-50%)' },
  },

  // BOTTOMS
  {
    id: 'b_shorts',
    category: 'bottom',
    name: 'Oviaas Lifestyle Shorts',
    image: BASE + 'ovs_shorts.png',
    isLocked: false,
    style: { top: '50%', left: '50%', width: '76%', transform: 'translateX(-50%)' },
  },
  {
    id: 'b_pitbul_shorts',
    category: 'bottom',
    name: 'OVS Pitbul Shorts',
    image: BASE + 'ovs_pitbul_shorts.png',
    isLocked: false,
    style: { top: '50%', left: '50%', width: '76%', transform: 'translateX(-50%)' },
  },
];

const INITIAL_INVENTORY = CLOTHING_DB.filter(i => !i.isLocked).map(i => i.id);

const CHALLENGES = [
  { id: 'c1', title: 'Campus Fit', desc: 'Build the ultimate first-day-of-class drip. Keep it clean, keep it loud.', reward: 'Unlock: OVS White Hoodie' },
  { id: 'c2', title: 'Kasi Flex', desc: 'Weekend in the township. Comfort meets pure street culture.', reward: 'Unlock: OVS Pitbul Shorts' },
  { id: 'c3', title: 'First Date', desc: 'Impress them before you even speak. Sophisticated streetwear.', reward: 'Unlock: OVS White Hoodie' },
];

// ==========================================
// 3. HOOKS
// ==========================================

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(v));
    } catch { /* ignore */ }
  };
  return [storedValue, setValue];
}

// ==========================================
// 4. AVATAR VIEWER — real PNG layered system
// ==========================================

interface OutfitState {
  avatar: 'male' | 'female';
  top: typeof CLOTHING_DB[0] | null;
  bottom: typeof CLOTHING_DB[0] | null;
}

const AvatarViewer = ({ outfit }: { outfit: OutfitState }) => {
  const avatarSrc = outfit.avatar === 'female'
    ? BASE + 'ovs_female.png'
    : BASE + 'ovs_male.png';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Base avatar */}
      <img
        src={avatarSrc}
        alt="Avatar"
        className="h-full w-auto object-contain relative z-10 select-none pointer-events-none"
        draggable={false}
      />

      {/* Clothing overlays — positioned absolute, relative to avatar container*/}
      <AnimatePresence>
        {outfit.bottom && (
          <motion.img
            key={`bottom-${outfit.bottom.id}`}
            src={outfit.bottom.image}
            alt={outfit.bottom.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute z-20 object-contain select-none pointer-events-none"
            style={outfit.bottom.style as React.CSSProperties}
            draggable={false}
          />
        )}
        {outfit.top && (
          <motion.img
            key={`top-${outfit.top.id}`}
            src={outfit.top.image}
            alt={outfit.top.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute z-30 object-contain select-none pointer-events-none"
            style={outfit.top.style as React.CSSProperties}
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 5. UI COMPONENTS
// ==========================================

const Btn = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
  const base = 'flex items-center justify-center gap-2 font-black uppercase tracking-wider py-3 px-6 transition-all duration-200 transform active:scale-95';
  const variants: any = {
    primary: 'bg-orange-500 text-black hover:bg-orange-400 border-2 border-orange-500 rounded-xl',
    outline: 'bg-transparent text-white border-2 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 rounded-xl',
    ghost: 'bg-transparent text-zinc-400 hover:text-white rounded-xl',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-zinc-900 border-2 border-zinc-800 w-full max-w-md p-6 rounded-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X size={24} /></button>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==========================================
// 6. SCREENS
// ==========================================

const HomeScreen = ({ onNavigate }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-zinc-950 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
      <div className="w-[150vw] h-[150vw] rounded-full border-[100px] border-orange-500 blur-3xl mix-blend-screen" />
    </div>
    <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="text-orange-500 font-bold tracking-[0.3em] text-sm uppercase mb-4">Obvious Studios Presents</h2>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
          DRIP<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">BUILDER</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-md mx-auto">Design your fit. Unlock exclusive digital merch. Rule the streets.</p>
      </motion.div>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-4 w-full">
        <Btn onClick={() => onNavigate('builder', { mode: 'freestyle' })} className="w-full text-xl py-4"><Shirt size={24} /> Free Style Mode</Btn>
        <Btn onClick={() => onNavigate('challenges')} variant="outline" className="w-full text-xl py-4"><Trophy size={24} /> Daily Challenges</Btn>
        <Btn onClick={() => onNavigate('gallery')} variant="ghost" className="w-full text-lg py-4"><ImageIcon size={20} /> Community Gallery</Btn>
      </motion.div>
    </div>
  </motion.div>
);

const BuilderScreen = ({ onNavigate, context, inventory, setInventory, savedOutfits, setSavedOutfits, showToast }: any) => {
  const isChallenge = context?.mode === 'challenge';

  const [outfit, setOutfit] = useState<OutfitState>({
    avatar: 'male',
    top: CLOTHING_DB.find(i => i.id === 't_black_tee') || null,
    bottom: CLOTHING_DB.find(i => i.id === 'b_shorts') || null,
  });

  const [activeCategory, setActiveCategory] = useState('top');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const adjectives = ['Kasi', 'Urban', 'Midnight', 'Neon', 'Concrete', 'Soweto', 'Retro', 'Future'];
  const nouns = ['Drip', 'Flex', 'Steez', 'Vibe', 'Flow', 'Wave', 'Edition', 'Uniform'];
  const [outfitName, setOutfitName] = useState(() => `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`);

  const handleEquip = (item: typeof CLOTHING_DB[0]) => {
    if (item.isLocked && !inventory.includes(item.id)) { setShowUnlockModal(true); return; }
    setOutfit(prev => ({ ...prev, [item.category]: item }));
  };

  const handleUnlock = () => {
    const found = CLOTHING_DB.find(i => (i as any).code === unlockCode.toUpperCase());
    if (found) {
      if (inventory.includes(found.id)) { showToast('You already own this!'); }
      else {
        setInventory((prev: string[]) => [...prev, found.id]);
        setOutfit(prev => ({ ...prev, [found.category]: found }));
        showToast(`Unlocked: ${found.name}! 🎉`, 'success');
      }
      setShowUnlockModal(false); setUnlockCode('');
    } else { showToast('Invalid code. Try again.', 'error'); }
  };

  const handleSave = () => {
    const newOutfit = { id: Date.now().toString(), name: outfitName, outfit, likes: 0, date: new Date().toISOString() };
    setSavedOutfits([newOutfit, ...savedOutfits]);
    setShowSaveModal(false);
    showToast('Fit saved to your gallery!', 'success');
    if (isChallenge) { onNavigate('home'); }
  };

  const filteredItems = CLOTHING_DB.filter(i => i.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex-none p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"><ChevronLeft size={20} /></button>
          <div className="min-w-0">
            <h1 className="font-black uppercase tracking-tight text-lg leading-none truncate">{isChallenge ? 'Challenge Mode' : 'Drip Builder'}</h1>
            {isChallenge && <p className="text-orange-500 text-xs font-bold truncate">{context.challenge.title}</p>}
          </div>
        </div>
        <Btn onClick={() => setShowSaveModal(true)} className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap"><Save size={16} /><span className="hidden sm:inline">Save Fit</span></Btn>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* === Avatar Preview Panel === */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-full relative bg-zinc-900 flex items-end justify-center overflow-hidden flex-none">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950" />
          {/* subtle ground reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* avatar container — fixed aspect ratio so overlays are predictable */}
          <div className="relative z-10 h-[90%] aspect-[1/2.1] flex-none">
            <AvatarViewer outfit={outfit} />
          </div>

          {/* Avatar toggle (male / female) */}
          <div className="absolute right-3 bottom-4 flex gap-2 z-20">
            <button
              onClick={() => setOutfit(p => ({ ...p, avatar: 'male' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${outfit.avatar === 'male' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
            >Male</button>
            <button
              onClick={() => setOutfit(p => ({ ...p, avatar: 'female' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${outfit.avatar === 'female' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
            >Female</button>
          </div>
        </div>

        {/* === Wardrobe Panel === */}
        <div className="flex-1 w-full md:w-1/2 bg-zinc-950 flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 overflow-hidden">
          {/* Category tabs */}
          <div className="flex p-3 gap-2 border-b border-zinc-800 flex-none overflow-x-auto no-scrollbar">
            {[
              { id: 'top', icon: Shirt, label: 'Tops' },
              { id: 'bottom', icon: ShoppingBag, label: 'Bottoms' },
            ].map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase tracking-wide whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                <cat.icon size={18} /> {cat.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 pb-24">
            {filteredItems.map(item => {
              const isUnlocked = inventory.includes(item.id) || !item.isLocked;
              const isActive = outfit[item.category as keyof OutfitState] && (outfit[item.category as keyof OutfitState] as any)?.id === item.id;
              return (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  key={item.id} onClick={() => handleEquip(item)}
                  className={`relative rounded-2xl flex flex-col items-center gap-2 transition-all border-2 overflow-hidden text-left ${isActive ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'} ${!isUnlocked ? 'opacity-60 grayscale' : ''}`}
                >
                  {/* Item thumbnail */}
                  <div className="w-full aspect-square bg-zinc-800 flex items-center justify-center overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.name} className="w-[80%] h-[80%] object-contain" />
                  </div>
                  <p className="px-3 pb-3 font-bold text-xs text-center uppercase tracking-tight leading-tight">{item.name}</p>

                  {!isUnlocked && <div className="absolute top-2 right-2 bg-zinc-950 p-1.5 rounded-full border border-zinc-700"><Lock size={12} className="text-zinc-400" /></div>}
                  {isActive && <div className="absolute top-2 right-2 bg-orange-500 p-1.5 rounded-full text-black"><Check size={12} /></div>}
                </motion.button>
              );
            })}

            {/* Remove slot */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setOutfit(prev => ({ ...prev, [activeCategory]: null }))}
              className={`relative rounded-2xl flex flex-col items-center justify-center gap-3 p-4 aspect-square transition-all border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-zinc-500 ${!outfit[activeCategory as keyof OutfitState] ? 'border-orange-500 text-orange-500' : ''}`}
            ><X size={28} /><p className="font-bold text-xs uppercase">Remove</p></motion.button>
          </div>

          {/* Unlock code footer */}
          <div className="flex-none p-4 bg-zinc-900 border-t border-zinc-800">
            <Btn onClick={() => setShowUnlockModal(true)} variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
              <Unlock size={18} /> Enter Merch Code
            </Btn>
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      <Modal isOpen={showUnlockModal} onClose={() => setShowUnlockModal(false)} title="Unlock Exclusive Merch">
        <p className="text-zinc-400 mb-6">Bought something from Oviaas? Enter the code on the tag to unlock it in-game.</p>
        <input type="text" value={unlockCode} onChange={e => setUnlockCode(e.target.value)}
          placeholder="ENTER CODE"
          className="w-full bg-zinc-950 border-2 border-zinc-700 rounded-xl px-4 py-4 text-white text-center text-xl font-black uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors mb-4" />
        <Btn onClick={handleUnlock} className="w-full py-4">Unlock Item</Btn>
      </Modal>

      {/* Save Modal */}
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Save Your Fit">
        <p className="text-zinc-400 mb-2">Give this drip a name.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={outfitName} onChange={e => setOutfitName(e.target.value)}
            className="flex-1 bg-zinc-950 border-2 border-zinc-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-orange-500 transition-colors" />
          <button onClick={() => setOutfitName(`${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`)} className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"><Sparkles size={20} className="text-orange-500" /></button>
        </div>
        <Btn onClick={handleSave} className="w-full py-4">Save to Gallery</Btn>
      </Modal>
    </motion.div>
  );
};

const ChallengesScreen = ({ onNavigate }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
    <header className="flex items-center gap-4 mb-8 pt-4">
      <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} /></button>
      <h1 className="text-3xl font-black uppercase tracking-tighter">Challenges</h1>
    </header>
    <div className="max-w-2xl mx-auto space-y-4">
      {CHALLENGES.map(c => (
        <motion.div key={c.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('builder', { mode: 'challenge', challenge: c })}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tight">{c.title}</h2>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-orange-500"><Trophy size={20} /></div>
          </div>
          <p className="text-zinc-400 mb-6 relative z-10">{c.desc}</p>
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400 bg-orange-500/10 w-max px-3 py-1.5 rounded-full relative z-10"><Unlock size={14} /> {c.reward}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const GalleryScreen = ({ onNavigate, savedOutfits, showToast }: any) => {
  const mockFeed = useMemo(() => [
    { id: 'm1', name: 'Midnight Flex', user: '@tebogo_steez', likes: 245 },
    { id: 'm2', name: 'Summer Wave', user: '@kasi_queen', likes: 189 },
  ], []);
  const allOutfits = [...savedOutfits.map((o: any) => ({ ...o, isUser: true, user: 'You' })), ...mockFeed];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Community Feed</h1>
      </header>
      {allOutfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ImageIcon size={48} className="text-zinc-700 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Fits Yet</h2>
          <p className="text-zinc-500 mb-6">Create your first outfit and save it here.</p>
          <Btn onClick={() => onNavigate('builder', { mode: 'freestyle' })}>Start Building</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {allOutfits.map((post: any) => (
            <motion.div key={post.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col">
              <div className="bg-zinc-800 h-72 relative flex items-center justify-center overflow-hidden">
                {post.isUser ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-full aspect-[1/2.1]">
                      <AvatarViewer outfit={post.outfit} />
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-600 flex flex-col items-center font-black uppercase tracking-widest opacity-50">
                    <ImageIcon size={48} className="mb-2" /> Community Fit
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">{post.name}</h3>
                    <p className="text-zinc-400 text-sm">{post.user}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-zinc-950 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"><Heart size={18} /></button>
                    <button onClick={() => showToast('Link copied!')} className="p-2 bg-zinc-950 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><Share2 size={18} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-500"><Heart size={14} className="fill-current text-red-500/50" /> {post.likes || 0} Likes</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// 7. MAIN APP
// ==========================================

export default function DripBuilder() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenContext, setScreenContext] = useState<any>(null);
  const [inventory, setInventory] = useLocalStorage<string[]>('obvious_inventory', INITIAL_INVENTORY);
  const [savedOutfits, setSavedOutfits] = useLocalStorage<any[]>('obvious_saved_fits', []);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const navigate = (screen: string, context: any = null) => {
    setScreenContext(context);
    setCurrentScreen(screen);
  };

  const showToast = (message: string, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="font-sans bg-zinc-950 text-white min-h-screen w-full selection:bg-orange-500 selection:text-black">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && <HomeScreen key="home" onNavigate={navigate} />}
        {currentScreen === 'builder' && <BuilderScreen key="builder" onNavigate={navigate} context={screenContext} inventory={inventory} setInventory={setInventory} savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} showToast={showToast} />}
        {currentScreen === 'challenges' && <ChallengesScreen key="challenges" onNavigate={navigate} />}
        {currentScreen === 'gallery' && <GalleryScreen key="gallery" onNavigate={navigate} savedOutfits={savedOutfits} showToast={showToast} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'success' ? 'bg-orange-500 text-black' : 'bg-white text-black'}`}
          >
            {toast.type === 'success' && <Check size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
