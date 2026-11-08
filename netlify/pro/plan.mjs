// Who the user is (free / trial / pro) and how many photo checks they may still make.
import { getStore } from "@netlify/blobs";

export const LIMITS = {
  freeTotal: 3, // free users: 3 checks, ever (enough to see what it does)
  perMonth: { trial: 15, pro: 40 }, // "fair use"; a check costs about 1-2 cents
  // Safety net for the whole service (about $10 of Sonnet a day). Raise it as paying users grow.
  globalPerDay: Number(process.env.GLOBAL_CHECKS_PER_DAY || 600),
};

const memory = new Map();
/** Netlify Blobs on Netlify; an in-memory store with the same calls for local tests. */
export function store(name) {
  try {
    return getStore({ name, consistency: "strong" });
  } catch {
    if (process.env.NETLIFY) throw new Error(`Netlify Blobs unavailable for store "${name}"`);
    return {
      async get(key) { const v = memory.get(`${name}/${key}`); return v === undefined ? null : JSON.parse(v); },
      async setJSON(key, value) { memory.set(`${name}/${key}`, JSON.stringify(value)); },
    };
  }
}

/** "free" | "trial" | "pro" from RevenueCat (the app uses our install id as the RevenueCat app user id). */
export async function getPlan(userId) {
  const testPro = (process.env.TEST_PRO_USERS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (testPro.includes(userId)) return "pro";
  if (process.env.DEV_ALL_PRO === "1" && !process.env.NETLIFY) return "pro";
  const key = process.env.REVENUECAT_SECRET;
  if (!key) return "free";
  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) return "free";
  const sub = (await res.json()).subscriber;
  const now = new Date();
  const active = Object.values(sub?.entitlements ?? {}).filter((e) => !e.expires_date || new Date(e.expires_date) > now);
  if (active.length === 0) return "free";
  const trial = active.every((e) => sub.subscriptions?.[e.product_identifier]?.period_type === "trial");
  return trial ? "trial" : "pro";
}

const month = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().slice(0, 10);

async function add(s, key, amount) {
  const cur = (await s.get(key, { type: "json" }))?.count ?? 0;
  await s.setJSON(key, { count: cur + amount });
  return cur + amount;
}

const userKey = (userId, plan) => (plan === "free" ? `user/${userId}/free-total` : `user/${userId}/${month()}`);

/** Counts one check if allowed. Returns { ok, remaining } or { ok: false, status, error }. */
export async function reserve(userId, plan) {
  const usage = store("usage");
  const global = (await usage.get(`global/${today()}`, { type: "json" }))?.count ?? 0;
  if (global >= LIMITS.globalPerDay) return { ok: false, status: 503, error: "BUSY" };
  const key = userKey(userId, plan);
  const limit = plan === "free" ? LIMITS.freeTotal : LIMITS.perMonth[plan];
  const used = (await usage.get(key, { type: "json" }))?.count ?? 0;
  if (used >= limit) return { ok: false, status: 429, error: plan === "free" ? "FREE_USED" : "MONTH_LIMIT", remaining: 0 };
  await add(usage, key, 1);
  await add(usage, `global/${today()}`, 1);
  return { ok: true, remaining: limit - used - 1 };
}

/** Gives the check back when it failed. */
export async function refund(userId, plan) {
  const usage = store("usage");
  await add(usage, userKey(userId, plan), -1);
  await add(usage, `global/${today()}`, -1);
}
