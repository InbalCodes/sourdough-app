// Small shared UI pieces and hooks.
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { inUnit } from "./lib/calc";
import { t } from "./i18n";

/** Current time, refreshed every second (for timers). */
export function useNow(): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** "350 g" or "12.3 oz" */
export const weight = (grams: number, imperial: boolean) => `${inUnit(grams, imperial)} ${imperial ? t("oz") : t("g")}`;

export function Num(props: { label: string; value: number; onInput: (v: number) => void; suffix?: string; step?: number; min?: number; max?: number; hint?: string }) {
  return (
    <label class="field">
      <span class="field-label">{props.label}</span>
      <span class="field-input">
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(props.value) ? props.value : ""}
          step={props.step ?? 1}
          min={props.min ?? 0}
          max={props.max}
          onInput={(e) => props.onInput(parseFloat((e.target as HTMLInputElement).value))}
        />
        {props.suffix && <span class="suffix">{props.suffix}</span>}
      </span>
      {props.hint && <span class="field-hint">{props.hint}</span>}
    </label>
  );
}

export function Stepper(props: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const { min = 1, max = 20 } = props;
  return (
    <div class="field">
      <span class="field-label">{props.label}</span>
      <span class="stepper">
        <button type="button" aria-label="−" onClick={() => props.onChange(Math.max(min, props.value - 1))}>−</button>
        <b>{props.value}</b>
        <button type="button" aria-label="+" onClick={() => props.onChange(Math.min(max, props.value + 1))}>+</button>
      </span>
    </div>
  );
}

export function Segmented<T extends string>(props: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div class="segmented" role="tablist">
      {props.options.map((o) => (
        <button type="button" role="tab" aria-selected={o.value === props.value} class={o.value === props.value ? "on" : ""} onClick={() => props.onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Card(props: { title?: string; children: ComponentChildren; class?: string; action?: ComponentChildren }) {
  return (
    <section class={"card " + (props.class ?? "")}>
      {(props.title || props.action) && (
        <header class="card-head">
          {props.title && <h2>{props.title}</h2>}
          {props.action}
        </header>
      )}
      {props.children}
    </section>
  );
}

export function Rows(props: { rows: [string, string][]; total?: [string, string] }) {
  return (
    <dl class="rows">
      {props.rows.map(([k, v]) => (
        <div><dt>{k}</dt><dd>{v}</dd></div>
      ))}
      {props.total && <div class="total"><dt>{props.total[0]}</dt><dd>{props.total[1]}</dd></div>}
    </dl>
  );
}

/** A jar of bubbly starter, shown when a starter has no photo. */
export function JarIcon(props: { size?: number }) {
  const s = props.size ?? 56;
  return (
    <span class="avatar jar" style={{ width: s, height: s }} aria-hidden="true">
      <svg viewBox="0 0 48 48" width={s * 0.62} height={s * 0.62}>
        <rect x="15" y="6" width="18" height="5" rx="2" fill="var(--accent)" />
        <path d="M14 12h20v24a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5z" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round" />
        <path d="M15.2 23c3-1.6 5.6 1.2 8.8-.2s6-1.4 8.8.2V36a4 4 0 0 1-4 4H19.2a4 4 0 0 1-4-4z" fill="var(--accent)" opacity=".28" />
        <circle cx="20" cy="30" r="1.6" fill="var(--accent)" />
        <circle cx="27" cy="34" r="1.3" fill="var(--accent)" />
        <circle cx="28.5" cy="27.5" r="1.1" fill="var(--accent)" />
        <path d="M14 18h20" stroke="var(--green)" stroke-width="1.6" stroke-dasharray="3 2.5" />
      </svg>
    </span>
  );
}

/** Resize a picked image to a small JPEG data URL (fits in localStorage). */
export function readPhoto(file: File, size = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = size / Math.max(img.width, img.height);
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * Math.min(1, scale));
      c.height = Math.round(img.height * Math.min(1, scale));
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
