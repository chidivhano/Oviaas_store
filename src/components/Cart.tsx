import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const cartItems = [
  {
    id: 1,
    name: 'Neon Genesis Jacket',
    price: 450,
    quantity: 1,
    size: 'L',
    image: 'https://picsum.photos/seed/cyberpunk_jacket/200/200',
  },
  {
    id: 2,
    name: 'Void Walkers',
    price: 280,
    quantity: 1,
    size: '10',
    image: 'https://picsum.photos/seed/cyberpunk_shoes/200/200',
  },
];

export default function Cart({ isOpen, onClose }: CartProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-surface border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-anton text-3xl uppercase tracking-tighter flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#b026ff]" />
                Cart
                <span className="text-sm font-sans text-gray-500 ml-2">({cartItems.length})</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-4 group"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black border border-white/10 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-sm uppercase tracking-widest text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">Size: {item.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-display font-bold neon-text-blue text-sm">
                        R {item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 text-sm font-display uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-6 text-sm font-display uppercase tracking-widest text-gray-400">
                <span>Shipping</span>
                <span className="text-white font-bold">Calculated at checkout</span>
              </div>
              
              <div className="flex items-center justify-between mb-8 text-xl font-anton uppercase tracking-tighter">
                <span>Total</span>
                <span className="neon-text-purple">R {subtotal.toFixed(2)}</span>
              </div>

              <button className="w-full py-4 bg-white text-black rounded-full font-display uppercase tracking-widest text-sm font-bold hover:bg-[#00f0ff] hover:text-black transition-colors duration-300 flex items-center justify-center gap-2 group">
                Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
