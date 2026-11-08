// Bake tracker: choose a schedule, then tick off steps with timers.
import { useEffect, useState } from "preact/hooks";
import { askPermission, exactAllowed, openExactSetting, permissionState } from "../lib/notify";
import { buildFolds, buildSteps, coldEnd, LIFESTYLES, newBake, phaseEnds, planBackward, toggleStep, type BakeState, type ScheduleType, type Step } from "../lib/bake";
import { formatDuration, formatTime } from "../lib/time";
import { locale, t, type Key } from "../i18n";
import type { AppState } from "../state";
import { Card, Segmented, weight } from "../ui";

const stepKey = (id: string, suffix = "") => `step_${id.replace(/-/g, "_")}${suffix}` as Key;

/** "in 12:30" before the planned time, "12:30 ago" after it. */
export function stepTiming(step: Step, now: number): string {
  const ref = step.timerRef ?? step.targetTs;
  if (ref == null) return "";
  const d = now - ref;
  return d >= 0 ? t("ago", { t: formatDuration(d) }) : t("in", { t: formatDuration(-d) });
}

export function Bake(props: { s: AppState; now: number; pro: boolean; onNeedPro: () => void }) {
  const { s, now } = props;
  const b = s.bake;
  // Can we notify, and on time? Checked on open and when coming back from the phone's settings.
  const [perm, setPerm] = useState<"granted" | "denied" | "ask" | "none">("none");
  const [exactOk, setExactOk] = useState(true);
  const refresh = async () => {
    setPerm(await permissionState());
    setExactOk(await exactAllowed());
  };
  useEffect(() => {
    if (b) void refresh();
    const onVis = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [!!b]);

  // After permission is granted, touch the bake so the app schedules its notifications.
  const allow = async (bake: BakeState) => {
    if (await askPermission()) s.setBake({ ...bake });
    await refresh();
  };

  if (!b) {
    return (
      <ChooseSchedule
        pro={props.pro}
        onNeedPro={props.onNeedPro}
        now={now}
        onPick={(type, startAt, coldHours) => {
          const nb = { ...newBake(type, startAt ?? Date.now()), ...(coldHours ? { coldHours } : {}) };
          s.setBake(nb);
          void allow(nb);
        }}
      />
    );
  }

  const update = (patch: Partial<BakeState>) => s.setBake({ ...b, ...patch });
  const nowIso = () => new Date().toISOString();
  const steps = buildSteps(b);
  const imperial = !!s.settings.imperial;

  return (
    <div class="screen">
      <header class="screen-head">
        <h1>{t(`sched${cap(b.scheduleType)}` as Key)}</h1>
        <p class="muted">
          {Date.parse(b.startTime) > now
            ? t("planWaiting", { t: new Date(Date.parse(b.startTime)).toLocaleString(locale(), { weekday: "short", hour: "2-digit", minute: "2-digit" }) })
            : t("started", { t: formatTime(Date.parse(b.startTime), locale()) })}
        </p>
      </header>

      {s.settings.bakeAlerts !== false && perm === "ask" && (
        <Card class="compact notice">
          <p>{t("notifOffHint")}</p>
          <button class="small-btn" onClick={() => void allow(b)}>{t("notifOnBtn")}</button>
        </Card>
      )}
      {s.settings.bakeAlerts !== false && perm === "denied" && (
        <Card class="compact notice">
          <p>{t("notifDeniedHint")}</p>
        </Card>
      )}
      {perm === "granted" && !exactOk && s.settings.bakeAlerts !== false && (
        <Card class="compact notice">
          <p>{t("exactHint")}</p>
          <button class="small-btn" onClick={() => void openExactSetting()}>{t("exactBtn")}</button>
        </Card>
      )}

      {s.selected && (
        <Card title={t("bakingRecipe", { name: s.selected.name })} class="compact">
          <p class="chips">
            <span>{t("flour")} <b>{weight(s.selected.flour, imperial)}</b></span>
            <span>{t("water")} <b>{weight(s.selected.water, imperial)}</b></span>
            <span>{t("starter")} <b>{weight(s.selected.starter, imperial)}</b></span>
            <span>{t("salt")} <b>{weight(s.selected.salt, imperial)}</b></span>
          </p>
        </Card>
      )}

      <ol class="steps">
        {steps.map((st) => (
          <li class={"step" + (st.done ? " done" : "") + (st.kind === "oven" ? " oven" : "")}>
            <button class="check" aria-pressed={st.done} aria-label={t(stepKey(st.id))} onClick={() => s.setBake(toggleStep(b, st.id, Date.now()))} />
            <div class="step-body">
              <div class="step-name">
                {t(stepKey(st.id))}
                {st.parallel && <span class="pill">{t("parallel")}</span>}
              </div>
              <div class="step-desc">{stepDesc(st, b)}</div>
              {st.done && st.doneTs ? (
                <div class="step-time">{formatTime(st.doneTs, locale())}</div>
              ) : (
                (st.timerRef ?? st.targetTs) != null && (
                  <div class="step-time">
                    {formatTime((st.timerRef ?? st.targetTs)!, locale())} · <span class="timer">{stepTiming(st, now)}</span>
                  </div>
                )
              )}
              {!st.done && st.kind === "autolyse" && !b.autolyseStart && (
                <button class="small-btn" onClick={() => update({ autolyseStart: nowIso() })}>{t("startAutolyse")}</button>
              )}
              {st.kind === "bulk" && <Bulk b={b} now={now} update={update} toggle={(id) => s.setBake(toggleStep(b, id, Date.now()))} />}
              {!st.done && st.kind === "preshape" && !b.preShapeStart && (
                <button class="small-btn" onClick={() => update({ preShapeStart: nowIso() })}>{t("startPreshape")}</button>
              )}
              {st.kind === "cold" && <Cold b={b} now={now} update={update} />}
              {st.kind === "bake" && <Phases b={b} now={now} update={update} />}
            </div>
          </li>
        ))}
      </ol>

      <button
        class="ghost danger"
        onClick={() => {
          if (confirm(t("finishBakeConfirm"))) {
            s.setBake(null);
            s.setSelected(null);
          }
        }}
      >
        {t("finishBake")}
      </button>
    </div>
  );
}

const cap = (x: string) => x[0].toUpperCase() + x.slice(1);

function stepDesc(st: Step, b: BakeState): string {
  const ls = LIFESTYLES[b.scheduleType];
  if (st.id === "starter-ready") return t("step_starter_ready_desc", { h: ls.levainHours });
  if (st.id === "autolyse") return t("step_autolyse_desc", { m: ls.autolyseMin });
  if (st.id === "oven" && !b.coldStart) return t("step_oven_wait_desc");
  return t(stepKey(st.id, "_desc"));
}

function ChooseSchedule(props: { onPick: (t: ScheduleType, startAt?: number, coldHours?: number) => void; pro: boolean; onNeedPro: () => void; now: number }) {
  const types: ScheduleType[] = ["worker", "thursday", "techie"];
  return (
    <div class="screen">
      <header class="screen-head">
        <h1>{t("chooseSchedule")}</h1>
        <p class="muted">{t("chooseScheduleHint")}</p>
      </header>
      {types.map((ty) => (
        <button class="schedule" onClick={() => props.onPick(ty)}>
          <b>{t(`sched${cap(ty)}` as Key)}</b>
          <span>{t(`sched${cap(ty)}Desc` as Key)}</span>
          <span class="muted small">{LIFESTYLES[ty].levainHours}h · {LIFESTYLES[ty].coldHours}h ❄</span>
        </button>
      ))}
      <Planner {...props} />
    </div>
  );
}

/** "Bread ready at …": works out when to feed the starter (Pro). */
function Planner(props: { onPick: (t: ScheduleType, startAt?: number, coldHours?: number) => void; pro: boolean; onNeedPro: () => void; now: number }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ScheduleType>("worker");
  const [cold, setCold] = useState(LIFESTYLES.worker.coldHours);
  const [ready, setReady] = useState(() => {
    // The first 10:00 that leaves time for the whole schedule (often the day after tomorrow).
    const d = new Date(props.now);
    d.setHours(10, 0, 0, 0);
    while (planBackward("worker", d.getTime())[0].ts < props.now) d.setDate(d.getDate() + 1);
    return toLocalInput(d.getTime());
  });
  const readyTs = new Date(ready).getTime();
  const plan = Number.isFinite(readyTs) ? planBackward(type, readyTs, cold) : [];
  const feed = plan[0]?.ts ?? 0;
  const tooSoon = feed < props.now - 10 * 60_000;
  const when = (ts: number) => new Date(ts).toLocaleString(locale(), { weekday: "short", hour: "2-digit", minute: "2-digit" });

  if (!open) {
    return (
      <button class="schedule planner-open" onClick={() => (props.pro ? setOpen(true) : props.onNeedPro())}>
        <b>{t("planTitle")} <span class="pro">{t("proBadge")}</span></b>
        <span>{t("planHint")}</span>
      </button>
    );
  }
  return (
    <Card title={t("planTitle")} action={<span class="pro">{t("proBadge")}</span>}>
      <Segmented<ScheduleType>
        value={type}
        onChange={(v) => { setType(v); setCold(LIFESTYLES[v].coldHours); }}
        options={(["worker", "thursday", "techie"] as ScheduleType[]).map((v) => ({ value: v, label: t(`sched${cap(v)}` as Key) }))}
      />
      <label class="field">
        <span class="field-label">{t("readyBy")}</span>
        <input type="datetime-local" class="dt" value={ready} onInput={(e) => setReady((e.target as HTMLInputElement).value)} />
      </label>
      <label class="mini">
        {t("coldHours")}
        <input type="number" inputMode="numeric" min={1} max={48} value={cold} onInput={(e) => setCold(Number((e.target as HTMLInputElement).value) || cold)} />
      </label>
      <ol class="timeline">
        {plan.map((p) => (
          <li class={p.id === "feed" ? "first" : ""}>
            <span class="tl-time">{when(p.ts)}</span>
            <span>{t(`plan_${p.id}` as Key)}</span>
          </li>
        ))}
      </ol>
      {tooSoon ? <p class="warn">{t("planTooSoon")}</p> : <button class="cta" onClick={() => props.onPick(type, feed, cold)}>{t("startPlan")}</button>}
    </Card>
  );
}

/** A timestamp as the value of <input type="datetime-local"> (local time, no seconds). */
function toLocalInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function Bulk(props: { b: BakeState; now: number; update: (p: Partial<BakeState>) => void; toggle: (id: string) => void }) {
  const { b, now, update } = props;
  if (!b.bulkStart) {
    return <button class="small-btn" onClick={() => update({ bulkStart: new Date().toISOString() })}>{t("startBulk")}</button>;
  }
  const folds = buildFolds(b);
  const volDone = b.checked.includes("volume");
  return (
    <div class="sub">
      {folds.map((f, i) => (
        <div class={"sub-step" + (f.done ? " done" : "")}>
          <button class="check small" aria-pressed={f.done} aria-label={t("fold", { n: f.n })} onClick={() => props.toggle(f.id)} />
          <div>
            <div>{t("fold", { n: f.n })}</div>
            <div class="muted small">{i === 0 ? t("foldDesc", { m: f.offsetMin }) : t("foldDescNext", { m: f.offsetMin - folds[i - 1].offsetMin })}</div>
          </div>
          <span class="timer">{f.done && f.doneTs ? formatTime(f.doneTs, locale()) : rel(f.timerTs, now)}</span>
        </div>
      ))}
      {!b.fold4Added && <button class="link" onClick={() => update({ fold4Added: true })}>+ {t("addFold4")}</button>}
      <div class={"sub-step" + (volDone ? " done" : "")}>
        <button class="check small" aria-pressed={volDone} aria-label={t("volume")} onClick={() => props.toggle("volume")} />
        <div>
          <div>{t("volume")}</div>
          <div class="muted small">{t("volumeDesc")}</div>
        </div>
        {b.volumeStart ? (
          <span class="timer">{formatDuration(now - Date.parse(b.volumeStart))}</span>
        ) : (
          <button class="link" onClick={() => update({ volumeStart: new Date().toISOString() })}>{t("startVolume")}</button>
        )}
      </div>
    </div>
  );
}

function Cold(props: { b: BakeState; now: number; update: (p: Partial<BakeState>) => void }) {
  const { b, now, update } = props;
  const [hours, setHours] = useState(b.coldHours);
  const end = coldEnd(b);
  if (!end) {
    return (
      <div class="inline">
        <label class="mini">
          {t("coldHours")}
          <input type="number" inputMode="numeric" min={1} max={48} value={hours} onInput={(e) => setHours(Number((e.target as HTMLInputElement).value) || b.coldHours)} />
        </label>
        <button class="small-btn" onClick={() => update({ coldStart: new Date().toISOString(), coldHours: hours })}>{t("startCold")}</button>
      </div>
    );
  }
  return (
    <div class="step-time">
      {t("coldEnds", { t: formatTime(end, locale()) })} · <span class="timer">{end > now ? t("coldLeft", { t: formatDuration(end - now) }) : t("coldDone")}</span>
    </div>
  );
}

function Phases(props: { b: BakeState; now: number; update: (p: Partial<BakeState>) => void }) {
  const { b, now, update } = props;
  const { p1, p2 } = phaseEnds(b);
  const phase = (n: 1 | 2, end: number | undefined, started: boolean) => {
    const tempK = n === 1 ? "bakePhase1Temp" : "bakePhase2Temp";
    const minK = n === 1 ? "bakePhase1Min" : "bakePhase2Min";
    const live = started && end != null && end > now;
    return (
      <div class={"phase" + (live ? " live" : "")}>
        <div class="phase-title">{t(n === 1 ? "phase1" : "phase2")}</div>
        <div class="phase-inputs">
          <label class="mini"><input type="number" inputMode="numeric" value={b[tempK]} disabled={started} onInput={(e) => update({ [tempK]: Number((e.target as HTMLInputElement).value) || b[tempK] })} />{t("temp")}</label>
          <label class="mini"><input type="number" inputMode="numeric" value={b[minK]} disabled={started} onInput={(e) => update({ [minK]: Number((e.target as HTMLInputElement).value) || b[minK] })} />{t("minutes")}</label>
        </div>
        {started && end != null && <div class="phase-timer">{live ? formatDuration(end - now) : t("phaseDone")}</div>}
      </div>
    );
  };
  return (
    <div class="phases">
      {phase(1, p1, !!b.bakePhase1Start)}
      {phase(2, p2, !!b.bakePhase2Start)}
      {!b.bakePhase1Start && <button class="cta" onClick={() => update({ bakePhase1Start: new Date().toISOString() })}>{t("startBaking")}</button>}
    </div>
  );
}

function rel(ts: number, now: number) {
  const d = now - ts;
  return d >= 0 ? t("ago", { t: formatDuration(d) }) : t("in", { t: formatDuration(-d) });
}
