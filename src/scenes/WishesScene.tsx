import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, RotateCcw } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { soundManager } from '../utils/soundManager';
import { triggerConfettiExplosion, triggerConfetti } from '../components/ConfettiEffect';
import { AppleEmoji } from '../components/AppleEmoji';

interface WishesSceneProps {
  onRestartAll: () => void;
}

export const WishesScene: React.FC<WishesSceneProps> = ({ onRestartAll }) => {
  // Pantun States: 'intro' | 'part1' | 'waiting_cakep' | 'part2' | 'finished'
  const [pantunStep, setPantunStep] = useState<'intro' | 'part1' | 'waiting_cakep' | 'part2' | 'finished'>('intro');
  const [activeLineIdx, setActiveLineIdx] = useState(-1);
  const [isListeningMic, setIsListeningMic] = useState(false);

  // Cake States
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  // Confetti Count
  const [confettiBurstCount, setConfettiBurstCount] = useState(0);

  const pantunLines = [
    "Ikan hiu makan pepaya,",
    "Makannya bareng temanku",
    "Mba Alin makin JAYA,",
    "MENYALAAA MBAKUUUU!"
  ];

  const handleStartPantun = () => {
    soundManager.playPop();
    setPantunStep('part1');
    setActiveLineIdx(0);

    // Speak Line 1
    soundManager.speakIndonesian("Ikan hiu makan pepaya,", () => {
      setTimeout(() => {
        setActiveLineIdx(1);
        // Speak Line 2
        soundManager.speakIndonesian("Makannya bareng temanku", () => {
          setTimeout(() => {
            setPantunStep('waiting_cakep');
            startVoiceListener();
          }, 200);
        });
      }, 250);
    });
  };

  const startVoiceListener = () => {
    try {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListeningMic(true);
        recognition.onresult = () => {
          handleSayCakep();
        };
        recognition.onerror = () => {
          setIsListeningMic(false);
        };
        recognition.onend = () => {
          setIsListeningMic(false);
        };
        recognition.start();
      }
    } catch { }
  };

  const handleSayCakep = () => {
    setIsListeningMic(false);
    soundManager.playPop();
    triggerConfetti(0.5);
    setPantunStep('part2');
    setActiveLineIdx(2);

    // Speak Cakep response + Line 3 & 4
    soundManager.speakIndonesian("Mba Alin makin JAYA,", () => {
      setTimeout(() => {
        setActiveLineIdx(3);
        soundManager.speakIndonesian("MENYALAAA MBAKUUUU!", () => {
          setTimeout(() => {
            setPantunStep('finished');
            soundManager.playCrowdCheer();
            triggerConfettiExplosion();
          }, 200);
        });
      }, 250);
    });
  };

  const handleToggleCandle = () => {
    soundManager.playBlowCandle();
    const nextState = !candlesLit;
    setCandlesLit(nextState);
    if (candlesLit) {
      setWishMade(true);
      setTimeout(() => {
        soundManager.playCrowdCheer();
        triggerConfettiExplosion();
      }, 250);
    } else {
      soundManager.playPop();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] mt-14 mb-16 flex flex-col items-center justify-center p-3 sm:p-6">

      {/* 1. PANTUN STAGE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center py-4 mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-3 border border-rose-900/15 shadow-2xs">
          <AppleEmoji emoji="🎤" size={14} />
          <span>PANTUN SPESIAL</span>
        </span>

        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] tracking-tight mb-2 flex items-center justify-center gap-2 flex-wrap">
          <span>PANTUN SPESIAL UNTUK MBA ALIN</span>
        </h2>

        <p className="text-slate-600 text-xs sm:text-sm max-w-xs mx-auto mb-6 font-medium">
          Sebelum selesai, ada persembahan pantun hangat dari kami bertiga untuk Mba Alin.
        </p>

        {pantunStep === 'intro' && (
          <button
            onClick={handleStartPantun}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Mic className="w-4 h-4 animate-bounce" />
            <span>DENGARKAN PANTUN</span>
          </button>
        )}

        {/* Pantun Line Reveal Container */}
        {pantunStep !== 'intro' && (
          <div className="my-4 min-h-[140px] flex flex-col items-center justify-center bg-white/95 border border-rose-900/15 rounded-3xl p-6 shadow-sm">
            <div className="space-y-3 max-w-xs text-center">
              {pantunLines.map((line, idx) => {
                const isVisible = idx <= activeLineIdx;
                const isCurrent = idx === activeLineIdx;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`text-sm sm:text-base font-serif transition-all flex items-center justify-center gap-1.5 ${idx >= 2
                        ? 'text-[#990024] font-black text-base sm:text-lg tracking-wide'
                        : isCurrent
                          ? 'text-[#8B102B] font-bold italic'
                          : 'text-slate-700 opacity-80 font-normal'
                      }`}
                  >
                    <span>"{line}"</span>
                    {idx === 3 && <AppleEmoji emoji="🔥" size={18} />}
                  </motion.div>
                );
              })}
            </div>

            {/* WAITING FOR CAKEP INTERACTIVE PROMPT */}
            {pantunStep === 'waiting_cakep' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-5 pt-4 border-t border-rose-100 w-full text-center space-y-3"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase border border-amber-300">
                  <AppleEmoji emoji="📣" size={13} />
                  <span>GILIRAN MBA ALIN</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-1 flex-wrap">
                  <span>Silakan klik tombol atau katakan</span>
                  <span className="text-[#990024] font-black underline">CAKEP</span>
                  <span>untuk melanjutkan pantun:</span>
                </p>

                <button
                  onClick={handleSayCakep}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#990024] text-white font-black text-sm shadow-md shadow-rose-900/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                >
                  <AppleEmoji emoji="📣" size={18} />
                  <span>BILANG CAKEP!</span>
                  <AppleEmoji emoji="🔥" size={18} />
                </button>

                {isListeningMic && (
                  <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <AppleEmoji emoji="🎙️" size={13} />
                    <span>Bisa langsung mengucapkan "Cakep"</span>
                  </p>
                )}
              </motion.div>
            )}

            {/* SUBTLE REPEAT PANTUN BUTTON */}
            {pantunStep === 'finished' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleStartPantun}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#8B102B] font-semibold py-1 px-3 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ulangi Pantun</span>
              </motion.button>
            )}
          </div>
        )}
      </motion.div>

      {/* 2. INTERACTIVE BIRTHDAY CAKE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-white/95 border-2 border-rose-900/20 rounded-3xl p-5 sm:p-7 text-center shadow-xl mb-8 relative overflow-hidden"
      >
        {/* Decorative corner sparkles */}
        <div className="absolute -top-3 -right-3 w-14 h-14 bg-amber-100 rounded-full blur-xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-rose-100 rounded-full blur-xl opacity-70 pointer-events-none" />

        <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] mb-2 tracking-tight">
          HOREEE, TIUP LILINNYA!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto mb-4 leading-relaxed">
          Lilin virtual dulu yaa ehehe... Silakan klik tombol di bawah ini untuk meniup lilinnya ✨
        </p>

        {/* CLEAN, ELEGANT & BEAUTIFULLY PROPORTIONED BIRTHDAY CAKE */}
        <div className="my-4 py-2 flex flex-col items-center justify-center relative select-none">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleToggleCandle}
            className="cursor-pointer relative flex flex-col items-center"
            title="Ketuk kue untuk tiup atau nyalakan lilin!"
          >
            {/* 3 CANDLES EMBEDDED IN CAKE - ALL GLOWING BRIGHTLY */}
            <div className="flex justify-center gap-9 mb-[-1px] z-20">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  {candlesLit ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.18, 0.96, 1.15, 1],
                        rotate: [0, -3, 3, -2, 0],
                        y: [0, -2, 1, -1, 0],
                      }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.12 }}
                      className="mb-[-2px] drop-shadow-[0_0_12px_rgba(255,165,0,0.95)] filter brightness-110"
                    >
                      <AppleEmoji emoji="🔥" size={28} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 0], opacity: [1, 0.7, 0], y: -12 }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: idx * 0.2 }}
                      className="mb-[-2px]"
                    >
                      <AppleEmoji emoji="💨" size={18} />
                    </motion.div>
                  )}
                  {/* Candle Wick */}
                  <div className="w-[1.5px] h-1.5 bg-slate-700" />
                  {/* Golden Striped Candle Stick */}
                  <div className="w-3.5 h-9 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 rounded-t-sm shadow-sm border border-amber-500/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.45)_3px,rgba(255,255,255,0.45)_6px)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* FRESH FRUIT TOPPINGS (STRAWBERRIES & CHERRY) */}
            <div className="flex items-center justify-center gap-4 mb-[-8px] z-15">
              <AppleEmoji emoji="🍓" size={20} />
              <AppleEmoji emoji="🍒" size={18} />
              <AppleEmoji emoji="🍓" size={20} />
            </div>

            {/* TOP TIER: STRAWBERRY SHORTCAKE WITH CREAM ICING */}
            <div className="w-44 h-14 bg-gradient-to-b from-rose-100 via-rose-150 to-rose-200 rounded-t-2xl border-2 border-rose-300/80 shadow-sm relative flex flex-col items-center justify-start overflow-hidden z-10">
              {/* White Glaze Frosting Top Drip */}
              <div className="w-full h-3 bg-white/95 rounded-b-xl flex justify-around items-center px-2 shadow-2xs">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className="w-2 h-2.5 rounded-full bg-white shadow-2xs" />
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              </div>
            </div>

            {/* BOTTOM TIER: RICH VELVET MAROON SPONGE */}
            <div className="w-60 h-16 bg-gradient-to-b from-[#8B102B] via-[#780E24] to-[#5C0B1C] rounded-2xl border-2 border-amber-300/60 shadow-lg relative flex flex-col items-center justify-start px-3 z-10 -mt-1 overflow-hidden">
              {/* Vanilla Cream Layer Divider */}
              <div className="w-full h-3 bg-rose-50/95 rounded-b-xl flex justify-between items-center px-2 shadow-2xs">
                {[...Array(11)].map((_, i) => (
                  <span key={i} className="w-1.5 h-2 rounded-b-full bg-rose-50 shadow-2xs" />
                ))}
              </div>
              
              {/* Elegant Gold Accent Dots */}
              <div className="flex items-center justify-center gap-3.5 mt-3">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-amber-300/90 shadow-xs" />
                ))}
              </div>
            </div>

            {/* LUXURY GOLDEN CAKE PLATTER STAND */}
            <div className="w-68 h-4 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 rounded-full border border-amber-400/80 shadow-md -mt-1.5 z-0" />
          </motion.div>
        </div>

        {/* BLOW / RELIGHT ACTION BUTTON (RESPECTFUL & JOYFUL) */}
        <button
          onClick={handleToggleCandle}
          className={`w-full py-4 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mx-auto mt-2 cursor-pointer ${candlesLit
              ? 'bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white shadow-rose-900/30 hover:scale-[1.02] active:scale-95'
              : 'bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white shadow-amber-900/25 hover:scale-[1.02] active:scale-95'
            }`}
        >
          {candlesLit ? (
            <>
              <AppleEmoji emoji="🎂" size={17} />
              <span>Tiup Lilin Ulang Tahun</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nyalakan Lilin Kembali</span>
            </>
          )}
        </button>

        {/* MEANINGFUL & CLEAN ISLAMIC BLESSING REVEAL */}
        {wishMade && !candlesLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mt-5 p-5 rounded-3xl bg-emerald-50/90 border border-emerald-300 text-slate-800 shadow-md text-left space-y-3"
          >
            <div className="border-b border-emerald-200/70 pb-2.5">
              <h4 className="font-serif font-bold text-base text-emerald-950">
                Aamiin Ya Rabbal 'Alamin
              </h4>
              <p className="text-[11px] text-emerald-800 font-medium tracking-wide">
                Semoga setiap doa baik Mba Alin senantiasa diijabah Allah SWT
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Bismillah... Semoga Allah SWT senantiasa melimpahkan keberkahan usia, kesehatan, kemudahan dan kelancaran dalam setiap urusan serta karier, rezeki yang berkah, dan kebahagiaan dunia akhirat untuk Mba Alin sekeluarga.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Subtle Restart Adventure Link */}
      <button
        onClick={() => {
          soundManager.playPop();
          onRestartAll();
        }}
        className="mt-2 mb-6 px-5 py-2.5 rounded-full bg-white/80 border border-rose-200 text-slate-500 hover:text-[#8B102B] font-semibold text-xs hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Ulangi Dari Awal </span>
      </button>
    </div>
  );
};
