// Shared HTTP helpers for the Pro functions: CORS, JSON responses, and the anonymous user id.
// (The v1 functions in netlify/functions/*.js are CommonJS and keep their own helpers.)

const ORIGINS = new Set([
  "https://localhost", // Capacitor Android
  "capacitor://localhost", // Capacitor iOS
  "http://localhost:5184", // vite dev
  "http://127.0.0.1:5184",
]);

function cors(req) {
  const origin = req.headers.get("origin");
  const h = { "Access-Control-Allow-Headers": "Content-Type, X-Levain-User", "Access-Control-Allow-Methods": "POST, OPTIONS", Vary: "Origin" };
  if (origin && ORIGINS.has(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export function json(req, status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors(req) } });
}

export const fail = (req, status, error, extra = {}) => json(req, status, { error, ...extra });

export const preflight = (req) => (req.method === "OPTIONS" ? new Response(null, { status: 204, headers: cors(req) }) : null);

/** Anonymous id per install (also the RevenueCat app user id), or RevenueCat's "$RCAnonymousID:<hex>". */
export function userIdFrom(req) {
  const id = req.headers.get("x-levain-user") ?? "";
  return /^(\$RCAnonymousID:[a-f0-9]{32}|[A-Za-z0-9_-]{16,64})$/.test(id) ? id : null;
}

export async function body(req) {
  try { return await req.json(); } catch { return null; }
}
