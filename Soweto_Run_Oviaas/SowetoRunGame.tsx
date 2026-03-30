import React, { useEffect, useRef, useState } from 'react';
import { openSowetoRun, closeSowetoRun } from './js/main'; // Adjust path if needed

/**
 * SowetoRunGame - A React wrapper for the Soweto Run Phaser game.
 * Optimized for React 19, Vite 6, and Tailwind CSS 4.
 */
export const SowetoRunGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartGame = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      // Small timeout to ensure the div is painted if it was previously hidden
      const timeout = setTimeout(() => {
        openSowetoRun();
      }, 50);

      return () => {
        clearTimeout(timeout);
        closeSowetoRun();
      };
    }
  }, [isPlaying]);

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden font-impact">
      {/* Game Container */}
      <div 
        ref={gameRef} 
        id="game-container" 
        className={`w-full h-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Main Menu / Starting UI Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-neutral-800 to-neutral-950 z-50">
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
            <h1 className="text-7xl md:text-9xl text-white font-bold tracking-tighter drop-shadow-2xl">
              SOWETO <span className="text-pink-600">RUN</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-lg font-sans uppercase tracking-[0.2em]">
              Obvious Studios © 2026 Preventative Maintenance
            </p>
            
            <div className="pt-10">
              <button 
                onClick={handleStartGame}
                className="group relative px-12 py-6 bg-pink-600 border-4 border-white text-white text-3xl cursor-pointer hover:bg-white hover:text-black transition-all duration-200 active:translate-x-1 active:translate-y-1"
                style={{ boxShadow: '12px 12px 0px rgba(0,0,0,1)' }}
              >
                HUSTLE NOW
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 animate-ping rounded-full" />
              </button>
            </div>
          </div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-8 left-8 border-t-4 border-l-4 border-white w-20 h-20 opacity-20" />
          <div className="absolute bottom-8 right-8 border-b-4 border-r-4 border-pink-600 w-20 h-20 opacity-20" />
        </div>
      )}

      {/* Optional: Close Button for the host platform */}
      {isPlaying && (
        <button 
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 left-4 z-[101] px-4 py-2 bg-black/50 text-white text-xs border border-white/20 hover:bg-neutral-800 transition-colors"
        >
          ESC / QUIT
        </button>
      )}
    </div>
  );
};

export default SowetoRunGame;
