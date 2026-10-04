import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { SectionId } from '../types/birthday';
import { AppleEmoji } from './AppleEmoji';

interface NavbarProps {
  currentSection: SectionId;
  unlockedSections: SectionId[];
  onNavigate: (section: SectionId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentSection, unlockedSections, onNavigate }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playPop();
  };

  const tabs: { id: SectionId; title: string; icon: string }[] = [
    { id: 'game', title: 'CLUE HUNT', icon: '🎮' },
    { id: 'surprise', title: 'SECRET QUEST', icon: '🔎' },
    { id: 'wishes', title: 'FINAL REVEAL', icon: '✨' },
  ];

  const handleTabClick = (tabId: SectionId) => {
    const isUnlocked = unlockedSections.includes(tabId);
    if (!isUnlocked) {
      soundManager.playPop();
      setLockedToast('Selesaikan misi sebelumnya terlebih dahulu yaa! 🔒');
      setTimeout(() => setLockedToast(null), 2200);
      return;
    }
    soundManager.playPop();
    onNavigate(tabId);
  };

  return (
    <>
      {/* Floating Glass App Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-rose-900/10 px-4 pt-[max(0.625rem,env(safe-area-inset-top))] pb-2.5 shadow-[0_4px_20px_rgba(114,13,35,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* Protagonist Quest App Branding */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              soundManager.playPop();
              onNavigate('game');
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#990024] via-[#B81436] to-[#D4AF37] p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <AppleEmoji emoji="👑" size={17} />
              </div>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xs text-[#80001F] tracking-wide leading-none">
                Mba Alin's Birthday Quest ✦
              </h1>
              <p className="text-[9px] text-[#B81436]/90 font-medium tracking-wider mt-0.5">
                A Little Adventure
              </p>
            </div>
          </div>

          {/* Prototype Progress Dots */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full transition-all ${
              currentSection === 'game'
                ? 'bg-[#B81436] shadow-[0_0_6px_rgba(184,20,54,0.6)] scale-110'
                : unlockedSections.includes('game') ? 'bg-rose-300' : 'bg-rose-100'
            }`} />
            <span className={`w-2 h-2 rounded-full transition-all ${
              currentSection === 'surprise'
                ? 'bg-[#B81436] shadow-[0_0_6px_rgba(184,20,54,0.6)] scale-110'
                : unlockedSections.includes('surprise') ? 'bg-rose-300' : 'bg-rose-100'
            }`} />
            <span className={`w-2 h-2 rounded-full transition-all ${
              currentSection === 'wishes'
                ? 'bg-[#B81436] shadow-[0_0_6px_rgba(184,20,54,0.6)] scale-110'
                : unlockedSections.includes('wishes') ? 'bg-rose-300' : 'bg-rose-100'
            }`} />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isMuted
                ? 'bg-white/70 border-slate-200 text-slate-400'
                : 'bg-rose-50 border-rose-900/20 text-[#B81436] shadow-xs scale-105'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse text-[#B81436]" />}
          </button>
        </div>
      </header>

      {/* Floating Locked Notice Toast */}
      {lockedToast && (
        <div className="fixed top-16 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-white/20 animate-bounce">
            {lockedToast}
          </div>
        </div>
      )}

      {/* Bottom Mission Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-xl border-t border-rose-900/10 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 shadow-[0_-4px_25px_rgba(153,0,36,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentSection === tab.id;
            const isUnlocked = unlockedSections.includes(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? 'text-[#990024] font-bold scale-105'
                    : isUnlocked
                    ? 'text-slate-500 font-semibold hover:text-[#B81436]'
                    : 'text-slate-300 font-medium opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`p-1.5 rounded-2xl transition-all relative ${
                  isActive
                    ? 'bg-rose-50 border border-rose-900/15 shadow-2xs'
                    : isUnlocked
                    ? 'bg-transparent'
                    : 'bg-slate-100/60'
                }`}>
                  <AppleEmoji emoji={isUnlocked ? tab.icon : '🔒'} size={18} />
                </div>
                <span className="text-[10px] tracking-wider uppercase font-bold flex items-center gap-1">
                  <span>{tab.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

