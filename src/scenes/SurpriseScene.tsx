import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Flower2, Music, Volume2, VolumeX } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { PhotoPlaceholder } from '../components/PhotoPlaceholder';
import { soundManager } from '../utils/soundManager';
import { triggerConfetti, triggerFlowerPetals, triggerConfettiExplosion } from '../components/ConfettiEffect';
import { AppleEmoji, AppleEmojiText } from '../components/AppleEmoji';

interface SurpriseSceneProps {
  onNextSection: () => void;
}

export const SurpriseScene: React.FC<SurpriseSceneProps> = ({ onNextSection }) => {
  const [revealStep, setRevealStep] = useState<'gift' | 'countdown' | 'revealed'>('gift');
  const [count, setCount] = useState(3);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    // If the step is already revealed, play the Jamrud birthday song
    if (revealStep === 'revealed') {
      soundManager.playJamrudSong();
      triggerConfettiExplosion();
      const interval = setInterval(() => {
        triggerConfetti(0.4);
      }, 4500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [revealStep]);

  useEffect(() => {
    return () => {
      soundManager.stopMusic();
    };
  }, []);

  const handleStartCountdown = () => {
    soundManager.playPop();
    setRevealStep('countdown');

    let current = 3;
    const timer = setInterval(() => {
      current--;
      soundManager.playPop();
      if (current > 0) {
        setCount(current);
      } else {
        clearInterval(timer);
        setRevealStep('revealed');
        soundManager.playJamrudSong();
        soundManager.playUnlock();
        triggerConfetti(0.8);
        triggerFlowerPetals();
        triggerConfettiExplosion();
      }
    }, 900);
  };

  const toggleMusic = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] mt-14 mb-16 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
      
      <AnimatePresence mode="wait">
        {/* STEP 1: GIFT UNBOXING TRIGGER */}
        {revealStep === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="w-full max-w-md text-center py-6 px-2"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-6 border border-rose-900/15 shadow-2xs">
              <Flower2 className="w-4 h-4 text-[#8B102B]" />
              The Big Reveal 
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] mb-3 tracking-tight flex items-center justify-center gap-2 flex-wrap">
              <span>ADA SESUATU UNTUK MBA ALIN NICHH UHUY!</span>
              <AppleEmoji emoji="💐" size={28} />
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mb-8 font-medium">
              Eheyyy, coba klik gift box di bawah ini buat buka rahasia terakhirnya~ 
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCountdown}
              className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#720D23] via-[#8B102B] to-[#D4AF37] p-1 shadow-xl shadow-rose-900/25 mx-auto flex items-center justify-center cursor-pointer group"
            >
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                <Gift className="w-14 h-14 text-[#8B102B] group-hover:rotate-12 transition-transform" />
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: COUNTDOWN 3... 2... 1... */}
        {revealStep === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-center py-20"
          >
            <span className="font-serif text-8xl sm:text-9xl font-bold text-gradient-maroon">
              {count}
            </span>
            <p className="text-xs font-bold text-[#8B102B] mt-4 tracking-wider uppercase animate-pulse flex items-center justify-center gap-1.5">
              <span>Siap-siap yaa... Cieee dikit lagii</span>
              <AppleEmoji emoji="👀" size={16} />
              <AppleEmoji emoji="✨" size={16} />
            </p>
          </motion.div>
        )}

        {/* STEP 3: PHOTO REVEAL & GREETING */}
        {revealStep === 'revealed' && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md flex flex-col items-center py-2 relative"
          >
            {/* JEDAG-JEDUG AMBIENT PARTY DISCO LIGHT BEAMS */}
            <div className="pointer-events-none absolute inset-0 -top-10 flex items-center justify-center overflow-hidden z-0">
              <motion.div
                animate={{
                  scale: [1, 1.35, 1, 1.25, 1],
                  opacity: [0.2, 0.55, 0.2, 0.45, 0.2],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-rose-500/25 via-amber-400/20 to-fuchsia-500/25 blur-3xl"
              />
            </div>

            {/* FLOATING CELEBRATION BALLOONS & SPARKS */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-20">
              <motion.div
                initial={{ y: '100vh', opacity: 0, x: '5vw' }}
                animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: ['5vw', '10vw', '2vw'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute text-4xl"
              >
                🎈
              </motion.div>
              <motion.div
                initial={{ y: '100vh', opacity: 0, x: '80vw' }}
                animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: ['80vw', '75vw', '85vw'] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 2 }}
                className="absolute text-4xl"
              >
                🎈
              </motion.div>
              <motion.div
                initial={{ y: '100vh', opacity: 0, x: '25vw' }}
                animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: ['25vw', '30vw', '20vw'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 5 }}
                className="absolute text-3xl"
              >
                🎉
              </motion.div>
              <motion.div
                initial={{ y: '100vh', opacity: 0, x: '70vw' }}
                animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: ['70vw', '65vw', '72vw'] }}
                transition={{ duration: 13, repeat: Infinity, ease: 'linear', delay: 7 }}
                className="absolute text-3xl"
              >
                ✨
              </motion.div>
            </div>

            {/* Now Playing Floating Music Badge with Animated Sound Equalizer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#8B102B] via-[#B81436] to-[#D4AF37] text-white text-xs font-bold shadow-md shadow-rose-900/25 relative z-10"
            >
              {/* Animated Equalizer Waves */}
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                {[0.4, 0.7, 0.3, 0.9, 0.6].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ height: ['3px', '14px', '5px', '12px', '3px'] }}
                    transition={{ duration: 0.75, repeat: Infinity, delay: delay * 0.3, ease: 'easeInOut' }}
                    className="w-1 bg-amber-200 rounded-full"
                  />
                ))}
              </div>

              <span className="text-[11px] tracking-wide font-bold">Jamrud - Selamat Ulang Tahun</span>

              <button
                type="button"
                onClick={toggleMusic}
                className="ml-1 p-1 rounded-full bg-white/20 hover:bg-white/35 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Lagu' : 'Mute Lagu'}
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-rose-200" /> : <Volume2 className="w-3 h-3 text-white" />}
              </button>
            </motion.div>

            {/* Header Ribbon with Beat Bounce */}
            <motion.div
              animate={{
                scale: [1, 1.025, 0.99, 1.02, 1],
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-center mb-5 relative z-10"
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] text-xs font-bold uppercase tracking-wider mb-2.5 border border-rose-900/15 shadow-2xs">
                <span>HAPPY BIRTHDAY, MBA ALIN!</span>
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#5C0B1C] tracking-tight mb-1 flex items-center justify-center gap-2">
                <span>HIP HIP HOORAY!</span>
                <AppleEmoji emoji="🎉" size={32} />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                A little birthday cheer, just for you! ♡
              </p>
            </motion.div>

            {/* Main Photo Frame / Gallery with JEDAG-JEDUG BEAT BOUNCE */}
            <motion.div
              animate={{
                scale: [1, 1.032, 0.985, 1.028, 1],
                boxShadow: [
                  '0 10px 30px -5px rgba(139, 16, 43, 0.25), 0 0 15px rgba(212, 175, 55, 0.2)',
                  '0 20px 45px -5px rgba(184, 20, 54, 0.45), 0 0 30px rgba(212, 175, 55, 0.5)',
                  '0 8px 25px -5px rgba(139, 16, 43, 0.2), 0 0 10px rgba(212, 175, 55, 0.15)',
                  '0 18px 40px -5px rgba(184, 20, 54, 0.4), 0 0 25px rgba(212, 175, 55, 0.45)',
                  '0 10px 30px -5px rgba(139, 16, 43, 0.25), 0 0 15px rgba(212, 175, 55, 0.2)',
                ],
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full bg-white border-2 border-rose-900/20 rounded-3xl p-3 sm:p-4 mb-5 relative overflow-hidden z-10"
            >
              {/* Photo Sparkle Corner Badges */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none animate-spin-slow">
                <AppleEmoji emoji="✨" size={20} />
              </div>
              <div className="absolute bottom-4 left-4 z-20 pointer-events-none animate-bounce-soft">
                <AppleEmoji emoji="💖" size={18} />
              </div>

              <PhotoPlaceholder
                src={birthdayConfig.flowerSurpriseImage}
                alt={`Mba Alin's Birthday Celebration`}
                className="w-full max-h-[460px] rounded-2xl overflow-hidden shadow-sm"
              />
            </motion.div>

            {/* “One more thing…” Lead-in Divider */}
            <div className="mb-5 flex items-center justify-center gap-2 relative z-10">
              <span className="h-[1px] w-8 bg-rose-200" />
              <span className="font-serif italic font-semibold text-sm sm:text-base text-[#8B102B] px-3 py-1 bg-white/80 rounded-full border border-rose-200 shadow-2xs flex items-center gap-1.5">
                <span>“One more thing…”</span>
                <AppleEmoji emoji="👀" size={18} />
              </span>
              <span className="h-[1px] w-8 bg-rose-200" />
            </div>

            {/* Caption & Personal Note */}
            <div className="w-full bg-white/95 border border-rose-900/15 rounded-3xl p-5 sm:p-7 text-center shadow-md mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-4 border border-rose-900/15">
                <span>A LITTLE NOTE FOR YOU</span>
          
              </span>

              <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-6 font-medium text-left">
                <AppleEmojiText text={birthdayConfig.copy.surpriseMessage} emojiSize={17} />
              </div>

              {/* Signature */}
              <div className="pt-4 border-t border-rose-100 text-xs sm:text-sm font-bold text-center">
                <span className="font-serif italic text-slate-500 font-normal block mb-1">With love,</span>
                <p className="text-[#8B102B] font-serif font-bold text-base">
                  Sabil, Calista, Joy
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                onNextSection();
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#990024] via-[#B81436] to-[#80001F] text-white font-extrabold text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>LANJUT KE PANTUN SPESIAL</span>
              <AppleEmoji emoji="🎤" size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
