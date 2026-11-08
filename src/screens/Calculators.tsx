// Feeding, baker's percentage and pizza calculators.
import { useEffect, useState } from "preact/hooks";
import { bakersWeights, defaultFeedTarget, feedAmounts, parseRatio, PIZZA_STYLES, pizzaWeights, RATIOS, splitFlour, type Bakers, type FlourPart, type Pizza } from "../lib/calc";
import { addRecipe } from "../lib/recipes";
import { SK, load, loadRaw, save } from "../lib/store";
import { t } from "../i18n";
import type { AppState } from "../state";
import { Card, Num, Rows, Segmented, Stepper, weight } from "../ui";

export type CalcTab = "feed" | "bakers" | "pizza";

export function Calculators(props: { s: AppState; sub: CalcTab; setSub: (c: CalcTab) => void; toast: (m: string) => void; draft: BakersDraft | null; clearDraft: () => void }) {
  return (
    <div class="screen">
      <Segmented<CalcTab>
        value={props.sub}
        onChange={props.setSub}
        options={[
          { value: "feed", label: t("calcFeed") },
          { value: "bakers", label: t("calcBakers") },
          { value: "pizza", label: t("calcPizza") },
        ]}
      />
      {props.sub === "feed" && <Feed imperial={!!props.s.settings.imperial} />}
      {props.sub === "bakers" && <BakersCalc s={props.s} toast={props.toast} draft={props.draft} clearDraft={props.clearDraft} />}
      {props.sub === "pizza" && <PizzaCalc imperial={!!props.s.settings.imperial} />}
    </div>
  );
}

// ---------- Feeding (v1 keys are plain strings) ----------

const num = (k: string, d: number) => {
  const v = parseFloat(loadRaw(k) ?? "");
  return Number.isFinite(v) ? v : d;
};
const setRaw = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* ignore */ }
};

function Feed(props: { imperial: boolean }) {
  const [loaves, setLoaves] = useState(() => num(SK.calcLoaves, 2));
  const [perLoaf, setPerLoaf] = useState(() => num(SK.calcBreadWeight, 100));
  const [ratio, setRatio] = useState(() => loadRaw(SK.calcRatio) || "1:2:2");
  const [custom, setCustom] = useState({ starter: 1, flour: 3, water: 3 });
  const [tare, setTare] = useState(() => num(SK.calcTare, NaN));
  const [target, setTarget] = useState(() => defaultFeedTarget(loaves, perLoaf));

  useEffect(() => setTarget(defaultFeedTarget(loaves, perLoaf || 0)), [loaves, perLoaf]);
  useEffect(() => { setRaw(SK.calcLoaves, String(loaves)); setRaw(SK.calcBreadWeight, String(perLoaf || 100)); setRaw(SK.calcRatio, ratio); }, [loaves, perLoaf, ratio]);
  useEffect(() => { Number.isFinite(tare) && tare > 0 ? setRaw(SK.calcTare, String(tare)) : localStorage.removeItem(SK.calcTare); }, [tare]);

  const r = ratio === "custom" ? custom : parseRatio(ratio);
  const a = target > 0 ? feedAmounts(target, r) : null;
  const g = (x: number) => weight(x, props.imperial);

  return (
    <Card title={t("feedTitle")}>
      <Stepper label={t("loaves")} value={loaves} onChange={setLoaves} />
      <Num label={t("starterPerLoaf")} value={perLoaf} onInput={setPerLoaf} suffix={t("g")} />
      <Num label={t("targetWeight")} value={target} onInput={setTarget} suffix={t("g")} hint={t("targetHint")} />
      <div class="field">
        <span class="field-label">{t("ratio")}</span>
        <div class="chips-select">
          {[...RATIOS, "custom"].map((x) => (
            <button type="button" class={x === ratio ? "on" : ""} onClick={() => setRatio(x)}>{x === "custom" ? t("ratioCustom") : x}</button>
          ))}
        </div>
      </div>
      {ratio === "custom" && (
        <div class="three">
          <Num label={t("starter")} value={custom.starter} onInput={(v) => setCustom({ ...custom, starter: v || 1 })} />
          <Num label={t("flour")} value={custom.flour} onInput={(v) => setCustom({ ...custom, flour: v || 1 })} />
          <Num label={t("water")} value={custom.water} onInput={(v) => setCustom({ ...custom, water: v || 1 })} />
        </div>
      )}
      <Num label={`${t("tare")} (${t("optional")})`} value={tare} onInput={setTare} suffix={t("g")} />
      {a && (
        <div class="result">
          <p>{t("feedResult", { starter: g(a.starter), flour: g(a.flour), water: g(a.water) })}</p>
          {tare > 0 && <p class="muted">{t("feedTotal", { total: g(a.total + tare) })}</p>}
        </div>
      )}
    </Card>
  );
}

// ---------- Baker's percentage ----------

export type BakersDraft = Bakers & { name: string; flourTypes?: FlourPart[] };

