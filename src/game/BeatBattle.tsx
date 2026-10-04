import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, FastForward, HelpCircle, Music, Star } from 'lucide-react';
import { DANCING_QUEEN_CHART, SONG_DURATION_SECONDS, RhythmNoteData } from './rhythmChart';
import { evaluateHit, HitResult, discoBeatSynth } from './BeatBattleEngine';
import { soundManager } from '../utils/soundManager';
import { triggerConfetti, triggerConfettiExplosion } from '../components/ConfettiEffect';
import { AppleEmoji } from '../components/AppleEmoji';

interface BeatBattleProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const BeatBattle: React.FC<BeatBattleProps> = ({ onComplete, onSkip }) => {
  // Game Flow States: 'tutorial' | 'playing' | 'paused' | 'results'
  const [gameState, setGameState] = useState<'tutorial' | 'playing' | 'paused' | 'results'>('tutorial');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Rhythm Timeline
  const [currentTime, setCurrentTime] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Notes state
  const [notes, setNotes] = useState<RhythmNoteData[]>(() =>
    DANCING_QUEEN_CHART.map((n) => ({ ...n, hit: false, missed: false }))
  );

  // Scoring HUD State
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [lastHitFeedback, setLastHitFeedback] = useState<HitResult | null>(null);
  const [activeLaneRipple, setActiveLaneRipple] = useState<number | null>(null);

  // Lanes Configuration (4 Lanes)
  const lanes = [
    { id: 0, color: 'from-pink-400 to-rose-500', targetBg: 'bg-pink-100 border-pink-400 text-rose-600', key: 'D', emoji: '🌸' },
    { id: 1, color: 'from-sky-400 to-blue-500', targetBg: 'bg-sky-100 border-sky-400 text-blue-600', key: 'F', emoji: '💎' },
    { id: 2, color: 'from-amber-300 to-yellow-500', targetBg: 'bg-amber-100 border-amber-400 text-amber-600', key: 'J', emoji: '⭐' },
    { id: 3, color: 'from-purple-400 to-indigo-500', targetBg: 'bg-purple-100 border-purple-400 text-purple-600', key: 'K', emoji: '🔮' },
  ];

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/dancing-queen.mp3');
    audioRef.current.volume = 0.8;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Sync animation loop
  const updateLoop = () => {
    if (!startTimeRef.current) return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    setCurrentTime(elapsed);

    // Auto-synth disco hi-hat beat if MP3 fails
    if (Math.floor(elapsed * 4) % 2 === 0) {
      discoBeatSynth.playHiHat();
    }

    // Check missed notes
    setNotes((prevNotes) =>
      prevNotes.map((n) => {
        if (!n.hit && !n.missed && elapsed > n.time + 0.35) {
          setCombo(0);
          setLastHitFeedback({ judgment: 'MISS', scoreDelta: 0, label: 'MISS', color: 'text-slate-400' });
          return { ...n, missed: true };
        }
        return n;
      })
    );

    // Song Finish Check
    if (elapsed >= SONG_DURATION_SECONDS) {
      handleFinishGame();
      return;
    }

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  // Start Gameplay
  const handleStartGame = () => {
    soundManager.playPop();
    setGameState('playing');
    setNotes(DANCING_QUEEN_CHART.map((n) => ({ ...n, hit: false, missed: false })));
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalHits(0);
    setPerfectHits(0);
    setLastHitFeedback(null);

    const now = performance.now();
    startTimeRef.current = now;
    pausedTimeRef.current = 0;

    if (audioRef.current && !soundManager.getMuted()) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  // Target Hit Handler
  const handleHitTarget = (laneId: number) => {
    if (gameState !== 'playing') return;

    soundManager.playPop();
    setActiveLaneRipple(laneId);
    setTimeout(() => setActiveLaneRipple(null), 150);

    // Find nearest unhit note in this lane
    const availableNote = notes.find((n) => n.lane === laneId && !n.hit && !n.missed);

    if (availableNote) {
      const timeDiff = currentTime - availableNote.time;
      const result = evaluateHit(timeDiff);

      if (result.judgment !== 'MISS') {
        // Mark note hit
        setNotes((prev) => prev.map((n) => (n.id === availableNote.id ? { ...n, hit: true } : n)));
        
        // Update Stats
        const newScore = score + result.scoreDelta + combo * 10;
        const newCombo = combo + 1;
        setScore(newScore);
        setCombo(newCombo);
        setMaxCombo(Math.max(maxCombo, newCombo));
        setTotalHits((prev) => prev + 1);
        if (result.judgment === 'PERFECT') setPerfectHits((prev) => prev + 1);
        setLastHitFeedback(result);

        discoBeatSynth.playDiscoKick();
      } else {
        setCombo(0);
        setLastHitFeedback(result);
      }
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const key = e.key.toUpperCase();
      if (key === 'D' || key === '1') handleHitTarget(0);
      if (key === 'F' || key === '2') handleHitTarget(1);
      if (key === 'J' || key === '3') handleHitTarget(2);
      if (key === 'K' || key === '4') handleHitTarget(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentTime, notes, combo]);

  // Pause / Resume
  const handleTogglePause = () => {
    soundManager.playPop();
    if (gameState === 'playing') {
      setGameState('paused');
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) audioRef.current.pause();
    } else if (gameState === 'paused') {
      setGameState('playing');
      const now = performance.now();
      startTimeRef.current = now - currentTime * 1000;
      if (audioRef.current && !soundManager.getMuted()) audioRef.current.play().catch(() => {});
      animFrameRef.current = requestAnimationFrame(updateLoop);
    }
  };

  // Finish Game
  const handleFinishGame = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioRef.current) audioRef.current.pause();
    setGameState('results');
    soundManager.playUnlock();
    triggerConfettiExplosion();
  };

