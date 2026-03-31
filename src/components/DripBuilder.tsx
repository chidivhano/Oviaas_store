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
// 1. DATA & CONSTANTS
// ==========================================

const INITIAL_INVENTORY = ['t1', 't2', 'b1', 'b2', 's1', 's2', 'a1'];

const CLOTHING_DB = [
  // TOPS
  { id: 't1', category: 'top', style: 'tee', name: 'Essential Blank Tee', color: '#ffffff', isLocked: false },
  { id: 't2', category: 'top', style: 'tee', name: 'Midnight Onyx Tee', color: '#1a1a1a', isLocked: false },
  { id: 't3', category: 'top', style: 'hoodie', name: 'Obvious Kasi Hoodie', color: '#ea580c', isLocked: false, hasGraphic: true },
  { id: 't4', category: 'top', style: 'hoodie', name: 'Soweto Sunset Puffer', color: '#8b5cf6', isLocked: true, code: 'SOWETO26', hasGraphic: true },
  { id: 't5', category: 'top', style: 'tee', name: 'Toxic Slime Longsleeve', color: '#84cc16', isLocked: true, code: 'DRIP26', hasGraphic: true },

  // BOTTOMS
  { id: 'b1', category: 'bottom', style: 'pants', name: 'Concrete Sweats', color: '#737373', isLocked: false },
  { id: 'b2', category: 'bottom', style: 'shorts', name: 'Summer Courts', color: '#172554', isLocked: false },
  { id: 'b3', category: 'bottom', style: 'pants', name: 'Cargo Heavyweights', color: '#3f6212', isLocked: false },
  { id: 'b4', category: 'bottom', style: 'pants', name: 'Neon Trackpants', color: '#eab308', isLocked: true, code: 'TRACKSTAR' },

  // SHOES
  { id: 's1', category: 'shoes', style: 'sneaker', name: 'Cloud Steppers', color: '#ffffff', isLocked: false },
  { id: 's2', category: 'shoes', style: 'boot', name: 'Asphalt Stompers', color: '#000000', isLocked: false },
  { id: 's3', category: 'shoes', style: 'sneaker', name: 'Volt Runners', color: '#10b981', isLocked: true, code: 'RUNJHB' },

  // ACCESSORIES
  { id: 'a1', category: 'acc', style: 'cap', name: 'Standard Beanie', color: '#27272a', isLocked: false },
  { id: 'a2', category: 'acc', style: 'chain', name: 'Heavy Gold Chain', color: '#fbbf24', isLocked: false },
  { id: 'a3', category: 'acc', style: 'cap', name: 'Obvious Trucker', color: '#dc2626', isLocked: true, code: 'OBVSHEAD' },
  { id: 'a4', category: 'acc', style: 'bag', name: 'Crossbody Utility', color: '#1e1b4b', isLocked: true, code: 'SECUREBAG' }
];

const CHALLENGES = [
  { id: 'c1', title: 'Campus Fit', desc: 'Build the ultimate first-day-of-class drip. Keep it clean, keep it loud.', reward: 'Unlock: Neon Trackpants' },
  { id: 'c2', title: 'Kasi Flex', desc: 'Weekend in the township. Comfort meets pure street culture.', reward: 'Unlock: Obvious Trucker' },
  { id: 'c3', title: 'First Date', desc: 'Impress them before you even speak. Sophisticated streetwear.', reward: 'Unlock: Volt Runners' },
];

// ==========================================
// 2. HOOKS
// ==========================================

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return [storedValue, setValue];
}

// ==========================================
// 3. SVG GRAPHICS ENGINE
// ==========================================

