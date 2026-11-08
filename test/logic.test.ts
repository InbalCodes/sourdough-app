// Run with: npm test   (Node runs the TypeScript directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { bakersWeights, defaultFeedTarget, feedAmounts, inUnit, parseRatio, pizzaWeights, splitFlour, PIZZA_STYLES } from "../src/lib/calc.ts";
import { ageMonths, markFed, newStarter, starterStatus } from "../src/lib/starters.ts";
import { alerts, buildFolds, buildSteps, currentStep, dueAlerts, newBake, normalizeBake, toggleStep } from "../src/lib/bake.ts";
import { mergeRecipes } from "../src/lib/recipes.ts";
import { formatDuration, formatSpan } from "../src/lib/time.ts";

const T0 = Date.UTC(2026, 10, 8, 8, 0); // 8 Nov 2026 08:00 UTC
const MIN = 60_000;
const HOUR = 60 * MIN;

test("feed calculator matches v1", () => {
  assert.equal(defaultFeedTarget(2, 100), 300);
  assert.deepEqual(feedAmounts(300, parseRatio("1:2:2")), { starter: 60, flour: 120, water: 120, total: 300 });
  assert.deepEqual(feedAmounts(300, parseRatio("1:1:1")), { starter: 100, flour: 100, water: 100, total: 300 });
  assert.deepEqual(parseRatio("garbage"), { starter: 1, flour: 1, water: 1 });
});

test("baker's percentages", () => {
  assert.deepEqual(bakersWeights({ flour: 500, hydration: 70, salt: 2, starter: 20 }), { flour: 500, water: 350, salt: 10, starter: 100, total: 960 });
  assert.deepEqual(splitFlour(500, [{ name: "Bread", grams: 0, pct: 80 }, { name: "Rye", grams: 0, pct: 20 }]).map((p) => p.grams), [400, 100]);
});

test("pizza dough adds up to the total", () => {
  const w = pizzaWeights(PIZZA_STYLES.neapolitan);
  assert.equal(w.total, 1000);
  assert.ok(Math.abs(w.flour + w.water + w.salt + w.starter + w.oil - 1000) <= 2, JSON.stringify(w));
  assert.equal(w.water, Math.round(w.flour * 0.63));
});

test("units", () => {
  assert.equal(inUnit(100, false), 100);
  assert.equal(inUnit(100, true), 3.5);
});

test("starter status", () => {
  const s = newStarter("Bubbles", T0);
  assert.equal(starterStatus(s, T0), "needs-feeding");
  const fed = markFed([s], s.id, T0)[0];
  assert.equal(starterStatus(fed, T0 + 3 * 24 * HOUR), "active");
  assert.equal(starterStatus({ ...fed, status: "resting" }, T0 + HOUR), "resting");
  assert.equal(starterStatus(fed, T0 + 5 * 24 * HOUR), "needs-feeding");
  assert.equal(ageMonths(new Date(Date.UTC(2025, 10, 1)).toISOString(), T0), 12);
});

test("bake steps follow the schedule", () => {
  const b = newBake("worker", T0);
  const steps = buildSteps(b);
  assert.deepEqual(steps.map((s) => s.id), ["feed-starter", "starter-ready", "autolyse", "bulk", "preshape", "final-shape", "cold", "oven", "score-bake"]);
  assert.equal(steps.find((s) => s.id === "starter-ready")!.targetTs, T0 + 4 * HOUR);
  assert.equal(steps.find((s) => s.id === "autolyse")!.targetTs, T0 + 4 * HOUR - 45 * MIN);
  assert.equal(currentStep(b)!.id, "feed-starter");
});

