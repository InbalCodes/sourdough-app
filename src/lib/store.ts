// localStorage, with the same keys as v1 so everything carries over after the update.
// (The app's origin is the same in v1 and v2: https://localhost on Android, capacitor://localhost on iOS.)

export const SK = {
  language: "levain_language",
  starters: "levain_starters",
  activeStarter: "levain_active_starter",
  settings: "levain_settings",
  bakeState: "levain_bake_state",
  calcRatio: "levain_calc_ratio",
  calcTare: "levain_calc_tare",
  calcLoaves: "levain_calc_loaves",
  calcBreadWeight: "levain_calc_bread_weight",
  selectedRecipe: "levain_selected_recipe",
  // New in v2
  recipes: "levain_recipes_local",
  pizza: "levain_pizza",
  bakers: "levain_bakers",
  migratedRecipes: "levain_v2_recipes_imported",
  v2Seen: "levain_v2_seen",
  userId: "levain_user_id",
  checks: "levain_checks",
  onboarded: "levain_onboarded",
  // v1 sign-in, read once to import recipes, then removed
  session: "levain_session",
  userEmail: "levain_user_email",
  userName: "levain_user_name",
  lastFed: "levain_last_fed",
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

/** v1 stored some values as plain strings (not JSON). */
export function loadRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export type Settings = { imperial?: boolean; bakeAlerts?: boolean; feedReminder?: boolean; theme?: "light" | "dark" | "auto" };
