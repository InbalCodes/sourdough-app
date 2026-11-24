// In-app rating prompt (the store's own sheet, Google Play or the App Store).
// We only ask right after a good moment: a finished bake, or a photo check that says "ready".
// The stores decide whether the sheet really shows (Apple allows it at most 3 times a year).
// The timing rule is in reviewRule.ts.
import { AppReview } from "@capawesome/capacitor-app-review";
import { Capacitor } from "@capacitor/core";
import { load, save } from "./store";
import { shouldAsk, type ReviewState } from "./reviewRule";

const KEY = "levain_review";

function state(now: number): ReviewState {
  const s = load<ReviewState | null>(KEY, null);
  if (s && typeof s.firstSeen === "number") return s;
  const fresh = { firstSeen: now, moments: 0 };
  save(KEY, fresh);
  return fresh;
}

/** Call once at startup, so the 2-day wait counts from the first launch. */
export function initReview(now = Date.now()): void {
  state(now);
}

/** A good moment happened. Maybe shows the rating sheet a moment later. */
export function goodMoment(now = Date.now()): void {
  const s = state(now);
  s.moments += 1;
  const ask = shouldAsk(s, now);
  if (ask) s.askedAt = now;
  save(KEY, s);
  if (!ask || !Capacitor.isNativePlatform()) return;
  // Let the success feedback show first.
  setTimeout(() => AppReview.requestReview().catch(() => {}), 1500);
}
