// Recipes live on the phone in v2. v1 kept them on the server (Airtable) behind a sign-in,
// so the first launch after the update downloads them once and then forgets the sign-in.
import type { FlourPart } from "./calc.ts";
import { SK, load, loadRaw, remove, save } from "./store.ts";

export type Recipe = { id: string; name: string; flour: number; hydration: number; salt: number; starter: number; flourTypes?: FlourPart[] };

const V1_ORIGIN = "https://vocal-lolly-7ebc53.netlify.app";

export const loadRecipes = (): Recipe[] => load<Recipe[]>(SK.recipes, []);
export const saveRecipes = (r: Recipe[]) => save(SK.recipes, r);

export function addRecipe(list: Recipe[], r: Omit<Recipe, "id">, now: number): Recipe[] {
  return [{ ...r, id: "r_" + now }, ...list];
}

/** Merge downloaded recipes into the local list, skipping any already there (same id or same name). */
export function mergeRecipes(local: Recipe[], incoming: Recipe[]): Recipe[] {
  const seen = new Set(local.flatMap((r) => [r.id, r.name.trim().toLowerCase()]));
  const fresh = incoming.filter((r) => r.name && !seen.has(r.id) && !seen.has(r.name.trim().toLowerCase()));
  return [...local, ...fresh];
}

/** One-time import of v1 recipes. Safe to call on every launch: it does nothing without a v1 session, and stops after one success. */
export async function importV1Recipes(): Promise<number> {
  const session = loadRaw(SK.session);
  if (!session || loadRaw(SK.migratedRecipes)) return 0;
  try {
    const res = await fetch(V1_ORIGIN + "/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + session },
      body: JSON.stringify({ action: "list" }),
    });
    if (res.status === 401) {
      forgetV1SignIn(); // expired session: nothing we can download
      return 0;
    }
    if (!res.ok) return 0; // offline or server trouble: try again next launch
    const data = (await res.json()) as { success?: boolean; recipes?: Recipe[] };
    if (!data.success) return 0;
    const incoming = (data.recipes || []).map((r) => ({ ...r, flourTypes: r.flourTypes || undefined }));
    const before = loadRecipes();
    const merged = mergeRecipes(before, incoming);
    saveRecipes(merged);
    forgetV1SignIn();
    return merged.length - before.length;
  } catch {
    return 0;
  }
}

function forgetV1SignIn() {
  save(SK.migratedRecipes, true);
  for (const k of [SK.session, SK.userEmail, SK.userName]) remove(k);
}
