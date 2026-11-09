// Photo check: starter readiness or crumb, with what to do next. Free users get 3 checks, then Pro.
import { useState } from "preact/hooks";
import { CheckError, photoToBase64, runCheck, type CheckKind, type CheckResponse, type Verdict } from "../lib/check";
import { lang, t, type Key } from "../i18n";
import { Card } from "../ui";

const GOOD: Verdict[] = ["peak", "well_proofed"];
const BAD: Verdict[] = ["needs_attention", "underbaked"];

export function Check(props: { kind: CheckKind; setKind: (k: CheckKind) => void; pro: boolean; onNeedPro: () => void; onClose: () => void }) {
  const { kind } = props;
  const [photo, setPhoto] = useState<string | null>(null); // base64
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<CheckResponse | null>(null);
  const [err, setErr] = useState("");

  const pick = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    setErr("");
    setRes(null);
    const b64 = await photoToBase64(file);
    setPhoto(b64);
    setBusy(true);
    try {
      setRes(await runCheck(kind, b64, lang));
    } catch (x) {
      const code = x instanceof CheckError ? x.code : "";
      if (code === "FREE_USED") props.onNeedPro();
      setErr(t(code === "BUSY" ? "checkErrBusy" : code === "MONTH_LIMIT" ? "checkMonthLimit" : code === "FREE_USED" ? "freeChecksIntro" : "checkErrGeneric"));
    } finally {
      setBusy(false);
    }
  };

  const r = res?.result;
  // When the photo isn't a starter/loaf, ignore the model's verdict and show "hard to tell".
  const verdict: Verdict | undefined = r && (r.is_subject ? r.verdict : "unclear");
  const tone = verdict ? (GOOD.includes(verdict) ? "good" : BAD.includes(verdict) ? "bad" : "mid") : "";

  return (
    <div class="screen">
      <header class="screen-head with-back">
        <button class="back" aria-label={t("close")} onClick={props.onClose}>‹</button>
        <h1>{t("checkTitle")}</h1>
      </header>

      <div class="segmented">
        {(["starter", "crumb"] as CheckKind[]).map((k) => (
          <button class={k === kind ? "on" : ""} onClick={() => { props.setKind(k); setRes(null); setPhoto(null); setErr(""); }}>
            {t(k === "starter" ? "checkTabStarter" : "checkTabCrumb")}
          </button>
        ))}
      </div>

      <Card>
        <p class="muted">{t(kind === "starter" ? "checkStarterHint" : "checkCrumbHint")}</p>
        {photo && <img class="check-photo" src={"data:image/jpeg;base64," + photo} alt="" />}
        <label class={"cta" + (busy ? " disabled" : "")}>
          {busy ? t("checking") : photo ? t("checkAgain") : t("takePhoto")}
          <input type="file" accept="image/*" hidden disabled={busy} onChange={pick} />
        </label>
        {!props.pro && !res && <p class="muted small center">{t("freeChecksIntro")}</p>}
        {err && <p class="warn center">{err}</p>}
      </Card>

      {r && (
        <Card class={"verdict " + tone}>
          <div class="verdict-head">
            <h2>{t(("v_" + verdict) as Key)}</h2>
            {r.is_subject && <span class="pill">{t("confidence", { p: Math.round(r.confidence * 100) })}</span>}
          </div>
          <p>{r.summary}</p>
          {r.photo_quality !== "good" && <p class="tip">{t(("tip_" + r.photo_quality) as Key)}</p>}
          {r.signs.length > 0 && (
            <>
              <h3>{t("whatISee")}</h3>
              <ul class="bullets">{r.signs.map((s) => <li>{s}</li>)}</ul>
            </>
          )}
          {r.next_steps.length > 0 && (
            <>
              <h3>{t("whatNext")}</h3>
              <ul class="bullets">{r.next_steps.map((s) => <li>{s}</li>)}</ul>
            </>
          )}
          <p class="muted small">{t("aiNote")}</p>
          {res?.plan === "free" && res.remaining != null && <p class="muted small">{t("freeChecksLeft", { n: res.remaining })}</p>}
        </Card>
      )}
    </div>
  );
}
