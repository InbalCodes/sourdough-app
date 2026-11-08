// Saved recipes, kept on the phone.
import { bakersWeights } from "../lib/calc";
import type { Recipe } from "../lib/recipes";
import { t } from "../i18n";
import type { AppState } from "../state";
import { Card, weight } from "../ui";
import type { BakersDraft } from "./Calculators";

export function Recipes(props: { s: AppState; openInCalc: (d: BakersDraft) => void; bakeThis: () => void }) {
  const { s } = props;
  const imperial = !!s.settings.imperial;
  if (!s.recipes.length) {
    return (
      <div class="screen">
        <Card><p class="muted">{t("recipesEmpty")}</p></Card>
      </div>
    );
  }
  return (
    <div class="screen">
      {s.recipes.map((r: Recipe) => {
        const w = bakersWeights(r);
        return (
          <Card title={r.name} action={
            <button class="x" aria-label={t("delete")} onClick={() => confirm(t("deleteRecipeConfirm")) && s.setRecipes(s.recipes.filter((x) => x.id !== r.id))}>×</button>
          }>
            <p class="chips">
              <span>{t("flour")} <b>{weight(r.flour, imperial)}</b></span>
              <span>{t("water")} <b>{r.hydration}%</b></span>
              <span>{t("salt")} <b>{r.salt}%</b></span>
              <span>{t("starter")} <b>{r.starter}%</b></span>
              {r.flourTypes?.map((f) => <span>{f.name} <b>{f.pct}%</b></span>)}
            </p>
            <div class="pair">
              <button class="secondary" onClick={() => props.openInCalc({ name: r.name, flour: r.flour, hydration: r.hydration, salt: r.salt, starter: r.starter, flourTypes: r.flourTypes })}>{t("useInCalc")}</button>
              <button class="cta" onClick={() => {
                s.setSelected({ name: r.name, ...w });
                props.bakeThis();
              }}>{t("bakeThis")}</button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
