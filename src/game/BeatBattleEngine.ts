export type HitJudgment = 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS';

export interface HitResult {
  judgment: HitJudgment;
  scoreDelta: number;
  label: string;
  color: string;
}

export function evaluateHit(timeDiffSeconds: number): HitResult {
  const absDiff = Math.abs(timeDiffSeconds);

  if (absDiff <= 0.12) {
    return { judgment: 'PERFECT', scoreDelta: 300, label: 'PERFECT!', color: 'text-amber-400' };
  } else if (absDiff <= 0.22) {
    return { judgment: 'GREAT', scoreDelta: 200, label: 'GREAT!', color: 'text-rose-500' };
  } else if (absDiff <= 0.35) {
    return { judgment: 'GOOD', scoreDelta: 100, label: 'NICE!', color: 'text-sky-500' };
  } else {
    return { judgment: 'MISS', scoreDelta: 0, label: 'MISS', color: 'text-slate-400' };
  }
}

class DiscoBeatSynthesizer {
  private audioCtx: AudioContext | null = null;

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

  public playDiscoKick() {
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playHiHat() {
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 0.05;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.05);
    } catch {}
  }
}

export const discoBeatSynth = new DiscoBeatSynthesizer();