function BakersCalc(props: { s: AppState; toast: (m: string) => void; draft: BakersDraft | null; clearDraft: () => void }) {
  const [d, setD] = useState<BakersDraft>(() => props.draft ?? load<BakersDraft>(SK.bakers, { name: "", flour: 500, hydration: 70, salt: 2, starter: 20 }));
  useEffect(() => {
    if (props.draft) { setD(props.draft); props.clearDraft(); }
  }, [props.draft]);
  useEffect(() => save(SK.bakers, d), [d]);

  const w = bakersWeights(d);
  const parts = d.flourTypes ? splitFlour(d.flour, d.flourTypes) : null;
  const pctSum = parts ? Math.round(parts.reduce((x, p) => x + (p.pct || 0), 0) * 10) / 10 : 100;
  const g = (x: number) => weight(x, !!props.s.settings.imperial);
  const set = (p: Partial<BakersDraft>) => setD({ ...d, ...p });
  const setPart = (i: number, p: Partial<FlourPart>) => set({ flourTypes: d.flourTypes!.map((x, j) => (j === i ? { ...x, ...p } : x)) });

  return (
    <Card title={t("bakersTitle")}>
      <label class="field">
        <span class="field-label">{t("recipeName")}</span>
        <input type="text" value={d.name} placeholder={t("recipeNamePh")} onInput={(e) => set({ name: (e.target as HTMLInputElement).value })} />
      </label>
      <Num label={t("totalFlour")} value={d.flour} onInput={(v) => set({ flour: v || 0 })} suffix={t("g")} step={10} />
      <div class="three">
        <Num label={t("hydration")} value={d.hydration} onInput={(v) => set({ hydration: v || 0 })} suffix="%" step={0.5} />
        <Num label={t("salt")} value={d.salt} onInput={(v) => set({ salt: v || 0 })} suffix="%" step={0.1} />
        <Num label={t("starter")} value={d.starter} onInput={(v) => set({ starter: v || 0 })} suffix="%" />
      </div>

      {parts ? (
        <div class="flour-parts">
          {parts.map((p, i) => (
            <div class="flour-part">
              <input type="text" value={p.name} placeholder={t("flourType")} onInput={(e) => setPart(i, { name: (e.target as HTMLInputElement).value })} />
              <span class="field-input pct">
                <input type="number" inputMode="decimal" value={p.pct} onInput={(e) => setPart(i, { pct: parseFloat((e.target as HTMLInputElement).value) || 0 })} />
                <span class="suffix">%</span>
              </span>
              <span class="muted">{g(p.grams)}</span>
              <button class="x" aria-label={t("delete")} onClick={() => {
                const rest = d.flourTypes!.filter((_, j) => j !== i);
                set({ flourTypes: rest.length ? rest : undefined });
              }}>×</button>
            </div>
          ))}
          {pctSum !== 100 && <p class="warn small">{t("flourSumWarn", { p: pctSum })}</p>}
          <button class="link" onClick={() => set({ flourTypes: [...d.flourTypes!, { name: "", grams: 0, pct: 0 }] })}>+ {t("addFlour")}</button>
        </div>
      ) : (
        <button class="link" onClick={() => set({ flourTypes: [{ name: t("breadFlour"), grams: d.flour, pct: 100 }] })}>+ {t("splitFlour")}</button>
      )}

      <Rows
        rows={[
          [t("flour"), g(w.flour)],
          [`${t("water")} (${d.hydration}%)`, g(w.water)],
          [`${t("salt")} (${d.salt}%)`, g(w.salt)],
          [`${t("starter")} (${d.starter}%)`, g(w.starter)],
        ]}
        total={[t("totalDough"), g(w.total)]}
      />
      <button
        class="cta"
        onClick={() => {
          if (!d.name.trim()) return props.toast(t("nameRequired"));
          props.s.setRecipes(addRecipe(props.s.recipes, { name: d.name.trim(), flour: d.flour, hydration: d.hydration, salt: d.salt, starter: d.starter, flourTypes: parts ?? undefined }, Date.now()));
          props.toast(t("saved"));
        }}
      >
        {t("saveRecipe")}
      </button>
    </Card>
  );
}

// ---------- Pizza ----------

type Style = keyof typeof PIZZA_STYLES;

function PizzaCalc(props: { imperial: boolean }) {
  const [st, setSt] = useState<{ style: Style } & Pizza>(() => load(SK.pizza, { style: "neapolitan" as Style, ...PIZZA_STYLES.neapolitan }));
  useEffect(() => save(SK.pizza, st), [st]);
  const w = pizzaWeights(st);
  const g = (x: number) => weight(x, props.imperial);
  const set = (p: Partial<Pizza>) => setSt({ ...st, ...p });

  return (
    <Card title={t("pizzaTitle")}>
      <Segmented<Style>
        value={st.style}
        onChange={(style) => setSt({ style, ...PIZZA_STYLES[style] })}
        options={[
          { value: "neapolitan", label: t("styleNeapolitan") },
          { value: "newyork", label: t("styleNewyork") },
          { value: "pan", label: t("stylePan") },
        ]}
      />
      <Stepper label={t("balls")} value={st.balls} onChange={(balls) => set({ balls })} max={30} />
      <Num label={t("ballWeight")} value={st.ballWeight} onInput={(v) => set({ ballWeight: v || 0 })} suffix={t("g")} step={10} />
      <div class="two">
        <Num label={t("hydration")} value={st.hydration} onInput={(v) => set({ hydration: v || 0 })} suffix="%" />
        <Num label={t("salt")} value={st.salt} onInput={(v) => set({ salt: v || 0 })} suffix="%" step={0.1} />
        <Num label={t("starter")} value={st.starter} onInput={(v) => set({ starter: v || 0 })} suffix="%" />
        <Num label={t("oil")} value={st.oil} onInput={(v) => set({ oil: v || 0 })} suffix="%" step={0.5} />
      </div>
      <Rows
        rows={[
          [t("flour"), g(w.flour)],
          [t("water"), g(w.water)],
          [t("starter"), g(w.starter)],
          [t("salt"), g(w.salt)],
          ...(w.oil > 0 ? ([[t("oil"), g(w.oil)]] as [string, string][]) : []),
        ]}
        total={[t("totalDough"), g(w.total)]}
      />
    </Card>
  );
}