  const accuracyPercent = totalHits > 0 ? Math.round((perfectHits / totalHits) * 100) : 100;

  return (
    <div className="relative w-full max-w-4xl mx-auto glass-card rounded-3xl p-4 sm:p-6 shadow-sm border border-rose-900/15 my-6 overflow-hidden">
      
      {/* 1. TUTORIAL / INTRO MODAL */}
      {gameState === 'tutorial' && (
        <div className="text-center py-6 px-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-4 border border-rose-900/15 shadow-2xs">
            <Music className="w-4 h-4 text-[#8B102B]" />
            Arcade Rhythm Game
          </div>

          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] tracking-tight mb-3 flex items-center justify-center gap-2 flex-wrap">
            <span>BEAT BATTLE — DANCING QUEEN</span>
            <AppleEmoji emoji="🎵" size={26} />
          </h3>

          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mb-6 font-medium leading-relaxed">
            Let's enjoy a little disco moment, Mba Alin! Tap the colorful notes as they reach the target circles below and collect points along the way! <AppleEmoji emoji="✨" size={16} />
          </p>

          {/* How to Play Box */}
          {showHowToPlay && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50/60 border border-rose-900/10 rounded-2xl p-4 mb-6 text-left text-xs sm:text-sm text-slate-700 font-medium space-y-2 shadow-2xs"
            >
              <p className="flex items-center gap-2 font-bold text-[#8B102B]">📖 CARA BERMAIN:</p>
              <p className="flex items-center gap-1.5"><AppleEmoji emoji="1️⃣" size={15} /> Tekan tombol Start untuk memulai musik Dancing Queen.</p>
              <p className="flex items-center gap-1.5"><AppleEmoji emoji="2️⃣" size={15} /> Perhatikan lingkaran warna yang meluncur dari atas ke bawah.</p>
              <p className="flex items-center gap-1.5"><AppleEmoji emoji="3️⃣" size={15} /> Tap/Klik lingkar sasaran tepat saat lingkaran musik tiba di garis target!</p>
              <p className="flex items-center gap-1.5"><AppleEmoji emoji="4️⃣" size={15} /> Desktop: Gunakan mouse atau tombol keyboard [D], [F], [J], [K].</p>
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>MULAI BEAT BATTLE!</span>
              <AppleEmoji emoji="🎶" size={16} />
            </button>

            <button
              onClick={() => setShowHowToPlay(!showHowToPlay)}
              className="px-5 py-3.5 rounded-full bg-white border border-rose-900/15 text-[#720D23] font-bold text-xs hover:bg-rose-50 flex items-center gap-1.5 shadow-2xs"
            >
              <HelpCircle className="w-4 h-4 text-[#8B102B]" />
              <span>CARA BERMAIN</span>
            </button>

            {onSkip && (
              <button
                onClick={() => {
                  soundManager.playPop();
                  onSkip();
                }}
                className="px-5 py-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 font-semibold text-xs hover:text-slate-800 flex items-center gap-1.5"
              >
                <FastForward className="w-4 h-4" />
                <span>SKIP GAME</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. PLAYING / PAUSED GAMEPLAY */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="relative flex flex-col items-center">
          
          {/* Top HUD */}
          <div className="w-full bg-white/90 border border-pink-100 rounded-2xl p-3 sm:p-4 mb-4 flex items-center justify-between shadow-sm flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-rose-500" />
                <span className="font-black text-xs sm:text-sm text-slate-800">Dancing Queen — ABBA</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold">Arcade Rhythm Mode</p>
            </div>

            {/* Score & Combo */}
            <div className="flex items-center gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">SCORE</span>
                <p className="text-lg font-black text-rose-600">{score}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">COMBO</span>
                <p className="text-lg font-black text-amber-500">{combo}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">ACCURACY</span>
                <p className="text-lg font-black text-sky-600">{accuracyPercent}%</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePause}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-pink-100 text-xs font-black"
              >
                {gameState === 'paused' ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-200"
              style={{ width: `${Math.min(100, (currentTime / SONG_DURATION_SECONDS) * 100)}%` }}
            />
          </div>

          {/* Hit Feedback Popup */}
          {lastHitFeedback && (
            <div className="absolute top-24 z-30 pointer-events-none animate-bounce-soft">
              <span className={`text-xl sm:text-2xl font-black ${lastHitFeedback.color} drop-shadow-md`}>
                {lastHitFeedback.label}
              </span>
            </div>
          )}

          {/* 4-LANE PERSPECTIVE PLAYFIELD */}
          <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 shadow-2xl p-2">
            
            {/* Lane Dividers */}
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none divide-x divide-slate-800/80">
              {lanes.map((l) => (
                <div
                  key={l.id}
                  className={`h-full transition-opacity duration-150 ${
                    activeLaneRipple === l.id ? 'bg-white/10' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Descending Notes */}
            <div className="absolute inset-0 pointer-events-none">
              {notes.map((note) => {
                if (note.hit || note.missed) return null;

                // Calculate vertical position (0% top -> 82% target line)
                const noteTimeAhead = note.time - currentTime;
                // Note reaches hit zone when noteTimeAhead = 0
                const progress = 1 - noteTimeAhead / 2.2; // 2.2s approach time

                if (progress < 0 || progress > 1.1) return null;

                const topPercent = progress * 82;

                return (
                  <div
                    key={note.id}
                    style={{
                      top: `${topPercent}%`,
                      left: `${note.lane * 25 + 12.5}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform"
                  >
                    <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr ${lanes[note.lane].color} p-0.5 shadow-lg shadow-pink-500/30 flex items-center justify-center animate-pulse`}>
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                        <AppleEmoji emoji={lanes[note.lane].emoji} size={22} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target Hit Circles Line (Bottom) */}
            <div className="absolute bottom-4 inset-x-0 grid grid-cols-4 gap-2 px-2 z-20">
              {lanes.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleHitTarget(l.id)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleHitTarget(l.id);
                  }}
                  className={`aspect-square rounded-2xl border-2 font-black flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90 ${l.targetBg}`}
                >
                  <AppleEmoji emoji={l.emoji} size={26} />
                  <span className="text-[10px] font-mono opacity-70 hidden sm:inline">[{l.key}]</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center z-40">
              <h3 className="text-2xl font-black text-white mb-4">GAME PAUSED</h3>
              <button
                onClick={handleTogglePause}
                className="px-8 py-3 rounded-2xl bg-rose-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-transform"
              >
                RESUME GAME 🚀
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. RESULTS SCREEN */}
      {gameState === 'results' && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6 px-2"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider mb-2 border border-amber-300">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Rhythm Star Achievement
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            WHAT A LOVELY PERFORMANCE! <AppleEmoji emoji="🎉" size={28} />
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-md mx-auto mb-6">
            That was such a fun disco moment, Mba Alin! You've completed the Beat Battle rhythm challenge!
          </p>

          {/* Score Stats Grid */}
          <div className="bg-gradient-to-r from-pink-50 via-white to-sky-50 border border-pink-200 rounded-2xl p-5 mb-4 max-w-md mx-auto grid grid-cols-3 gap-3 text-center shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase">FINAL SCORE</span>
              <p className="text-xl sm:text-2xl font-black text-rose-600">{score}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase">ACCURACY</span>
              <p className="text-xl sm:text-2xl font-black text-sky-600">{accuracyPercent}%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase">MAX COMBO</span>
              <p className="text-xl sm:text-2xl font-black text-amber-500">{maxCombo}</p>
            </div>
          </div>

          {/* Secret Code Card Reveal */}
          <div className="bg-white border border-rose-900/20 rounded-2xl p-4 mb-6 max-w-md mx-auto text-center shadow-md animate-bounce-soft">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#8B102B] font-bold text-[11px] uppercase mb-1.5 border border-rose-900/15 shadow-2xs">
              <AppleEmoji emoji="🔑" size={14} />
              <span>KODE RAHASIA TERBUKA!</span>
              <AppleEmoji emoji="✨" size={14} />
            </div>
            <p className="text-xs text-slate-700 font-medium mb-2">
              Selamat Mba Alin! Anda berhasil membuka Kode Rahasia:
            </p>
            <div className="text-3xl font-mono font-bold text-[#8B102B] tracking-widest bg-rose-50 rounded-xl py-2 px-6 inline-block border border-rose-900/20 shadow-inner">
              2 5 9
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAIN LAGI</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                onComplete();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>LANJUT KE SURPRISE</span>
              <AppleEmoji emoji="💐" size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
