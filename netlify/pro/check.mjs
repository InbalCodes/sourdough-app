// Photo check with Claude Sonnet 5.5 (the plan's choice for cost; about 1-2 cents a check).
// kind "starter": is the starter ready to bake with? kind "crumb": how did the bread proof?
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-sonnet-5-5";

export const VERDICTS = {
  starter: ["sluggish", "rising", "peak", "past_peak", "needs_attention"],
  crumb: ["underproofed", "well_proofed", "overproofed", "underbaked", "unclear"],
};

export const LANGS = { fr: "French", de: "German", it: "Italian", ja: "Japanese", ko: "Korean", pt: "Brazilian Portuguese", es: "Latin American Spanish", he: "Hebrew" };

const SYSTEM = `You are an experienced sourdough baker helping home bakers through an app called Levain. You look at one photo and give a short, honest, practical read.

Two kinds of photo:
1. "starter": a jar of sourdough starter. Judge how ready it is to bake with:
   - sluggish: few or no bubbles, flat, little rise
   - rising: bubbles forming and rising, not yet at its highest
   - peak: domed top, lots of bubbles, about doubled or more, ready to use now
   - past_peak: top has fallen or caved in, streaks on the glass above the surface, liquid (hooch) on top
   - needs_attention: signs it may be spoiled: fuzzy mold, pink, orange or red streaks or spots. Then say clearly to throw it away and not to bake with it.
2. "crumb": the cut face of a baked loaf. Judge the proof and bake:
   - underproofed: dense areas, tight crumb with a few big tunnels or a big hole under the crust, gummy look
   - well_proofed: open, even, lacy crumb with a mix of hole sizes, glossy
   - overproofed: flat loaf, large irregular holes near the top, or tight, crumbly, even crumb with little spring
   - underbaked: gummy or wet-looking crumb, pale crust
   - unclear: the photo doesn't show enough to tell

Rules:
- If the photo does not show what was asked (no starter jar, no cut loaf), set is_subject to false and verdict to the closest neutral value ("rising" for starter, "unclear" for crumb), and explain in summary what to photograph.
- Confidence is 0 to 1 and must be honest. One photo often can't show everything: lower confidence when unsure, and say what would help (a photo from the side, a rubber band at the starting level, better light).
- signs: 2-4 short things you actually see in this photo that led to the verdict.
- next_steps: 2-4 short, concrete things to do next (for starter: use it now / wait about N hours / feed again at a different ratio or temperature; for crumb: change bulk time, temperature, shaping or bake time next time).
- Plain words, no jargon without a short explanation. No health claims beyond telling people not to eat spoiled starter.`;

const STR = { type: "string" };
const LIST = { type: "array", items: STR };
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["is_subject", "photo_quality", "verdict", "confidence", "summary", "signs", "next_steps"],
  properties: {
    is_subject: { type: "boolean" },
    photo_quality: { type: "string", enum: ["good", "blurry", "too_far", "bad_light"] },
    verdict: { type: "string", enum: [...VERDICTS.starter, ...VERDICTS.crumb] },
    confidence: { type: "number" },
    summary: STR,
    signs: LIST,
    next_steps: LIST,
  },
};

let client;

/** image: base64 JPEG (resized on the phone). Returns { result, usage }. */
export async function check(kind, image, lang = "en") {
  client ??= new Anthropic();
  const langNote = Object.hasOwn(LANGS, lang) ? ` Write summary, signs and next_steps in ${LANGS[lang]}.` : "";
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    // Same system prompt and schema on every call: cache them. The language goes in the user message so all share one cache.
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    // Refusals are unlikely for bread photos; the server-side fallback is cheap insurance.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{ role: "user", content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
      { type: "text", text: `This is a "${kind}" photo. Give your read.${langNote}` },
    ] }],
  });
  if (res.stop_reason === "refusal") throw new Error("REFUSED");
  if (res.stop_reason === "max_tokens") throw new Error("TRUNCATED");
  const out = JSON.parse(res.content.filter((b) => b.type === "text").map((b) => b.text).join(""));
  // A verdict from the other kind's list means the model mixed them up: fall back to the neutral one.
  if (!VERDICTS[kind].includes(out.verdict)) out.verdict = kind === "starter" ? "rising" : "unclear";
  out.confidence = Math.max(0, Math.min(1, Number(out.confidence) || 0));
  out.signs = out.signs.slice(0, 4);
  out.next_steps = out.next_steps.slice(0, 4);
  const u = res.usage;
  return { result: out, usage: { in: u.input_tokens, out: u.output_tokens, cacheRead: u.cache_read_input_tokens ?? 0 } };
}
