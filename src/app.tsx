// App shell: bottom tabs, settings sheet, toasts, bake chimes and the one-time recipe import.
import { useEffect, useRef, useState } from "preact/hooks";
import { dueAlerts } from "./lib/bake";
import { playChime } from "./lib/chime";
import { importV1Recipes, loadRecipes } from "./lib/recipes";
import { t, type Key } from "./i18n";
import { useAppState } from "./state";
import { useNow } from "./ui";
import { Bake } from "./screens/Bake";
import { Calculators, type BakersDraft, type CalcTab } from "./screens/Calculators";
import { Recipes } from "./screens/Recipes";
import { Settings } from "./screens/Settings";
import { Starters } from "./screens/Starters";
import { Today } from "./screens/Today";

export type Tab = "today" | "starters" | "bake" | "calc" | "recipes";

const TABS: { id: Tab; key: Key; icon: string }[] = [
  { id: "today", key: "tabToday", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { id: "starters", key: "tabStarters", icon: "M8 3h8v3H8zM7 6h10l1 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z M9 13h6" },
  { id: "bake", key: "tabBake", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { id: "calc", key: "tabCalc", icon: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" },
  { id: "recipes", key: "tabRecipes", icon: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11" },
];

export function App() {
  const s = useAppState();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("today");
  const [calc, setCalc] = useState<CalcTab>("feed");
  const [draft, setDraft] = useState<BakersDraft | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [, rerender] = useState(0);
  const fired = useRef(new Set<string>());
  const toastTimer = useRef<number>();

  const showToast = (m: string) => {
    setToast(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  };

  // Chime for bake steps that just became due; when phase 1 ends, phase 2 starts by itself.
  useEffect(() => {
    if (!s.bake) return;
    for (const a of dueAlerts(s.bake, now, fired.current)) {
      fired.current.add(`${a.key}@${a.ts}`);
      if (s.settings.bakeAlerts !== false) playChime();
      showToast(t(a.msg));
      if (a.key === "phase1" && !s.bake.bakePhase2Start) s.setBake({ ...s.bake, bakePhase2Start: new Date(a.ts).toISOString() });
    }
  }, [now]);

  // v1 users: bring their recipes over from the old account, once.
  useEffect(() => {
    importV1Recipes().then((n) => {
      if (n > 0) {
        s.setRecipes(loadRecipes());
        showToast(t("importedRecipes", { n }));
      }
    });
  }, []);

  const go = (to: Tab, sub?: string) => {
    if (to === "calc" && sub) setCalc(sub as CalcTab);
    setTab(to);
    window.scrollTo(0, 0);
  };

  return (
    <div class="app">
      <header class="topbar">
        <span class="brand">Levain</span>
        <button class="icon-btn" aria-label={t("settings")} onClick={() => setSettingsOpen(true)}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
          </svg>
        </button>
      </header>

      <main>
        {tab === "today" && <Today s={s} now={now} go={go} toast={showToast} />}
        {tab === "starters" && <Starters s={s} now={now} toast={showToast} />}
        {tab === "bake" && <Bake s={s} now={now} />}
        {tab === "calc" && <Calculators s={s} sub={calc} setSub={setCalc} toast={showToast} draft={draft} clearDraft={() => setDraft(null)} />}
        {tab === "recipes" && <Recipes s={s} openInCalc={(d) => { setDraft(d); go("calc", "bakers"); }} bakeThis={() => go("bake")} />}
      </main>

      <nav class="tabbar" role="tablist">
        {TABS.map((x) => (
          <button role="tab" aria-selected={tab === x.id} class={tab === x.id ? "on" : ""} onClick={() => go(x.id)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={x.icon} /></svg>
            <span>{t(x.key)}</span>
          </button>
        ))}
      </nav>

      {settingsOpen && <Settings s={s} onClose={() => setSettingsOpen(false)} onLang={() => rerender((n) => n + 1)} />}
      {toast && <div class="toast" role="status">{toast}</div>}
    </div>
  );
}
