// Starters: pick, rename, photo, fridge/counter, delete, and the routine feeding tip.
import { ageMonths, markFed, newStarter, starterStatus, updateStarter } from "../lib/starters";
import { formatDate } from "../lib/time";
import { locale, span, t } from "../i18n";
import type { AppState } from "../state";
import { Card, JarIcon, readPhoto } from "../ui";
import { statusKey } from "./Today";

function ageLabel(months: number): string {
  if (months < 12) return months === 1 ? t("starterAge1Month") : t("starterAgeMonths", { n: months });
  const y = Math.floor(months / 12);
  return y === 1 ? t("starterAge1Year") : t("starterAgeYears", { n: y });
}

export function Starters(props: { s: AppState; now: number; toast: (m: string) => void }) {
  const { s, now } = props;
  const a = s.active;
  const status = starterStatus(a, now);
  const months = ageMonths(a.creationDate, now);
  const patch = (p: Parameters<typeof updateStarter>[2]) => s.setStarters(updateStarter(s.starters, a.id, p));

  return (
    <div class="screen">
      <div class="starter-pills" role="tablist">
        {s.starters.map((x) => (
          <button role="tab" aria-selected={x.id === a.id} class={x.id === a.id ? "on" : ""} onClick={() => s.setActiveId(x.id)}>
            <span class={"dot " + starterStatus(x, now)} />
            {x.name}
          </button>
        ))}
        <button
          class="add"
          onClick={() => {
            const n = newStarter(`${t("newStarterName")} ${s.starters.length + 1}`, Date.now());
            s.setStarters([...s.starters, n]);
            s.setActiveId(n.id);
          }}
        >
          + {t("addStarter")}
        </button>
      </div>

      <Card class="starter-card">
        <div class="starter-top">
          <label class="photo">
            {a.photo ? <img src={a.photo} alt="" /> : <JarIcon size={84} />}
            <span class="photo-label">{a.photo ? t("changePhoto") : t("addPhoto")}</span>
            <input type="file" accept="image/*" hidden onChange={async (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) patch({ photo: await readPhoto(f) });
              (e.target as HTMLInputElement).value = "";
            }} />
          </label>
          <div class="starter-meta">
            <input class="name-input" aria-label={t("starterName")} value={a.name} onChange={(e) => patch({ name: (e.target as HTMLInputElement).value.trim() || a.name })} />
            <label class="muted small">
              {ageLabel(months)} ·{" "}
              <input type="date" class="date-input" aria-label={t("starterBorn")} value={a.creationDate.slice(0, 10)} max={new Date(now).toISOString().slice(0, 10)}
                onChange={(e) => {
                  const v = (e.target as HTMLInputElement).value;
                  if (v) patch({ creationDate: new Date(v + "T00:00:00").toISOString() });
                }} />
            </label>
            <span class={"badge " + status}>{t(statusKey(status))}</span>
          </div>
        </div>

        <div class="fed-line">
          {a.lastFed ? (
            <>
              <b class="big">{span(now - Date.parse(a.lastFed))}</b>
              <span class="muted small">{t("sinceFed")} · {formatDate(Date.parse(a.lastFed), locale())}</span>
            </>
          ) : (
            <span class="muted">{t("neverFed")}</span>
          )}
        </div>
        <button class="cta" onClick={() => { s.setStarters(markFed(s.starters, a.id, Date.now())); props.toast(t("fedDone")); }}>{t("iFedIt")}</button>
        <button class="secondary" onClick={() => patch({ status: a.status === "resting" ? "active" : "resting" })}>
          {a.status === "resting" ? t("setActive") : t("setResting")}
        </button>
        {s.starters.length > 1 && (
          <button class="ghost danger" onClick={() => {
            if (!confirm(t("deleteStarterConfirm"))) return;
            const rest = s.starters.filter((x) => x.id !== a.id);
            s.setStarters(rest);
            s.setActiveId(rest[0].id);
          }}>{t("deleteStarter")}</button>
        )}
      </Card>

      <Card title={t("routineTitle")}>
        <p class="muted">{t("routineText")}</p>
      </Card>
    </div>
  );
}
