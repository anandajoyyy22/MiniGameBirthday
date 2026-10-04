import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Lightbulb, CheckCircle2, RotateCcw, Heart } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { GameStage, HiddenObject, PuzzleItem } from '../types/birthday';
import { soundManager } from '../utils/soundManager';
import { triggerConfetti } from '../components/ConfettiEffect';
import { AppleEmoji } from '../components/AppleEmoji';
import { BeatBattle } from '../game/BeatBattle';
import { ClawMachine } from '../components/clawMachine/ClawMachine';
import { CluesRevealScreen } from '../components/CluesRevealScreen';
import { TreasureUnlockedScreen } from '../components/TreasureUnlockedScreen';

interface GameSceneProps {
  onGameComplete: () => void;
}

export const GameScene: React.FC<GameSceneProps> = ({ onGameComplete }) => {
  const [stage, setStage] = useState<GameStage>('intro');

  // Hidden Objects State (Bunga 🌸, Bintang ⭐, Kunci 🔑)
  const [hiddenObjects, setHiddenObjects] = useState<HiddenObject[]>([
    {
      id: 'flower',
      name: 'Bunga',
      icon: '🌸',
      found: false,
      xPercent: 78,
      yPercent: 35,
      hint: 'Coba perhatikan area Meja Pesta untuk sesuatu yang mekar...',
    },
    {
      id: 'star',
      name: 'Bintang',
      icon: '⭐',
      found: false,
      xPercent: 52,
      yPercent: 62,
      hint: 'Benda langit yang cantik terselip dekat area Sofa...',
    },
    {
      id: 'key',
      name: 'Kunci',
      icon: '🔑',
      found: false,
      xPercent: 25,
      yPercent: 70,
      hint: 'Alat pembuka pintu tersimpan di sekitar Meja Kerja...',
    },
  ]);

  const [showNeedHints, setShowNeedHints] = useState(false);
  const [objectToast, setObjectToast] = useState<{ text: string; emoji: string } | null>(null);

  // Puzzle State (Clue Order: Bunga 🌸 -> Bintang ⭐ -> Kunci 🔑)
  const puzzleItems: PuzzleItem[] = [
    {
      id: 'flower',
      name: 'Bunga',
      icon: '🌸',
      orderHint: '1. Sesuatu yang tumbuh dan bermekaran indah.',
    },
    {
      id: 'star',
      name: 'Bintang',
      icon: '⭐',
      orderHint: '2. Benda langit yang cantik memancarkan cahaya.',
    },
    {
      id: 'key',
      name: 'Kunci',
      icon: '🔑',
      orderHint: '3. Alat pembuka rahasia dan masa depan.',
    },
  ];
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [puzzleError, setPuzzleError] = useState<string | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Combination Lock State
  const [inputCode, setInputCode] = useState<string>('');
  const [lockError, setLockError] = useState<string | null>(null);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  // Handlers for Hidden Objects Exploration
  const handleExploreZone = (zone: 'desk' | 'sofa' | 'party') => {
    soundManager.playPop();

    let targetId = '';
    let successToast = '';
    let emoji = '';

    if (zone === 'desk') {
      targetId = 'key';
      successToast = '🔑 Secret Key collected! Nice catch!';
      emoji = '🔑';
    } else if (zone === 'sofa') {
      targetId = 'star';
      successToast = '⭐ Shining Star collected! Awesome!';
      emoji = '⭐';
    } else if (zone === 'party') {
      targetId = 'flower';
      successToast = '🌸 Secret Flower collected! Pretty!';
      emoji = '🌸';
    }

    const item = hiddenObjects.find((o) => o.id === targetId);

    if (item && item.found) {
      setObjectToast({ text: `${item.icon} ${item.name} already collected!`, emoji: item.icon });
      setTimeout(() => setObjectToast(null), 2000);
      return;
    }

    const updated = hiddenObjects.map((obj) => {
      if (obj.id === targetId) {
        return { ...obj, found: true };
      }
      return obj;
    });

    setHiddenObjects(updated);
    setObjectToast({ text: successToast, emoji });
    setTimeout(() => setObjectToast(null), 2500);

    const allFound = updated.every((o) => o.found);
    if (allFound) {
      soundManager.playSparkle();
      triggerConfetti(0.7);
    }
  };

  // Handlers for Ordering Puzzle (flower -> star -> key)
  const handlePuzzleSelect = (id: string) => {
    soundManager.playPop();
    if (userOrder.includes(id)) {
      setUserOrder(userOrder.filter((i) => i !== id));
      return;
    }
    const newOrder = [...userOrder, id];
    setUserOrder(newOrder);

    if (newOrder.length === 3) {
      if (newOrder[0] === 'flower' && newOrder[1] === 'star' && newOrder[2] === 'key') {
        soundManager.playSparkle();
        setPuzzleSolved(true);
        setPuzzleError(null);
        triggerConfetti(0.6);
      } else {
        setPuzzleError('Hmm, sepertinya urutannya belum pas dengan 3 clue tadi. Coba lagi ya, Mba Alin! ✦');
      }
    }
  };

  const handleResetPuzzle = () => {
    soundManager.playPop();
    setUserOrder([]);
    setPuzzleError(null);
  };

  // Handlers for Lock (4-digit birthday code: 0310)
  const handleLockDigit = (digit: string) => {
    soundManager.playPop();
    if (inputCode.length < birthdayConfig.secretCode.length) {
      setInputCode(inputCode + digit);
      setLockError(null);
    }
  };

  const handleLockBackspace = () => {
    soundManager.playPop();
    setInputCode(inputCode.slice(0, -1));
  };

  const handleLockSubmit = () => {
    if (inputCode === birthdayConfig.secretCode || inputCode === '0310' || inputCode === '310') {
      soundManager.playUnlock();
      triggerConfetti(0.8);
      setUnlockedSuccess(true);
      setTimeout(() => {
        setStage('treasure_unlocked');
      }, 2000);
    } else {
      soundManager.playPop();
      setLockError('Kode belum tepat nih... Coba masukkan tanggal ulang tahun Mba Alin (0310)!');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] mt-14 mb-16 flex flex-col items-center justify-center p-3 sm:p-6">
      <AnimatePresence mode="wait">
        {/* STAGE: INTRO (ELEGANT MAROON & WHITE THEME) */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-md text-center py-2 px-3 flex flex-col items-center justify-between min-h-[calc(100vh-140px)]"
          >
            {/* GLASS ARCH DOME CONTAINER */}
            <div className="relative w-full bg-white/90 backdrop-blur-xl border border-rose-900/15 rounded-t-[140px] rounded-b-[36px] shadow-[0_20px_50px_rgba(114,13,35,0.08)] p-6 pt-12 sm:p-8 sm:pt-14 text-center my-auto flex flex-col items-center justify-between min-h-[470px] overflow-hidden">

              {/* Subtle Gold Accents */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/30 animate-pulse" />
                <Sparkles className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37] animate-bounce-soft" />
                <Sparkles className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/30 animate-pulse" />
              </div>

              {/* Title Block */}
              <div className="my-2">
                <p className="font-serif italic text-[#B81436] text-xl font-normal tracking-wide mb-1">
                  A Little
                </p>
                <h2 className="font-serif font-bold text-[#80001F] text-3xl sm:text-4xl tracking-tight leading-[1.18] drop-shadow-xs">
                  Birthday<br />
                  Adventure<br />
                  Awaits...
                </h2>
              </div>

              {/* Subtitle Supporting Copy */}
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-xs mx-auto my-3">
                One little mission, beberapa secret clues,<br />
                dan sesuatu yang special menunggu di akhir.
              </p>

              {/* Prompt Block */}
              <div className="my-2 text-center">
                <p className="font-serif font-bold text-sm sm:text-base text-[#80001F] tracking-wide">
                  Ready, Mba Alin?
                </p>
                <p className="text-xs text-[#B81436] font-semibold mt-0.5">
                  Letsgoow kita berpetualang!!
                </p>
              </div>

              {/* Action Button (LET'S PLAY! →) */}
              <button
                onClick={() => {
                  soundManager.playPop();
                  setStage('claw_machine');
                }}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs sm:text-sm tracking-wider border border-amber-300/30 shadow-[0_10px_25px_rgba(184,20,54,0.35)] hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 select-none"
              >
                <span>LET'S PLAY</span>
                <span className="text-base font-bold"></span>
              </button>
            </div>

            {/* Footer Note & Clean Transparent Gift Icon */}
            <div className="w-full flex flex-col items-center mt-3 gap-1">
              <p className="text-xs font-semibold text-[#80001F] flex items-center justify-center gap-1.5">
              </p>

              {/* Clean Transparent Gift Icon Container */}
            </div>
          </motion.div>
        )}

        {/* STAGE: CLAW MACHINE (FRAME 2 & 3 PROTOTYPE) */}
        {stage === 'claw_machine' && (
          <motion.div
            key="claw_machine"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md text-center py-2"
          >
            <ClawMachine
              onComplete={() => {
                soundManager.playSparkle();
                setStage('hidden_objects');
              }}
              onSkip={() => setStage('hidden_objects')}
            />
          </motion.div>
        )}

        {/* STAGE: BEAT BATTLE DISCO */}
        {stage === 'beat_battle' && (
          <motion.div
            key="beat_battle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md text-center py-2"
          >
            <BeatBattle
              onComplete={() => setStage('hidden_objects')}
              onSkip={() => setStage('intro')}
            />
          </motion.div>
        )}

        {/* CHALLENGE 1: VISUAL SEEK & FIND (SPOT THE 3 CLUE ICONS) */}
        {stage === 'hidden_objects' && (
          <motion.div
            key="hidden_objects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center py-2"
          >
            {/* Header */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#8B102B] text-xs font-bold uppercase tracking-wider mb-2 border border-rose-900/15">
                <span>MISSION 02</span>
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] tracking-tight mb-1">
                CARI 3 SECRET ICONS
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto">
                Cari 3 icon (<span className="font-bold text-[#8B102B]">🌸 Flower, ⭐ Star, 🔑 Key</span>) sesuai clue tadi. Kumpulkan ketiganya untuk unlock the secret code!
              </p>
            </div>

            {/* Collected Icons Indicator */}
            <div className="flex items-center justify-between px-4 py-2 mb-3 bg-white/95 rounded-2xl border border-rose-900/15 shadow-2xs">
              <span className="text-xs font-bold text-slate-700">Icons Collected:</span>
              <div className="flex items-center gap-2.5">
                {[
                  { id: 'flower', icon: '🌸', name: 'Flower' },
                  { id: 'star', icon: '⭐', name: 'Star' },
                  { id: 'key', icon: '🔑', name: 'Key' },
                ].map((item) => {
                  const isFound = hiddenObjects.find((o) => o.id === item.id)?.found;
                  return (
                    <div
                      key={item.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isFound
                          ? 'bg-rose-100 border-2 border-rose-400 scale-105 shadow-2xs'
                          : 'bg-slate-100 border border-dashed border-slate-300 opacity-40'
                      }`}
                      title={isFound ? `${item.name} collected!` : item.name}
                    >
                      {isFound ? (
                        <AppleEmoji emoji={item.icon} size={16} />
                      ) : (
                        <span className="text-[11px] text-slate-400 font-bold">?</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs font-extrabold text-[#8B102B]">
                {hiddenObjects.filter((o) => o.found).length} / 3
              </span>
            </div>

            {/* Toast Feedback */}
            {objectToast && (
              <div className="mb-3 bg-amber-100 text-amber-900 font-bold text-xs text-center py-2 px-3 rounded-2xl shadow-xs border border-amber-300 flex items-center justify-center gap-2 animate-fade-in">
                <span>{objectToast.text}</span>
                <AppleEmoji emoji={objectToast.emoji} size={16} />
              </div>
            )}

            {/* THE VISUAL SEEK & FIND CANVAS */}
            <div
              onClick={() => {
                soundManager.playPop();
                setObjectToast({
                  text: 'Check carefully near the sofa, plant, or work desk! 👀',
                  emoji: '🔍',
                });
                setTimeout(() => setObjectToast(null), 2500);
              }}
              className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#FFF9FA] via-[#FFF3F5] to-[#FCEEF2] border-2 border-rose-900/20 shadow-lg overflow-hidden select-none p-4"
            >
              {/* Background Party Ambient Lighting & Festive Garland */}
              <div className="absolute top-2 inset-x-3 flex justify-between items-center opacity-60 pointer-events-none">
                <span className="text-xs">✨</span>
                <span className="text-xs">🎈</span>
                <span className="text-xs">✨</span>
                <span className="text-xs">🎈</span>
                <span className="text-xs">✨</span>
              </div>

              {/* FURNITURE 1: Cozy Lounge Sofa & Gift Box (Top-Left) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playPop();
                  setObjectToast({ text: 'Sofa empuk & gift box! Check the secret star nearby ✨', emoji: '🎁' });
                  setTimeout(() => setObjectToast(null), 2000);
                }}
                className="absolute top-5 left-5 bg-white/95 border border-rose-200 rounded-2xl p-2.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 z-10"
              >
                <AppleEmoji emoji="🛋️" size={24} />
                <AppleEmoji emoji="🎁" size={18} />
              </div>

              {/* TARGET 1: ⭐ BINTANG (STAR) - Perched right next to Sofa */}
              {!hiddenObjects.find((o) => o.id === 'star')?.found ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.25, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreZone('sofa');
                  }}
                  className={`absolute top-5 left-28 p-2.5 bg-amber-300/95 hover:bg-amber-400 rounded-full border-2 border-amber-500 shadow-md cursor-pointer z-30 ring-2 ring-amber-200 ${
                    showNeedHints ? 'animate-bounce ring-4 ring-amber-400' : 'animate-bounce-soft'
                  }`}
                  title="Click to collect Star!"
                >
                  <AppleEmoji emoji="⭐" size={22} />
                </motion.button>
              ) : (
                <div className="absolute top-5 left-28 p-2 bg-emerald-100/90 rounded-full border-2 border-emerald-400 shadow-xs z-30">
                  <AppleEmoji emoji="⭐" size={18} />
                </div>
              )}

              {/* FURNITURE 2: Wall Art / Picture (Top-Right) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playPop();
                  setObjectToast({ text: 'Aesthetic wall art painting! ✨', emoji: '🖼️' });
                  setTimeout(() => setObjectToast(null), 2000);
                }}
                className="absolute top-5 right-5 bg-white/90 border border-rose-200 rounded-2xl p-2 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center z-10"
              >
                <AppleEmoji emoji="🖼️" size={24} />
              </div>

              {/* FURNITURE 3: Potted Plant Foliage (Center-Right) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playPop();
                  setObjectToast({ text: 'Fresh potted plant... Ada secret flower di sampingnya! 🌸', emoji: '🪴' });
                  setTimeout(() => setObjectToast(null), 2000);
                }}
                className="absolute top-24 right-5 bg-emerald-50/95 border border-emerald-200 rounded-2xl p-2.5 shadow-xs cursor-pointer hover:scale-105 transition-transform flex items-center gap-1.5 z-10"
              >
                <AppleEmoji emoji="🪴" size={28} />
              </div>

              {/* TARGET 2: 🌸 BUNGA (FLOWER) - Hidden right beside Plant */}
              {!hiddenObjects.find((o) => o.id === 'flower')?.found ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.25, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreZone('party');
                  }}
                  className={`absolute top-24 right-22 p-2.5 bg-rose-200/95 hover:bg-rose-300 rounded-full border-2 border-rose-400 shadow-md cursor-pointer z-30 ring-2 ring-rose-200 ${
                    showNeedHints ? 'animate-bounce ring-4 ring-rose-400' : 'animate-bounce-soft'
                  }`}
                  title="Click to collect Flower!"
                >
                  <AppleEmoji emoji="🌸" size={22} />
                </motion.button>
              ) : (
                <div className="absolute top-24 right-22 p-2 bg-emerald-100/90 rounded-full border-2 border-emerald-400 shadow-xs z-30">
                  <AppleEmoji emoji="🌸" size={18} />
                </div>
              )}

              {/* FURNITURE 4: Executive Desk with Laptop & Coffee (Bottom-Left) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playPop();
                  setObjectToast({ text: 'Work desk & hot coffee! Secret key terselip di samping ☕', emoji: '💻' });
                  setTimeout(() => setObjectToast(null), 2000);
                }}
                className="absolute bottom-5 left-5 bg-amber-50/95 border border-amber-200 rounded-2xl p-2.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 z-10"
              >
                <AppleEmoji emoji="💻" size={24} />
                <AppleEmoji emoji="☕" size={18} />
              </div>

              {/* TARGET 3: 🔑 KUNCI (KEY) - Hidden right beside Laptop */}
              {!hiddenObjects.find((o) => o.id === 'key')?.found ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.25, rotate: 20 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreZone('desk');
                  }}
                  className={`absolute bottom-5 left-28 p-2.5 bg-amber-300/95 hover:bg-amber-400 rounded-full border-2 border-amber-500 shadow-md cursor-pointer z-30 ring-2 ring-amber-200 ${
                    showNeedHints ? 'animate-bounce ring-4 ring-amber-400' : 'animate-bounce-soft'
                  }`}
                  title="Click to collect Key!"
                >
                  <AppleEmoji emoji="🔑" size={22} />
                </motion.button>
              ) : (
                <div className="absolute bottom-5 left-28 p-2 bg-emerald-100/90 rounded-full border-2 border-emerald-400 shadow-xs z-30">
                  <AppleEmoji emoji="🔑" size={18} />
                </div>
              )}

              {/* FURNITURE 5: Birthday Cake & Festive Balloon (Bottom-Right) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playPop();
                  setObjectToast({ text: 'Sweet birthday cake for Mba Alin! 🎂🎈', emoji: '🎂' });
                  setTimeout(() => setObjectToast(null), 2000);
                }}
                className="absolute bottom-5 right-5 bg-white/95 border border-rose-200 rounded-2xl p-2.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 z-10"
              >
                <AppleEmoji emoji="🎂" size={26} />
                <AppleEmoji emoji="🎈" size={18} />
              </div>

              {/* Bottom Decorative Hardwood Line */}
              <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200" />
            </div>

            {/* Bottom Controls & Hint Button */}
            <div className="mt-3.5 space-y-3">
              {/* Hint Helper Button */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setShowNeedHints(!showNeedHints);
                }}
                className="text-xs font-bold text-[#8B102B] bg-rose-50 border border-rose-900/15 px-4 py-2 rounded-full inline-flex items-center gap-1.5 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                <span>{showNeedHints ? 'HIDE HINTS' : 'NEED HINTS? 💡'}</span>
              </button>

              {showNeedHints && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50/95 border border-amber-200 rounded-2xl p-3 text-left text-xs text-amber-950 space-y-1 w-full shadow-2xs"
                >
                  <p className="font-bold text-[#8B102B]">
                    Secret Hints & Locations:
                  </p>
                  <p>• ⭐ <strong>Star</strong>: Bersinar di samping cozy sofa & gift box 🛋️🎁</p>
                  <p>• 🌸 <strong>Flower</strong>: Berada di samping fresh potted plant 🪴</p>
                  <p>• 🔑 <strong>Key</strong>: Terselip di samping work desk & coffee 💻☕</p>
                </motion.div>
              )}

              {/* When All 3 Objects Found: Reveal Code and Advance */}
              {hiddenObjects.every((o) => o.found) ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3 pt-1"
                >
                  <div className="bg-white border border-rose-900/20 rounded-2xl p-4 text-center shadow-md animate-bounce-soft">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-[10px] uppercase mb-1.5 border border-rose-900/15">
                      <AppleEmoji emoji="✨" size={13} />
                      <span>ALL 3 ICONS COLLECTED!</span>
                    </span>
                    <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2 mt-1">
                      <span>Secret Code:</span>
                      <span className="text-[#990024] text-xl font-mono font-black tracking-widest bg-rose-50 px-3 py-0.5 rounded-lg border border-rose-900/20 shadow-inner">
                        {birthdayConfig.secretCode}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPop();
                      setStage('combination_lock');
                    }}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>BUKA PART SELANJUTNYA</span>
                  </button>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}

        {/* CHALLENGE 2: BIRTHDAY PUZZLE */}
        {stage === 'puzzle' && (
          <motion.div
            key="puzzle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center py-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#B81436] text-xs font-bold uppercase tracking-wider mb-2 border border-rose-900/15">
              <span>MISSION 02 — PART 2</span>
              <AppleEmoji emoji="🧩" size={14} />
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#80001F] mb-1">
              DECODE THE SECRET ORDER
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Urutkan 3 simbol di bawah ini berdasarkan logika hint rahasia Mba Alin!
            </p>

            {/* Clue Hints List */}
            <div className="bg-white/90 border border-rose-900/15 rounded-2xl p-4 mb-5 text-left space-y-3 text-xs text-slate-700 font-medium shadow-xs">
              {puzzleItems.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#B81436] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed text-slate-700">
                    {item.orderHint.replace(/^[0-9]+\.\s*/, '')}
                  </p>
                </div>
              ))}
            </div>

            {/* Current Selected Slots */}
            <div className="flex justify-center gap-3 mb-5">
              {[0, 1, 2].map((slotIdx) => {
                const itemId = userOrder[slotIdx];
                const item = puzzleItems.find((i) => i.id === itemId);
                return (
                  <div
                    key={slotIdx}
                    className="w-20 h-24 rounded-2xl border-2 border-dashed border-rose-300 bg-white/95 flex flex-col items-center justify-center p-2 shadow-inner"
                  >
                    {item ? (
                      <div className="text-center">
                        <AppleEmoji emoji={item.icon} size={30} />
                        <p className="text-[10px] font-bold text-[#80001F] mt-1">{item.name}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-rose-300">Slot {slotIdx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Items Selector */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {puzzleItems.map((item) => {
                const isSelected = userOrder.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePuzzleSelect(item.id)}
                    className={`p-3.5 rounded-2xl border font-bold text-xs transition-all flex flex-col items-center gap-1.5 ${isSelected
                        ? 'bg-gradient-to-b from-[#990024] to-[#B81436] text-white border-[#80001F] shadow-md scale-105'
                        : 'bg-white text-slate-700 border-rose-900/10 hover:border-rose-300 shadow-2xs'
                      }`}
                  >
                    <AppleEmoji emoji={item.icon} size={26} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Error / Feedback Message */}
            {puzzleError && (
              <p className="text-[#B81436] text-xs font-bold mb-4 flex items-center justify-center gap-1">
                <span>{puzzleError}</span>
              </p>
            )}

            {/* Solved Secret Code Card */}
            {puzzleSolved && (
              <div className="bg-white border border-rose-900/20 rounded-2xl p-4 mb-5 text-center shadow-md animate-fade-in">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-50 text-[#B81436] font-bold text-[10px] uppercase mb-2 border border-rose-900/15">
                  <span>LOGIC SOLVED!</span>
                  <AppleEmoji emoji="✨" size={13} />
                </span>
                <h4 className="text-base font-bold text-slate-800">
                  Kode Rahasia: <span className="text-[#990024] font-mono font-black text-2xl ml-1">{birthdayConfig.secretCode}</span>
                </h4>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleResetPuzzle}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>

              {puzzleSolved && (
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setStage('combination_lock');
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-xs shadow-md shadow-rose-900/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>BUKA PART SELANJUTNYA</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* CHALLENGE 3: COMBINATION LOCK */}
        {stage === 'combination_lock' && (
          <motion.div
            key="combination_lock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center py-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#B81436] text-xs font-bold uppercase tracking-wider mb-2 border border-rose-900/15">
              <span>MISSION 02 — FINAL LOCK</span>
              <AppleEmoji emoji="🔐" size={14} />
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#80001F] mb-1">
              UNLOCK THE SECRET BOX
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Masukkan 4 digit kode rahasia tanggal ulang tahun Mba Alin (0310) untuk membuka kunci kotak misteri!
            </p>

            {/* Secret Code Clue Banner */}
            <div className="bg-white border border-rose-900/15 rounded-2xl p-3 mb-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2">
                <AppleEmoji emoji="💡" size={16} />
                <span className="text-xs font-bold text-slate-700">Kode Rahasia:</span>
                <span className="text-[#990024] text-base font-mono font-bold tracking-widest bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-900/15">
                  {birthdayConfig.secretCode}
                </span>
              </div>
            </div>

            {/* Combination Lock Box */}
            <div className="w-full bg-gradient-to-br from-rose-50/90 via-white to-amber-50/60 border border-rose-900/15 rounded-3xl p-5 mb-5 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-white border border-rose-900/20 flex items-center justify-center mx-auto mb-3 text-[#990024] shadow-xs">
                <Lock className="w-6 h-6" />
              </div>

              {/* Digit Display */}
              <div className="flex justify-center gap-2.5 mb-1">
                {Array.from({ length: birthdayConfig.secretCode.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-11 h-14 rounded-2xl border-2 border-rose-200 bg-white font-mono font-bold text-2xl text-[#80001F] flex items-center justify-center shadow-inner"
                  >
                    {inputCode[idx] || '•'}
                  </div>
                ))}
              </div>
            </div>

            {/* Lock Error */}
            {lockError && (
              <p className="text-[#B81436] text-xs font-bold mb-4 flex items-center justify-center gap-1">
                <span>{lockError}</span>
              </p>
            )}

            {/* Keypad Buttons */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleLockDigit(digit)}
                  className="py-3 rounded-2xl bg-white border border-rose-900/10 font-bold text-slate-800 text-base hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleLockBackspace}
                className="py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700 text-xs hover:bg-slate-100 shadow-2xs cursor-pointer"
              >
                ⌫
              </button>
              <button
                onClick={() => handleLockDigit('0')}
                className="py-3 rounded-2xl bg-white border border-rose-900/10 font-bold text-slate-800 text-base hover:bg-rose-50 shadow-2xs cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => setInputCode('')}
                className="py-3 rounded-2xl bg-rose-50 border border-rose-200 font-bold text-[#B81436] text-xs hover:bg-rose-100 shadow-2xs cursor-pointer"
              >
                C
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLockSubmit}
              disabled={inputCode.length < birthdayConfig.secretCode.length}
              className={`w-full py-4 rounded-full font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${inputCode.length === birthdayConfig.secretCode.length
                  ? 'bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white shadow-rose-900/20 hover:scale-[1.02] active:scale-95 cursor-pointer'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                }`}
            >
              <span>BUKA PART SELANJUTNYA</span>
            </button>

            {/* Unlocked Celebration Overlay */}
            {unlockedSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 z-50 text-center shadow-2xl"
              >
                <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center mb-4 text-emerald-600 shadow-sm animate-bounce">
                  <AppleEmoji emoji="🔓" size={42} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#80001F] mb-2">
                  KOTAK BERHASIL DIBUKA! <AppleEmoji emoji="✦" size={20} />
                </h3>
                <p className="text-[#990024] text-sm font-bold mb-4">
                  Kode Benar: {birthdayConfig.secretCode} ✨
                </p>
                <p className="text-slate-500 text-xs font-medium max-w-xs">
                  Membuka sesuatu yang spesial untuk Mba Alin... ✦
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STAGE: TREASURE UNLOCKED (FRAME 11 PROTOTYPE) */}
        {stage === 'treasure_unlocked' && (
          <motion.div
            key="treasure_unlocked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md text-center py-2"
          >
            <TreasureUnlockedScreen
              onOpenSurprise={() => {
                soundManager.playUnlock();
                onGameComplete();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
