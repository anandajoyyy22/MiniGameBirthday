import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AppleEmoji } from '../AppleEmoji';
import { soundManager } from '../../utils/soundManager';

interface ScrollFoundModalProps {
  scrollNumber: number; // 1, 2, or 3
  onClose: () => void;
}

export const ScrollFoundModal: React.FC<ScrollFoundModalProps> = ({ scrollNumber, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#180308]/70 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        className="w-full max-w-sm bg-white border border-rose-900/15 rounded-[32px] p-6 text-center shadow-2xl relative"
      >
        {/* Starburst Halo Orb with 3D Scroll */}
        <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-200/40 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-50 to-rose-50 border border-amber-300 flex items-center justify-center shadow-sm">
            <AppleEmoji emoji="📜" size={46} />
          </div>
          <div className="absolute -top-1 -right-1 text-[#D4AF37] animate-bounce-soft">
            <Sparkles className="w-5 h-5 fill-[#D4AF37]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-2xl text-[#5C0B1C] tracking-tight mb-1">
          YOU GOT ONE! ✦
        </h3>

        {/* Subtitle */}
        <p className="text-slate-600 text-xs font-medium mb-1">
          Nice catch! Satu secret clue berhasil didapatkan.
        </p>
        <p className="text-[#8B102B] text-xs font-bold mb-6">
          {scrollNumber === 1 && "2 more to go..."}
          {scrollNumber === 2 && "1 more to go..."}
          {scrollNumber === 3 && "All 3 clues collected! Great job!"}
        </p>

        {/* OK Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onClose();
          }}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          LANJUT HUNT
        </button>

        {/* Footer HUD */}
        <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#8B102B]">
          <AppleEmoji emoji="📜" size={14} />
          <span>{scrollNumber} / 3 SECRET CLUES TERKUMPUL</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
