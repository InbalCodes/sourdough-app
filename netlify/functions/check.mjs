// POST /api/check  { kind: "starter" | "crumb", image: base64 JPEG, lang?: "en" | "fr" | ... }
// Header X-Levain-User: install id (also the RevenueCat app user id).
// → { result, plan, remaining }   Errors: { error: "FREE_USED" | "MONTH_LIMIT" | "BUSY" | ... }
import { json, fail, preflight, userIdFrom, body } from "../pro/http.mjs";
import { getPlan, reserve, refund } from "../pro/plan.mjs";
import { check, VERDICTS, LANGS } from "../pro/check.mjs";

const MAX_IMAGE_BYTES = 1_500_000; // the app sends ~1024 px JPEGs (~150-400 KB)

export default async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== "POST") return fail(req, 405, "METHOD");
  const userId = userIdFrom(req);
  if (!userId) return fail(req, 400, "NO_USER");

  const b = await body(req);
  const kind = b?.kind;
  if (!Object.hasOwn(VERDICTS, kind)) return fail(req, 400, "BAD_KIND");
  const image = b?.image;
  if (typeof image !== "string" || !image.startsWith("/9j/")) return fail(req, 400, "NOT_JPEG"); // base64 of FF D8 FF
  if ((image.length * 3) / 4 > MAX_IMAGE_BYTES) return fail(req, 413, "IMAGE_TOO_BIG");
  const lang = typeof b?.lang === "string" && (b.lang === "en" || Object.hasOwn(LANGS, b.lang)) ? b.lang : "en";

  const plan = await getPlan(userId);
  const r = await reserve(userId, plan);
  if (!r.ok) return fail(req, r.status, r.error, { plan, remaining: r.remaining ?? null });

  try {
    const t0 = Date.now();
    const { result, usage } = await check(kind, image, lang);
    console.log(JSON.stringify({ ev: "check", kind, plan, lang, ms: Date.now() - t0, verdict: result.verdict, conf: result.confidence, subject: result.is_subject, ...usage }));
    return json(req, 200, { result, plan, remaining: r.remaining });
  } catch (e) {
    console.error("check failed:", e.message);
    await refund(userId, plan);
    return fail(req, 502, "CHECK_FAILED");
  }
};

export const config = { path: "/api/check" };
