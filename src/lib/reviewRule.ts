// When to ask for a store rating (pure, so it can be tested without the plugin). Used by review.ts.
const DAY = 86400000;
export const MIN_AGE_DAYS = 2;
export const MIN_MOMENTS = 2;
export const GAP_DAYS = 120;

export type ReviewState = { firstSeen: number; moments: number; askedAt?: number };

/** Not in the first 2 days, only from the 2nd good moment, then at most every 120 days. */
export function shouldAsk(s: ReviewState, now: number): boolean {
  if (s.moments < MIN_MOMENTS) return false;
  if (now - s.firstSeen < MIN_AGE_DAYS * DAY) return false;
  if (s.askedAt && now - s.askedAt < GAP_DAYS * DAY) return false;
  return true;
}
