import { motion } from 'framer-motion';
import { ShoppingCart, Menu, User, Search, Hexagon } from 'lucide-react';

interface NavigationProps {
  onCartClick: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navigation({ onCartClick, activeSection, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'showroom', label: 'Showroom' },
    { id: 'collections', label: 'Drops' },
    { id: 'entertainment', label: 'Hub' },
    { id: 'community', label: 'Culture' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none"
    >
      {/* Logo */}
      <div className="pointer-events-auto cursor-pointer flex items-center gap-3">
        <img 
          src={`${import.meta.env.BASE_URL}assets/Oviaas_Logo.jpeg`} 
          alt="Oviaas Logo" 
          className="w-10 h-10 rounded-full object-cover border border-[#b026ff] neon-box-purple"
          referrerPolicy="no-referrer"
        />
        <span className="font-anton text-3xl uppercase tracking-tighter neon-text-purple">Oviaas</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8 glass-panel px-8 py-3 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`font-display text-xs uppercase tracking-widest transition-colors duration-300 ${
              activeSection === item.id ? 'text-[#00f0ff] neon-text-blue' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Icons & Gamification */}
      <div className="pointer-events-auto flex items-center gap-4">
        {/* User Level / Points */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700]">
          <Hexagon className="w-4 h-4" />
          <span className="font-mono text-xs font-bold">LVL 4</span>
          <div className="w-12 h-1 bg-black/50 rounded-full overflow-hidden ml-1">
            <div className="h-full bg-[#ffd700] w-3/4" />
          </div>
        </div>

        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
          <Search className="w-5 h-5 text-gray-300" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
          <User className="w-5 h-5 text-gray-300" />
        </button>
        <button onClick={onCartClick} className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
          <ShoppingCart className="w-5 h-5 text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#b026ff] rounded-full neon-box-purple" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
          <Menu className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </motion.nav>
  );
}
