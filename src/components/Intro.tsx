// First-launch intro: 5 short screens (swipe or tap Next), shown once. Skip ends it at any point.
import { useRef, useState } from "preact/hooks";
import { lang, t, type Key } from "../i18n";

type Slide = { icon: string; badges: [string, string]; title: Key; text: Key };

// Icons are 24x24 outline paths, like the tab bar.
const SLIDES: Slide[] = [
  {
    icon: "M8 3h8v3H8zM7 6h10l1 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z M9 13h6",
    badges: ["M9 9a2 2 0 1 0 0 .01M15 14a3 3 0 1 0 0 .01M8 17a1.5 1.5 0 1 0 0 .01", "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"],
    title: "ob1Title",
    text: "ob1Text",
  },
  {
    icon: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2",
    badges: ["M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z", "M4 6c5-2.5 11-2.5 16 0L12 21zM10 10h.01M14 13h.01"],
    title: "ob2Title",
    text: "ob2Text",
  },
  {
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    badges: ["M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4", "M4 12a8 8 0 0 1 14-5.3M18 3v4h-4"],
    title: "ob3Title",
    text: "ob3Text",
  },
  {
    icon: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11",
    badges: ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z", "M12 5v14M5 12h14"],
    title: "ob4Title",
    text: "ob4Text",
  },
  {
    icon: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    badges: ["M12 3v4M12 17v4M3 12h4M17 12h4", "M5 12l4 4 10-10"],
    title: "ob5Title",
    text: "ob5Text",
  },
];

const Svg = (p: { d: string; size: number; w?: number }) => (
  <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="none" stroke="currentColor" stroke-width={p.w ?? 1.6} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d={p.d} />
  </svg>
);

export function Intro(props: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0); // px the finger moved, while swiping
  const start = useRef<{ x: number; y: number } | null>(null);
  const rtl = lang === "he";
  const last = i === SLIDES.length - 1;

  const go = (n: number) => setI(Math.max(0, Math.min(SLIDES.length - 1, n)));
  const next = () => (last ? props.onDone() : go(i + 1));

  const down = (e: PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const move = (e: PointerEvent) => { if (start.current) setDrag(e.clientX - start.current.x); };
  const up = () => {
    if (!start.current) return;
    const forward = rtl ? drag > 0 : drag < 0; // swiping toward the next screen
    if (Math.abs(drag) > 50) go(forward ? i + 1 : i - 1);
    start.current = null;
    setDrag(0);
  };

  // In RTL the next screen comes from the left, so the track moves the other way.
  const shift = (rtl ? 1 : -1) * i * 100;

  return (
    <div class="intro" role="dialog" aria-modal="true">
      <div class="intro-top">
        {!last && <button class="ghost" onClick={props.onDone}>{t("obSkip")}</button>}
      </div>

      <div class="intro-viewport" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
        <div class="intro-track" style={{ transform: `translateX(calc(${shift}% + ${drag}px))`, transition: start.current ? "none" : undefined }}>
          {SLIDES.map((s, n) => (
            <section class={"intro-slide" + (n === i ? " on" : "")} aria-hidden={n !== i}>
              <div class="intro-art">
                <div class="intro-tile"><Svg d={s.icon} size={64} w={1.4} /></div>
                <span class="intro-badge b1"><Svg d={s.badges[0]} size={20} w={1.8} /></span>
                <span class="intro-badge b2"><Svg d={s.badges[1]} size={20} w={1.8} /></span>
              </div>
              <h2>{t(s.title)}</h2>
              <p>{t(s.text)}</p>
            </section>
          ))}
        </div>
      </div>

      <div class="intro-bottom">
        <div class="intro-dots">
          {SLIDES.map((_, n) => <button class={n === i ? "on" : ""} aria-label={String(n + 1)} onClick={() => go(n)} />)}
        </div>
        <button class="cta" onClick={next}>
          {last ? t("obStart") : t("obNext")} <span class="intro-arrow" aria-hidden="true">{rtl ? "←" : "→"}</span>
        </button>
      </div>
    </div>
  );
}
