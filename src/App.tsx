import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionId } from './types/birthday';
import { Navbar } from './components/Navbar';
import { GameScene } from './scenes/GameScene';
import { SurpriseScene } from './scenes/SurpriseScene';
import { WishesScene } from './scenes/WishesScene';
import { soundManager } from './utils/soundManager';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SectionId>('game');
  const [unlockedSections, setUnlockedSections] = useState<SectionId[]>(() => {
    try {
      const saved = localStorage.getItem('birthday_quest_unlocked');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.includes('game')) {
          return parsed;
        }
      }
    } catch {}
    return ['game'];
  });

  const handleNavigate = (sec: SectionId) => {
    if (sec !== 'surprise') {
      soundManager.stopMusic();
    }
    setCurrentSection(sec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameComplete = () => {
    setUnlockedSections((prev) => {
      const updated: SectionId[] = prev.includes('surprise') ? prev : [...prev, 'surprise'];
      try {
        localStorage.setItem('birthday_quest_unlocked', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    handleNavigate('surprise');
  };

  const handleSurpriseComplete = () => {
    setUnlockedSections((prev) => {
      const updated: SectionId[] = prev.includes('wishes') ? prev : [...prev, 'wishes'];
      try {
        localStorage.setItem('birthday_quest_unlocked', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    handleNavigate('wishes');
  };

  return (
    <div className="min-h-screen bg-[#1f0207] sm:bg-gradient-to-b sm:from-[#1f0207] sm:via-[#36030e] sm:to-[#170105] text-slate-800 flex flex-col items-center justify-start font-sans selection:bg-[#B81436] selection:text-white relative overflow-x-hidden">
      
      {/* Desktop Background Glow Ambient Orbs */}
      <div className="hidden sm:block fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-[#B81436]/18 rounded-full blur-[150px] pointer-events-none" />
      <div className="hidden sm:block fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#D4AF37]/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Native Mobile App Container (Full bleed on Mobile, iOS Device Container on Desktop) */}
      <div className="w-full max-w-md min-h-[100dvh] bg-gradient-to-b from-[#FFFDFD] via-[#FDF5F7] to-[#FCEEF2] sm:shadow-[0_25px_80px_rgba(35,2,8,0.6)] sm:border-x sm:border-rose-900/20 flex flex-col relative overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar
          currentSection={currentSection}
          unlockedSections={unlockedSections}
          onNavigate={handleNavigate}
        />

        {/* Main Animated Mobile App Content */}
        <main className="flex-1 flex flex-col relative z-10 bg-transparent">
          <AnimatePresence mode="wait">
            {currentSection === 'game' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GameScene
                  onGameComplete={handleGameComplete}
                />
              </motion.div>
            )}

            {currentSection === 'surprise' && (
              <motion.div
                key="surprise"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.3 }}
              >
                <SurpriseScene
                  onNextSection={handleSurpriseComplete}
                />
              </motion.div>
            )}

            {currentSection === 'wishes' && (
              <motion.div
                key="wishes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WishesScene
                  onRestartAll={() => handleNavigate('game')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
