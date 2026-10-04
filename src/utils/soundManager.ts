class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgAudio: HTMLAudioElement | null = null;

  constructor() {
    const saved = localStorage.getItem('mba_alin_birthday_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('mba_alin_birthday_muted', String(this.isMuted));
    if (this.isMuted) {
      if (this.bgAudio) {
        this.bgAudio.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (this.bgAudio) {
        this.bgAudio.play().catch(() => {});
      }
    }
    return this.isMuted;
  }

  public playJamrudSong() {
    this.stopMusic();
    try {
      this.bgAudio = new Audio('/audio/jamrud-selamat-ulang-tahun.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.75;
      if (!this.isMuted) {
        const promise = this.bgAudio.play();
        if (promise) {
          promise.catch(() => {});
        }
      }
    } catch {}
  }

  public stopMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
      this.bgAudio = null;
    }
  }

  public isPlayingMusic(): boolean {
    return !!(this.bgAudio && !this.bgAudio.paused);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {}
  }

  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      [659.25, 880, 1046.5].forEach((f, i) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
    } catch {}
  }

  public playUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch {}
  }

  public playCrowdCheer() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // White noise buffer for crowd applause simulation
      const bufferSize = this.audioCtx.sampleRate * 1.5;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 1.4);
    } catch {}
  }

  public playBlowCandle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playConfettiPop() {
    this.playPop();
  }

  public playWin() {
    this.playUnlock();
  }

  // Web Speech API for Pantun Reading
  public speakIndonesian(text: string, onEnd?: () => void) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.15;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const soundManager = new SoundManager();
