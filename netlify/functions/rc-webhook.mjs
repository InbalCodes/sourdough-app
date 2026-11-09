// POST /api/rc-webhook  ← RevenueCat webhook
// Sends a Telegram message when a real user starts a free trial or pays for the first time.
// Skipped: sandbox / license-test purchases (environment SANDBOX) and test devices in TEST_PRO_USERS.
// Env: REVENUECAT_WEBHOOK_AUTH (same value as the "Authorization header" set in RevenueCat),
//      TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
// Same file in every app; only APP changes.
import { store } from "../pro/plan.mjs";

const APP = "Levain";

const testUsers = () => (process.env.TEST_PRO_USERS || "").split(",").map((s) => s.trim()).filter(Boolean);

/** Which message this event deserves, or null for events we stay quiet about. */
export function kindOf(e) {
  if (e.type === "TEST") return "test";
  if (e.environment !== "PRODUCTION") return null;
  const ids = [e.app_user_id, e.original_app_user_id, ...(e.aliases || [])];
  if (ids.some((id) => testUsers().includes(id))) return null;
  if (e.type === "INITIAL_PURCHASE") return e.period_type === "TRIAL" ? "trial" : "purchase";
  if (e.type === "RENEWAL" && e.is_trial_conversion) return "conversion";
  if (e.type === "NON_RENEWING_PURCHASE") return "purchase";
  return null;
}

const STORES = { PLAY_STORE: "Google Play", APP_STORE: "App Store" };

function money(e) {
  if (e.price_in_purchased_currency != null && e.currency) return `${e.price_in_purchased_currency} ${e.currency}`;
  return e.price != null ? `$${e.price}` : "";
}

export function message(kind, e, count) {
  if (kind === "test") return `🧪 ${APP}: החיבור מ-RevenueCat עובד`;
  const where = [STORES[e.store] || e.store, e.country_code].filter(Boolean).join(", ");
  const product = e.product_id || "";
  if (kind === "trial") {
    const head = count === 1 ? `🎉 ${APP}: הניסיון הראשון אי פעם!` : `✨ ${APP}: ניסיון חדש (#${count})`;
    return `${head}\n${product} · ${where}`;
  }
  const head = count === 1 ? `💰🎉 ${APP}: הרכישה הראשונה אי פעם!` : `💰 ${APP}: רכישה (#${count})`;
  const how = kind === "conversion" ? "המרה מניסיון" : "רכישה ישירה";
  return `${head}\n${how} · ${product} · ${money(e)}\n${where}`;
}

/** Counts trials and paid purchases, so the very first one gets its own message. Saved only after a send. */
async function counter(kind) {
  const key = kind === "trial" ? "trials" : "purchases";
  const s = store("sales");
  const n = ((await s.get(key, { type: "json" })) ?? 0) + 1;
  return { n, save: () => s.setJSON(key, n) };
}

async function telegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing");
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!r.ok) throw new Error(`Telegram ${r.status}: ${await r.text()}`);
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const auth = process.env.REVENUECAT_WEBHOOK_AUTH;
  if (!auth || req.headers.get("authorization") !== auth) return new Response("Unauthorized", { status: 401 });

  let e;
  try { e = (await req.json())?.event; } catch { e = null; }
  if (!e?.type) return new Response("Bad request", { status: 400 });

  const kind = kindOf(e);
  if (!kind) return new Response("ignored", { status: 200 });

  try {
    const c = kind === "test" ? { n: 0, save: async () => {} } : await counter(kind);
    await telegram(message(kind, e, c.n));
    await c.save();
  } catch (err) {
    console.error("rc-webhook:", err.message);
    return new Response("notify failed", { status: 500 }); // RevenueCat retries later
  }
  return new Response("ok", { status: 200 });
};

export const config = { path: "/api/rc-webhook" };
