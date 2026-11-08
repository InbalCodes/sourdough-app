// A soft two-note chime (Web Audio, no sound files), same as v1.
let ctx: AudioContext | null = null;

export function playChime(): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    for (const freq of [523.25, 659.25]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2);
    }
  } catch {
    /* no audio: the toast still shows */
  }
}
