// App state: everything the screens share, saved to localStorage on every change.
import { useEffect, useState } from "preact/hooks";
import { normalizeBake, type BakeState } from "./lib/bake";
import { loadRecipes, saveRecipes, type Recipe } from "./lib/recipes";
import { newStarter, type Starter } from "./lib/starters";
import { SK, load, loadRaw, save, type Settings } from "./lib/store";
import { t } from "./i18n";

export type SelectedRecipe = { name: string; flour: number; water: number; salt: number; starter: number; total: number };

function initialStarters(): Starter[] {
  const list = load<Starter[]>(SK.starters, []);
  if (list.length) return list;
  // v1 before multi-starter kept a single "last fed" time.
  const s = newStarter(t("newStarterName"), Date.now());
  const legacy = loadRaw(SK.lastFed);
  return [{ ...s, lastFed: legacy && !isNaN(Date.parse(legacy)) ? legacy : null }];
}

export function useAppState() {
  const [starters, setStarters] = useState<Starter[]>(initialStarters);
  const [activeId, setActiveId] = useState<string>(() => loadRaw(SK.activeStarter) || "");
  const [bake, setBake] = useState<BakeState | null>(() => normalizeBake(load(SK.bakeState, null)));
  const [settings, setSettings] = useState<Settings>(() => load<Settings>(SK.settings, {}));
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes);
  const [selected, setSelected] = useState<SelectedRecipe | null>(() => load(SK.selectedRecipe, null));

  useEffect(() => save(SK.starters, starters), [starters]);
  useEffect(() => save(SK.bakeState, bake), [bake]);
  useEffect(() => save(SK.settings, settings), [settings]);
  useEffect(() => saveRecipes(recipes), [recipes]);
  useEffect(() => save(SK.selectedRecipe, selected), [selected]);
  useEffect(() => {
    try { localStorage.setItem(SK.activeStarter, activeId); } catch { /* ignore */ }
  }, [activeId]);

  const active = starters.find((s) => s.id === activeId) ?? starters[0];
  return { starters, setStarters, active, setActiveId, bake, setBake, settings, setSettings, recipes, setRecipes, selected, setSelected };
}

export type AppState = ReturnType<typeof useAppState>;
