// The bake tracker, as pure functions over the saved state (same shape and key as v1).
// The UI turns step ids and string keys into words; this file only does the timing.

const MIN = 60_000;
const HOUR = 3_600_000;

export type ScheduleType = "worker" | "thursday" | "techie";

export const LIFESTYLES: Record<ScheduleType, { levainHours: number; autolyseMin: number; coldHours: number }> = {
  worker: { levainHours: 4, autolyseMin: 45, coldHours: 12 },
  thursday: { levainHours: 5, autolyseMin: 45, coldHours: 10 },
  techie: { levainHours: 6, autolyseMin: 60, coldHours: 14 },
};

export const OVEN_PREHEAT_MIN = 60;
export const PRESHAPE_REST_MIN = 15;

export type BakeState = {
  active: true;
  startTime: string;
  scheduleType: ScheduleType;
  checked: string[];
  completedAt: Record<string, string>;
  autolyseStart: string | null;
  bulkStart: string | null;
  fold4Added: boolean;
  foldStarts: Record<string, string>; // when each fold was ticked
  volumeStart: string | null;
  preShapeStart: string | null;
  coldStart: string | null;
  coldHours: number;
  bakePhase1Start: string | null;
  bakePhase2Start: string | null;
  bakePhase1Temp: number;
  bakePhase1Min: number;
  bakePhase2Temp: number;
  bakePhase2Min: number;
};

const ms = (iso: string | null | undefined) => (iso ? new Date(iso).getTime() : null);
const iso = (t: number) => new Date(t).toISOString();

export function newBake(type: ScheduleType, now: number): BakeState {
  const ls = LIFESTYLES[type];
  return {
    active: true, startTime: iso(now), scheduleType: type, checked: [], completedAt: {},
    autolyseStart: null, bulkStart: null, fold4Added: false, foldStarts: {}, volumeStart: null,
    preShapeStart: null, coldStart: null, coldHours: ls.coldHours,
    bakePhase1Start: null, bakePhase2Start: null, bakePhase1Temp: 250, bakePhase1Min: 20, bakePhase2Temp: 220, bakePhase2Min: 20,
  };
}

/** Accept a v1 state from storage and fill anything missing. Returns null for "no active bake". */
export function normalizeBake(raw: unknown): BakeState | null {
  if (!raw || typeof raw !== "object" || !(raw as BakeState).active) return null;
  const s = raw as Partial<BakeState> & { checked?: string[] };
  const type: ScheduleType = s.scheduleType && s.scheduleType in LIFESTYLES ? s.scheduleType : "worker";
  const base = newBake(type, ms(s.startTime) ?? Date.now());
  const out: BakeState = { ...base, ...s, scheduleType: type, checked: [...(s.checked || [])], completedAt: { ...(s.completedAt || {}) }, foldStarts: { ...(s.foldStarts || {}) } } as BakeState;
  // Very old v1 bakes had a single "levain" step.
  if (out.checked.includes("levain")) {
    out.checked = out.checked.filter((id) => id !== "levain");
    for (const id of ["feed-starter", "starter-ready"]) {
      if (!out.checked.includes(id)) out.checked.push(id);
      if (out.completedAt.levain && !out.completedAt[id]) out.completedAt[id] = out.completedAt.levain;
    }
    delete out.completedAt.levain;
  }
  return out;
}

export type StepKind = "plain" | "autolyse" | "bulk" | "preshape" | "cold" | "oven" | "bake";

export type Step = {
  id: string;
  kind: StepKind;
  /** Planned time for this step (count down to it). */
  targetTs?: number;
  /** Time to count up from (a manual start, or the last finished step). */
  timerRef?: number;
  parallel?: boolean;
  done: boolean;
  doneTs?: number;
};

export function buildSteps(s: BakeState): Step[] {
  const ls = LIFESTYLES[s.scheduleType];
  const start = ms(s.startTime)!;
  // The plan follows what really happened: the starter peaks N hours after it was actually fed,
  // and once it's marked ready, mixing is due right away.
  const fedAt = s.checked.includes("feed-starter") ? ms(s.completedAt["feed-starter"]) ?? start : start;
  const levainEnd = fedAt + ls.levainHours * HOUR;
  const readyAt = s.checked.includes("starter-ready") ? ms(s.completedAt["starter-ready"]) : null;
  const coldStart = ms(s.coldStart);
  const steps: Omit<Step, "done">[] = [
    { id: "feed-starter", kind: "plain", targetTs: start, timerRef: start },
    { id: "starter-ready", kind: "plain", targetTs: levainEnd },
    { id: "autolyse", kind: "autolyse", targetTs: levainEnd - ls.autolyseMin * MIN, parallel: true, timerRef: ms(s.autolyseStart) ?? undefined },
    { id: "bulk", kind: "bulk", targetTs: readyAt ?? levainEnd, timerRef: ms(s.bulkStart) ?? undefined },
    { id: "preshape", kind: "preshape", timerRef: ms(s.preShapeStart) ?? undefined },
    { id: "final-shape", kind: "plain" },
    { id: "cold", kind: "cold" },
    { id: "oven", kind: "oven", targetTs: coldStart ? coldStart + s.coldHours * HOUR - OVEN_PREHEAT_MIN * MIN : undefined },
    { id: "score-bake", kind: "bake" },
  ];
  return steps.map((st) => ({ ...st, done: s.checked.includes(st.id), doneTs: ms(s.completedAt[st.id]) ?? undefined }));
}

