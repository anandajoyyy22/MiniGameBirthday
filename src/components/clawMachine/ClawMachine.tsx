import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import { SecretScroll } from '../../types/birthday';
import { soundManager } from '../../utils/soundManager';
import { triggerConfetti, triggerConfettiExplosion } from '../ConfettiEffect';
import { AppleEmoji } from '../AppleEmoji';
import { ClawControls } from './ClawControls';
import { ClawMachineCompletion } from './ClawMachineCompletion';
import { ScrollFoundModal } from './ScrollFoundModal';
import { Sparkles, HelpCircle, Play, RotateCcw, X } from 'lucide-react';

interface ClawMachineProps {
  onComplete: (collectedScrolls: SecretScroll[]) => void;
  onSkip?: () => void;
}

interface PrizeItemData {
  id: string;
  name: string;
  emoji: string;
  xPercent: number; // 12% to 88%
  bottomPx?: number; // 4px to 28px vertical depth offset
  rotation?: number; // -12deg to 12deg organic rotation
  layer?: 'back' | 'front';
  isScroll?: boolean;
  scrollId?: string;
}

export const ClawMachine: React.FC<ClawMachineProps> = ({ onComplete, onSkip }) => {
  const scrolls = birthdayConfig.clawMachine.scrolls;

  // Game View State ('start' | 'playing' | 'how_to_play')
  const [gameState, setGameState] = useState<'start' | 'playing' | 'how_to_play'>('start');

  // Inventory & Progress State
  const [collectedScrolls, setCollectedScrolls] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [foundScrollModalNumber, setFoundScrollModalNumber] = useState<number | null>(null);

  // Claw Position & Physics Movement
  const [clawX, setClawX] = useState<number>(50); // 16% to 84%
  const [clawY, setClawY] = useState<number>(14); // 14% top -> 68% floor
  const [clawState, setClawState] = useState<
    'idle' | 'moving_down' | 'grabbing' | 'moving_up' | 'moving_to_chute' | 'releasing' | 'returning'
  >('idle');

  // Interactive Prize Items State
  const [grabbedItem, setGrabbedItem] = useState<PrizeItemData | null>(null);
  const [fallingItem, setFallingItem] = useState<PrizeItemData | null>(null);
  const [droppedItemInTray, setDroppedItemInTray] = useState<PrizeItemData | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; emoji: string; isScroll?: boolean } | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  // DENSE 14-ITEM PLUSHIE PILE ON FLOOR (ORGANIC 2-LAYER DEPTH STACKING)
  const initialPrizes: PrizeItemData[] = [
    // BACK LAYER (Slightly smaller, sits higher at bottomPx 22-28px)
    { id: 'toy_bear_back_1', name: 'Plush Bear', emoji: '🧸', xPercent: 16, bottomPx: 24, rotation: -8, layer: 'back' },
    { id: 'toy_bunny_back_1', name: 'Cute Bunny', emoji: '🐰', xPercent: 28, bottomPx: 26, rotation: 10, layer: 'back' },
    { id: 'scroll_1', name: 'Scroll 1', emoji: '📜', xPercent: 38, bottomPx: 22, rotation: -4, layer: 'back', isScroll: true, scrollId: 'scroll_1' },
    { id: 'toy_kitty_back', name: 'White Kitty', emoji: '🐱', xPercent: 48, bottomPx: 28, rotation: 6, layer: 'back' },
    { id: 'toy_gift_back', name: 'Gift Box', emoji: '🎁', xPercent: 58, bottomPx: 22, rotation: -6, layer: 'back' },
    { id: 'scroll_2', name: 'Scroll 2', emoji: '📜', xPercent: 68, bottomPx: 24, rotation: 8, layer: 'back', isScroll: true, scrollId: 'scroll_2' },
    { id: 'toy_star_back', name: 'Plush Star', emoji: '⭐', xPercent: 78, bottomPx: 26, rotation: -10, layer: 'back' },
    { id: 'toy_heart_back', name: 'Heart Pillow', emoji: '💗', xPercent: 86, bottomPx: 20, rotation: 12, layer: 'back' },

    // FRONT LAYER (Larger, sits lower at bottomPx 4-12px, overlapping back layer)
    { id: 'toy_bouquet_front', name: 'Bouquet', emoji: '💐', xPercent: 22, bottomPx: 6, rotation: -12, layer: 'front' },
    { id: 'toy_bear_front', name: 'Big Teddy Bear', emoji: '🧸', xPercent: 34, bottomPx: 8, rotation: 4, layer: 'front' },
    { id: 'toy_bunny_front', name: 'Pink Bunny', emoji: '🐰', xPercent: 52, bottomPx: 10, rotation: -8, layer: 'front' },
    { id: 'scroll_3', name: 'Scroll 3', emoji: '📜', xPercent: 62, bottomPx: 4, rotation: -6, layer: 'front', isScroll: true, scrollId: 'scroll_3' },
    { id: 'toy_gift_front', name: 'Surprise Gift', emoji: '🎁', xPercent: 74, bottomPx: 6, rotation: 5, layer: 'front' },
    { id: 'toy_ribbon_front', name: 'Ribbon Star', emoji: '🎀', xPercent: 84, bottomPx: 4, rotation: -5, layer: 'front' },
  ];

  const [prizes, setPrizes] = useState<PrizeItemData[]>(initialPrizes);

  // Keyboard controls listener (Active during 'playing' state)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || clawState !== 'idle' || showCompletion) return;

      if (e.key === 'ArrowLeft') {
        handleMoveLeft();
      } else if (e.key === 'ArrowRight') {
        handleMoveRight();
      } else if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        handleDropClaw();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, clawState, clawX, showCompletion]);

  // Movement Handlers
  const handleMoveLeft = () => {
    if (clawState !== 'idle') return;
    setClawX((prev) => Math.max(16, prev - 7));
  };

  const handleMoveRight = () => {
    if (clawState !== 'idle') return;
    setClawX((prev) => Math.min(84, prev + 7));
  };

  // Drop Claw Sequence with Framer Motion Physics
  const handleDropClaw = () => {
    if (clawState !== 'idle') return;

    soundManager.playPop();
    setAttempts((prev) => prev + 1);

    // 1. Lower claw down to floor (y: 68%)
    setClawState('moving_down');
    setClawY(68);

    // 2. Clamp claw prongs closed (at 800ms)
    setTimeout(() => {
      setClawState('grabbing');

      // Check uncollected scrolls
      const uncollectedScrollIds = scrolls
        .map((s) => s.id)
        .filter((id) => !collectedScrolls.includes(id));

      let targetItem: PrizeItemData | null = null;

      // Smart Assist: check nearby scroll or doll
      const scrollCandidate = prizes.find(
        (p) => p.isScroll && uncollectedScrollIds.includes(p.scrollId!) && Math.abs(p.xPercent - clawX) <= 18
      );

      if (scrollCandidate) {
        targetItem = scrollCandidate;
      } else {
        const nearbyItem = prizes.find((p) => Math.abs(p.xPercent - clawX) <= 15);
        if (nearbyItem) {
          targetItem = nearbyItem;
        } else if (uncollectedScrollIds.length > 0 && attempts >= 2) {
          const nearestScroll = prizes.find((p) => p.isScroll && uncollectedScrollIds.includes(p.scrollId!));
          if (nearestScroll) targetItem = nearestScroll;
        }
      }

      if (targetItem) {
        setGrabbedItem(targetItem);
        setPrizes((prev) => prev.filter((p) => p.id !== targetItem!.id));
      }

      // 3. Lift claw back up with doll held inside prongs (at 1250ms)
      setTimeout(() => {
        setClawState('moving_up');
        setClawY(14);

        // 4. Move claw horizontally to prize chute at x = 16% (at 2050ms)
        setTimeout(() => {
          setClawState('moving_to_chute');
          setClawX(16);

          // 5. Open claw prongs & drop doll into tray (at 2750ms)
          setTimeout(() => {
            setClawState('releasing');
            const itemToDrop = targetItem;
            setGrabbedItem(null);

            if (itemToDrop) {
              setFallingItem(itemToDrop);

              // 6. Item lands inside tray (at 3200ms)
              setTimeout(() => {
                setFallingItem(null);
                setDroppedItemInTray(itemToDrop);
                soundManager.playSparkle();

                if (itemToDrop.isScroll && itemToDrop.scrollId) {
                  const updatedScrolls = [...collectedScrolls, itemToDrop.scrollId];
                  setCollectedScrolls(updatedScrolls);
                  triggerConfetti(0.6);

                  setFoundScrollModalNumber(updatedScrolls.length);

                  if (updatedScrolls.length === 3) {
                    setTimeout(() => {
                      triggerConfettiExplosion();
                      setShowCompletion(true);
                    }, 1200);
                  }
                } else {
                  setToastMessage({
                    text: `Nice try! Boneka ini lucu, tapi yuk cari secret clue-nya!`,
                    emoji: itemToDrop.emoji,
                  });
                }
              }, 450);
            } else {
              setToastMessage({
                text: "Belum dapat nih... Coba lagi, Mba Alin!",
                emoji: '👀',
              });
            }

            setTimeout(() => setToastMessage(null), 3000);

            // 7. Return claw to center (at 3450ms)
            setTimeout(() => {
              setClawState('returning');
              setClawX(50);
              setTimeout(() => {
                setClawState('idle');
              }, 600);
            }, 600);
          }, 700);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleResetGame = () => {
    setCollectedScrolls([]);
    setShowCompletion(false);
    setFoundScrollModalNumber(null);
    setClawX(50);
    setClawY(14);
    setClawState('idle');
    setGrabbedItem(null);
    setFallingItem(null);
    setDroppedItemInTray(null);
    setToastMessage(null);
    setAttempts(0);
    setPrizes(initialPrizes);
  };

  const isProngsClosed = clawState === 'grabbing' || clawState === 'moving_up' || clawState === 'moving_to_chute';

  return (
    <div className="relative w-full max-w-[370px] sm:max-w-md mx-auto flex flex-col items-center px-1">

      {/* HEADER TITLE (CLEAN MODERN MOBILE APP STYLE) */}
      <div className="text-center mb-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#8B102B] text-[10px] font-bold uppercase tracking-wider mb-1 border border-rose-900/15">
          <span>MISSION 01</span>
          <AppleEmoji emoji="🎀" size={13} />
        </span>
        <h2 className="font-serif font-bold text-[#5C0B1C] text-xl sm:text-2xl tracking-tight leading-snug drop-shadow-2xs">
          GRAB THE CLUES
        </h2>
        <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto mt-0.5 leading-relaxed">
          Kumpulkan 3 secret clues<br />
        </p>
      </div>

      {/* VIEW MODE 1: START SCREEN */}
      {gameState === 'start' && (
        <motion.div
          key="start_screen"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full flex flex-col items-center"
        >
          {/* ARCHED ARCADE MACHINE CABINET (VELVET MAROON & GOLD TRIM) */}
          <div className="relative w-full h-[470px] sm:h-[500px] rounded-[36px] bg-gradient-to-b from-[#720D23] via-[#8B102B] to-[#400613] p-3 border-4 border-amber-200/90 shadow-[0_20px_50px_rgba(80,10,25,0.4)] flex flex-col justify-between overflow-hidden">

            {/* Glossy Arch Top Marquee Banner with Gold Accents */}
            <div className="relative w-full h-12 rounded-t-[28px] bg-white/90 backdrop-blur-md border border-amber-300/60 flex flex-col items-center justify-center shadow-sm">
              <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] border border-white shadow-2xs flex items-center justify-center -mb-0.5 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-[#720D23]" />
              </div>
              <span className="font-serif italic font-bold text-[#720D23] text-base sm:text-lg tracking-wider drop-shadow-xs">
                SIAP? LET'S GRAB!
              </span>

              {/* Internal Glowing Arcade Lights Rim */}
              <div className="absolute top-2 inset-x-4 flex justify-between pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-rose-200 shadow-[0_0_8px_#FBE4E8] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-ping" />
              </div>
            </div>

            {/* Glass Showcase Window */}
            <div className="relative flex-1 my-2 rounded-2xl bg-gradient-to-b from-[#FFFDFD]/95 via-[#FAF3F5]/90 to-[#F5E6EA]/90 border-2 border-white/90 shadow-inner overflow-hidden flex flex-col justify-between p-3">

              {/* Suspended Shiny 3D Gold Claw */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <div className="w-1.5 h-10 bg-gradient-to-b from-slate-400 to-[#D4AF37] shadow-xs" />
                <div className="w-10 h-5 bg-gradient-to-r from-amber-400 via-amber-300 to-[#D4AF37] rounded-lg border border-white shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                {/* 3D Prongs */}
                <div className="relative w-14 h-10 flex justify-center -mt-0.5">
                  <div className="w-3.5 h-8 border-2 border-amber-700 bg-amber-300 rounded-bl-full shadow-xs -rotate-20" />
                  <div className="w-3.5 h-8 border-2 border-amber-700 bg-amber-300 rounded-br-full shadow-xs rotate-20 -ml-1" />
                </div>
              </div>

              {/* DENSE OVERFLOWING PLUSHIE PILE */}
              <div className="absolute bottom-2 inset-x-1 h-32 flex items-end justify-between pointer-events-none z-10">
                {initialPrizes.map((item) => (
                  <div
                    key={`preview_${item.id}`}
                    style={{
                      position: 'absolute',
                      left: `${item.xPercent}%`,
                      transform: `translateX(-50%) rotate(${item.rotation || 0}deg)`,
                      bottom: `${item.bottomPx || 4}px`,
                      zIndex: item.layer === 'front' ? 15 : 10,
                    }}
                    className={`transition-all ${item.layer === 'back' ? 'scale-90 opacity-90' : 'scale-100'}`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center ${item.isScroll
                        ? 'bg-gradient-to-tr from-amber-100 via-white to-amber-200 border-2 border-amber-400 shadow-md animate-bounce-soft'
                        : 'bg-white/95 border border-rose-900/10 shadow-2xs'
                        }`}
                    >
                      <AppleEmoji emoji={item.emoji} size={item.layer === 'front' ? 26 : 22} />
                      {item.isScroll && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D4AF37] text-[8px] font-black flex items-center justify-center text-slate-900 border border-white shadow-2xs">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Glass Overlay Sparkle Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/30 pointer-events-none" />
            </div>

            {/* FRONT OVERLAY GLASS CARD */}
            <div className="relative w-full bg-white/95 backdrop-blur-xl border border-rose-900/15 rounded-3xl p-3.5 flex flex-col items-center text-center shadow-xl space-y-2.5 z-30">

              {/* Secret Scrolls HUD Pill */}
              <div className="w-full bg-rose-50/90 border border-rose-900/15 rounded-2xl p-2.5 flex items-center justify-start gap-3 shadow-2xs">
                <AppleEmoji emoji="📜" size={24} />
                <div className="text-left">
                  <p className="text-xs font-bold text-[#5C0B1C] uppercase tracking-wide">0 / 3</p>
                  <p className="text-[10px] font-semibold text-[#8B102B]">SECRET CLUES TERKUMPUL</p>
                </div>
              </div>

              {/* Primary START THE HUNT Button */}
              <button
                onClick={() => {
                  soundManager.playPop();
                  setGameState('playing');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-sm tracking-wider shadow-[0_8px_20px_rgba(114,13,35,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START THE HUNT</span>
              </button>

              {/* Secondary BUTUH PETUNJUK? Button */}
              <button
                onClick={() => {
                  soundManager.playPop();
                  setGameState('how_to_play');
                }}
                className="w-full py-2.5 rounded-xl bg-white border border-rose-900/15 text-[#720D23] font-bold text-xs hover:bg-rose-50 shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-[#8B102B]" />
                <span> NEED HINTS?</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW MODE 2: ACTIVE GAMEPLAY */}
      {gameState === 'playing' && (
        <motion.div
          key="playing_screen"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full flex flex-col items-center"
        >
          {/* TOP FLOATING STATS BAR */}
          <div className="w-full bg-white/95 backdrop-blur-md border border-rose-900/15 rounded-2xl p-2 mb-2 flex items-center justify-around shadow-sm text-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</p>
              <p className="text-base font-bold text-[#5C0B1C]">{attempts * 10}</p>
            </div>
            <div className="h-6 w-px bg-rose-100" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clues</p>
              <p className="text-base font-bold text-[#8B102B] flex items-center justify-center gap-1">
                <span>{collectedScrolls.length} / 3</span>
                <AppleEmoji emoji="📜" size={14} />
              </p>
            </div>
            <div className="h-6 w-px bg-rose-100" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attempts</p>
              <p className="text-base font-bold text-[#5C0B1C]">{attempts}</p>
            </div>
          </div>

          {/* Toast Notice Banner */}
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-2 px-3 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs text-center mb-2 shadow-sm border border-amber-300 flex items-center justify-center gap-1.5"
            >
              <AppleEmoji emoji={toastMessage.emoji} size={16} />
              <span>{toastMessage.text}</span>
            </motion.div>
          )}

          {/* MAIN ARCADE MACHINE CABINET HOUSING */}
          <div className="relative w-full h-[470px] sm:h-[500px] rounded-[36px] bg-gradient-to-b from-[#720D23] via-[#8B102B] to-[#400613] p-3 border-4 border-amber-200/90 shadow-2xl flex flex-col justify-between overflow-hidden select-none">

            {/* Glass Arcade Window Canvas */}
            <div className="relative flex-1 rounded-[24px] bg-gradient-to-b from-[#FFFDFD]/95 via-[#FAF3F5]/90 to-[#F5E6EA]/90 border-2 border-white/90 shadow-inner overflow-hidden flex flex-col justify-between isolate">

              {/* Top Arc Lights Trim (Seamlessly rounded to match window arch) */}
              <div className="absolute top-0 inset-x-0 h-7 rounded-t-[22px] bg-gradient-to-b from-white/80 to-transparent flex items-center justify-between px-3.5 border-b border-rose-900/10 z-20 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
              </div>

              {/* Horizontal Cable Track Rail */}
              <div className="absolute top-7 inset-x-3 h-2.5 bg-slate-300/80 rounded-full border border-white z-20 shadow-inner">
                <motion.div
                  className="absolute top-0 bottom-0 w-8 bg-amber-400 border border-amber-600 rounded-md shadow-2xs -translate-x-1/2"
                  animate={{ left: `${clawX}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>

              {/* UNBREAKABLE METALLIC CORD & COILED SPRING */}
              <motion.div
                className="absolute z-25 pointer-events-none flex flex-col items-center -translate-x-1/2"
                style={{ top: '36px' }}
                animate={{
                  left: `${clawX}%`,
                  height: `calc(${clawY}% - 26px)`,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              >
                {/* Cable Line */}
                <div className="w-1.5 h-full bg-gradient-to-b from-slate-600 via-slate-500 to-slate-700 shadow-sm" />
              </motion.div>

              {/* CLAW MECHANISM ASSEMBLY */}
              <motion.div
                className="absolute z-30 flex flex-col items-center pointer-events-none -translate-x-1/2"
                animate={{
                  top: `${clawY}%`,
                  left: `${clawX}%`,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              >
                {/* Coiled Spring Wire Top */}
                <div className="w-3 h-4 bg-gradient-to-b from-slate-300 to-slate-500 rounded-sm border border-slate-700 shadow-2xs mb-0.5" />

                {/* Claw Motor Box */}
                <div className="w-11 h-5 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 border border-white rounded-lg shadow-md flex items-center justify-center relative">
                  <div className={`w-2.5 h-2.5 rounded-full border border-white ${isProngsClosed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'}`} />
                </div>

                {/* 3D Prongs & Grabbed Item */}
                <div className="relative w-14 h-11 flex items-center justify-center -mt-1">
                  {/* Left Curved Claw Prong */}
                  <motion.div
                    className="absolute top-0 left-1 w-3.5 h-9 border-2 border-slate-700 bg-gradient-to-b from-slate-200 to-slate-400 rounded-bl-full shadow-sm origin-top-right"
                    animate={{ rotate: isProngsClosed ? -4 : -38 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                  />

                  {/* Right Curved Claw Prong */}
                  <motion.div
                    className="absolute top-0 right-1 w-3.5 h-9 border-2 border-slate-700 bg-gradient-to-b from-slate-200 to-slate-400 rounded-br-full shadow-sm origin-top-left"
                    animate={{ rotate: isProngsClosed ? 4 : 38 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                  />

                  {/* Grabbed Item */}
                  {grabbedItem && (
                    <motion.div
                      initial={{ scale: 0.6, y: -5 }}
                      animate={{ scale: [1, 1.08, 1], y: 3 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="absolute top-1 left-1/2 -translate-x-1/2 z-40"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${grabbedItem.isScroll
                        ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300/60 shadow-lg'
                        : 'bg-white border-pink-200 shadow-md'
                        }`}>
                        <AppleEmoji emoji={grabbedItem.emoji} size={28} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* FALLING ITEM TRAJECTORY INTO PRIZE TRAY */}
              {fallingItem && (
                <motion.div
                  initial={{ top: '16%', left: '16%', scale: 1, rotate: 0 }}
                  animate={{ top: '74%', left: '10%', scale: 0.9, rotate: -15 }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                  className="absolute z-50 pointer-events-none -translate-x-1/2"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${fallingItem.isScroll
                    ? 'bg-amber-100 border-amber-400 shadow-xl'
                    : 'bg-white border-pink-200 shadow-lg'
                    }`}>
                    <AppleEmoji emoji={fallingItem.emoji} size={26} />
                  </div>
                </motion.div>
              )}

              {/* REALISTIC ARCADE PRIZE BASKET / DROP HATCH (Bottom Left) */}
              <div className="absolute bottom-2 left-2 w-26 h-22 bg-gradient-to-b from-rose-50/95 via-white/95 to-amber-50/95 border border-rose-900/20 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between p-1.5 z-20 shadow-md">
                <div className="text-[9px] font-bold text-[#720D23] uppercase tracking-wide text-center bg-rose-100/80 rounded-lg py-0.5 border border-rose-200 shadow-2xs flex items-center justify-center gap-1">
                  <span>PRIZE BASKET</span>
                  <AppleEmoji emoji="🧺" size={11} />
                </div>

                <div className="h-12 flex items-center justify-center relative overflow-hidden rounded-xl bg-white/90 border border-rose-100 shadow-inner">
                  {droppedItemInTray ? (
                    <motion.div
                      initial={{ y: -15, scale: 0.5, rotate: -10 }}
                      animate={{ y: 0, scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                      className="w-full h-full bg-gradient-to-tr from-rose-50 via-white to-amber-50 rounded-xl p-1 flex items-center justify-center gap-1 shadow-sm"
                    >
                      <AppleEmoji emoji={droppedItemInTray.emoji} size={24} />
                      <span className="text-[9px] font-bold text-[#5C0B1C] truncate">{droppedItemInTray.name}</span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 text-slate-400">
                      <AppleEmoji emoji="🧺" size={15} />
                      <span className="text-[8px] font-semibold tracking-tight">Drop here</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DENSE OVERFLOWING PLUSHIE PILE ON FLOOR */}
              <div className="absolute bottom-3 inset-x-1 h-32 flex items-end justify-between pointer-events-none z-10">
                {prizes.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: `${item.xPercent}%`,
                      transform: `translateX(-50%) rotate(${item.rotation || 0}deg)`,
                      bottom: `${item.bottomPx || 4}px`,
                      zIndex: item.layer === 'front' ? 15 : 10,
                    }}
                    className={`transition-all ${item.layer === 'back' ? 'scale-90 opacity-90' : 'scale-100'}`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-transform ${item.isScroll
                        ? 'bg-gradient-to-tr from-amber-100 via-white to-amber-200 border-2 border-amber-400 shadow-md animate-bounce-soft'
                        : 'bg-white/95 border border-rose-900/10 shadow-2xs'
                        }`}
                    >
                      <AppleEmoji emoji={item.emoji} size={item.layer === 'front' ? 26 : 22} />
                      {item.isScroll && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-[9px] font-black flex items-center justify-center text-slate-900 border border-white shadow-2xs">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Glass Reflection Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none rounded-[22px] z-40" />
            </div>

            {/* INTEGRATED MACHINE BASE CONTROL PANEL */}
            <ClawControls
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onDropClaw={handleDropClaw}
              onHowToPlay={() => setGameState('how_to_play')}
              onReset={handleResetGame}
              disabled={clawState !== 'idle' || showCompletion}
            />
          </div>
        </motion.div>
      )}

      {/* MODAL 1: HOW TO PLAY MODAL */}
      {gameState === 'how_to_play' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#180308]/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative border border-rose-900/15"
          >
            <button
              onClick={() => setGameState('playing')}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#8B102B] flex items-center justify-center mx-auto mb-3 border border-rose-900/15 shadow-2xs">
              <HelpCircle className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-bold text-xl text-[#5C0B1C] mb-1">NEED HINTS?</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Ikuti hint mudah ini untuk mengumpulkan 3 secret clues! 📜✦
            </p>

            <div className="space-y-3 text-left mb-6 text-xs text-slate-700 font-medium">
              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#8B102B] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <p>Geser capit ke kiri atau kanan menggunakan tombol <strong>← →</strong> (atau panah keyboard di desktop).</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#8B102B] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <p>Tekan tombol <strong>GRAB</strong> (atau Spacebar / Panah Bawah) untuk menurunkan capit dan mengambil target.</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <p>Kumpulkan ketiga <strong>Secret Clues</strong> yang ada di dalam mesin untuk melanjutkan ke misi berikutnya!</p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playPop();
                setGameState('playing');
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Let's Play
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* MODAL 2: SECRET SCROLL FOUND MODAL (FRAME 4 PROTOTYPE) */}
      {foundScrollModalNumber && (
        <ScrollFoundModal
          scrollNumber={foundScrollModalNumber}
          onClose={() => setFoundScrollModalNumber(null)}
        />
      )}

      {/* MODAL 3: GAME COMPLETION MODAL */}
      {showCompletion && (
        <ClawMachineCompletion
          scrolls={scrolls}
          onContinue={() => {
            soundManager.playPop();
            onComplete(scrolls);
          }}
        />
      )}
    </div>
  );
};
