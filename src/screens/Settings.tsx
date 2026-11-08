// Settings sheet: language, units, chimes.
import { LANGS, lang, setLang, t } from "../i18n";
import type { AppState } from "../state";
import { Segmented } from "../ui";

export function Settings(props: { s: AppState; onClose: () => void; onLang: () => void }) {
  const { s } = props;
  return (
    <div class="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
      <div class="sheet" role="dialog" aria-label={t("settings")}>
        <header class="card-head">
          <h2>{t("settings")}</h2>
          <button class="x" aria-label={t("close")} onClick={props.onClose}>×</button>
        </header>

        <div class="field">
          <span class="field-label">{t("language")}</span>
          <Segmented value={lang} onChange={(c) => { setLang(c); props.onLang(); }} options={LANGS.map((l) => ({ value: l.code, label: l.name }))} />
        </div>
        <div class="field">
          <span class="field-label">{t("units")}</span>
          <Segmented<"g" | "oz">
            value={s.settings.imperial ? "oz" : "g"}
            onChange={(u) => s.setSettings({ ...s.settings, imperial: u === "oz" })}
            options={[{ value: "g", label: t("grams") }, { value: "oz", label: t("ounces") }]}
          />
        </div>
        <label class="toggle">
          <input type="checkbox" checked={s.settings.bakeAlerts !== false} onChange={(e) => s.setSettings({ ...s.settings, bakeAlerts: (e.target as HTMLInputElement).checked })} />
          <span>{t("sounds")}</span>
        </label>

        <p class="muted small center">
          <a href="https://vocal-lolly-7ebc53.netlify.app/privacy.html" target="_blank" rel="noopener">{t("privacy")}</a> · {t("version", { v: __APP_VERSION__ })}
        </p>
      </div>
    </div>
  );
}
