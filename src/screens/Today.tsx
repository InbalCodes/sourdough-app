// Home: what needs doing right now (starter + the current bake step).
import { currentStep } from "../lib/bake";
import type { CheckKind } from "../lib/check";
import { markFed, starterStatus } from "../lib/starters";
import { span, t, type Key } from "../i18n";
import type { AppState } from "../state";
import { Card, JarIcon } from "../ui";
import type { Tab } from "../app";
import { stepTiming } from "./Bake";

export function Today(props: { s: AppState; now: number; go: (tab: Tab, sub?: string) => void; toast: (m: string) => void; onCheck: (k: CheckKind) => void }) {
  const { s, now, go } = props;
  const st = s.active;
  const status = starterStatus(st, now);
  const hour = new Date(now).getHours();
  const greeting = hour < 12 ? t("greetingMorning") : hour < 18 ? t("greetingDay") : t("greetingEvening");
  const step = s.bake ? currentStep(s.bake) : undefined;

  return (
    <div class="screen">
      <header class="hero">
        <h1>{greeting}</h1>
        <p class="muted">{t("appTagline")}</p>
      </header>

      <Card title={st.name} class="starter-today" action={<span class={"badge " + status}>{t(statusKey(status))}</span>}>
        <div class="starter-row">
          {st.photo ? <img class="avatar" src={st.photo} alt="" /> : <JarIcon size={56} />}
          <div>
            <div class="big">{st.lastFed ? span(now - Date.parse(st.lastFed)) : "—"}</div>
            <div class="muted small">{st.lastFed ? t("sinceFed") : t("neverFed")}</div>
          </div>
        </div>
        <button
          class="cta"
          onClick={() => {
            s.setStarters(markFed(s.starters, st.id, Date.now()));
            props.toast(t("fedDone"));
          }}
        >
          {t("iFedIt")}
        </button>
      </Card>

      <Card title={t("bakeNow")}>
        {s.bake && step ? (
          <button class="now-step" onClick={() => go("bake")}>
            <span class="eyebrow">{t("nowStep")}</span>
            <span class="now-name">{t(`step_${step.id.replace(/-/g, "_")}` as Key)}</span>
            <span class="now-timer">{stepTiming(step, now)}</span>
          </button>
        ) : (
          <>
            <p class="muted">{s.bake ? t("phaseDone") : t("noBakeHint")}</p>
            <button class="cta secondary" onClick={() => go("bake")}>{s.bake ? t("openBake") : t("startBake")}</button>
          </>
        )}
      </Card>

      <Card title={t("checkTitle")} action={<span class="pro">{t("proBadge")}</span>}>
        <p class="muted">{t("checkCardHint")}</p>
        <div class="pair">
          <button class="secondary" onClick={() => props.onCheck("starter")}>{t("checkStarter")}</button>
          <button class="secondary" onClick={() => props.onCheck("crumb")}>{t("checkCrumb")}</button>
        </div>
      </Card>

      <Card title={t("quickCalcs")}>
        <div class="quick">
          <button onClick={() => go("calc", "feed")}>{t("calcFeed")}</button>
          <button onClick={() => go("calc", "bakers")}>{t("calcBakers")}</button>
          <button onClick={() => go("calc", "pizza")}>{t("calcPizza")}</button>
        </div>
      </Card>
    </div>
  );
}

export const statusKey = (s: string): Key => (s === "active" ? "statusActive" : s === "resting" ? "statusResting" : "statusNeedsFeeding");
