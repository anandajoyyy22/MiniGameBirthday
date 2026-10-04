import React from 'react';
import { motion } from 'framer-motion';
import { AppleEmoji } from './AppleEmoji';
import { soundManager } from '../utils/soundManager';
import { birthdayConfig } from '../config/birthdayConfig';

interface CluesRevealScreenProps {
  onContinue: () => void;
}

export const CluesRevealScreen: React.FC<CluesRevealScreenProps> = ({ onContinue }) => {
  const scrolls = birthdayConfig.clawMachine.scrolls;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto text-center py-4 px-2"
    >
      {/* Header Pill */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-3 border border-rose-900/15 shadow-2xs">
        <span>MISSION 02</span>
      </div>

      <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] tracking-tight mb-2">
        DECODE THE CLUES
      </h2>

      <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto mb-6">
        Tiga secret clues sudah di tangan. Saatnya menghubungkan hint ini untuk menyelesaikan misi berikutnya!
      </p>

      {/* 3 Clues Cards List */}
      <div className="space-y-3 mb-8 text-left">
        <div className="bg-white/95 backdrop-blur-md border border-rose-900/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs hover:scale-[1.01] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
            <AppleEmoji emoji={scrolls[0]?.icon || "🌸"} size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8B102B] uppercase tracking-wide">
              {scrolls[0]?.title || "Hint 1"}
            </span>
            <p className="text-xs font-medium text-slate-700 italic mt-0.5">
              "{scrolls[0]?.hintText}"
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-amber-300/60 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs hover:scale-[1.01] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
            <AppleEmoji emoji={scrolls[1]?.icon || "⭐"} size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              {scrolls[1]?.title || "Hint 2"}
            </span>
            <p className="text-xs font-medium text-slate-700 italic mt-0.5">
              "{scrolls[1]?.hintText}"
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-rose-900/15 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs hover:scale-[1.01] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
            <AppleEmoji emoji={scrolls[2]?.icon || "🔑"} size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#8B102B] uppercase tracking-wide">
              {scrolls[2]?.title || "Hint 3"}
            </span>
            <p className="text-xs font-medium text-slate-700 italic mt-0.5">
              "{scrolls[2]?.hintText}"
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => {
          soundManager.playPop();
          onContinue();
        }}
        className="w-full py-4 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>MULAI MENCARI</span>
      </button>
    </motion.div>
  );
};
