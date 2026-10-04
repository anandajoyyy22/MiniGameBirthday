import React from 'react';
import { motion } from 'framer-motion';
import { SecretScroll } from '../../types/birthday';
import { AppleEmoji } from '../AppleEmoji';

interface ClawMachineCompletionProps {
  scrolls: SecretScroll[];
  onContinue: () => void;
}

export const ClawMachineCompletion: React.FC<ClawMachineCompletionProps> = ({ scrolls, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-[#180308]/75 backdrop-blur-md flex items-center justify-center p-3.5 overflow-y-auto"
    >
      <div className="w-full max-w-[340px] sm:max-w-sm bg-white/95 backdrop-blur-xl border border-rose-900/15 rounded-3xl p-4 sm:p-5 text-center shadow-2xl relative my-auto">
        
        {/* Animated Scroll Badge */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-900/20 p-1 mx-auto mb-2.5 shadow-sm animate-bounce-soft">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
            <AppleEmoji emoji="📜" size={26} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-[10px] uppercase tracking-wider mb-2 border border-rose-900/15">
          <span>MISSION 01 CLEARED!</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif font-bold text-lg sm:text-xl text-[#5C0B1C] tracking-tight mb-1">
          CLUES COLLECTED
        </h2>

        {/* Supporting text */}
        <p className="text-slate-600 text-[11px] sm:text-xs font-medium max-w-[270px] mx-auto mb-3.5 leading-snug">
          Nice one, Mba Alin! Tiga clue sudah terkumpul. Saatnya mencari tempat yang tepat!
        </p>

        {/* The 3 Scrolls Clues Display */}
        <div className="space-y-2 text-left mb-4">
          {scrolls.map((scroll) => (
            <div
              key={scroll.id}
              className="bg-rose-50/60 border border-rose-900/10 rounded-xl p-2.5 shadow-2xs"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <AppleEmoji emoji={scroll.icon || "📜"} size={14} />
                <span className="text-[11px] font-bold text-[#8B102B] uppercase tracking-wide">
                  {scroll.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 italic font-medium pl-5 leading-tight">
                "{scroll.hintText}"
              </p>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <span>MULAI MENCARI</span>
        </button>
      </div>
    </motion.div>
  );
};
