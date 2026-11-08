// Settings sheet: language, units, chimes.
import { LANGS, lang, setLang, t } from "../i18n";
import { MANAGE_URL } from "../lib/subscription";
import { applyTheme, type Theme } from "../lib/theme";
import type { AppState } from "../state";
import { Segmented } from "../ui";

export function Settings(props: { s: AppState; pro: boolean; onUpgrade: () => void; onClose: () => void; onLang: () => void }) {
  const { s } = props;
  return (
    <div class="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
      <div class="sheet" role="dialog" aria-label={t("settings")}>
        <header class="card-head">
          <h2>{t("settings")}</h2>
          <button class="x" aria-label={t("close")} onClick={props.onClose}>×</button>
        </header>

        {props.pro ? (
          <p class="pro-row">
            <span>{t("proActive")}</span>
            <a href={MANAGE_URL} target="_blank" rel="noopener">{t("manageSub")}</a>
          </p>
        ) : (
          <button class="secondary pro-row" onClick={props.onUpgrade}>
            {t("paywallTitle")} <span class="pro">{t("proBadge")}</span>
          </button>
        )}

        <div class="field">
          <span class="field-label">{t("language")}</span>
          <div class="chips-select">
            {LANGS.map((l) => (
              <button type="button" lang={l.code} class={l.code === lang ? "on" : ""} aria-pressed={l.code === lang} onClick={() => { setLang(l.code); props.onLang(); }}>
                {l.name}
              </button>
            ))}
          </div>
        </div>
        <div class="field">
          <span class="field-label">{t("units")}</span>
          <Segmented<"g" | "oz">
            value={s.settings.imperial ? "oz" : "g"}
            onChange={(u) => s.setSettings({ ...s.settings, imperial: u === "oz" })}
            options={[{ value: "g", label: t("grams") }, { value: "oz", label: t("ounces") }]}
          />
        </div>
        <div class="field">
          <span class="field-label">{t("appearance")}</span>
          <Segmented<Theme>
            value={s.settings.theme ?? "light"}
            onChange={(theme) => { s.setSettings({ ...s.settings, theme }); applyTheme(theme); }}
            options={[{ value: "light", label: t("themeLight") }, { value: "dark", label: t("themeDark") }, { value: "auto", label: t("themeAuto") }]}
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