test("the plan follows when steps were really done", () => {
  let b = newBake("worker", T0);
  b = toggleStep(b, "feed-starter", T0 + 2 * HOUR); // fed 2 hours late
  assert.equal(buildSteps(b).find((s) => s.id === "starter-ready")!.targetTs, T0 + 6 * HOUR);
  assert.equal(buildSteps(b).find((s) => s.id === "starter-ready")!.timerRef, undefined); // a countdown, not "ago"
  b = toggleStep(b, "starter-ready", T0 + 3 * HOUR); // peaked early
  const steps = buildSteps(b);
  assert.equal(steps.find((s) => s.id === "bulk")!.targetTs, T0 + 3 * HOUR);
  assert.equal(currentStep(b)!.id, "autolyse");
  b = toggleStep(b, "starter-ready", T0 + 3 * HOUR); // untick
  assert.equal(currentStep(b)!.id, "starter-ready");
});

test("folds count from the previous fold", () => {
  let b = { ...newBake("worker", T0), bulkStart: new Date(T0).toISOString() };
  assert.deepEqual(buildFolds(b).map((f) => f.timerTs), [T0 + 30 * MIN, T0 + 75 * MIN, T0 + 120 * MIN]);
  b = toggleStep(b, "fold-1", T0 + 40 * MIN);
  assert.equal(buildFolds(b)[1].timerTs, T0 + 40 * MIN);
  assert.equal(buildFolds({ ...b, fold4Added: true }).length, 4);
  assert.equal(buildSteps(b).find((s) => s.id === "bulk")!.timerRef, T0); // counts from the bulk start
});

test("alerts fire once, and not for old events", () => {
  const b = { ...newBake("worker", T0), coldStart: new Date(T0).toISOString(), coldHours: 10 };
  const keys = alerts(b).map((a) => a.key);
  assert.ok(keys.includes("oven") && keys.includes("cold"));
  const oven = alerts(b).find((a) => a.key === "oven")!;
  assert.equal(oven.ts, T0 + 9 * HOUR);
  const fired = new Set<string>();
  assert.equal(dueAlerts(b, oven.ts + 1000, fired).some((a) => a.key === "oven"), true);
  fired.add(`oven@${oven.ts}`);
  assert.equal(dueAlerts(b, oven.ts + 2000, fired).some((a) => a.key === "oven"), false);
  assert.equal(dueAlerts(b, oven.ts + HOUR, new Set()).some((a) => a.key === "oven"), false);
});

test("v1 bake state is accepted", () => {
  assert.equal(normalizeBake(null), null);
  assert.equal(normalizeBake({ active: false }), null);
  const v1 = { active: true, startTime: new Date(T0).toISOString(), scheduleType: "techie", checked: ["levain"], completedAt: { levain: new Date(T0).toISOString() } };
  const b = normalizeBake(v1)!;
  assert.deepEqual(b.checked, ["feed-starter", "starter-ready"]);
  assert.equal(b.bakePhase1Temp, 250);
  assert.equal(currentStep(b)!.id, "autolyse");
});

test("recipe import skips duplicates", () => {
  const local = [{ id: "r_1", name: "Country loaf", flour: 500, hydration: 70, salt: 2, starter: 20 }];
  const incoming = [
    { id: "rec1", name: "country loaf ", flour: 500, hydration: 72, salt: 2, starter: 20 },
    { id: "rec2", name: "Spelt", flour: 400, hydration: 75, salt: 2, starter: 15 },
  ];
  assert.deepEqual(mergeRecipes(local, incoming).map((r) => r.name), ["Country loaf", "Spelt"]);
});

test("durations", () => {
  assert.equal(formatDuration(65_000), "01:05");
  assert.equal(formatDuration(HOUR + 65_000), "1:01:05");
  assert.equal(formatDuration(26 * HOUR), "1d 02:00:00");
  const u = { min: "min", h: "h", d: "d" };
  assert.equal(formatSpan(71_000, u), "1 min");
  assert.equal(formatSpan(HOUR + 11 * MIN, u), "1 h 11 min");
  assert.equal(formatSpan(26 * HOUR, u), "1 d 2 h");
});