const AvatarBase = ({ type, skinTone }: { type: string, skinTone: string }) => {
  const isFemale = type === 'female';
  const width = isFemale ? 65 : 80;
  const waist = isFemale ? 55 : 75;

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-xl z-0 transition-all duration-500">
      <circle cx="100" cy="50" r="22" fill={skinTone} />
      <rect x="92" y="68" width="16" height="15" fill={skinTone} />
      <path d={`M ${100 - width / 2} 80 L ${100 + width / 2} 80 L ${100 + waist / 2} 210 L ${100 - waist / 2} 210 Z`} fill={skinTone} />
      <rect x={100 - waist / 2 + 2} y="200" width="22" height="140" rx="10" fill={skinTone} />
      <rect x={100 + waist / 2 - 24} y="200" width="22" height="140" rx="10" fill={skinTone} />
      <path d={`M ${100 - width / 2} 80 Q ${100 - width / 2 - 20} 140 ${100 - width / 2 - 10} 200`} fill="none" stroke={skinTone} strokeWidth="18" strokeLinecap="round" />
      <path d={`M ${100 + width / 2} 80 Q ${100 + width / 2 + 20} 140 ${100 + width / 2 + 10} 200`} fill="none" stroke={skinTone} strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
};

const TopGraphic = ({ item }: { item: any }) => {
  if (!item) return null;
  return (
    <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-20">
      {item.style === 'hoodie' && (
        <path d="M 60 75 Q 100 20 140 75 Z" fill={item.color} />
      )}
      <rect x="55" y="78" width="90" height="135" rx="12" fill={item.color} />
      <path d="M 58 85 L 30 150 L 50 160 L 65 110 Z" fill={item.color} />
      <path d="M 142 85 L 170 150 L 150 160 L 135 110 Z" fill={item.color} />
      {item.style === 'hoodie' && (
        <>
          <rect x="70" y="160" width="60" height="35" rx="8" fill="rgba(0,0,0,0.15)" />
          <path d="M 85 80 L 85 110 M 115 80 L 115 110" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {item.hasGraphic && (
        <text x="100" y="145" fill={item.color === '#ffffff' ? '#000' : '#fff'} fontSize="18" fontWeight="900" textAnchor="middle" transform="rotate(-10 100 145)" style={{ fontFamily: 'sans-serif', letterSpacing: '2px' }}>
          OBVIOUS
        </text>
      )}
    </svg>
  );
};

const BottomGraphic = ({ item }: { item: any }) => {
  if (!item) return null;
  const isShorts = item.style === 'shorts';
  return (
    <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg z-10">
      <rect x="58" y="200" width="84" height="25" rx="4" fill={item.color} />
      <rect x="58" y="210" width="40" height={isShorts ? 65 : 135} rx="6" fill={item.color} />
      <rect x="102" y="210" width="40" height={isShorts ? 65 : 135} rx="6" fill={item.color} />
      {!isShorts && item.color !== '#172554' && (
        <>
          <rect x="55" y="260" width="10" height="30" rx="2" fill="rgba(0,0,0,0.2)" />
          <rect x="135" y="260" width="10" height="30" rx="2" fill="rgba(0,0,0,0.2)" />
        </>
      )}
    </svg>
  );
};

const ShoeGraphic = ({ item }: { item: any }) => {
  if (!item) return null;
  return (
    <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl z-30">
      <path d={`M 55 330 L 95 330 L 98 360 L 45 360 Q 45 340 55 330 Z`} fill={item.color} />
      <path d={`M 105 330 L 145 330 L 155 360 L 102 360 Q 102 340 105 330 Z`} fill={item.color} />
      {item.style === 'sneaker' && (
        <>
          <path d="M 45 352 L 98 352 M 102 352 L 155 352" stroke="#fff" strokeWidth="6" />
          <path d="M 50 340 L 70 345 M 110 340 L 130 345" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {item.style === 'boot' && (
        <>
          <rect x="45" y="355" width="53" height="8" fill="#333" />
          <rect x="102" y="355" width="53" height="8" fill="#333" />
        </>
      )}
    </svg>
  );
};

const AccessoryGraphic = ({ item }: { item: any }) => {
  if (!item) return null;
  if (item.style === 'cap') {
    return (
      <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl z-40">
        <path d="M 70 40 Q 100 15 130 40 L 145 40 L 145 52 L 65 52 Z" fill={item.color} />
        {item.color === '#dc2626' && <circle cx="100" cy="35" r="5" fill="#fff" />}
      </svg>
    );
  }
  if (item.style === 'chain') {
    return (
      <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-30">
        <path d="M 75 80 Q 100 140 125 80" fill="none" stroke={item.color} strokeWidth="4" strokeDasharray="4 2" />
        <circle cx="100" cy="112" r="10" fill={item.color} />
        <text x="100" y="117" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">O</text>
      </svg>
    );
  }
  if (item.style === 'bag') {
    return (
      <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-40">
        <path d="M 50 80 L 140 160" stroke="#111" strokeWidth="6" />
        <rect x="110" y="130" width="45" height="55" rx="8" fill={item.color} transform="rotate(-20 110 130)" />
        <rect x="120" y="145" width="25" height="15" rx="4" fill="rgba(0,0,0,0.3)" transform="rotate(-20 110 130)" />
      </svg>
    );
  }
  return null;
};

// ==========================================
// 4. UI COMPONENTS
// ==========================================

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
  const base = "flex items-center justify-center gap-2 font-black uppercase tracking-wider py-3 px-6 rounded-none transition-all duration-200 transform active:scale-95";
  const variants: any = {
    primary: "bg-orange-500 text-black hover:bg-orange-400 border-2 border-orange-500",
    secondary: "bg-zinc-100 text-black hover:bg-white border-2 border-zinc-100",
    outline: "bg-transparent text-white border-2 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800",
    ghost: "bg-transparent text-zinc-400 hover:text-white"
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
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-zinc-900 border-2 border-zinc-800 w-full max-w-md p-6 rounded-xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==========================================
// 5. SCREENS
// ==========================================

const HomeScreen = ({ onNavigate }: any) => {
  return (
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
          <Button onClick={() => onNavigate('builder', { mode: 'freestyle' })} className="w-full text-xl py-4 rounded-xl">
            <Shirt size={24} /> Free Style Mode
          </Button>
          <Button onClick={() => onNavigate('challenges')} variant="outline" className="w-full text-xl py-4 rounded-xl">
            <Trophy size={24} /> Daily Challenges
          </Button>
          <Button onClick={() => onNavigate('gallery')} variant="ghost" className="w-full text-lg py-4">
            <ImageIcon size={20} /> View Community Gallery
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BuilderScreen = ({ onNavigate, context, inventory, setInventory, savedOutfits, setSavedOutfits, showToast }: any) => {
  const isChallenge = context?.mode === 'challenge';
  const [outfit, setOutfit] = useState<any>({
    avatar: 'neutral',
    skinTone: '#a67b5b',
    top: CLOTHING_DB.find(i => i.id === 't1'),
    bottom: CLOTHING_DB.find(i => i.id === 'b1'),
    shoes: CLOTHING_DB.find(i => i.id === 's1'),
    acc: null
  });
  const [activeCategory, setActiveCategory] = useState('top');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const adjectives = ["Kasi", "Urban", "Midnight", "Neon", "Concrete", "Soweto", "Retro", "Future"];
  const nouns = ["Drip", "Flex", "Steez", "Vibe", "Flow", "Wave", "Edition", "Uniform"];
  const [outfitName, setOutfitName] = useState(() => `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`);

  const handleEquip = (item: any) => {
    if (item.isLocked && !inventory.includes(item.id)) {
      setShowUnlockModal(true);
      return;
    }
    setOutfit((prev: any) => ({ ...prev, [item.category]: item }));
  };

  const handleUnlock = () => {
    const itemToUnlock = CLOTHING_DB.find(item => item.code === unlockCode.toUpperCase());
    if (itemToUnlock) {
      if (inventory.includes(itemToUnlock.id)) {
        showToast('You already own this item!');
      } else {
        setInventory((prev: any) => [...prev, itemToUnlock.id]);
        setOutfit((prev: any) => ({ ...prev, [itemToUnlock.category]: itemToUnlock }));
        showToast(`Unlocked: ${itemToUnlock.name}! 🎉`, 'success');
      }
      setShowUnlockModal(false);
      setUnlockCode('');
    } else {
      showToast('Invalid code. Try again.', 'error');
    }
  };

  const handleSave = () => {
    const newOutfit = {
      id: Date.now().toString(),
      name: outfitName,
      outfit: outfit,
      likes: 0,
      date: new Date().toISOString()
    };
    setSavedOutfits([newOutfit, ...savedOutfits]);
    setShowSaveModal(false);
    showToast('Fit saved to your gallery!', 'success');
    if (isChallenge) {
      onNavigate('home');
      showToast('Challenge completed!', 'success');
    }
  };

  const filteredItems = CLOTHING_DB.filter(item => item.category === activeCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <header className="flex-none p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-black uppercase tracking-tight text-lg sm:text-xl leading-none truncate">{isChallenge ? 'Challenge Mode' : 'Drip Builder'}</h1>
            {isChallenge && <p className="text-orange-500 text-xs font-bold truncate">{context.challenge.title}</p>}
          </div>
        </div>
        <Button onClick={() => setShowSaveModal(true)} className="px-3 py-2 text-xs sm:text-sm rounded-lg whitespace-nowrap" variant="primary">
          <Save size={16} /> <span className="hidden sm:inline">Save Fit</span>
        </Button>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 h-[40vh] min-h-[250px] md:h-full relative bg-zinc-800 flex items-center justify-center p-2 md:p-4 overflow-hidden flex-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-700 blur-[100px] rounded-full opacity-30 pointer-events-none" />
          <div className="relative h-[95%] w-auto aspect-[1/2] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={outfit.avatar + outfit.skinTone} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0">
                <AvatarBase type={outfit.avatar} skinTone={outfit.skinTone} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {outfit.bottom && (
                <motion.div key={`bottom-${outfit.bottom.id}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <BottomGraphic item={outfit.bottom} />
                </motion.div>
              )}
              {outfit.top && (
                <motion.div key={`top-${outfit.top.id}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <TopGraphic item={outfit.top} />
                </motion.div>
              )}
              {outfit.shoes && (
                <motion.div key={`shoes-${outfit.shoes.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <ShoeGraphic item={outfit.shoes} />
                </motion.div>
              )}
              {outfit.acc && (
                <motion.div key={`acc-${outfit.acc.id}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <AccessoryGraphic item={outfit.acc} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute left-4 bottom-4 flex gap-2">
            {['#fcd5ce', '#e6c2a5', '#a67b5b', '#6b4c3a', '#3d2314'].map(tone => (
              <button key={tone} onClick={() => setOutfit((p: any) => ({ ...p, skinTone: tone }))} className={`w-8 h-8 rounded-full border-2 ${outfit.skinTone === tone ? 'border-white scale-110' : 'border-transparent opacity-50'} transition-all shadow-lg`} style={{ backgroundColor: tone }} />
            ))}
          </div>
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button onClick={() => setOutfit((p: any) => ({ ...p, avatar: 'neutral' }))} className={`p-2 rounded-lg bg-black/50 ${outfit.avatar === 'neutral' ? 'text-white' : 'text-zinc-500'}`}><User size={20} /></button>
            <button onClick={() => setOutfit((p: any) => ({ ...p, avatar: 'female' }))} className={`p-2 rounded-lg bg-black/50 ${outfit.avatar === 'female' ? 'text-white' : 'text-zinc-500'}`}><User size={20} /></button>
          </div>
        </div>
        <div className="flex-1 w-full md:w-1/2 bg-zinc-950 flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar p-3 sm:p-4 gap-2 border-b border-zinc-800 flex-none">
            {[
              { id: 'top', icon: Shirt, label: 'Tops' },
              { id: 'bottom', icon: ShoppingBag, label: 'Bottoms' },
              { id: 'shoes', icon: Sparkles, label: 'Kicks' },
              { id: 'acc', icon: User, label: 'Accs' }
            ].map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold uppercase tracking-wide whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
                <cat.icon size={18} /> {cat.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {filteredItems.map(item => {
              const isUnlocked = inventory.includes(item.id) || !item.isLocked;
              const isActive = outfit[item.category]?.id === item.id;
              return (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.id} onClick={() => handleEquip(item)} className={`relative p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2 sm:gap-3 transition-all border-2 text-left ${isActive ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'} ${!isUnlocked ? 'opacity-70 grayscale' : ''}`}>
                  <div className="w-full aspect-square rounded-xl bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-[200px] h-[400px] transform scale-[0.25] sm:scale-[0.35] origin-center pointer-events-none">
                      {item.category === 'top' && <TopGraphic item={item} />}
                      {item.category === 'bottom' && <BottomGraphic item={{ ...item, style: item.style === 'shorts' ? 'shorts' : 'pants' }} />}
                      {item.category === 'shoes' && <ShoeGraphic item={{ ...item, style: item.style === 'boot' ? 'boot' : 'sneaker' }} />}
                      {item.category === 'acc' && <AccessoryGraphic item={item} />}
                    </div>
                  </div>
                  <div className="w-full"><p className="font-bold text-sm truncate uppercase tracking-tight">{item.name}</p></div>
                  {!isUnlocked && <div className="absolute top-3 right-3 bg-zinc-950 p-1.5 rounded-full border border-zinc-800"><Lock size={14} className="text-zinc-400" /></div>}
                  {isActive && <div className="absolute top-3 right-3 bg-orange-500 p-1.5 rounded-full text-black"><Check size={14} /></div>}
                </motion.button>
              );
            })}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setOutfit((prev: any) => ({ ...prev, [activeCategory]: null }))} className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border-2 border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-zinc-500 ${!outfit[activeCategory] ? 'border-orange-500 text-orange-500' : ''}`}><X size={32} /> <p className="font-bold text-sm uppercase">Remove</p></motion.button>
          </div>
          <div className="flex-none p-4 bg-zinc-900 border-t border-zinc-800"><Button onClick={() => setShowUnlockModal(true)} variant="outline" className="w-full rounded-xl py-3 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"><Unlock size={18} /> Enter Merch Code</Button></div>
        </div>
      </div>
      <Modal isOpen={showUnlockModal} onClose={() => setShowUnlockModal(false)} title="Unlock Exclusive Merch">
        <p className="text-zinc-400 mb-6">Bought something from Obvious Studios? Enter the code on the tag to unlock it in-game.</p>
        <input type="text" value={unlockCode} onChange={(e) => setUnlockCode(e.target.value)} placeholder="ENTER CODE" className="w-full bg-zinc-950 border-2 border-zinc-700 rounded-xl px-4 py-4 text-white text-center text-xl font-black uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors mb-4" />
        <Button onClick={handleUnlock} className="w-full rounded-xl py-4">Unlock Item</Button>
      </Modal>
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Save Your Fit">
        <p className="text-zinc-400 mb-2">Give this drip a name.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={outfitName} onChange={(e) => setOutfitName(e.target.value)} className="flex-1 bg-zinc-950 border-2 border-zinc-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-orange-500 transition-colors" />
          <button onClick={() => setOutfitName(`${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`)} className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"><Sparkles size={20} className="text-orange-500" /></button>
        </div>
        <Button onClick={handleSave} className="w-full rounded-xl py-4">Save to Gallery</Button>
      </Modal>
    </motion.div>
  );
};

const ChallengesScreen = ({ onNavigate }: any) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Challenges</h1>
      </header>
      <div className="max-w-2xl mx-auto space-y-4">
        {CHALLENGES.map(challenge => (
          <motion.div key={challenge.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onNavigate('builder', { mode: 'challenge', challenge })} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10"><h2 className="text-2xl font-black uppercase tracking-tight text-white">{challenge.title}</h2> <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-orange-500"><Trophy size={20} /></div></div>
            <p className="text-zinc-400 mb-6 relative z-10">{challenge.desc}</p>
            <div className="flex items-center gap-2 text-sm font-bold text-orange-400 bg-orange-500/10 w-max px-3 py-1.5 rounded-full relative z-10"><Unlock size={14} /> {challenge.reward}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const GalleryScreen = ({ onNavigate, savedOutfits, showToast }: any) => {
  const mockFeed = useMemo(() => [
    { id: 'm1', name: 'Midnight Flex', user: '@tebogo_steez', likes: 245, date: new Date().toISOString() },
    { id: 'm2', name: 'Summer Wave', user: '@kasi_queen', likes: 189, date: new Date().toISOString() },
  ], []);
  const allOutfits = [...savedOutfits.map((o: any) => ({ ...o, isUser: true, user: 'You' })), ...mockFeed];
  const handleShare = () => { showToast("Link copied to clipboard! Share your drip."); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-zinc-950 text-white p-6 pb-20">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Community Feed</h1>
      </header>
      {allOutfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center"><ImageIcon size={48} className="text-zinc-700 mb-4" /> <h2 className="text-xl font-bold mb-2">No Fits Yet</h2> <p className="text-zinc-500 mb-6">Create your first outfit and save it to the gallery.</p> <Button onClick={() => onNavigate('builder', { mode: 'freestyle' })}>Start Building</Button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {allOutfits.map((post: any) => (
            <motion.div key={post.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col">
              <div className="bg-zinc-800 h-80 relative flex items-center justify-center overflow-hidden">
                {post.isUser ? (
                  <div className="absolute inset-0 flex items-center justify-center scale-90 pointer-events-none"><AvatarBase type={post.outfit.avatar} skinTone={post.outfit.skinTone} /> {post.outfit.bottom && <BottomGraphic item={post.outfit.bottom} />} {post.outfit.top && <TopGraphic item={post.outfit.top} />} {post.outfit.shoes && <ShoeGraphic item={post.outfit.shoes} />} {post.outfit.acc && <AccessoryGraphic item={post.outfit.acc} />}</div>
                ) : (
                  <div className="text-zinc-600 flex flex-col items-center font-black uppercase tracking-widest opacity-50"><ImageIcon size={48} className="mb-2" /> Mock Render</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4"><div><h3 className="font-black text-lg uppercase tracking-tight">{post.name}</h3> <p className="text-zinc-400 text-sm">{post.user}</p></div><div className="flex gap-2"><button className="p-2 bg-zinc-950 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors"><Heart size={18} /></button> <button onClick={handleShare} className="p-2 bg-zinc-950 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><Share2 size={18} /></button></div></div>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-500"><Heart size={14} className="fill-current text-red-500/50" /> {post.likes} Likes</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// 6. MAIN APP COMPONENT
// ==========================================

export default function DripBuilder() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenContext, setScreenContext] = useState<any>(null);
  const [inventory, setInventory] = useLocalStorage('obvious_inventory', INITIAL_INVENTORY);
  const [savedOutfits, setSavedOutfits] = useLocalStorage('obvious_saved_fits', []);
  const [toast, setToast] = useState<{ message: string, type: string } | null>(null);

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
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className={`fixed bottom-6 left-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'success' ? 'bg-orange-500 text-black' : 'bg-white text-black'}`}>
            {toast.type === 'success' && <Check size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
