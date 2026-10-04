import React from 'react';
import { SecretScroll } from '../../types/birthday';
import { AppleEmoji } from '../AppleEmoji';
import { Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface ScrollInventoryProps {
  scrolls: SecretScroll[];
  collectedScrolls: string[];
}

export const ScrollInventory: React.FC<ScrollInventoryProps> = ({ scrolls, collectedScrolls }) => {
  const count = collectedScrolls.length;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-rose-900/15 rounded-2xl p-3 sm:p-4 shadow-sm mb-4">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs font-serif font-bold text-[#5C0B1C] uppercase tracking-wider">SECRET SCROLLS</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B102B] text-white font-bold text-xs shadow-2xs">
          <AppleEmoji emoji="📜" size={13} />
          <span>{count} / 3 COLLECTED</span>
        </div>
      </div>

      {/* 3 Slots Grid */}
      <div className="grid grid-cols-3 gap-2">
        {scrolls.map((scroll, index) => {
          const isCollected = collectedScrolls.includes(scroll.id);
          return (
            <div
              key={scroll.id}
              className={`p-2.5 rounded-xl border transition-all flex flex-col items-center text-center relative overflow-hidden ${
                isCollected
                  ? 'bg-gradient-to-b from-rose-50 to-amber-50/50 border-amber-300 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200 opacity-60'
              }`}
            >
              {isCollected && (
                <div className="absolute top-1 right-1 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="w-9 h-9 rounded-full bg-white border border-rose-900/15 flex items-center justify-center mb-1 shadow-2xs">
                {isCollected ? (
                  <AppleEmoji emoji="📜" size={20} />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <span className={`text-[10px] font-bold leading-tight ${isCollected ? 'text-[#5C0B1C]' : 'text-slate-400'}`}>
                Slot {index + 1}
              </span>
              <span className={`text-[9px] font-semibold ${isCollected ? 'text-[#8B102B]' : 'text-slate-400'}`}>
                {isCollected ? 'Unlocked!' : 'Locked'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
