// Starters. Same shape and storage key as v1, so data carries over after the update.

export type Starter = {
  id: string;
  name: string;
  creationDate: string; // ISO
  status: "active" | "resting";
  lastFed: string | null; // ISO
  photo?: string; // small JPEG data URL
};

export type StarterStatus = "active" | "resting" | "needs-feeding";

const DAY = 86_400_000;

/** Never fed, or not fed for more than 4 days, means it needs feeding (v1 rule). */
export function starterStatus(s: Starter, now: number): StarterStatus {
  if (!s.lastFed) return "needs-feeding";
  if (now - new Date(s.lastFed).getTime() > 4 * DAY) return "needs-feeding";
  return s.status === "resting" ? "resting" : "active";
}

/** Whole months since creation, at least 1. */
export function ageMonths(creationDate: string, now: number): number {
  const c = new Date(creationDate);
  const n = new Date(now);
  return Math.max(1, (n.getFullYear() - c.getFullYear()) * 12 + (n.getMonth() - c.getMonth()));
}

export function newStarter(name: string, now: number): Starter {
  return { id: "starter_" + now, name, creationDate: new Date(now).toISOString(), status: "active", lastFed: null };
}

export function markFed(list: Starter[], id: string, now: number): Starter[] {
  const iso = new Date(now).toISOString();
  return list.map((s) => (s.id === id ? { ...s, lastFed: iso, status: "active" } : s));
}

export function updateStarter(list: Starter[], id: string, patch: Partial<Starter>): Starter[] {
  return list.map((s) => (s.id === id ? { ...s, ...patch } : s));
}
