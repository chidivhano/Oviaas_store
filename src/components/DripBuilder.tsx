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
  ShoppingBag
} from 'lucide-react';

// ==========================================
// 1. ASSET PATHS
// ==========================================
const BASE = import.meta.env.BASE_URL + 'Drip_Builder/';

// ==========================================
// 2. DATA
//
// Positioning rationale (all % of the shared stack container):
//  Male avatar (PNG ~0.54:1 w:h ratio):
//    Collar/shirt-start  ≈ 20% from top
//    Shirt hem / waist   ≈ 52% from top
//    Shorts waist        ≈ 50% from top
//    Shorts hem          ≈ 72% from top
//    Avatar shoulder w   ≈ 66% of container width
//
//  Female avatar (PNG ~0.72:1 w:h ratio — wider relative to height):
//    Collar/shirt-start  ≈ 23% from top
//    Shirt hem / waist   ≈ 56% from top
//    Shorts waist        ≈ 53% from top
//    Shorts hem          ≈ 72% from top
//    Avatar shoulder w   ≈ 58% of container width
//
//  The clothing PNGs have ~5% transparent padding on each side.
//  We therefore add ~10% extra width so the garment fills to the body edge.
// ==========================================

interface ClothingStyle {
  top: string;
  left: string;
  width: string;
  transform: string;
}

interface ClothingItem {
  id: string;
  category: 'top' | 'bottom';
  name: string;
  image: string;
  isLocked: boolean;
  code?: string;
  styleM: ClothingStyle;   // male overlay
  styleF: ClothingStyle;   // female overlay
}

const CLOTHING_DB: ClothingItem[] = [
  // ── TOPS ──────────────────────────────────────────────────────────────────
  {
    id: 't_black_tee',
    category: 'top',
    name: 'Oviäas Black Tee',
    image: BASE + 'ovs_black_tee.png',
    isLocked: false,
    // Male: tee collar at ~20%, shoulder-to-shoulder ~66% → image 76%
    styleM: { top: '19%', left: '50%', width: '76%', transform: 'translateX(-50%)' },
    // Female: slightly narrower shoulders, starts slightly lower
    styleF: { top: '22%', left: '50%', width: '68%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_white_tee',
    category: 'top',
    name: 'Oviäas White Tee',
    image: BASE + 'ovs_white_tee.png',
    isLocked: false,
    styleM: { top: '19%', left: '50%', width: '76%', transform: 'translateX(-50%)' },
    styleF: { top: '22%', left: '50%', width: '68%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_black_hoodie',
    category: 'top',
    name: 'Oviaas Black Hoodie',
    image: BASE + 'ovs_black_hoodie.png',
    isLocked: false,
    // Hoodie is shorter-sleeve / boxier — sits a touch higher, slightly wider
    styleM: { top: '17%', left: '50%', width: '82%', transform: 'translateX(-50%)' },
    styleF: { top: '20%', left: '50%', width: '72%', transform: 'translateX(-50%)' },
  },
  {
    id: 't_white_hoodie',
    category: 'top',
    name: 'OVS White Hoodie',
    image: BASE + 'ovs_white_hoodie.png',
    isLocked: true,
    code: 'SOWETO26',
    // Full pullover hoodie — widest (long arms visible)
    styleM: { top: '15%', left: '50%', width: '88%', transform: 'translateX(-50%)' },
    styleF: { top: '18%', left: '50%', width: '78%', transform: 'translateX(-50%)' },
  },

  // ── BOTTOMS ───────────────────────────────────────────────────────────────
  {
    id: 'b_shorts',
    category: 'bottom',
    name: 'Oviaas Lifestyle Shorts',
    image: BASE + 'ovs_shorts.png',
    isLocked: false,
    // Shorts PNG is wider than tall (landscape-ish).  Male hip ~55% container W.
    styleM: { top: '49%', left: '50%', width: '66%', transform: 'translateX(-50%)' },
    styleF: { top: '52%', left: '50%', width: '60%', transform: 'translateX(-50%)' },
  },
  {
    id: 'b_pitbul_shorts',
    category: 'bottom',
    name: 'OVS Pitbul Shorts',
    image: BASE + 'ovs_pitbul_shorts.png',
    isLocked: false,
    styleM: { top: '49%', left: '50%', width: '66%', transform: 'translateX(-50%)' },
    styleF: { top: '52%', left: '50%', width: '60%', transform: 'translateX(-50%)' },
  },
];

const INITIAL_INVENTORY: string[] = CLOTHING_DB.filter(i => !i.isLocked).map(i => i.id);

const CHALLENGES = [
  { id: 'c1', title: 'Campus Fit', desc: 'Build the ultimate first-day-of-class drip. Keep it clean, keep it loud.', reward: 'Unlock: OVS White Hoodie (code: SOWETO26)' },
  { id: 'c2', title: 'Kasi Flex', desc: 'Weekend in the township. Comfort meets pure street culture.', reward: 'Unlock: Pitbul Shorts' },
  { id: 'c3', title: 'First Date', desc: 'Impress them before you even speak. Sophisticated streetwear.', reward: 'Unlock: OVS White Hoodie (code: SOWETO26)' },
];

// ==========================================
// 3. HOOKS
// ==========================================
function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initialValue; }
    catch { return initialValue; }
  });
  const set = (v: T | ((prev: T) => T)) => {
    const val = v instanceof Function ? v(state) : v;
    setState(val);
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* */ }
  };
  return [state, set];
}

