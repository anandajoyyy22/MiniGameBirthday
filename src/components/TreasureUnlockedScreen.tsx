import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AppleEmoji } from './AppleEmoji';
import { soundManager } from '../utils/soundManager';
import { triggerConfettiExplosion } from './ConfettiEffect';

interface TreasureUnlockedScreenProps {
  onOpenSurprise: () => void;
}

export const TreasureUnlockedScreen: React.FC<TreasureUnlockedScreenProps> = ({ onOpenSurprise }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-md mx-auto text-center py-6 px-2"
    >
      {/* Magical Crown Container */}
      <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-amber-200/40 animate-ping opacity-30" />
        <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-3xl border border-amber-300/80 flex items-center justify-center shadow-lg shadow-amber-200/30 animate-bounce-soft">
          <AppleEmoji emoji="👑" size={56} />
        </div>
      </div>

      <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] tracking-tight mb-2">
        TREASURE UNLOCKED! 
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto mb-8">
        Asikkk misi selesai! Ada sesuatu yang spesial banget untuk Mba Alin nichh uhuy... <span className="text-[#8B102B]">♥</span>
      </p>

      <button
        onClick={() => {
          soundManager.playUnlock();
          triggerConfettiExplosion();
          onOpenSurprise();
        }}
        className="w-full py-4 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>SEE WHAT'S INSIDE 🎁</span>
      </button>
    </motion.div>
  );
};
