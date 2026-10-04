import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

interface ClawControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDropClaw: () => void;
  onHowToPlay?: () => void;
  onReset?: () => void;
  disabled: boolean;
}

export const ClawControls: React.FC<ClawControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onDropClaw,
  onHowToPlay,
  onReset,
  disabled,
}) => {
  return (
    <div className="w-full bg-gradient-to-b from-[#FFFDFD]/95 via-[#FAF3F5]/95 to-[#F5E6EA]/95 backdrop-blur-md border-t border-rose-900/15 p-3 sm:p-4 rounded-b-[32px] flex flex-col items-center gap-2 select-none shadow-inner">
      {/* 3D Spherical Joystick Control Panel (Maroon & Gold Theme) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xs py-1">
        
        {/* LEFT BUTTON */}
        <button
          onClick={() => {
            soundManager.playPop();
            onMoveLeft();
          }}
          disabled={disabled}
          className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full border-3 border-white flex items-center justify-center transition-all active:scale-90 active:translate-y-1 ${
            disabled
              ? 'bg-rose-100 text-rose-300 cursor-not-allowed opacity-60 shadow-none'
              : 'bg-gradient-to-b from-[#B81436] via-[#8B102B] to-[#5C0B1C] text-white shadow-[0_5px_0_#3d040f,0_8px_16px_rgba(114,13,35,0.3)] hover:brightness-105'
          }`}
          title="Move Left (←)"
        >
          <div className="absolute top-1 inset-x-3 h-3.5 rounded-full bg-white/40 blur-[1px] pointer-events-none" />
          <ArrowLeft className="w-6 h-6 stroke-[3.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10" />
        </button>

        {/* GRAB BUTTON (Solid Velvet Maroon Sphere with Gold Rim) */}
        <button
          onClick={() => {
            soundManager.playPop();
            onDropClaw();
          }}
          disabled={disabled}
          className={`relative w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 border-amber-300/80 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 active:translate-y-1 ${
            disabled
              ? 'bg-rose-200/50 text-rose-100 cursor-not-allowed opacity-60 shadow-none'
              : 'bg-gradient-to-b from-[#B81436] via-[#8B102B] to-[#5C0B1C] text-white shadow-[0_7px_0_#2b040d,0_12px_25px_rgba(92,11,28,0.4)] hover:brightness-105'
          }`}
          title="Grab Claw (Space / ↓)"
        >
          {/* Top Radial Glare Highlight */}
          <div className="absolute top-1.5 inset-x-4 h-4 rounded-full bg-white/30 blur-[1px] pointer-events-none" />
          
          {/* Claw Hook Icon SVG */}
          <svg className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] fill-none stroke-current stroke-[3] relative z-10" viewBox="0 0 24 24">
            <path d="M12 2v6m0 0a4 4 0 0 0-4 4v3M12 8a4 4 0 0 1 4 4v3m-8 0a2 2 0 1 0 0 4m8-4a2 2 0 1 1 0 4" />
          </svg>
          <span className="text-[11px] font-black tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] relative z-10">GRAB</span>
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => {
            soundManager.playPop();
            onMoveRight();
          }}
          disabled={disabled}
          className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full border-3 border-white flex items-center justify-center transition-all active:scale-90 active:translate-y-1 ${
            disabled
              ? 'bg-rose-100 text-rose-300 cursor-not-allowed opacity-60 shadow-none'
              : 'bg-gradient-to-b from-[#B81436] via-[#8B102B] to-[#5C0B1C] text-white shadow-[0_5px_0_#3d040f,0_8px_16px_rgba(114,13,35,0.3)] hover:brightness-105'
          }`}
          title="Move Right (→)"
        >
          <div className="absolute top-1 inset-x-3 h-3.5 rounded-full bg-white/40 blur-[1px] pointer-events-none" />
          <ArrowRight className="w-6 h-6 stroke-[3.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10" />
        </button>
      </div>

      {/* Footer How to Play / Reset Pill Buttons */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <div className="flex items-center gap-2">
          {onHowToPlay && (
            <button
              onClick={() => {
                soundManager.playPop();
                onHowToPlay();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-rose-900/15 text-[#720D23] font-bold text-[11px] hover:bg-rose-50 shadow-2xs transition-all hover:scale-105 active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#8B102B]" />
              <span>Need Hints?</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={() => {
                soundManager.playPop();
                onReset();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-500 font-semibold text-[11px] hover:bg-white shadow-2xs transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