// ==========================================
// 4. AVATAR VIEWER
//
// All layers share ONE relative container.
// Every img (avatar + clothes) is position:absolute inset-0 w-full h-full object-contain.
// This ensures that left/top/width percentages on clothing overlays
// are measured from the SAME origin as the avatar image.
// ==========================================
interface OutfitState {
  avatar: 'male' | 'female';
  top: ClothingItem | null;
  bottom: ClothingItem | null;
}

const AvatarViewer = ({ outfit }: { outfit: OutfitState }) => {
  const isFemale = outfit.avatar === 'female';
  const avatarSrc = isFemale ? BASE + 'ovs_female.png' : BASE + 'ovs_male.png';

  const getStyle = (item: ClothingItem): ClothingStyle =>
    isFemale ? item.styleF : item.styleM;

  return (
    // This `relative` div IS the positioning context for everything.
    // aspect-[9/17] ≈ male avatar's natural ratio. Female is squarer but
    // object-contain handles it gracefully inside the same container.
    <div className="relative w-full h-full">

      {/* ── Layer 0: base avatar ── */}
      <img
        src={avatarSrc}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />

      {/* ── Layer 1: bottom (rendered below top) ── */}
      <AnimatePresence>
        {outfit.bottom && (
          <motion.img
            key={`bottom-${outfit.bottom.id}-${outfit.avatar}`}
            src={outfit.bottom.image}
            alt={outfit.bottom.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute object-contain select-none pointer-events-none"
            style={getStyle(outfit.bottom) as React.CSSProperties}
            draggable={false}
          />
        )}
      </AnimatePresence>

      {/* ── Layer 2: top (rendered above bottom) ── */}
      <AnimatePresence>
        {outfit.top && (
          <motion.img
            key={`top-${outfit.top.id}-${outfit.avatar}`}
            src={outfit.top.image}
            alt={outfit.top.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute object-contain select-none pointer-events-none"
            style={getStyle(outfit.top) as React.CSSProperties}
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 5. UI PRIMITIVES
// ==========================================
const Btn = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
  const base = 'flex items-center justify-center gap-2 font-black uppercase tracking-wider py-3 px-6 transition-all duration-200 active:scale-95';
  const v: Record<string, string> = {
    primary: 'bg-orange-500 text-black hover:bg-orange-400 border-2 border-orange-500 rounded-xl',
    outline: 'bg-transparent text-white border-2 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 rounded-xl',
    ghost: 'bg-transparent text-zinc-400 hover:text-white rounded-xl',
  };
  return <button onClick={onClick} className={`${base} ${v[variant]} ${className}`} {...props}>{children}</button>;
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-zinc-900 border-2 border-zinc-800 w-full max-w-md p-6 rounded-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
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

/* ── Home ─────────────────────────────── */
const HomeScreen = ({ onNavigate }: { onNavigate: (s: string, ctx?: any) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-zinc-950 relative overflow-hidden">
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

/* ── Builder ──────────────────────────── */
const BuilderScreen = ({ onNavigate, context, inventory, setInventory, savedOutfits, setSavedOutfits, showToast }: any) => {
  const isChallenge = context?.mode === 'challenge';

  const [outfit, setOutfit] = useState<OutfitState>({
    avatar: 'male',
    top: CLOTHING_DB.find(i => i.id === 't_black_tee') ?? null,
    bottom: CLOTHING_DB.find(i => i.id === 'b_shorts') ?? null,
  });
  const [activeCategory, setActiveCategory] = useState<'top' | 'bottom'>('top');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const adj = ['Kasi', 'Urban', 'Midnight', 'Neon', 'Concrete', 'Soweto', 'Retro', 'Future'];
  const nou = ['Drip', 'Flex', 'Steez', 'Vibe', 'Flow', 'Wave', 'Edition', 'Uniform'];
  const [outfitName, setOutfitName] = useState(() => `${adj[Math.floor(Math.random() * adj.length)]} ${nou[Math.floor(Math.random() * nou.length)]}`);

  const handleEquip = (item: ClothingItem) => {
    if (item.isLocked && !inventory.includes(item.id)) { setShowUnlockModal(true); return; }
    setOutfit(p => ({ ...p, [item.category]: item }));
  };

  const handleUnlock = () => {
    const found = CLOTHING_DB.find(i => i.code === unlockCode.toUpperCase());
    if (found) {
      if (inventory.includes(found.id)) { showToast('You already own this!'); }
      else {
        setInventory((p: string[]) => [...p, found.id]);
        setOutfit(p => ({ ...p, [found.category]: found }));
        showToast(`Unlocked: ${found.name}! 🎉`, 'success');
      }
      setShowUnlockModal(false); setUnlockCode('');
    } else { showToast('Invalid code. Try again.', 'error'); }
  };

  const handleSave = () => {
    setSavedOutfits((p: any[]) => [{ id: Date.now().toString(), name: outfitName, outfit, likes: 0, date: new Date().toISOString() }, ...p]);
    setShowSaveModal(false);
    showToast('Fit saved to your gallery!', 'success');
    if (isChallenge) onNavigate('home');
  };

  const filteredItems = CLOTHING_DB.filter(i => i.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Header */}
      <header className="flex-none p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"><ChevronLeft size={20} /></button>
          <div className="min-w-0">
            <h1 className="font-black uppercase tracking-tight text-lg leading-none truncate">{isChallenge ? 'Challenge Mode' : 'Drip Builder'}</h1>
            {isChallenge && <p className="text-orange-500 text-xs font-bold truncate">{context.challenge.title}</p>}
          </div>
        </div>
        <Btn onClick={() => setShowSaveModal(true)} className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
          <Save size={16} /><span className="hidden sm:inline ml-1">Save Fit</span>
        </Btn>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ── Avatar Panel ── */}
        <div className="w-full md:w-1/2 flex-none md:flex-1 h-[46vh] md:h-full
                        relative bg-zinc-900 flex items-center justify-center overflow-hidden">
          {/* subtle bg gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

          {/*
            THE KEY: a single container with a portrait aspect ratio.
            `aspect-[9/17]` ≈ male avatar's natural proportions (≈ 0.53:1).
            All clothing overlays are children of AvatarViewer which sits
            inside this div — so every percentage refers to THIS box.
          */}
          <div className="relative h-[92%] aspect-[9/17] z-10">
            <AvatarViewer outfit={outfit} />
          </div>

          {/* Gender toggle */}
          <div className="absolute bottom-4 right-3 flex gap-2 z-20">
            {(['male', 'female'] as const).map(g => (
              <button key={g}
                onClick={() => setOutfit(p => ({ ...p, avatar: g }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all shadow
                  ${outfit.avatar === g ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >{g}</button>
            ))}
          </div>
        </div>

        {/* ── Wardrobe Panel ── */}
        <div className="flex-1 w-full md:w-1/2 bg-zinc-950 flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 overflow-hidden">

          {/* Category tabs */}
          <div className="flex p-3 gap-2 border-b border-zinc-800 flex-none overflow-x-auto no-scrollbar">
            {[
              { id: 'top' as const, icon: Shirt, label: 'Tops' },
              { id: 'bottom' as const, icon: ShoppingBag, label: 'Bottoms' },
            ].map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase tracking-wide whitespace-nowrap transition-all
                  ${activeCategory === cat.id ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                <cat.icon size={18} /> {cat.label}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 pb-24 content-start">
            {filteredItems.map(item => {
              const unlocked = !item.isLocked || inventory.includes(item.id);
              const active = outfit[item.category]?.id === item.id;
              return (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.id}
                  onClick={() => handleEquip(item)}
                  className={`relative rounded-2xl flex flex-col items-center gap-0 transition-all border-2 overflow-hidden
                    ${active ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}
                    ${!unlocked ? 'opacity-60 grayscale' : ''}`}>
                  {/* Thumbnail */}
                  <div className="w-full aspect-square bg-zinc-800 flex items-center justify-center overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.name} className="w-[85%] h-[85%] object-contain" loading="lazy" />
                  </div>
                  <p className="px-3 py-3 font-bold text-xs text-center uppercase tracking-tight leading-tight">{item.name}</p>
                  {!unlocked && <div className="absolute top-2 right-2 bg-zinc-950 p-1.5 rounded-full border border-zinc-700"><Lock size={12} className="text-zinc-400" /></div>}
                  {active && <div className="absolute top-2 right-2 bg-orange-500 p-1.5 rounded-full text-black"><Check size={12} /></div>}
                </motion.button>
              );
            })}

            {/* Remove slot */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setOutfit(p => ({ ...p, [activeCategory]: null }))}
              className={`relative rounded-2xl flex flex-col items-center justify-center gap-3 aspect-square transition-all border-2 border-dashed
                border-zinc-700 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-zinc-500
                ${!outfit[activeCategory] ? 'border-orange-500 text-orange-500' : ''}`}>
              <X size={28} /><p className="font-bold text-xs uppercase">Remove</p>
            </motion.button>
          </div>

          {/* Code unlock footer */}
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
          <button onClick={() => setOutfitName(`${adj[Math.floor(Math.random() * adj.length)]} ${nou[Math.floor(Math.random() * nou.length)]}`)}
            className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
            <Sparkles size={20} className="text-orange-500" />
          </button>
        </div>
        <Btn onClick={handleSave} className="w-full py-4">Save to Gallery</Btn>
      </Modal>
    </motion.div>
  );
};

/* ── Challenges ───────────────────────── */
const ChallengesScreen = ({ onNavigate }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
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
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400 bg-orange-500/10 w-max px-3 py-1.5 rounded-full relative z-10">
            <Unlock size={14} /> {c.reward}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ── Gallery ──────────────────────────── */
const GalleryScreen = ({ onNavigate, savedOutfits, showToast }: any) => {
  const mockFeed = useMemo(() => [
    { id: 'm1', name: 'Midnight Flex', user: '@tebogo_steez', likes: 245, isUser: false },
    { id: 'm2', name: 'Summer Wave', user: '@kasi_queen', likes: 189, isUser: false },
  ], []);
  const all = [...savedOutfits.map((o: any) => ({ ...o, isUser: true, user: 'You' })), ...mockFeed];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Community Feed</h1>
      </header>
      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ImageIcon size={48} className="text-zinc-700 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Fits Yet</h2>
          <p className="text-zinc-500 mb-6">Create your first outfit and save it here.</p>
          <Btn onClick={() => onNavigate('builder', { mode: 'freestyle' })}>Start Building</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {all.map((post: any) => (
            <motion.div key={post.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col">
              <div className="bg-zinc-800 h-72 relative flex items-center justify-center overflow-hidden">
                {post.isUser ? (
                  <div className="relative h-full aspect-[9/17] mx-auto">
                    <AvatarViewer outfit={post.outfit} />
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
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
                  <Heart size={14} className="fill-current text-red-500/50" /> {post.likes || 0} Likes
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// 7. ROOT
// ==========================================
export default function DripBuilder() {
  const [screen, setScreen] = useState('home');
  const [ctx, setCtx] = useState<any>(null);
  const [inventory, setInventory] = useLocalStorage<string[]>('obvious_inventory', INITIAL_INVENTORY);
  const [savedOutfits, setSavedOutfits] = useLocalStorage<any[]>('obvious_saved_fits', []);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const navigate = (s: string, c: any = null) => { setCtx(c); setScreen(s); };
  const showToast = (message: string, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="font-sans bg-zinc-950 text-white min-h-screen w-full selection:bg-orange-500 selection:text-black">
      <AnimatePresence mode="wait">
        {screen === 'home' && <HomeScreen key="home" onNavigate={navigate} />}
        {screen === 'builder' && (
          <BuilderScreen key="builder" onNavigate={navigate} context={ctx}
            inventory={inventory} setInventory={setInventory}
            savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} showToast={showToast} />
        )}
        {screen === 'challenges' && <ChallengesScreen key="challenges" onNavigate={navigate} />}
        {screen === 'gallery' && <GalleryScreen key="gallery" onNavigate={navigate} savedOutfits={savedOutfits} showToast={showToast} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2
              ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'success' ? 'bg-orange-500 text-black' : 'bg-white text-black'}`}>
            {toast.type === 'success' && <Check size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
