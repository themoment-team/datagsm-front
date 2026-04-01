export type SoundType =
  | 'click'
  | 'softClick'
  | 'select'
  | 'complete'
  | 'error'
  | 'open'
  | 'close'
  | 'enable'
  | 'disable';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'square',
  vol = 0.25,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.01);
}

function noiseBurst(ctx: AudioContext, start: number, duration: number, vol = 0.35) {
  const bufSize = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, start);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(start);
}

export function playSound(type: SoundType, pitchMultiplier = 1): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const p = Math.min(pitchMultiplier, 4);

    switch (type) {
      case 'click':
        tone(ctx, 1200 * p, t, 0.04, 'square', 0.15);
        tone(ctx, 800 * p, t + 0.02, 0.03, 'square', 0.1);
        break;

      case 'softClick':
        tone(ctx, 1800 * p, t, 0.02, 'square', 0.06);
        break;

      case 'select':
        tone(ctx, 660 * p, t, 0.07, 'square', 0.22);
        tone(ctx, 880 * p, t + 0.07, 0.1, 'square', 0.2);
        break;

      case 'complete':
        [523, 659, 784, 1047].forEach((f, i) => {
          tone(ctx, f * p, t + i * 0.1, 0.15, 'square', 0.22);
        });
        break;

      case 'error': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350 * p, t);
        osc.frequency.exponentialRampToValueAtTime(80 * p, t + 0.3);
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.31);
        break;
      }

      case 'open':
        [262, 330, 392, 494].forEach((f, i) => {
          tone(ctx, f * p, t + i * 0.07, 0.1, 'square', 0.18);
        });
        break;

      case 'close':
        [494, 392, 330, 262].forEach((f, i) => {
          tone(ctx, f * p, t + i * 0.07, 0.1, 'square', 0.18);
        });
        break;

      case 'enable':
        noiseBurst(ctx, t, 0.05);
        tone(ctx, 440 * p, t + 0.04, 0.08, 'square', 0.28);
        tone(ctx, 660 * p, t + 0.12, 0.12, 'square', 0.24);
        tone(ctx, 880 * p, t + 0.22, 0.1, 'square', 0.2);
        break;

      case 'disable':
        noiseBurst(ctx, t, 0.05);
        tone(ctx, 660 * p, t + 0.04, 0.08, 'square', 0.28);
        tone(ctx, 440 * p, t + 0.12, 0.12, 'square', 0.24);
        tone(ctx, 262 * p, t + 0.22, 0.1, 'square', 0.2);
        break;
    }
  } catch {
    // silent fail
  }
}
