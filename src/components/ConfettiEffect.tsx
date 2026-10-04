import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundManager';

export const triggerConfetti = (originY = 0.6) => {
  soundManager.playConfettiPop();
  
  // Elegant Maroon, Champagne Gold, and Pearl White burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: originY },
    colors: ['#720D23', '#8B102B', '#D4AF37', '#F3C766', '#FFFFFF', '#FBE4E8']
  });
};

export const triggerConfettiExplosion = () => {
  soundManager.playWin();
  
  const count = 180;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#720D23', '#8B102B', '#D4AF37', '#F3C766', '#FFFFFF', '#A31538']
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerFlowerPetals = () => {
  soundManager.playConfettiPop();
  
  confetti({
    particleCount: 70,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#8B102B', '#720D23', '#D4AF37', '#FBE4E8', '#FFFFFF'],
    shapes: ['circle'],
    scalar: 1.2
  });
};