export type Fold = { id: string; n: number; offsetMin: number; done: boolean; doneTs?: number; timerTs: number };

/** Folds at 30, 75 and 120 minutes into bulk (and 180 if a 4th was added). Each counts from the previous fold once done. */
export function buildFolds(s: BakeState): Fold[] {
  const bulk = ms(s.bulkStart);
  if (!bulk) return [];
  const offsets = s.fold4Added ? [30, 75, 120, 180] : [30, 75, 120];
  let lastDone: number | null = null;
  return offsets.map((offsetMin, i) => {
    const id = `fold-${i + 1}`;
    const done = s.checked.includes(id);
    const doneTs = ms(s.foldStarts[id]) ?? undefined;
    const scheduled = bulk + offsetMin * MIN;
    const fold: Fold = { id, n: i + 1, offsetMin, done, doneTs, timerTs: lastDone && !done ? lastDone : scheduled };
    if (done && doneTs) lastDone = doneTs;
    return fold;
  });
}

export function toggleStep(s: BakeState, id: string, now: number): BakeState {
  const out = { ...s, checked: [...s.checked], completedAt: { ...s.completedAt }, foldStarts: { ...s.foldStarts } };
  const i = out.checked.indexOf(id);
  if (i === -1) {
    out.checked.push(id);
    out.completedAt[id] = iso(now);
    if (id.startsWith("fold-") && !out.foldStarts[id]) out.foldStarts[id] = iso(now);
  } else {
    out.checked.splice(i, 1);
    delete out.completedAt[id];
  }
  return out;
}

export function coldEnd(s: BakeState): number | null {
  const c = ms(s.coldStart);
  return c ? c + s.coldHours * HOUR : null;
}

export function phaseEnds(s: BakeState): { p1?: number; p2?: number } {
  const p1 = ms(s.bakePhase1Start);
  const p2 = ms(s.bakePhase2Start);
  return { p1: p1 ? p1 + s.bakePhase1Min * MIN : undefined, p2: p2 ? p2 + s.bakePhase2Min * MIN : undefined };
}

/** The first step that isn't done: what the Today screen shows. */
export function currentStep(s: BakeState): Step | undefined {
  return buildSteps(s).find((st) => !st.done);
}

export type Alert = { key: string; msg: "chimeAutolyse" | "chimeBulk" | "chimeFold" | "chimePreshape" | "chimeOven" | "chimeCold" | "chimeBakePhase1" | "chimeBakePhase2"; ts: number };

/** Every moment the app should chime for, for steps that aren't done yet. */
export function alerts(s: BakeState): Alert[] {
  const out: Alert[] = [];
  const steps = buildSteps(s);
  const open = (id: string) => !steps.find((st) => st.id === id)?.done;
  const st = (id: string) => steps.find((x) => x.id === id)!;
  if (open("autolyse") && !s.autolyseStart && st("autolyse").targetTs) out.push({ key: "autolyse", msg: "chimeAutolyse", ts: st("autolyse").targetTs! });
  if (open("bulk") && !s.bulkStart) out.push({ key: "bulk", msg: "chimeBulk", ts: st("bulk").targetTs! });
  for (const f of buildFolds(s)) if (!f.done) out.push({ key: f.id, msg: "chimeFold", ts: f.timerTs });
  const pre = ms(s.preShapeStart);
  if (pre && open("preshape")) out.push({ key: "preshape", msg: "chimePreshape", ts: pre + PRESHAPE_REST_MIN * MIN });
  const oven = st("oven").targetTs;
  if (oven && open("oven")) out.push({ key: "oven", msg: "chimeOven", ts: oven });
  const ce = coldEnd(s);
  if (ce && open("cold")) out.push({ key: "cold", msg: "chimeCold", ts: ce });
  const { p1, p2 } = phaseEnds(s);
  if (p1 && !s.bakePhase2Start) out.push({ key: "phase1", msg: "chimeBakePhase1", ts: p1 });
  if (p2) out.push({ key: "phase2", msg: "chimeBakePhase2", ts: p2 });
  return out;
}

/** Alerts that became due since the last check (and at most 2 minutes ago, so a reopened app doesn't replay old ones). */
export function dueAlerts(s: BakeState, now: number, fired: Set<string>): Alert[] {
  return alerts(s).filter((a) => now >= a.ts && now - a.ts < 2 * MIN && !fired.has(`${a.key}@${a.ts}`));
}
