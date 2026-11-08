// Pure dough math. No DOM, no i18n, so `npm test` can run it in Node.

export const GRAMS_PER_OZ = 28.3495;

export type Ratio = { starter: number; flour: number; water: number };

/** Feed ratios offered in the app ("starter:flour:water"). */
export const RATIOS = ["1:1:1", "1:2:2", "1:4:4", "1:6:6", "1:12:12"] as const;

export function parseRatio(s: string): Ratio {
  const [starter, flour, water] = s.split(":").map(Number);
  return { starter: starter || 1, flour: flour || 1, water: water || 1 };
}

/** Starter needed for a bake: loaves × starter per loaf, plus 100 g kept back as the mother starter. */
export function defaultFeedTarget(loaves: number, perLoaf: number): number {
  return Math.max(1, loaves) * Math.max(0, perLoaf) + 100;
}

/** Split a target levain weight into starter, flour and water by ratio. */
export function feedAmounts(target: number, r: Ratio) {
  const unit = target / (r.starter + r.flour + r.water);
  const starter = Math.round(unit * r.starter);
  const flour = Math.round(unit * r.flour);
  const water = Math.round(unit * r.water);
  return { starter, flour, water, total: starter + flour + water };
}

export type FlourPart = { name: string; grams: number; pct: number };

export type Bakers = { flour: number; hydration: number; salt: number; starter: number };

/** Baker's percentages → grams. Starter is an extra ingredient on top of the flour, as in v1. */
export function bakersWeights(b: Bakers) {
  const flour = Math.max(0, b.flour);
  const water = Math.round((flour * b.hydration) / 100);
  const salt = Math.round((flour * b.salt) / 100);
  const starter = Math.round((flour * b.starter) / 100);
  return { flour, water, salt, starter, total: Math.round(flour + water + salt + starter) };
}

/** Grams of each flour type from its share of the total flour. */
export function splitFlour(total: number, parts: FlourPart[]): FlourPart[] {
  return parts.map((p) => ({ ...p, grams: Math.round((total * p.pct) / 100) }));
}

export type Pizza = { balls: number; ballWeight: number; hydration: number; salt: number; starter: number; oil: number };

export const PIZZA_STYLES: Record<"neapolitan" | "newyork" | "pan", Pizza> = {
  neapolitan: { balls: 4, ballWeight: 250, hydration: 63, salt: 2.8, starter: 10, oil: 0 },
  newyork: { balls: 3, ballWeight: 300, hydration: 65, salt: 2.5, starter: 15, oil: 2 },
  pan: { balls: 2, ballWeight: 450, hydration: 72, salt: 2.5, starter: 15, oil: 3 },
};

/** Total dough (balls × weight) → grams of every ingredient. Percentages are of the flour weight. */
export function pizzaWeights(p: Pizza) {
  const total = Math.max(0, p.balls) * Math.max(0, p.ballWeight);
  const flour = total / (1 + (p.hydration + p.salt + p.starter + p.oil) / 100);
  const pct = (x: number) => Math.round((flour * x) / 100 * 10) / 10;
  return {
    total,
    flour: Math.round(flour),
    water: Math.round((flour * p.hydration) / 100),
    salt: pct(p.salt),
    starter: Math.round((flour * p.starter) / 100),
    oil: pct(p.oil),
  };
}

/** Show a gram value in the user's unit (rounded to 0.1 oz). */
export function inUnit(grams: number, imperial: boolean): number {
  return imperial ? Math.round((grams / GRAMS_PER_OZ) * 10) / 10 : Math.round(grams * 10) / 10;
}
