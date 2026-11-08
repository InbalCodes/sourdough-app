// Levain Pro paywall: shown only when someone taps a Pro feature. Prices and the trial come from the store
// through RevenueCat; nothing is hard-coded. No timers, no repeat pop-ups.
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "preact/hooks";
import { t, type Key } from "../i18n";
import { buy, getPlans, restore, type Plan } from "../lib/subscription";

export const LEGAL = {
  terms: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
  privacy: "https://vocal-lolly-7ebc53.netlify.app/privacy.html",
};

/** Store name in the fine print: the same text works on both stores. */
const store = (s: string) => (Capacitor.getPlatform() === "ios" ? s.replace(/Google Play/g, "App Store") : s);

export function Paywall(props: { onUnlocked: () => void; onClose: () => void }) {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getPlans()
      .then((p) => {
        setPlans(p);
        const annual = p.findIndex((x) => x.kind === "annual");
        setSel(annual >= 0 ? annual : 0);
      })
      .catch(() => setPlans([]));
  }, []);

  const plan = plans?.[sel];
  const label = (p: Plan) => (p.kind === "other" ? p.pkg.product.title : t(p.kind as Key));
  const pricePer = (p: Plan) => t(p.kind === "annual" ? "priceYear" : "priceMonth", { price: p.price });
  const fine = (p: Plan) =>
    store(p.kind === "lifetime" ? t("finePrintLifetime") : p.trialDays ? t("finePrintTrial", { d: p.trialDays, pricePer: pricePer(p) }) : t("finePrint", { pricePer: pricePer(p) }));

  const act = async (fn: () => Promise<boolean>, emptyMsg?: Key) => {
    setBusy(true);
    setMsg("");
    try {
      if (await fn()) props.onUnlocked();
      else if (emptyMsg) setMsg(t(emptyMsg));
    } catch {
      setMsg(t("purchaseFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div class="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && props.onClose()}>
      <div class="sheet paywall" role="dialog" aria-label={t("paywallTitle")}>
        <header class="card-head">
          <h2>{t("paywallTitle")} <span class="pro">{t("proBadge")}</span></h2>
          <button class="x" aria-label={t("notNow")} onClick={props.onClose}>×</button>
        </header>
        <ul class="benefits">
          <li>{t("pwBenefit1")}</li>
          <li>{t("pwBenefit2")}</li>
          <li class="muted">{t("pwBenefit3")}</li>
        </ul>

        {plans === null && <p class="muted center">…</p>}
        {plans?.length === 0 && <p class="warn center">{t("notAvailable")}</p>}
        {plans && plans.length > 0 && (
          <div class="plans" role="radiogroup">
            {plans.map((p, i) => (
              <button role="radio" aria-checked={i === sel} class={"plan" + (i === sel ? " on" : "")} onClick={() => setSel(i)}>
                <span class="plan-name">
                  {label(p)}
                  {p.kind === "annual" && <span class="tag">{t("bestValue")}</span>}
                </span>
                <span class="plan-price">{p.price}</span>
                <span class="plan-sub">
                  {p.kind === "annual" && p.perMonth ? t("perMonth", { p: p.perMonth }) : p.kind === "lifetime" ? t("oneTime") : ""}
                  {p.trialDays ? ` · ${t("freeDays", { d: p.trialDays })}` : ""}
                </span>
              </button>
            ))}
          </div>
        )}

        {msg && <p class="warn center">{msg}</p>}
        <button class="cta" disabled={!plan || busy} onClick={() => plan && act(() => buy(plan))}>
          {busy ? "…" : plan?.trialDays ? t("trialCta", { d: plan.trialDays }) : t("continueBtn")}
        </button>
        {plan && <p class="fine">{fine(plan)}</p>}
        <div class="links">
          <button class="link" disabled={busy} onClick={() => act(restore, "nothingToRestore")}>{t("restore")}</button>
          <a href={LEGAL.terms} target="_blank" rel="noopener">{t("terms")}</a>
          <a href={LEGAL.privacy} target="_blank" rel="noopener">{t("privacy")}</a>
        </div>
      </div>
    </div>
  );
}
