// Client for the photo check (netlify/functions/check.mjs).
import { Capacitor } from "@capacitor/core";
import { getUserId } from "./subscription";

export type CheckKind = "starter" | "crumb";
export type Verdict =
  | "sluggish" | "rising" | "peak" | "past_peak" | "needs_attention"
  | "underproofed" | "well_proofed" | "overproofed" | "underbaked" | "unclear";

export interface CheckResult {
  is_subject: boolean;
  photo_quality: "good" | "blurry" | "too_far" | "bad_light";
  verdict: Verdict;
  confidence: number;
  summary: string;
  signs: string[];
  next_steps: string[];
}
export interface CheckResponse { result: CheckResult; plan: "free" | "trial" | "pro"; remaining: number | null }

/** The app on the phone talks to the live site; the browser dev server uses a sample answer. */
const API = Capacitor.isNativePlatform() ? "https://vocal-lolly-7ebc53.netlify.app" : (import.meta.env.VITE_API_BASE ?? "");

export class CheckError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

export async function runCheck(kind: CheckKind, image: string, lang: string): Promise<CheckResponse> {
  if (import.meta.env.DEV && !Capacitor.isNativePlatform() && !import.meta.env.VITE_API_BASE) return sample(kind);
  const res = await fetch(`${API}/api/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Levain-User": getUserId() },
    body: JSON.stringify({ kind, image, lang }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new CheckError(res.status, data.error ?? "HTTP_" + res.status);
  return data as CheckResponse;
}

/** Downscale a photo to a ~1024 px JPEG, as base64 without the data: prefix. */
export function photoToBase64(file: File, max = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function sample(kind: CheckKind): Promise<CheckResponse> {
  await new Promise((r) => setTimeout(r, 900));
  const result: CheckResult = kind === "starter"
    ? { is_subject: true, photo_quality: "good", verdict: "rising", confidence: 0.72, summary: "Your starter is active and still rising. It isn't at its peak yet.", signs: ["Lots of small bubbles on the side of the jar", "The top is flat, not domed yet"], next_steps: ["Wait about 1–2 hours and check again", "Put a rubber band at today's level to see the rise"] }
    : { is_subject: true, photo_quality: "good", verdict: "underproofed", confidence: 0.64, summary: "The crumb looks a little underproofed.", signs: ["Dense areas near the bottom", "A few large holes under the top crust"], next_steps: ["Let bulk fermentation run 30–60 minutes longer", "Wait for about 50–75% rise before shaping"] };
  return { result, plan: "pro", remaining: 39 };
}
