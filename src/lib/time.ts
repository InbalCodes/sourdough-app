// Durations and clock times for timers.

const pad = (n: number) => String(n).padStart(2, "0");

/** 05:07, 1:05:07 or 2d 01:05:07 */
export function formatDuration(msIn: number): string {
  let s = Math.floor(Math.max(0, msIn) / 1000);
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  s %= 60;
  if (d > 0) return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** A rough age for "since the last feeding": "3 min", "2 h 5 min", "3 d 4 h". Unit words come from the caller. */
export function formatSpan(msIn: number, u: { min: string; h: string; d: string }): string {
  const m = Math.floor(Math.max(0, msIn) / 60_000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  if (d > 0) return h ? `${d} ${u.d} ${h} ${u.h}` : `${d} ${u.d}`;
  if (h > 0) return m % 60 ? `${h} ${u.h} ${m % 60} ${u.min}` : `${h} ${u.h}`;
  return `${m} ${u.min}`;
}

export const formatTime = (t: number, locale: string) => new Date(t).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

export const formatDate = (t: number, locale: string) =>
  new Date(t).toLocaleDateString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
